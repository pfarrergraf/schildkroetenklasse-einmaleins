# Graph Report - samuel-einmaleins-pwa  (2026-05-19)

## Corpus Check
- 5 files · ~2,412 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 31 nodes · 27 edges · 4 communities (3 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `Codex-Instruction: Schildkrötenklasse Einmaleins` - 6 edges
2. `Schildkrötenklasse Einmaleins` - 6 edges
3. `Testplan` - 2 edges
4. `Lokal starten` - 2 edges
5. `Produktionsbuild` - 2 edges
6. `APP_SHELL` - 1 edges
7. `responseClone` - 1 edges
8. `TABLES` - 1 edges
9. `DEFAULT_TABLES` - 1 edges
10. `CORRECT_TEXTS` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (4 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (3): CORRECT_TEXTS, DEFAULT_TABLES, TABLES

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (8): code:bash (npm install && npm run dev), code:bash (npm run build), Funktionen, Hinweise zur Sprachausgabe, Lokal starten, Produktionsbuild, Schildkrötenklasse Einmaleins, Teilen per Smartphone

### Community 2 - "Community 2"
Cohesion: 0.25
Nodes (7): code:bash (npm install), Codex-Instruction: Schildkrötenklasse Einmaleins, Dateien, Maskottchen, Testplan, Wichtige Regeln, Ziel

## Knowledge Gaps
- **15 isolated node(s):** `APP_SHELL`, `responseClone`, `TABLES`, `DEFAULT_TABLES`, `CORRECT_TEXTS` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `APP_SHELL`, `responseClone`, `TABLES` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._