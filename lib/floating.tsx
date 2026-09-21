import { cloneElement, isValidElement, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';
import {
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import type { Placement, UseFloatingReturn, UseInteractionsReturn } from '@floating-ui/react';

/** Shared collision handling. Floating elements remain visible in small/clipping containers. */
export function useAnchoredSurface(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  placement: Placement = 'bottom',
) {
  const arrowRef = useRef<SVGSVGElement>(null);
  const floating = useFloating({
    open,
    onOpenChange(next, event, reason) {
      // Escape belongs to the open surface, not the browser's stop-loading action.
      if (reason === 'escape-key') event?.preventDefault();
      onOpenChange(next);
    },
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 8, fallbackAxisSideDirection: 'start' }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(0, availableWidth)}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
      arrow({ element: arrowRef }),
    ],
  });
  return { ...floating, arrowRef };
}

/** A portal must retain scoped themes, including Storybook's side-by-side modes. */
export function ThemedPortal({
  reference,
  children,
}: {
  reference: Element | null;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<{ style: CSSProperties; dark: boolean; dir: string }>({
    style: {},
    dark: false,
    dir: 'ltr',
  });
  useLayoutEffect(() => {
    if (!reference) return;
    const update = () => {
      const computed = getComputedStyle(reference);
      const variables: Record<string, string> = {};
      for (const key of computed)
        if (key.startsWith('--')) variables[key] = computed.getPropertyValue(key);
      setTheme({
        style: variables as CSSProperties,
        dark: Boolean(reference.closest('.dark')),
        dir: computed.direction,
      });
    };
    update();
    const observer = new MutationObserver(update);
    for (let el: Element | null = reference; el; el = el.parentElement)
      observer.observe(el, { attributes: true, attributeFilter: ['class', 'style', 'dir'] });
    return () => observer.disconnect();
  }, [reference]);
  // Keep portals inside a native dialog's top layer when the trigger belongs to one.
  const dialog = reference?.closest('dialog');
  return (
    <FloatingPortal root={dialog ?? undefined}>
      <div className={theme.dark ? 'dark' : undefined} style={theme.style} dir={theme.dir}>
        {children}
      </div>
    </FloatingPortal>
  );
}

export function FloatingTrigger({
  children,
  floating,
  getReferenceProps,
}: {
  children: ReactNode;
  floating: UseFloatingReturn;
  getReferenceProps: UseInteractionsReturn['getReferenceProps'];
}) {
  const child = isValidElement(children) ? (
    (children as ReactElement<Record<string, unknown>>)
  ) : (
    <button type="button">{children}</button>
  );
  // Property descriptors avoid React 18/19's development getters for the other ref API.
  const childRef = (Object.getOwnPropertyDescriptor(child.props, 'ref')?.value ??
    Object.getOwnPropertyDescriptor(child, 'ref')?.value) as Ref<HTMLElement> | undefined;
  const ref = useMergeRefs([floating.refs.setReference, childRef]);
  const props = getReferenceProps(child.props);
  const descriptions = [child.props['aria-describedby'], props['aria-describedby']].filter(Boolean);
  return cloneElement(child, {
    ...props,
    ref,
    'data-jakeui-trigger': '',
    'aria-describedby': [...new Set(descriptions)].join(' ') || undefined,
  });
}
