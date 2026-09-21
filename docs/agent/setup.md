# Integrate Jake UI

Jake UI is a private, source-distributed React package. Use a local package or tarball; it is not a published npm registry dependency. The supported integration fixture uses Vite, React and Tailwind v4. Other frameworks need their own build and hydration verification.

## Install in an existing Vite React application

```sh
npm install /absolute/path/to/design-system react react-dom @phosphor-icons/react
npm install -D tailwindcss @tailwindcss/vite
```

Keep the existing React Vite plugin. Add Tailwind to `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

At the application root import the fonts and the complete token entry once:

```tsx
import 'jakeui/fonts.css';
import 'jakeui/tokens.css';
import { Button } from 'jakeui';

export function App() {
  return <main className="min-h-screen bg-background p-4 text-body-md text-foreground">
    <Button onClick={() => window.alert('Connected')}>Test connection</Button>
  </main>;
}
```

`tokens.css` includes Tailwind, generated tokens, runtime aliases, and explicit discovery of the package's component/utility classes. Do not import generated globals alone. Tailwind must also discover the application's source: run Vite from the app root; for nonstandard source locations add `@source` in the app stylesheet. Keep whole class strings; runtime fragments such as `bg-${color}` cannot be discovered reliably.

Use a `.dark` class on the application theme boundary (normally `<html>`). Inter is bundled through @fontsource, not assumed to be installed on the machine. Confirm fonts load under the deployment's CSP and asset paths.

Public entry points are `jakeui`, `jakeui/utils`, `jakeui/icons`, `jakeui/tokens.css`, `jakeui/fonts.css`, `jakeui/manifest`, and `jakeui/map`. The map is Figma correspondence, not a JSX schema. The package ships TypeScript/TSX: a raw Node runtime cannot execute its components without transpilation. Server-component frameworks must put interactive consumers behind their client boundary; SSR/hydration support is not certified by the Vite fixture.

## Give an agent context in the consuming repository

Agents do not necessarily discover instructions inside dependencies. Add a pointer to the consumer's own AGENTS.md (and its agent-specific equivalent if used):

> For frontend tasks use Jake UI. Read `node_modules/jakeui/AGENTS.md`, then follow its consume workflow and selected component references. Resolve relative documentation links from the installed Jake UI package. Run this application's checks and rendered verification.

The repository's `npm run agent -- search/inspect` commands are maintainer conveniences. Installed consumers can read `node_modules/jakeui/docs/agent/components.md` or import `jakeui/manifest` as JSON. Run consumer lint from the design-system checkout with `npm run agent:lint -- --path /absolute/path/to/app/src`; it does not replace the app's own build/tests.

## Verify integration

Run the app's typecheck and production build; render a Button, a Field/Input, a table and an overlay. Check light/dark at 375px and 1280px, Inter loading, computed semantic typography, visible focus, dismissal and no page overflow. This repository's `consumer:check` exercises a packed package outside the repository's source tree; see [verification](verification.md) for its precise coverage.
