import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readdirSync,
  cpSync,
  symlinkSync,
  realpathSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";
import { build } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { chromium } from "playwright-core";
import { ROOT } from "./lib/public-api.mjs";
import { missingDocumentLinks } from "./lib/document-links.mjs";
import { serve } from "./computed-type-check.mjs";

// Exercise a real packed package, not aliases to components/. Dependencies are
// reused from npm ci; this tests distribution/exports/CSS, not registry resolution.
const temp = realpathSync(mkdtempSync(join(tmpdir(), "jakeui-consumer-")));
const modules = join(temp, "node_modules");
mkdirSync(join(modules, "jakeui"), { recursive: true });
const [pack] = JSON.parse(
  execFileSync(
    "npm",
    ["pack", "--json", "--ignore-scripts", "--pack-destination", temp],
    {
      cwd: ROOT,
      encoding: "utf8",
    },
  ),
);
const packaged = new Set(pack.files.map((f) => f.path));
for (const path of [
  "AGENTS.md",
  "agent/manifest.json",
  "docs/agent/setup.md",
  "docs/agent/recipes.md",
  "examples/recipes.tsx",
  "tokens/fonts.css",
  "tokens/index.css",
  "tokens/runtime.css",
  "lib/public.ts",
])
  assert.ok(packaged.has(path), `Missing package context ${path}`);
assert.ok(
  ![...packaged].some((path) => path.endsWith(".stories.tsx")),
  "Stories must not be runtime distribution",
);
execFileSync("tar", [
  "-xzf",
  join(temp, pack.filename),
  "--strip-components=1",
  "-C",
  join(modules, "jakeui"),
]);
for (const path of packaged) {
  if (!path.endsWith(".md")) continue;
  assert.deepEqual(
    missingDocumentLinks(
      path,
      readFileSync(join(modules, "jakeui", path), "utf8"),
      packaged,
    ),
    [],
    `Shipped documentation must resolve without repository-only files: ${path}`,
  );
}
const shippedManifest = JSON.parse(
  readFileSync(join(modules, "jakeui/agent/manifest.json"), "utf8"),
);
for (const c of shippedManifest.components)
  for (const path of [c.source, c.reference])
    assert.ok(packaged.has(path), `Missing shipped component contract ${path}`);
