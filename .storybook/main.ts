import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

/**
 * Storybook lives at the repo root, not in a monorepo package.
 *
 * `storybook-chromatic-builder` expects a pnpm + Turborepo workspace with
 * packages/tokens and packages/ui. Jake UI is deliberately single-package until
 * component packages actually exist (see repo._note in design-system.json), so
 * this config is the single-package equivalent: same job, no workspace.
 *
 * Tailwind v4 runs as a Vite plugin. This is the first thing in the project that
 * actually compiles tokens/globals.css — before this, its 307 declarations had
 * never been through a Tailwind build.
 */
const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    return viteConfig;
  },
};

export default config;
