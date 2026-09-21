import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

/** Absolute origin for the share card; scrapers reject relative og:image paths. */
const SITE = 'https://liquidjakey.github.io/jakeui';
const TITLE = 'Jake UI — React design system';
const DESCRIPTION =
  'A compact React product-interface design system with semantic tokens, paired light/dark themes and compiler-derived component contracts.';

/** Single-package Storybook preview. Tailwind v4 compiles the token entry through Vite. */
const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx)'],
  addons: [],
  staticDirs: ['./public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: { disableTelemetry: true },
  // Link-unfurl metadata for Slack, iMessage, LinkedIn and X.
  managerHead: (head) => `${head}
    <meta name="description" content="${DESCRIPTION}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Jake UI" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:url" content="${SITE}/" />
    <meta property="og:image" content="${SITE}/og.png" />
    <meta property="og:image:width" content="2400" />
    <meta property="og:image:height" content="1260" />
    <meta property="og:image:alt" content="Jake UI — a compact React product-interface design system" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />
    <meta name="twitter:image" content="${SITE}/og.png" />
    <meta name="theme-color" content="#0a0a0a" />
  `,
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    return viteConfig;
  },
};

export default config;
