# Color token reference

For current consumer policy read [design rules](../agent/design.md). Import the complete `jakeui/tokens.css` entry, not the generated export alone.

## Semantic roles

| Role | Surface | Foreground |
|---|---|---|
| Application | background | foreground |
| Contained content | card | card-foreground |
| Floating content | popover | popover-foreground |
| Secondary content | muted | muted-foreground |
| Primary action | primary | primary-foreground |
| Interaction tint | accent | accent-foreground |
| Sidebar | sidebar | sidebar-foreground |
| Tinted feedback | success/warning/info-muted | matching -muted-foreground |

Use `border` for separators, `input` for control boundaries and `ring` for focus indication. `primary-hover`, `primary-active`, `accent-hover` and `destructive-hover` are state roles, not standalone palettes. Chart roles `chart-1` through `chart-5` are available for data series.

## Readable action and destructive text

`primary-readable` is the foreground role for action-colored text on neutral surfaces; `primary-foreground` is text on a solid primary fill. Do not interchange them.

`destructive-readable` is an approved runtime foreground alias: red/700 in light and red/300 in dark. Use it for readable text on tinted surfaces. Solid destructive fills still use `destructive-foreground`. Preserve the implementation's pairing and validate the actual background.

`scrim` is an approved runtime overlay alias: neutral/950 at 50%, in both themes. Do not derive an overlay from theme-inverting `foreground`.

These aliases are defined in [runtime.css](../../tokens/runtime.css); their scope and retirement decisions live in [the exception registry](../../agent/exceptions.json).

## Verification

The generated [globals.css](../../tokens/globals.css) and committed token input establish exported values. Check actual text/background pairs, focus indicators, hover/selected states and both themes after composition. See [verification](../agent/verification.md) for the test scope and limits.

A new role requires an explicit extension decision, a role sentence, light and dark values, tested foreground pairing and generator-safe implementation. Primitive colors are implementation evidence, not a consumer styling API.
