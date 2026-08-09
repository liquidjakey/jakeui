import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';

/**
 * Stories for `Button`. Contract: docs/components/button.md
 *
 * Button was the longest-blocked component — 32 variants against 8 description rows,
 * with outline and ghost entirely unrecorded. It was built from **live bindings**
 * read through the Desktop Bridge, so this is the first time the full matrix has
 * been visible anywhere outside Figma.
 *
 * ⚠️ **Look at the disabled row below.** The live bindings drop the outline style's
 * border entirely when disabled, so **disabled outline and disabled ghost render
 * identically**. That is transcribed faithfully from the file — it is a design
 * question, not a code bug, and this story is the only place it is visible.
 *
 * Also worth knowing: the spacing here is fully tokenised (`space/3`, `space/4`,
 * `space/1-5`, `space/2-25`) and the focus ring is `stroke/2`. None of those tokens
 * appear in any description — the ANATOMY block does not emit spacing or stroke
 * weights at all.
 */

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Four styles x two sizes x four states. Hover uses primary-hover / accent-hover — two ' +
          'tokens that appear in no doc record anywhere and only surfaced when the live bindings ' +
          'were read.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const STYLES = ['primary', 'secondary', 'outline', 'ghost'] as const;

/** Every style, at both sizes. Hover them to see `primary-hover` / `accent-hover`. */
export const Styles: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {STYLES.map((s) => (
          <Button key={s} style={s} size="medium">
            {s}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {STYLES.map((s) => (
          <Button key={s} style={s} size="small">
            {s}
          </Button>
        ))}
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Medium above, small below. Padding is `space/4` / `space/2-25` and `space/3` / `space/1-5`
        — real tokens, read from the live bindings.
      </p>
    </div>
  ),
};

/**
 * ⚠️ **The disabled finding.** All four render as `muted` with `muted-foreground`, and
 * the outline style's border is **dropped**, so outline and ghost become
 * indistinguishable. Compare against the enabled row above.
 */
export const Disabled: Story = {
  name: 'Disabled — outline and ghost collapse',
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {STYLES.map((s) => (
          <Button key={s} style={s} disabled>
            {s}
          </Button>
        ))}
      </div>
      <p className="text-caption-sm text-muted-foreground">
        Transcribed from the file, not a code bug. Outline loses its border entirely.
      </p>
    </div>
  ),
};

/**
 * Focus. **Tab through these** — every style keeps its resting fill and adds a
 * `stroke/2` `ring`. Implemented as a ring rather than a border so there is no layout
 * shift, the same treatment `Input` uses and for the same reason.
 */
export const Focus: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {STYLES.map((s) => (
        <Button key={s} style={s}>
          Tab to {s}
        </Button>
      ))}
    </div>
  ),
};

/** With a leading icon. The Figma `Show leading icon` boolean collapsed into the slot. */
export const WithIcon: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon={<span aria-hidden="true">+</span>}>New appointment</Button>
      <Button style="outline" leadingIcon={<span aria-hidden="true">↧</span>}>
        Export
      </Button>
      <Button style="ghost" size="small" leadingIcon={<span aria-hidden="true">⌕</span>}>
        Search
      </Button>
    </div>
  ),
};

/** The full 32-variant matrix, which no description could ever show. */
export const Matrix: Story = {
  name: 'All 32 variants',
  args: { children: 'Button' },
  render: () => (
    <table className="border-separate border-spacing-3 text-body-sm">
      <thead>
        <tr className="text-left text-muted-foreground">
          <th />
          <th>default</th>
          <th>disabled</th>
        </tr>
      </thead>
      <tbody>
        {STYLES.flatMap((s) =>
          (['medium', 'small'] as const).map((size) => (
            <tr key={`${s}-${size}`}>
              <th className="pr-2 text-left font-normal text-muted-foreground">
                {s} / {size}
              </th>
              <td>
                <Button style={s} size={size}>
                  Label
                </Button>
              </td>
              <td>
                <Button style={s} size={size} disabled>
                  Label
                </Button>
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
};
