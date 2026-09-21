import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './alert.js';
import { Button } from './button.js';

/**
 * Tone, action and announcement previews. All tones use muted surfaces;
 * warning title and description share warning-muted-foreground.
 * Consumer contract: docs/agent/components/alert.md.
 */

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "Inline feedback with four muted tone surfaces. live defaults to off; use polite for updates and assertive only for urgent interruptions.",
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Compare all four tinted surfaces and readable text in both themes. */
export const Tones: Story = {
  args: { title: 'Alert' },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert tone="info" title="Appointment confirmed" description="Tuesday 14 August, 10:30." />
      <Alert tone="success" title="Record saved" description="All changes have been stored." />
      <Alert
        tone="warning"
        title="Insurance expires soon"
        description="Update the policy details before the next appointment."
      />
      <Alert
        tone="destructive"
        title="Could not save"
        description="The connection dropped. No changes were lost."
      />
      <p className="text-caption-sm text-muted-foreground">
        All four tones use a tinted muted surface with a tone-appropriate readable foreground.
      </p>
    </div>
  ),
};

/** With an action and a dismiss control. The close button names what it dismisses. */
export const WithActions: Story = {
  args: { title: 'Alert' },
  render: () => <ActionsDemo />,
};

function ActionsDemo() {
  const [shown, setShown] = useState(true);
  return (
    <div className="max-w-lg">
      {shown ? (
        <Alert
          tone="warning"
          title="Unsaved changes"
          description="Leaving now will discard them."
          action={
            <Button size="small" style="outline">
              Save now
            </Button>
          }
          onDismiss={() => setShown(false)}
        />
      ) : (
        <Button size="small" onClick={() => setShown(true)}>
          Show it again
        </Button>
      )}
    </div>
  );
}

/** Built-in icons supplement severity text; colour is not the only signal. */
export const WithIcons: Story = {
  args: { title: 'Alert' },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert tone="info" title="Informational" />
      <Alert tone="success" title="Succeeded" />
      <Alert tone="warning" title="Needs attention" />
      <Alert tone="destructive" title="Blocked" />
    </div>
  ),
};

/**
 * The announcement contract. `off` renders no live region at all — correct for an
 * alert that is simply present on the page. `polite` uses `role="status"`, `assertive`
 * uses `role="alert"` and interrupts.
 */
export const Announcement: Story = {
  args: { title: 'Alert' },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert tone="info" live="off" title="live=off — no live region (default)" />
      <Alert tone="info" live="polite" title='live=polite — role="status"' />
      <Alert tone="destructive" live="assertive" title='live=assertive — role="alert", interrupts' />
    </div>
  ),
};
