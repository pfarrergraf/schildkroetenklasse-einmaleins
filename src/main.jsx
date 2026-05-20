import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./features/dinoAnimations/dinoAnimationStyles.css";

const DEV_CACHE_RESET_KEY = "schildi-dev-cache-reset-v2";
const CACHE_PREFIX = "schildkroetenklasse-einmaleins";
const APP_BASE_URL = import.meta.env.BASE_URL;

async function clearSchildiBrowserState() {
  let changed = false;

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map(async (registration) => {
        const unregistered = await registration.unregister();
        changed = changed || unregistered;
      })
    );
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    const matching = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    if (matching.length > 0) {
      changed = true;
      await Promise.all(matching.map((key) => caches.delete(key)));
    }
  }

  return changed;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener("load", async () => {
  if (import.meta.env.DEV) {
    const resetDone = sessionStorage.getItem(DEV_CACHE_RESET_KEY) === "done";
    if (!resetDone) {
      const changed = await clearSchildiBrowserState();
      sessionStorage.setItem(DEV_CACHE_RESET_KEY, "done");
      if (changed) {
        window.location.reload();
      }
    }
    return;
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(`${APP_BASE_URL}sw.js`, { scope: APP_BASE_URL }).catch((error) => {
      console.info("Service Worker konnte nicht registriert werden:", error);
    });
  }
});
