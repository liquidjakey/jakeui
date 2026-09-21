import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

/** Keyboard/lifecycle behavior shared by inline menu surfaces and linked popups. */
export function useMenu(id?: string) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const setRef = useCallback((node: HTMLDivElement | null) => {
    ref.current = node;
    setElement(node);
  }, []);
  const search = useRef({ text: '', time: 0 });
  const trigger = () =>
    id
      ? document.querySelector<HTMLElement>(
          `[aria-haspopup="menu"][aria-controls="${CSS.escape(id)}"]`,
        )
      : null;
  const items = () =>
    [...(ref.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])].filter(
      (el) =>
        el.closest('[role="menu"]') === ref.current && el.getAttribute('aria-disabled') !== 'true',
    );
  const close = (restore: boolean, ancestors = false) => {
    const button = trigger();
    const chain: HTMLElement[] = [];
    let owner = button;
    while (owner && !chain.includes(owner)) {
      chain.push(owner);
      const parentId = ancestors ? owner.closest('[role="menu"]')?.id : undefined;
      owner = parentId
        ? document.querySelector<HTMLElement>(
            `[aria-haspopup="menu"][aria-controls="${CSS.escape(parentId)}"]`,
          )
        : null;
    }
    for (const entry of chain) if (entry.getAttribute('aria-expanded') === 'true') entry.click();
    if (restore) chain.at(-1)?.focus();
  };
  useEffect(() => {
    const menu = element;
    if (!menu) return;
    const first = items()[0];
    if (first) first.tabIndex = 0;
    if (trigger() === document.activeElement) first?.focus();
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      // An open submenu is owned by this menu even if it is portalled.
      const visited = new Set<Element>();
      const owns = (surface: Element): boolean => {
        if (visited.has(surface)) return false;
        visited.add(surface);
        return (
          surface.contains(target) ||
          [...surface.querySelectorAll('[aria-controls]')].some((el) => {
            const controlled = document.getElementById(el.getAttribute('aria-controls') ?? '');
            return controlled ? owns(controlled) : false;
          })
        );
      };
      const owned = owns(menu);
      if (!menu.contains(target) && !trigger()?.contains(target) && !owned) close(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [id, element]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('[role="menu"]') !== ref.current) return;
    const available = items();
    const at = available.indexOf(document.activeElement as HTMLElement);
    const current = available[at];
    let next: HTMLElement | undefined;
    if (e.key === 'ArrowDown') next = available[(at + 1) % available.length];
    else if (e.key === 'ArrowUp') next = available[(at - 1 + available.length) % available.length];
    else if (e.key === 'Home') next = available[0];
    else if (e.key === 'End') next = available.at(-1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    } else if (e.key === 'Tab') {
      setTimeout(() => close(false), 0);
      return;
    } else if ((e.key === 'Enter' || e.key === ' ') && current) {
      e.preventDefault();
      current.click();
      return;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now();
      search.current = {
        text: (now - search.current.time < 700 ? search.current.text : '') + e.key.toLowerCase(),
        time: now,
      };
      const candidates = [...available.slice(at + 1), ...available.slice(0, at + 1)];
      next = candidates.find((el) =>
        el.textContent
          ?.trim()
          .toLowerCase()
          .replace(/^[•✓–]\s*/, '')
          .startsWith(search.current.text),
      );
    }
    if (next) {
      e.preventDefault();
      available.forEach((el) => {
        el.tabIndex = el === next ? 0 : -1;
      });
      next.focus();
    }
  };
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const item = (e.target as Element).closest<HTMLElement>('[role^="menuitem"]');
    if (
      !item ||
      item.closest('[role="menu"]') !== ref.current ||
      item.getAttribute('aria-disabled') === 'true' ||
      item.hasAttribute('aria-haspopup')
    )
      return;
    if (item.getAttribute('role') !== 'menuitemcheckbox') close(true, true);
  };
  return { ref: setRef, onKeyDown, onClick };
}
