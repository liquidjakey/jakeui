import ts from "typescript";
import { readFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The compiler, not a second handwritten schema, owns public prop names/types. */
export function readPublicApi(root = ROOT) {
  const config = ts.readConfigFile(
    resolve(root, "tsconfig.json"),
    ts.sys.readFile,
  );
  if (config.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
    );
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const map = JSON.parse(readFileSync(resolve(root, "figma.map.json"), "utf8"));
  const barrel = program.getSourceFile(resolve(root, "components/index.ts"));
  const exported = new Set(
    checker
      .getExportsOfModule(checker.getSymbolAtLocation(barrel))
      .map((s) => s.name),
  );
  const publicTypes = checker
    .getExportsOfModule(checker.getSymbolAtLocation(barrel))
    .map((symbol) => checker.getAliasedSymbol(symbol))
    .flatMap((symbol) => symbol.declarations ?? [])
    .filter(
      (node) =>
        ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node),
    );
  const result = new Map();
  const entries = { ...map.components };
  // A code-only extension is still public; do not fabricate a Figma node to catalogue it.
  for (const symbol of checker.getExportsOfModule(
    checker.getSymbolAtLocation(barrel),
  )) {
    const target = checker.getAliasedSymbol(symbol);
    if (!(target.flags & ts.SymbolFlags.Value)) continue;
    if (
      Object.values(entries).some((entry) => entry.codeExport === symbol.name)
    )
      continue;
    const declaration = target.valueDeclaration ?? target.declarations?.[0];
    if (!declaration)
      throw new Error(`${symbol.name}: missing implementation declaration`);
    if (entries[symbol.name])
      throw new Error(`${symbol.name}: resolve design/code name conflict`);
    entries[symbol.name] = {
      codeExport: symbol.name,
      codePath: relative(root, declaration.getSourceFile().fileName),
    };
  }
  for (const [name, entry] of Object.entries(entries)) {
    if (!entry.codePath) continue;
    const source = program.getSourceFile(resolve(root, entry.codePath));
    if (!source) throw new Error(`${name}: source missing`);
    const symbol = checker
      .getExportsOfModule(checker.getSymbolAtLocation(source))
      .find((s) => s.name === `${entry.codeExport}Props`);
    if (!symbol) throw new Error(`${name}: exported Props type missing`);
    if (!exported.has(entry.codeExport) || !exported.has(symbol.name))
      throw new Error(`${name}: missing from public barrel`);
    const type = checker.getDeclaredTypeOfSymbol(symbol);
    const defaults = {};
    function visit(node) {
      if (
        ts.isFunctionLike(node) &&
        node.name?.getText(source) === entry.codeExport
      ) {
        const first = node.parameters[0]?.name;
        if (first && ts.isObjectBindingPattern(first))
          for (const binding of first.elements) {
            if (binding.initializer)
              defaults[
                (binding.propertyName ?? binding.name)
                  .getText(source)
                  .replace(/^['"]|['"]$/g, "")
              ] = binding.initializer.getText(source);
          }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    const properties = (t) =>
      checker.getPropertiesOfType(t).map((prop) => {
        const declaration = prop.valueDeclaration ?? prop.declarations?.[0];
        const file = declaration?.getSourceFile();
        const own =
          file && !relative(root, file.fileName).startsWith("node_modules");
        return {
          name: prop.name,
          type: checker
            .typeToString(
              checker.getTypeOfSymbolAtLocation(prop, declaration ?? source),
              source,
              ts.TypeFormatFlags.NoTruncation,
            )
            .replaceAll(
              root.replace(/\/$/, "") + "/node_modules/@types/react/index",
              "react",
            )
            .replaceAll(
              root.replace(/\/$/, "") + "/components/",
              "jakeui/components/",
            ),
          required: !(prop.flags & ts.SymbolFlags.Optional),
          inherited: !own,
          ...(defaults[prop.name] !== undefined
            ? { defaultExpression: defaults[prop.name] }
            : {}),
          ...(prop.getDocumentationComment(checker).length
            ? {
                description: ts.displayPartsToString(
                  prop.getDocumentationComment(checker),
                ),
              }
            : {}),
        };
      });
    const props = properties(type);
    const valueSymbol = checker
      .getExportsOfModule(checker.getSymbolAtLocation(source))
      .find((s) => s.name === entry.codeExport);
    const call = checker.getSignaturesOfType(
      checker.getTypeOfSymbolAtLocation(valueSymbol, source),
      ts.SignatureKind.Call,
    )[0];
    if (!call?.parameters[0])
      throw new Error(`${name}: component has no typed props parameter`);
    const accepted = checker.getTypeOfSymbolAtLocation(
      call.parameters[0],
      source,
    );
    const shape = (list) =>
      JSON.stringify(
        list
          .filter((p) => !p.inherited)
          .map(({ name, type, required }) => ({ name, type, required }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
    if (
      !checker.isTypeAssignableTo(type, accepted) ||
      !checker.isTypeAssignableTo(accepted, type) ||
      shape(props) !== shape(properties(accepted))
    )
      throw new Error(
        `${name}: exported Props type disagrees with the callable component interface`,
      );
    const branches = type.isUnion()
      ? type.types.map((t) => properties(t))
      : undefined;
    let references = [...props, ...(branches?.flat() ?? [])]
      .filter((p) => !p.inherited)
      .map((p) => p.type)
      .join(" ");
    const supportingTypes = [];
    const seen = new Set([symbol.name]);
    for (let added = true; added;) {
      added = false;
      for (const node of publicTypes) {
        const typeName = node.name.text;
        if (
          seen.has(typeName) ||
          !new RegExp(`\\b${typeName}\\b`).test(references)
        )
          continue;
        seen.add(typeName);
        const declaration = node.getText(node.getSourceFile());
        supportingTypes.push({
          name: typeName,
          source: relative(root, node.getSourceFile().fileName),
          declaration,
        });
        references += " " + declaration;
        added = true;
      }
    }
    result.set(name, {
      name,
      export: entry.codeExport,
      source: entry.codePath,
      propsType: symbol.name,
      import: `import { ${entry.codeExport} } from 'jakeui';`,
      props,
      supportingTypes,
      ...(branches ? { branches } : {}),
    });
  }
  return { components: result, map, checker, program, exported };
}
