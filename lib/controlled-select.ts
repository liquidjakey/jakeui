import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";

/** Native reset runs after React's reset handler; restore the caller's controlled value afterward. */
export function useControlledSelectReset(
  ref: RefObject<HTMLSelectElement | null>,
  value: string,
  onReset?: () => void,
) {
  const latest = useRef(value);
  const resetCallback = useRef(onReset);
  useLayoutEffect(() => {
    latest.current = value;
    resetCallback.current = onReset;
  }, [value, onReset]);
  useLayoutEffect(() => {
    const select = ref.current;
    const form = select?.form;
    if (!select || !form) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const reset = (event: Event) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (select.isConnected && !event.defaultPrevented) {
          select.value = latest.current;
          resetCallback.current?.();
        }
      }, 0);
      timers.add(timer);
    };
    form.addEventListener("reset", reset);
    return () => {
      form.removeEventListener("reset", reset);
      for (const timer of timers) clearTimeout(timer);
    };
  }, [ref]);
}
