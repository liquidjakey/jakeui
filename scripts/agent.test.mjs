import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lintSource, lintCss } from "./lib/consumer-lint.mjs";
import { missingDocumentLinks } from "./lib/document-links.mjs";
import { reconcileMap, validateMapShape } from "./lib/figma-contract.mjs";

test("consumer accepts semantic composition and public imports", () => {
  assert.deepEqual(
    lintSource(`import { Button } from 'jakeui'; import { cn } from 'jakeui/utils';
    <main className="bg-background p-4 sm:p-6 text-body-md text-foreground"><Button style="outline">Save</Button></main>`),
    [],
  );
});
for (const [name, code] of Object.entries({
  primitive: '<div className="hover:bg-blue-500" />',
  primitiveText: '<p className="text-neutral-800" />',
  primitiveSideBorder: '<div className="border-l-red-500" />',
  inventedSurface: '<div className="bg-brand-new" />',
  typography: '<p className="text-sm font-bold leading-6" />',
  arbitrary: '<div className="md:w-[321px]" />',
  spacing: '<div className="gap-7" />',
  deepImport: "import { cn } from 'jakeui/lib/cn';",
  foreign: "import { Button } from '@/components/ui/button';",
  merge: "import { twMerge } from 'tailwind-merge';",
  native: "<button>Save</button>",
  inline: '<div style={{ color: "red" }} />',
  dynamic: "<div className={`bg-${color}`} />",
}))
  test(`rejects consumer drift: ${name}`, () =>
    assert.ok(lintSource(code).length));
test("CSS catches literals and token/type overrides", () => {
  assert.ok(
    lintCss("p {color: #fff; font-size: 19px}", "test.css").length >= 2,
  );
  assert.ok(lintCss("@theme { --color-brand: red; }", "test.css").length);
  assert.deepEqual(lintCss("@source './src';", "test.css"), []);
  assert.deepEqual(
    lintCss(
      "p { color: var(--foreground); font-size: var(--text-body-md); }",
      "test.css",
    ),
    [],
  );
  assert.ok(lintCss("p { color: red; }", "test.css").length);
});
const makeMap = (binding) => ({
  components: {
    Button: {
      codePath: "components/button.tsx",
      codeExport: "Button",
      props: { Label: binding },
    },
  },
});
const api = new Map([
  [
    "Button",
    { props: [{ name: "children", type: "ReactNode", required: true }] },
  ],
]);
test("Figma labels resolve to reviewed composition, never invented props", () => {
  const next = reconcileMap(
    makeMap({ kind: "prop", figma: "Label", code: "label", type: "string" }),
    api,
  );
  assert.equal(next.components.Button.props.Label.kind, "transform");
  assert.deepEqual(next.components.Button.props.Label.targets, ["children"]);
  assert.deepEqual(
    reconcileMap(next, api),
    next,
    "Reconciliation must be idempotent",
  );
});
test("unknown direct prop or stale transform target fails", () => {
  assert.throws(
    () => reconcileMap(makeMap({ kind: "prop", code: "invented" }), api),
    /not a public prop/,
  );
  assert.throws(
    () =>
      reconcileMap(
        makeMap({ kind: "transform", designCode: "label" }),
        new Map([["Button", { props: [] }]]),
      ),
    /invalid transform target/,
  );
});
test("direct mapping types and requiredness are compiler-derived", () => {
  const map = makeMap({
    kind: "slot",
    code: "children",
    type: "string",
    required: false,
  });
  const next = reconcileMap(map, api);
  assert.notDeepEqual(next, map, "Freshness gates must detect the wrong type");
  assert.equal(next.components.Button.props.Label.type, "ReactNode");
  assert.equal(next.components.Button.props.Label.required, true);
});
test("binding discriminants reject invented kinds and transform-as-prop ambiguity", () => {
  const map = {
    schemaVersion: 2,
    components: {
      Button: {
        figmaNodeId: "1:1",
        codePath: "components/button.tsx",
        codeExport: "Button",
        props: { Label: { kind: "invented" } },
      },
    },
  };
  assert.throws(() => validateMapShape(map), /binding kind/);
  map.components.Button.props.Label = {
    kind: "transform",
    designCode: "label",
    targets: ["children"],
    reason: "composition",
    reference: "docs/agent/components/button.md",
    code: "label",
  };
  assert.throws(() => validateMapShape(map), /not pretend to be a prop/);
});

const readRepo = (path) =>
  readFileSync(new URL("../" + path, import.meta.url), "utf8");
const manifest = JSON.parse(readRepo("agent/manifest.json"));
const component = (name) => {
  const result = manifest.components.find((c) => c.export === name);
  assert.ok(result, name + " must be discoverable");
  return result;
};

