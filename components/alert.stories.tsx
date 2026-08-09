import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './alert.js';
import { Button } from './button.js';

/**
 * Stories for `Alert`. Contract: docs/components/alert.md
 *
 * Alert was the last component still blocked by stale tokens, and its live bindings
 * settled both open questions — one of them worse than expected.
 *
 * 🛑 **Warning is half-rebound in Figma.** The 9 Aug rebind moved its *title* to
 * `warning-muted-foreground` but left its *description* on plain `warning`. One of
 * the two 3.07:1 nodes was fixed and the other was missed. **The code applies the
 * readable token to both** — shipping a known contrast failure to match a
 * half-finished rebind would be transcribing a bug, not a contract.
 *
 * ⚠️ **Destructive has no surface fill at all.** The description reported `fill card`,
 * but the live read shows nothing bound — that was an unbound literal. Combined with
 * `destructive-muted` not existing, the most severe tone ends up the least visually
 * distinct. Look at the four together below and it is obvious.
 */

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          '`live` defaults to "off" deliberately: an alert rendered on page load with role="alert" ' +
          'interrupts a screen-reader user for a message they never asked for. The record is ' +
          'explicit that only an urgent, interrupting message should be assertive.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * All four tones. **Note how much weaker Destructive looks** — no tinted surface,
 * because `destructive-muted` does not exist and nothing is bound in its place.
 */
export const Tones: Story = {
  args: { title: 'Alert' },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert tone="info" title="Appointment confirmed" description="Tuesday 14 August, 10:30." />
      <Alert tone="success" title="Record saved" description="All changes have been stored." />
      <Alert
        tone="warning"
        title="Insurance expires soon"
        description="This description is the half-rebound node — it renders readable here, not as the file has it."
      />
      <Alert
        tone="destructive"
        title="Could not save"
        description="The connection dropped. No changes were lost."
      />
      <p className="text-caption-sm text-muted-foreground">
        Info, Success and Warning each get a tinted `*-muted` surface. Destructive gets none —
        the token does not exist.
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

/**
 * Severity must never be carried by colour alone (WCAG 1.4.1) — which is why `icon`
 * exists despite having no Figma property. Without it the component cannot satisfy
 * its own recorded don't.
 */
export const WithIcons: Story = {
  args: { title: 'Alert' },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert tone="info" icon={<span aria-hidden="true">i</span>} title="Informational" />
      <Alert tone="success" icon={<span aria-hidden="true">✓</span>} title="Succeeded" />
      <Alert tone="warning" icon={<span aria-hidden="true">!</span>} title="Needs attention" />
      <Alert tone="destructive" icon={<span aria-hidden="true">×</span>} title="Blocked" />
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
