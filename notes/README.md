# Working notes — historical, not build documentation

**Nothing in this folder should be built from.** It is kept for provenance: how the
Jake UI documentation format was arrived at, what an audit found at a point in time,
and what design work is still queued on the Figma side.

Two specific hazards if you read these as current:

- **Token names may be another system's.** `crrt-benchmark.md` quotes CRRT's tokens
  (`cobalt/400`, `surface/muted`, `text/disabled`). None of them exist in
  `tokens/globals.css`.
- **Counts are frozen in time.** `audit-2026-08-08.md` reports 178 variables and 74
  component sets. The file now has 180 and 75.

| File | What it is |
|---|---|
| [`crrt-benchmark.md`](./crrt-benchmark.md) | The competitive benchmark that the props-table format and description standard were derived from. Analysis of someone else's design system. |
| [`audit-2026-08-08.md`](./audit-2026-08-08.md) | Build-readiness audit snapshot, 7–8 Aug 2026. Superseded by the `audit` block in `design-system.json`. |
| [`figma-cleanup-backlog.md`](./figma-cleanup-backlog.md) | Figma-side design work queued: 450 drift nodes to snap, 6 primitives to add, 29 spacer hacks to replace, 2 variant sets over the ceiling. |

**Building something?** Go to [`../docs/README.md`](../docs/README.md).
**Want current project state?** [`../design-system.json`](../design-system.json).
