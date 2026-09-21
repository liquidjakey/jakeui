import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
import { buildStorybook, serve } from "./computed-type-check.mjs";

// Default is self-contained for CI. --url reuses a development server.
const urlIndex = process.argv.indexOf("--url");
let server;
let base = urlIndex < 0 ? undefined : process.argv[urlIndex + 1];
if (!base) {
  const dir = buildStorybook();
  execFileSync(
    process.execPath,
    ["scripts/computed-type-check.mjs", "--static", dir],
    {
      stdio: "inherit",
    },
  );
  const serving = await serve(dir);
  server = serving.server;
  base = `http://127.0.0.1:${serving.port}`;
}
const browser = await chromium.launch();
let page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(5000);
const errors = [];
let failures = 0,
  passed = 0;
async function story(id, theme = "light") {
  // Isolate stories. Full-page navigation can reject Storybook's outstanding
  // requests during teardown; those are not runtime failures in the next story.
  const viewport = page.viewportSize();
  page.removeAllListeners("pageerror");
  await page.close();
  page = await browser.newPage({ viewport });
  page.setDefaultTimeout(5000);
  page.on("pageerror", (error) =>
    errors.push({
      url: page.url(),
      message: error.message,
      stack: error.stack,
    }),
  );
  await page.goto(
    `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`,
  );
  await page.waitForSelector("#storybook-root > *");
  // Storybook awaits initial animation.finished promises during its completing
  // phase. Interacting earlier can cancel those transitions and reject its waiter.
  await page.waitForFunction(
    () => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === "finished",
  );
  await page.evaluate(() => document.fonts.ready);
}
async function check(name, run) {
  try {
    await run();
    passed++;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${name}: ${error.message}`);
  }
}
const focused = (locator) =>
  locator.evaluate((el) => el === document.activeElement);
async function eventually(fn) {
  for (let n = 0; n < 50; n++) {
    if (await fn()) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail("Expected state was not reached");
}
try {
  await check("checkbox square, label, and Space activate", async () => {
    await story("controls-checkbox--checkboxes");
    const box = page.getByRole("checkbox", { name: /Indeterminate/ });
    await box.locator("..").locator("span[aria-hidden]").click();
    await eventually(() => box.isChecked());
    await box.locator("xpath=ancestor::label").click();
    await eventually(async () => !(await box.isChecked()));
    await box.focus();
    await page.keyboard.press("Space");
    await eventually(() => box.isChecked());
  });
  await check(
    "Field composes required and validation for all controls",
    async () => {
      await story("verification-interactions--field-composition");
      for (const name of ["Email", "Notes", "Choice"]) {
        const input = page.getByLabel(name, { exact: false });
        assert.equal(await input.getAttribute("aria-invalid"), "true");
        assert.equal(await input.evaluate((el) => el.required), true);
        assert.equal(
          await input.evaluate((el) =>
            el
              .getAttribute("aria-describedby")
              .split(" ")
              .every((id) => document.getElementById(id)),
          ),
          true,
        );
      }
    },
  );
  await check(
    "calendar arrows and month navigation retain a tab stop",
    async () => {
      await story("controls-calendar--calendars");
      const grid = page.getByRole("grid").first();
      const first = grid.locator('button[tabindex="0"]');
      const date = await first.getAttribute("data-date");
      await first.focus();
      await page.keyboard.press("ArrowRight");
      await eventually(
        async () =>
          (await grid
            .locator('button[tabindex="0"]')
            .getAttribute("data-date")) !== date,
      );
      await page.keyboard.press("PageDown");
      assert.equal(await grid.locator('button[tabindex="0"]').count(), 1);
      await page.getByRole("button", { name: "Next month" }).first().click();
      assert.equal(await grid.locator('button[tabindex="0"]').count(), 1);
      assert.equal(await grid.locator("button[aria-selected]").count(), 0);
    },
  );
  await check(
    "menu arrows, selection, Escape and outside dismissal",
    async () => {
      await story("overlays-dropdownmenu--default");
      const trigger = page.getByRole("button", { name: "Appointment type" });
      await trigger.focus();
      await trigger.press("ArrowDown");
      await eventually(() =>
        focused(page.getByRole("menuitemradio", { name: "General check-up" })),
      );
      await page.keyboard.press("End");
      assert(
        await focused(
          page.getByRole("menuitemradio", { name: "Orthodontic consult" }),
        ),
      );
      await page.keyboard.press("Home");
      await page.keyboard.press("Enter");
      await eventually(
        async () => (await page.getByRole("menu").count()) === 0,
      );
      await trigger.click();
      assert.equal(
        await page
          .getByRole("menuitemradio", { name: "General check-up" })
          .getAttribute("aria-checked"),
        "true",
      );
      await page
        .getByRole("menuitemradio", { name: "Cleaning", exact: true })
        .click();
      await trigger.click();
      assert.equal(
        await page
          .getByRole("menuitemradio", { name: "Cleaning", exact: true })
          .getAttribute("aria-checked"),
        "true",
      );
      await page.keyboard.press("Escape");
      await eventually(() => focused(trigger));
      assert.equal(await page.getByRole("menu").count(), 0);
      await trigger.click();
      await page.mouse.click(1100, 800);
      await eventually(
        async () => (await page.getByRole("menu").count()) === 0,
      );
    },
  );
  await check("submenu lateral keyboard navigation", async () => {
    await story("overlays-dropdownmenu--submenu");
    const trigger = page.getByRole("menuitem", { name: "Move to…" });
    await trigger.focus();
    await page.keyboard.press("ArrowRight");
    await eventually(() =>
      focused(page.getByRole("menuitemradio", { name: "Archive" })),
    );
    await page.keyboard.press("ArrowLeft");
    await eventually(() => focused(trigger));
    assert.equal(
      await page.getByRole("menu", { name: "Move to", exact: true }).count(),
      0,
    );
  });
  await check(
    "modal popover traps focus and returns it on Escape",
    async () => {
      await story("overlays-popover--form-popover");
      const trigger = page.getByRole("button", { name: "Edit name…" });
      await trigger.click();
      const input = page.getByRole("textbox");
      await eventually(() => focused(input));
      for (const key of ["Tab", "Shift+Tab", "Tab"]) {
        await page.keyboard.press(key);
        await eventually(() => focused(input));
      }
      assert.equal(
        await page.getByRole("dialog").getAttribute("aria-modal"),
        "true",
      );
      await page.keyboard.press("Escape");
      await eventually(() => focused(trigger));
    },
  );
  await check("dialog interior does not dismiss; backdrop does", async () => {
    await story("overlays-dialog--default");
    await page
      .getByRole("button", { name: "Open dialog", exact: true })
      .click();
    const bounds = await page.getByRole("dialog").boundingBox();
    await page.mouse.click(bounds.x + 10, bounds.y + 10);
    assert.equal(await page.locator("dialog[open]").count(), 1);
    await page.mouse.click(5, 5);
    assert.equal(await page.locator("dialog[open]").count(), 0);
  });
  await check(
    "Tooltip opens from the real Button on focus and hover",
    async () => {
      await story("overlays-tooltip--tooltips");
      const trigger = page.getByRole("button", { name: "top", exact: true });
      await trigger.focus();
      await page.getByRole("tooltip").waitFor();
      await page.keyboard.press("Escape");
      await page.getByRole("tooltip").waitFor({ state: "hidden" });
      await trigger.hover();
      await page.getByRole("tooltip").waitFor();
      await page.getByRole("tooltip").hover();
      await new Promise((resolve) => setTimeout(resolve, 200));
      assert.equal(await page.getByRole("tooltip").count(), 1);
    },
  );
  await check("switch visible label toggles", async () => {
    await story("controls-switch--switches");
    const toggle = page.getByRole("switch", {
      name: "Marketing email",
      exact: true,
    });
    await page.locator("label").filter({ hasText: "Marketing email" }).click();
    await eventually(
      async () => (await toggle.getAttribute("aria-checked")) === "true",
    );
  });
  await check("table row keyboard selection", async () => {
    await story("content-table--with-actions");
    const row = page.getByRole("row").filter({ hasText: "INV-001" });
    await row.focus();
    await page.keyboard.press("Enter");
    assert.equal(await row.getAttribute("aria-selected"), "true");
    await page.keyboard.press("Space");
    assert.equal(await row.getAttribute("aria-selected"), "false");
  });
  await check("breadcrumb reveals hidden links and retains focus", async () => {
    await story("navigation-breadcrumb--breadcrumb-demo");
    await page.getByRole("button", { name: "Show 2 hidden levels" }).click();
    assert(await page.getByRole("link", { name: "Clinics" }).isVisible());
    assert(await focused(page.getByRole("link", { name: "Clinics" })));
  });
  await check(
    "HoverCard opens on focus and dismisses with Escape",
    async () => {
      await story("overlays-hovercard--hover-cards");
      await page.getByRole("button", { name: "Detailed" }).focus();
      await page.getByRole("dialog", { name: "Ada Lovelace" }).waitFor();
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
    },
  );
  await check("Button disabled states preserve dimensions", async () => {
    await story("primitives-button--matrix");
    for (const row of await page.locator("#storybook-root tbody tr").all()) {
      const buttons = row.getByRole("button");
      const a = await buttons.nth(0).boundingBox(),
        b = await buttons.nth(1).boundingBox();
      assert.equal(a.height, b.height);
      assert.equal(a.width, b.width);
    }
  });
  await check(
    "range date typing, mobile fit, edge cases and inherited state",
    async () => {
      await page.setViewportSize({ width: 375, height: 900 });
      await story("verification-interactions--edge-cases", "dark");
      assert(await page.getByText("No results.", { exact: true }).isVisible());
      await eventually(
        async () =>
          (await page
            .getByRole("img", { name: "Broken image fallback" })
            .textContent()) === "AL",
      );
      assert.equal(
        await page
          .getByRole("navigation", { name: "Pagination" })
          .getByRole("button")
          .count(),
        2,
      );
      assert.equal(
        await page
          .getByRole("link", { name: "Home", exact: true })
          .locator(".sr-only")
          .count(),
        1,
      );
      assert.equal(
        await page
          .getByRole("row")
          .evaluate((el) => getComputedStyle(el).height),
        "42px",
      );
      assert.equal(
        await page
          .getByText("Old panel action")
          .evaluate((el) => Boolean(el.closest("[inert]"))),
        true,
      );
      assert(
        await page.getByTestId("small-switch").evaluate((el) => {
          const track = el.firstElementChild,
            thumb = track.firstElementChild;
          const a = track.getBoundingClientRect(),
            b = thumb.getBoundingClientRect();
          return (
            b.left >= a.left &&
            b.right <= a.right &&
            b.top >= a.top &&
            b.bottom <= a.bottom
          );
        }),
      );
      await page.getByRole("button", { name: "Stay dates" }).click();
      assert.notEqual(
        await page
          .locator(".bg-scrim")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgba(0, 0, 0, 0)",
      );
      assert.equal(
        await page
          .getByLabel("Start date")
          .evaluate((el) => getComputedStyle(el).colorScheme),
        "dark",
      );
      await page.getByLabel("Start date").fill("2026-08-10");
      await page.getByLabel("End date").fill("2026-08-15");
      assert.equal(
        await page.getByLabel("Selected range").textContent(),
        "10–15",
      );
      const rect = await page.getByRole("dialog").boundingBox();
      assert(rect.x >= 0 && rect.x + rect.width <= 375);
      assert.equal(
        await page
          .getByRole("dialog")
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
        true,
      );
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.setViewportSize({ width: 1280, height: 900 });
    },
  );
  await check("composed trigger and nested menu ownership", async () => {
    await story("verification-interactions--overlay-composition");
    const trigger = page.getByRole("button", { name: "Composed trigger" });
    await trigger.click();
    assert.equal(await page.getByLabel("Open changes").textContent(), "1");
    assert.equal(
      await trigger.getAttribute("aria-controls"),
      await page.getByRole("dialog").getAttribute("id"),
    );
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    for (const nested of [false, true]) {
      await page.getByRole("button", { name: "Nested actions" }).click();
      await page.getByRole("menuitem", { name: "More actions" }).click();
      if (nested)
        await page.getByRole("menuitem", { name: "Destinations" }).click();
      await page
        .getByRole("menuitem", {
          name: nested ? "Archive record" : "Direct action",
        })
        .click();
      await eventually(
        async () => (await page.getByRole("menu").count()) === 0,
      );
      assert.equal(
        await page.getByLabel("Completed actions").textContent(),
        nested ? "2" : "1",
      );
    }
  });

  await check(
    "navigation previews stay in Storybook and reflect selection",
    async () => {
      for (const [id, name] of [
        ["navigation-breadcrumb--breadcrumb-demo", "Home"],
        ["navigation-navigationmenu--navigation", "Patients"],
        ["navigation-sidebar--sidebars", "Appointments"],
      ]) {
        await story(id);
        const url = page.url();
        await page.getByRole("link", { name, exact: true }).first().click();
        assert.equal(page.url(), url);
        assert.match(
          await page.getByRole("status").textContent(),
          new RegExp(name),
        );
        if (!id.includes("breadcrumb"))
          assert.equal(
            await page.getByRole("link", { name }).getAttribute("aria-current"),
            "page",
          );
      }
      await story("navigation-pagination--paginations");
      const url = page.url();
      await page
        .getByRole("button", { name: "Next", exact: true })
        .first()
        .click();
      assert.equal(page.url(), url);
      assert.match(await page.getByRole("status").textContent(), /page 2 of 5/);
      await page.setViewportSize({ width: 375, height: 900 });
      await story("navigation-navigationmenu--navigation");
      const toggle = page.getByRole("button", { name: "Menu", exact: true });
      await toggle.click();
      await page.getByRole("link", { name: "Billing" }).focus();
      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert(await focused(toggle));
      await toggle.click();
      await page.getByRole("link", { name: "Billing" }).click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert.equal(new URL(page.url()).hash, "");
      await page.setViewportSize({ width: 1280, height: 900 });
    },
  );
  await check(
    "button and sidebar icons have consistent, nonshrinking SVG sizes",
    async () => {
      await story("primitives-button--with-icon");
      const icons = await page
        .locator("#storybook-root button svg")
        .evaluateAll((els) =>
          els.map((el) => [
            el.getBoundingClientRect().width,
            el.getBoundingClientRect().height,
          ]),
        );
      assert.deepEqual(icons, [
        [20, 20],
        [20, 20],
        [16, 16],
      ]);
      await story("navigation-sidebar--sidebars");
      const sizes = await page
        .locator("nav a svg")
        .evaluateAll((els) =>
          els.map((el) => el.getBoundingClientRect().width),
        );
      assert.deepEqual(sizes, [20, 20, 20]);
      await page.getByRole("button", { name: "Collapse sidebar" }).click();
      assert(await page.getByRole("link", { name: "Patients" }).isVisible());
      assert.equal(
        await page
          .getByRole("link", { name: "Patients" })
          .locator(".sr-only")
          .count(),
        1,
      );
    },
  );
  await check(
    "NativeSelect labels, indicator spacing, RTL, empty states and form behavior",
    async () => {
      for (const theme of ["light", "dark"]) {
        await page.setViewportSize({ width: 375, height: 900 });
        await story("primitives-nativeselect--all-states", theme);
        for (const select of await page.locator("select").all()) {
          assert(
            await select.evaluate(
              (el) =>
                el.labels.length > 0 || Boolean(el.getAttribute("aria-label")),
            ),
          );
          const metrics = await select.evaluate((el) => {
            const a = el.getBoundingClientRect(),
              b = el.parentElement
                .querySelector("[data-select-indicator]")
                .getBoundingClientRect();
            return {
              gap: a.right - b.right,
              icon: b.width,
              padding: parseFloat(getComputedStyle(el).paddingInlineEnd),
            };
          });
          assert.equal(metrics.icon, 16);
          assert(metrics.gap >= 12 && metrics.padding >= 40);
        }
        await story("primitives-nativeselect--edge-cases", theme);
        assert(await page.getByLabel("Empty options").isDisabled());
        assert(
          await page.getByLabel("نوع الموعد").evaluate((el) => {
            const a = el.getBoundingClientRect(),
              b = el.parentElement
                .querySelector("[data-select-indicator]")
                .getBoundingClientRect();
            return (
              b.left - a.left >= 12 && getComputedStyle(el).direction === "rtl"
            );
          }),
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
      }
      await story("primitives-nativeselect--form");
      const input = page.getByLabel("Appointment type");
      await page.getByRole("button", { name: "Save appointment" }).click();
      assert(await focused(input));
      await input.selectOption("cleaning");
      await page.getByRole("button", { name: "Save appointment" }).click();
      assert.match(
        await page.getByRole("status").textContent(),
        /Saved: cleaning/,
      );
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await eventually(async () => (await input.inputValue()) === "");
      assert.equal(
        await input.evaluate((el) => new FormData(el.form).get("appointment")),
        null,
        "The disabled placeholder is not a successful form option",
      );
      await page.setViewportSize({ width: 1280, height: 900 });
    },
  );
  await check(
    "styled Select keyboard navigation, cancellation, typeahead and disabled options",
    async () => {
      await story("primitives-select--default");
      const trigger = page.getByRole("combobox", { name: "Appointment type" });
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.getByRole("listbox").waitFor();
      assert(await focused(trigger));
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      const activeLabel = await trigger.evaluate(
        (el) =>
          document.getElementById(el.getAttribute("aria-activedescendant"))
            .textContent,
      );
      assert.equal(activeLabel, "Emergency");
      await page.keyboard.press("Escape");
      assert.match(await trigger.textContent(), /Choose an option/);
      assert(await focused(trigger));
      await page.keyboard.press("c");
      assert.equal(
        await page.getByRole("option", { selected: true }).textContent(),
        "Cleaning",
      );
      await page.keyboard.press("Enter");
      assert.match(await trigger.textContent(), /Cleaning/);
      await trigger.click();
      await page
        .getByRole("option", { name: /fully booked/ })
        .click({ force: true });
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      await page
        .getByRole("option", { name: "Emergency", exact: true })
        .click();
      assert.match(await trigger.textContent(), /Emergency/);
      await trigger.click();
      await page.mouse.click(1100, 800);
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    },
  );
  await check(
    "styled Select form submission, required validation, Tab and reset",
    async () => {
      await story("primitives-select--form");
      const trigger = page.getByRole("combobox", { name: "Appointment type" });
      await page.getByRole("button", { name: "Save appointment" }).click();
      assert(await focused(trigger));
      assert.equal(await trigger.getAttribute("aria-invalid"), "true");
      await page.getByText("Choose an option.", { exact: true }).waitFor();
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await page
        .getByText("Choose an option.", { exact: true })
        .waitFor({ state: "hidden" });
      assert.equal(await trigger.getAttribute("aria-invalid"), null);
      await trigger.focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Tab");
      assert(
        await focused(page.getByRole("button", { name: "Save appointment" })),
      );
      await page.keyboard.press("Enter");
      assert.match(
        await page.getByRole("status").textContent(),
        /Saved: cleaning/,
      );
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      assert.match(await trigger.textContent(), /Choose an option/);
      await trigger.click();
      await page.keyboard.press("End");
      await page.keyboard.press("Escape");
      assert.match(await trigger.textContent(), /Choose an option/);
    },
  );
  await check(
    "styled Select placement, scroll, RTL and themes fit narrow viewports",
    async () => {
      for (const width of [375, 1280])
        for (const theme of ["light", "dark"]) {
          await page.setViewportSize({ width, height: 900 });
          await story("primitives-select--long-list", theme);
          const trigger = page.getByRole("combobox");
          await trigger.click();
          const box = await page.getByRole("listbox").boundingBox(),
            field = await trigger.boundingBox();
          assert(Math.abs(box.y - (field.y + field.height) - 8) < 1);
          assert(Math.abs(box.width - field.width) < 1);
          assert(box.height <= 256 && box.x >= 0 && box.x + box.width <= width);
          assert.equal(
            await page
              .getByRole("listbox")
              .evaluate((el) => Boolean(el.closest(".dark"))),
            theme === "dark",
          );
          await page.keyboard.press("End");
          assert(
            await page.getByRole("listbox").evaluate((el) => el.scrollTop > 0),
          );
          await page.keyboard.press("Enter");
          assert.match(await trigger.textContent(), /Clinic 30/);
          await story("primitives-select--near-viewport-edge", theme);
          await page.getByRole("combobox").click();
          const popup = page.getByRole("listbox");
          assert.match(await popup.getAttribute("data-placement"), /^top/);
          const topBox = await popup.boundingBox(),
            topField = await page.getByRole("combobox").boundingBox();
          assert(topBox.y >= 0 && topBox.y + topBox.height <= topField.y - 7);
          await story("primitives-select--rtl", theme);
          await page.getByRole("combobox").click();
          assert.equal(
            await page
              .getByRole("listbox")
              .evaluate((el) => getComputedStyle(el).direction),
            "rtl",
          );
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
        }
      await page.setViewportSize({ width: 1280, height: 900 });
      await story("primitives-select--default");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.getByRole("combobox").click();
      assert.equal(
        await page
          .locator('button[role="combobox"] svg')
          .evaluate((el) => getComputedStyle(el).transitionDuration),
        "0s",
      );
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.emulateMedia({ forcedColors: "active" });
      assert.equal(
        await page
          .getByRole("option", { selected: true })
          .evaluate((el) => getComputedStyle(el).outlineStyle),
        "solid",
        "The active option stays visible when forced colors removes its background",
      );
    },
  );
  assert.deepEqual(errors, [], "No browser runtime errors");
} finally {
  await browser.close();
  server?.close();
}
console.log(`${passed} interaction checks passed; ${failures} failed.`);
if (failures) process.exitCode = 1;