test("code-only Select is discoverable without inventing Figma correspondence", () => {
  const select = component("Select");
  assert.equal(select.source, "components/select.tsx");
  assert.match(
    readRepo(select.reference),
    /Code-only component; no Figma correspondence/,
  );
  assert.ok(!JSON.parse(readRepo("figma.map.json")).components.Select);
  assert.ok(
    select.props.some((prop) => prop.name === "onValueChange" && prop.required),
  );
  assert.ok(
    !select.props.some(
      (prop) => prop.name === "onChange" || prop.name === "open",
    ),
  );
  assert.match(component("NativeSelect").constraints.join(" "), /Select/);
});

test("selected references expose every documented public prop contract", () => {
  let documented = 0;
  for (const c of manifest.components) {
    const reference = readRepo(c.reference);
    for (const prop of c.props.filter((p) => p.description)) {
      const row = reference
        .split("\n")
        .find((line) => line.startsWith("| `" + prop.name + "` |"));
      const contract = prop.description
        .replaceAll("|", "\\|")
        .replaceAll("\n", " ");
      assert.ok(
        row?.includes(contract),
        c.export + "." + prop.name + " contract is hidden",
      );
      documented++;
    }
  }
  assert.ok(documented > 0, "The compiler must retain source JSDoc");
});

test("reviewed consumer contracts retain current ownership and selection guidance", () => {
  const prop = (name, key) =>
    component(name).props.find((p) => p.name === key)?.description ?? "";
  assert.match(prop("Dialog", "type"), /data-type.*both types use Heading\/LG/);
  assert.match(
    prop("SwitchRoot", "state"),
    /Visual preview.*does not implement interaction/,
  );
  assert.match(prop("Skeleton", "label"), /this component's status region/);
  for (const name of ["Input", "NativeSelect", "Textarea"])
    assert.match(
      prop(name, "errorMessage"),
      /Inside Field, pass it to Field only/,
    );
  assert.match(
    component("Field").constraints.join(" "),
    /errorMessage to Field only/,
  );
  assert.match(
    component("Switch").whenToUse.join(" "),
    /boolean setting.*immediately/,
  );
  assert.match(
    component("RadioGroup").whenToUse.join(" "),
    /mutually exclusive/,
  );
  assert.match(
    component("Tabs").constraints.join(" "),
    /Complete controlled tablist and panels/,
  );
  assert.match(component("Progress").constraints.join(" "), /0 is determinate/);
});

test("every public component has self-contained current usage guidance", () => {
  const usage = JSON.parse(readRepo("agent/usage.json"));
  assert.deepEqual(
    Object.keys(usage).sort(),
    manifest.components.map((c) => c.name).sort(),
  );
  for (const c of manifest.components) {
    const entry = usage[c.name];
    assert.ok(entry.summary.trim());
    assert.ok(entry.whenToUse.length && entry.whenNotToUse.length);
    for (const key of Object.keys(entry)) assert.deepEqual(c[key], entry[key]);
    assert.ok(
      !("designCorrespondence" in c),
      "No duplicate per-component contract",
    );
    assert.ok(
      !c.stories.some((p) => /interaction-checks|text-message-editor/.test(p)),
      "Test fixtures and screen experiments are not canonical component examples",
    );
  }
  const unavailable = JSON.parse(readRepo("agent/design-only.json")).names;
  assert.deepEqual(
    manifest.designOnly.map((c) => c.name),
    unavailable,
  );
  assert.ok(unavailable.every((name) => !usage[name]));
});

test("selection guidance distinguishes real controls from anatomy and unavailable features", () => {
  assert.match(component("Checkbox").whenToUse.join(" "), /Save or submit/);
  assert.match(component("AlertDialog").whenToUse.join(" "), /consequential/);
  assert.match(component("Command").summary, /not a complete palette/);
  assert.match(
    component("NavigationMenu").whenNotToUse.join(" "),
    /no nested item shape/,
  );
  assert.match(component("NativeSelect").whenNotToUse.join(" "), /not exposed/);
  assert.match(
    component("Tooltip").whenToUse.join(" "),
    /already named control/,
  );
  for (const name of ["SwitchRoot", "RadioGroupItem", "RadioGroupRoot"])
    assert.match(
      component(name).whenNotToUse.join(" "),
      /standalone interactive control/,
    );
});

test("distributed documentation cannot rely on missing repository-only targets", () => {
  const files = new Set([
    "docs/guide.md",
    "docs/current.md",
    "components/button.tsx",
  ]);
  const content =
    "[current](current.md#usage) [source](../components/button.tsx) [web](https://example.com) [here](#top)";
  assert.deepEqual(missingDocumentLinks("docs/guide.md", content, files), []);
  assert.deepEqual(
    missingDocumentLinks("docs/guide.md", "[missing](missing.md)", files),
    [
      {
        from: "docs/guide.md",
        target: "missing.md",
        resolved: "docs/missing.md",
      },
    ],
  );
});
