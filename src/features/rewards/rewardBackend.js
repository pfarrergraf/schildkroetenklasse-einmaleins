import { applyRewardCheckpoint, createRewardCheckpoint } from "./rewardStorage";

const DEFAULT_REMOTE_TIMEOUT_MS = 4000;

function getImportMetaEnv() {
  try {
    return import.meta.env ?? {};
  } catch {
    return {};
  }
}

function sanitizeRemoteUrl(value) {
  return typeof value === "string" && value.trim() ? value.trim().replace(/\/$/, "") : "";
}

function sanitizeTimeout(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 500 ? Math.round(parsed) : DEFAULT_REMOTE_TIMEOUT_MS;
}

function normalizeRewardStateUrl(baseUrl) {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/reward-state") ? baseUrl : `${baseUrl}/reward-state`;
}

function createStatus(overrides = {}) {
  return {
    configuredMode: overrides.configuredMode ?? "local",
    activeMode: overrides.activeMode ?? "local",
    transport: overrides.transport ?? "local",
    state: overrides.state ?? "ready",
    endpoint: overrides.endpoint ?? null,
    lastSyncAt: overrides.lastSyncAt ?? null,
    lastError: overrides.lastError ?? null,
  };
}

function getTimestamp(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

async function fetchWithTimeout(url, options, timeoutMs, fetchImpl) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    return await fetchImpl(url, {
      ...options,
      signal: controller?.signal,
    });
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

export function resolveRewardBackendConfig(env = getImportMetaEnv()) {
  const configuredMode = env?.VITE_REWARD_BACKEND_MODE === "remote" ? "remote" : "local";
  const remoteUrl = sanitizeRemoteUrl(env?.VITE_REWARD_REMOTE_URL);
  const endpoint = normalizeRewardStateUrl(remoteUrl);

  return {
    configuredMode,
    remoteEnabled: configuredMode === "remote" && Boolean(endpoint),
    endpoint,
    timeoutMs: sanitizeTimeout(env?.VITE_REWARD_REMOTE_TIMEOUT_MS),
  };
}

export function createDefaultRewardBackendStatus(env = getImportMetaEnv()) {
  const config = resolveRewardBackendConfig(env);

  if (!config.remoteEnabled) {
    return createStatus({
      configuredMode: config.configuredMode,
      activeMode: "local",
      transport: "local",
      state: "ready",
    });
  }

  return createStatus({
    configuredMode: config.configuredMode,
    activeMode: isOffline() ? "local" : "remote",
    transport: isOffline() ? "local-fallback" : "remote",
    state: isOffline() ? "offline" : "ready",
    endpoint: config.endpoint,
  });
}

export function getRewardBackendStatusText(status) {
  if (!status) {
    return "Belohnungen: lokal gespeichert.";
  }

  if (status.transport === "remote") {
    return "Belohnungen: Online-Sync aktiv.";
  }

  if (status.transport === "local-fallback") {
    return "Belohnungen: Remote konfiguriert, aktuell lokaler Fallback.";
  }

  return "Belohnungen: lokal gespeichert.";
}

export async function hydrateRewardCheckpoint({ env = getImportMetaEnv(), fetchImpl = globalThis.fetch } = {}) {
  const config = resolveRewardBackendConfig(env);
  const localCheckpoint = createRewardCheckpoint();

  if (!config.remoteEnabled || typeof fetchImpl !== "function" || isOffline()) {
    return {
      checkpoint: localCheckpoint,
      status: createStatus({
        configuredMode: config.configuredMode,
        activeMode: "local",
        transport: config.remoteEnabled ? "local-fallback" : "local",
        state: config.remoteEnabled && isOffline() ? "offline" : "ready",
        endpoint: config.endpoint || null,
      }),
    };
  }

  try {
    const response = await fetchWithTimeout(config.endpoint, { method: "GET" }, config.timeoutMs, fetchImpl);
    if (!response.ok) {
      throw new Error(`Remote Reward-State antwortete mit ${response.status}`);
    }

    const payload = await response.json();
    const remoteCheckpoint = createRewardCheckpoint(payload?.rewardCheckpoint ?? payload ?? {});
    const preferLocal = getTimestamp(localCheckpoint.updatedAt) >= getTimestamp(remoteCheckpoint.updatedAt);
    const preferredCheckpoint = preferLocal ? localCheckpoint : remoteCheckpoint;
    applyRewardCheckpoint(preferredCheckpoint);

    if (preferLocal) {
      await fetchWithTimeout(
        config.endpoint,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rewardCheckpoint: preferredCheckpoint }),
        },
        config.timeoutMs,
        fetchImpl
      );
    }

    return {
      checkpoint: preferredCheckpoint,
      status: createStatus({
        configuredMode: config.configuredMode,
        activeMode: "remote",
        transport: "remote",
        state: "ready",
        endpoint: config.endpoint,
        lastSyncAt: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      checkpoint: localCheckpoint,
      status: createStatus({
        configuredMode: config.configuredMode,
        activeMode: "local",
        transport: "local-fallback",
        state: "fallback",
        endpoint: config.endpoint,
        lastError: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}

export async function persistRewardCheckpoint(nextCheckpoint, { env = getImportMetaEnv(), fetchImpl = globalThis.fetch } = {}) {
  const config = resolveRewardBackendConfig(env);
  const localCheckpoint = applyRewardCheckpoint(nextCheckpoint);

  if (!config.remoteEnabled || typeof fetchImpl !== "function" || isOffline()) {
    return {
      checkpoint: localCheckpoint,
      status: createStatus({
        configuredMode: config.configuredMode,
        activeMode: "local",
        transport: config.remoteEnabled ? "local-fallback" : "local",
        state: config.remoteEnabled && isOffline() ? "offline" : "ready",
        endpoint: config.endpoint || null,
      }),
    };
  }

  try {
    const response = await fetchWithTimeout(
      config.endpoint,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardCheckpoint: localCheckpoint }),
      },
      config.timeoutMs,
      fetchImpl
    );

    if (!response.ok) {
      throw new Error(`Remote Reward-State antwortete mit ${response.status}`);
    }

    let appliedCheckpoint = localCheckpoint;

    try {
      const payload = await response.json();
      if (payload) {
        appliedCheckpoint = applyRewardCheckpoint(createRewardCheckpoint(payload?.rewardCheckpoint ?? payload));
      }
    } catch {
      appliedCheckpoint = localCheckpoint;
    }

    return {
      checkpoint: appliedCheckpoint,
      status: createStatus({
        configuredMode: config.configuredMode,
        activeMode: "remote",
        transport: "remote",
        state: "ready",
        endpoint: config.endpoint,
        lastSyncAt: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      checkpoint: localCheckpoint,
      status: createStatus({
        configuredMode: config.configuredMode,
        activeMode: "local",
        transport: "local-fallback",
        state: "fallback",
        endpoint: config.endpoint,
        lastError: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}