for (const entry of readdirSync(resolve(ROOT, "node_modules"))) {
  if (entry.startsWith(".") || entry === "jakeui") continue;
  symlinkSync(
    resolve(ROOT, "node_modules", entry),
    join(modules, entry),
    "dir",
  );
}
cpSync(resolve(ROOT, "examples/consumer"), join(temp, "examples/consumer"), {
  recursive: true,
});
cpSync(
  resolve(ROOT, "examples/recipes.tsx"),
  join(temp, "examples/recipes.tsx"),
);
const app = join(temp, "examples/consumer");
const out = join(temp, "dist");
const previousCwd = process.cwd();
try {
  process.chdir(app);
  await build({
    root: app,
    configFile: false,
    plugins: [tailwindcss()],
    esbuild: { jsx: "automatic" },
    resolve: { dedupe: ["react", "react-dom"] },
    build: { outDir: out, emptyOutDir: false },
    logLevel: "warn",
  });
} finally {
  process.chdir(previousCwd);
}
const { server, port } = await serve(out);
const browser = await chromium.launch();
const base = `http://127.0.0.1:${port}`;
const errors = [];
let cases = 0;
const backgrounds = new Set();
try {
  for (const width of [375, 1280])
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      page.setDefaultTimeout(5000);
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`${base}/?theme=${theme}`);
      await page.getByRole("heading", { name: "Workspace settings" }).waitFor();
      const loadedFonts = await page.evaluate(async () => {
        const faces = await Promise.all(
          [400, 500, 600, 700].map((weight) =>
            document.fonts.load(`${weight} 14px Inter`, "Jake UI"),
          ),
        );
        await document.fonts.ready;
        return faces.map(
          (group) =>
            group.length > 0 && group.every((face) => face.status === "loaded"),
        );
      });
      assert.deepEqual(
        loadedFonts,
        [true, true, true, true],
        "Each declared font weight must load, not silently fall back",
      );
      const metrics = await page
        .getByRole("button", { name: "Save preferences" })
        .evaluate((el) => {
          const cs = getComputedStyle(el);
          return {
            size: cs.fontSize,
            line: cs.lineHeight,
            weight: cs.fontWeight,
            padding: cs.paddingLeft,
            family: cs.fontFamily,
            fonts: [400, 500, 600, 700].every((weight) =>
              document.fonts.check(`${weight} 14px Inter`),
            ),
            background: getComputedStyle(document.querySelector("main"))
              .backgroundColor,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
      assert.deepEqual(
        [metrics.size, metrics.line, metrics.weight],
        ["14px", "20px", "500"],
        "Public cn must preserve semantic type with color",
      );
      assert.equal(
        metrics.padding,
        "16px",
        "Installed component utilities must be discovered",
      );
      assert.ok(
        metrics.family.includes("Inter") && metrics.fonts,
        "Inter must load at every required weight",
      );
      assert.equal(metrics.overflow, false, "No page overflow");
      backgrounds.add(metrics.background);
      const name = page.getByLabel("Display name", { exact: false });
      assert.equal(await name.evaluate((el) => el.required), true);
      assert.ok(
        await name.getAttribute("aria-describedby"),
        "Field helper must be connected",
      );
      await name.fill("Ada");
      await page.getByLabel("Summary frequency").selectOption("monthly");
      const choice = page.getByRole("combobox", { name: "Appointment type" });
      await choice.focus();
      await page.keyboard.press("c");
      await page
        .getByRole("option", { name: "Cleaning", exact: true })
        .waitFor();
      await page.keyboard.press("Enter");
      assert.match(await choice.textContent(), /Cleaning/);
      assert.equal(await choice.getAttribute("aria-expanded"), "false");
      const checkbox = page.getByRole("checkbox", {
        name: "Send product updates",
      });
      await page.getByText("Send product updates", { exact: true }).click();
      assert.equal(
        await checkbox.isChecked(),
        true,
        "Visible checkbox label must activate",
      );
      await checkbox.focus();
      await page.keyboard.press("Space");
      assert.equal(
        await checkbox.isChecked(),
        false,
        "Checkbox must also work from the keyboard",
      );
      await page.getByRole("button", { name: "Save preferences" }).click();
      await page.getByText("Preferences saved.", { exact: true }).waitFor();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page
        .getByRole("cell", { name: "Margaret Hamilton", exact: true })
        .waitFor();
      await page.getByLabel("Search members").fill("not-a-member");
      await page
        .getByText("No members match your search.", { exact: true })
        .waitFor();
      await page.getByLabel("Search members").fill("Ada");
      await page
        .getByRole("cell", { name: "Ada Lovelace", exact: true })
        .waitFor();
      const trigger = page.getByRole("button", { name: "Visibility details" });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Workspace visibility" });
      await dialog.waitFor();
      const box = await dialog.boundingBox();
      assert.ok(
        box && box.x >= 0 && box.x + box.width <= width,
        "Overlay must fit viewport",
      );
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      assert.equal(
        await trigger.evaluate((el) => el === document.activeElement),
        true,
        "Focus must return",
      );
      await page.screenshot({
        path: join(temp, `${theme}-${width}.png`),
        fullPage: true,
      });
      await page.close();
      console.log(
        `PASS packed consumer ${theme} ${width}px: fonts, styles, form, search, pagination, overlay/focus`,
      );
      cases++;
    }
  assert.equal(
    backgrounds.size,
    2,
    "Both theme surfaces must resolve distinctly",
  );
  for (const [query, expected] of [
    ["loading", "Loading results…"],
    ["error", "Members could not be loaded."],
    ["saveError", "Could not save. Try again."],
  ]) {
    const page = await browser.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${base}/?${query}`);
    if (query === "saveError") {
      await page.getByLabel("Display name", { exact: false }).fill("Ada");
      await page.getByRole("button", { name: "Save preferences" }).click();
    }
    await page.getByText(expected, { exact: true }).waitFor();
    await page.close();
    console.log(`PASS packed consumer ${query} feedback`);
    cases++;
  }
  assert.deepEqual(errors, [], "No runtime errors");
  console.log(`Packed consumer: ${cases} cases passed. Artifacts: ${temp}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
