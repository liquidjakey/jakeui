import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

/** Single-package Storybook preview. Tailwind v4 compiles the token entry through Vite. */
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
