# Jake UI

A compact React product-interface design system with semantic tokens, paired light/dark themes and compiler-derived component contracts.

For AI-assisted frontend work start at [AGENTS.md](AGENTS.md). It routes consumption, library extension and Figma synchronization separately.

- [Install and integrate](docs/agent/setup.md)
- [Component index](docs/agent/components.md) — actual public exports; anatomy and design-only assets distinguished
- [Design and composition rules](docs/agent/design.md)
- [Runnable recipes](docs/agent/recipes.md)
- [Verification and limits](docs/agent/verification.md)

```sh
npm ci
npm run agent -- search form
npm run agent -- inspect Button
npm run check
```

The full check includes generated-contract freshness, token/Figma/documentation checks, TypeScript, negative drift tests, an external packed-consumer build/browser test, and Storybook typography/interaction checks. Chromium must be installed for browser checks; CI provisions it.

## Maintenance

Public interfaces live in `components/` and its barrel. Generate the machine-readable `agent/manifest.json` and focused references with `npm run agent:sync`. Usage constraints live in `agent/usage.json`; approved divergences live in `agent/exceptions.json`. A correspondence marked `transform` in `figma.map.json` is not a JSX prop.

Import `jakeui/tokens.css` and `jakeui/fonts.css` once. The token entry combines the generated Figma export with approved runtime aliases. Preserve `tokens/globals.css`: change its committed source dump and regenerate only as part of an authorized token sync.

[Documentation maintenance](docs/README.md) explains current sources and generation. The shared system contains current contracts and supporting checks, not session journals or duplicate component histories.

This is a private source-distributed package, not a published registry release. Static guardrails reduce common drift; they cannot guarantee that every agent or every composed screen will follow the system. Rendered usability verification remains required.
