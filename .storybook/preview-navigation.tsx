import { useState } from "react";
import type { ReactNode } from "react";

/** Simulate destinations in a demo without changing the browser URL. Never ship in runtime code. */
export function PreviewNavigation({
  initial,
  children,
}: {
  initial: string;
  children: (destination: string) => ReactNode;
}) {
  const [destination, setDestination] = useState(initial);
  const [label, setLabel] = useState("");
  return (
    <div
      className="flex min-w-0 flex-col gap-4"
      onClickCapture={(event) => {
        const link =
          event.target instanceof Element
            ? event.target.closest("a[href]")
            : null;
        if (!link) return;
        event.preventDefault();
        setDestination(link.getAttribute("href")!);
        setLabel(link.textContent?.trim() || "Destination");
      }}
      onAuxClickCapture={(event) => {
        if (event.target instanceof Element && event.target.closest("a[href]"))
          event.preventDefault();
      }}
    >
      {children(destination)}
      <p role="status" className="text-caption-sm text-muted-foreground">
        {label
          ? `Preview destination: ${label}. You are still in Storybook.`
          : "Navigation is simulated in this preview."}
      </p>
    </div>
  );
}
