import { createRoot } from "react-dom/client";
import "jakeui/fonts.css";
import "jakeui/tokens.css";
import "./app.css";
import {
  PreferencesForm,
  RecordsTable,
  DetailsPopover,
  AppointmentChoice,
} from "../recipes.js";

const params = new URLSearchParams(window.location.search);
document.documentElement.classList.toggle(
  "dark",
  params.get("theme") === "dark",
);
const rows = [
  { id: "1", name: "Ada Lovelace", role: "Owner" },
  { id: "2", name: "Grace Hopper", role: "Editor" },
  { id: "3", name: "Margaret Hamilton", role: "Viewer" },
];

createRoot(document.getElementById("root")!).render(
  <main className="min-h-screen bg-background p-4 text-body-md text-foreground sm:p-6">
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <h1 className="text-heading-lg">Workspace settings</h1>
      <PreferencesForm
        onSave={async () => {
          await new Promise((resolve) => setTimeout(resolve, 150));
          if (params.has("saveError")) throw new Error("Fixture failure");
        }}
      />
      <RecordsTable
        rows={rows}
        loading={params.has("loading")}
        error={params.has("error") ? "Members could not be loaded." : undefined}
      />
      <DetailsPopover />
      <AppointmentChoice />
    </div>
  </main>,
);
