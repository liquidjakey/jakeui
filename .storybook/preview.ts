import type { Preview, Decorator } from '@storybook/react-vite';
import { createElement } from 'react';

// The whole point: this import puts tokens/globals.css through a real Tailwind v4
// build. Everything in the library resolves from these variables.
import '../tokens/globals.css';

/**
 * Dark mode is a `.dark` ancestor class — globals.css declares
 * `@custom-variant dark (&:is(.dark *))` with a `.dark { … }` block of overrides.
 * So the decorator toggles that class on a wrapper rather than on <html>, which
 * also lets both themes render side by side in one story.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';

  const panel = (mode: 'light' | 'dark') =>
    createElement(
      'div',
      {
        key: mode,
        className: mode === 'dark' ? 'dark' : undefined,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          padding: '2rem',
          flex: 1,
          minWidth: 0,
        },
      },
      createElement(Story as never),
    );

  if (theme === 'both') {
    return createElement(
      'div',
      { style: { display: 'flex', gap: 0, alignItems: 'stretch' } },
      panel('light'),
      panel('dark'),
    );
  }
  return panel(theme as 'light' | 'dark');
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Light / Dark / both. Dark is a `.dark` ancestor class.',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'both', title: 'Side by side' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
};

export default preview;
