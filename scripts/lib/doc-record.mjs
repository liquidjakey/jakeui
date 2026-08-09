/**
 * Jake UI — canonical documentation-record helpers.
 *
 * One implementation of the fingerprint so `docs:check`, `docs:digest` and the
 * adoption pass can never disagree about what a record hashes to.
 *
 * Schema and algorithm: docs/components/<Name>.doc.json, per the ThroughLine
 * component-doc-schema. Zero dependencies — node:crypto only.
 */

import { createHash } from 'node:crypto';

/**
 * Deterministic JSON: object keys sorted recursively, so formatting and key
 * order can never change a fingerprint. Arrays keep their order (it is content).
 */
export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
}

/**
 * fingerprint = sha256(stableStringify(record without provenance)).slice(0, 16)
 *
 * `provenance` is excluded deliberately: it is authoring metadata, not projected
 * content, so changing who authored a block must not invalidate every surface.
 */
export function canonicalFingerprint(record) {
  const { provenance, ...content } = record;
  void provenance;
  return createHash('sha256').update(stableStringify(content)).digest('hex').slice(0, 16);
}

/** Hash of a rendered surface's content, for detecting hand-edits. */
export function renderHash(text) {
  return createHash('sha256').update(String(text)).digest('hex').slice(0, 16);
}

/** Blocks that a regeneration must never overwrite. */
export const PROTECTED_PROVENANCE = ['imported', 'user'];

export function isProtected(provenanceValue) {
  if (!provenanceValue) return false;
  return String(provenanceValue)
    .split('+')
    .some((p) => PROTECTED_PROVENANCE.includes(p.trim()));
}

/** Required fields per the v1 schema. */
export const REQUIRED_FIELDS = ['name', 'summary', 'description'];

/** Fields deferred to a later schema version — emitting them is an error in v1. */
export const DEFERRED_FIELDS = ['anatomy', 'content', 'examples'];

export const VALID_STATUS = ['draft', 'beta', 'stable', 'deprecated'];

/** Validate a record. Returns an array of problem strings; empty means valid. */
export function validateRecord(record, where = 'record') {
  const problems = [];
  for (const f of REQUIRED_FIELDS) {
    if (!record[f] || !String(record[f]).trim()) problems.push(`${where}: missing required field "${f}"`);
  }
  for (const f of DEFERRED_FIELDS) {
    if (f in record) problems.push(`${where}: "${f}" is deferred to a later schema version; do not emit it in v1`);
  }
  if (record.status && !VALID_STATUS.includes(record.status)) {
    problems.push(`${where}: status "${record.status}" is not one of ${VALID_STATUS.join(' | ')}`);
  }
  if (record.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(record.updatedAt)) {
    problems.push(`${where}: updatedAt "${record.updatedAt}" is not an ISO date (YYYY-MM-DD)`);
  }
  return problems;
}

/** Filename for a component's record. Mirrors the Figma name exactly. */
export function recordFileName(componentName) {
  return `${componentName.replace(/\s*\/\s*/g, '-').replace(/[^A-Za-z0-9._-]+/g, '-')}.doc.json`;
}
