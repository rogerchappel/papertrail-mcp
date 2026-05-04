import { assertObject, assertString, PaperTrailError } from './errors.js';
import type { PaperAuthor, PaperLink, PaperRecord, PaperTrailDataset, ProvenanceEvent } from './types.js';

const allowedActions = new Set(['searched', 'imported', 'retrieved', 'exported']);
const allowedSources = new Set(['fixture', 'cache', 'manual', 'external-record']);

export function parseDataset(input: unknown): PaperTrailDataset {
  assertObject(input, 'dataset');
  const papersInput = input.papers;
  if (!Array.isArray(papersInput)) throw new PaperTrailError('dataset.papers must be an array', 'invalid_papers');
  const provenanceInput = input.provenance ?? [];
  if (!Array.isArray(provenanceInput)) throw new PaperTrailError('dataset.provenance must be an array', 'invalid_provenance');
  const papers = papersInput.map(parsePaper);
  const provenance = provenanceInput.map(parseProvenance);
  return { papers, provenance };
}

export function parsePaper(input: unknown): PaperRecord {
  assertObject(input, 'paper');
  const source = String(input.source ?? 'fixture');
  if (!allowedSources.has(source)) throw new PaperTrailError(`unsupported paper source: ${source}`, 'invalid_source');
  const authorsInput = input.authors ?? [];
  if (!Array.isArray(authorsInput)) throw new PaperTrailError('paper.authors must be an array', 'invalid_authors');
  return {
    id: assertString(input.id, 'paper.id'),
    title: assertString(input.title, 'paper.title'),
    authors: authorsInput.map(parseAuthor),
    year: parseOptionalNumber(input.year, 'paper.year'),
    venue: parseOptionalString(input.venue),
    abstract: parseOptionalString(input.abstract),
    doi: parseOptionalString(input.doi),
    arxivId: parseOptionalString(input.arxivId),
    url: parseOptionalString(input.url),
    pdfPath: parseOptionalString(input.pdfPath),
    tags: parseOptionalStringArray(input.tags, 'paper.tags'),
    citation: parseOptionalString(input.citation),
    source: source as PaperRecord['source'],
    query: parseOptionalString(input.query),
    retrievedAt: parseOptionalString(input.retrievedAt),
    links: parseLinks(input.links)
  };
}

function parseAuthor(input: unknown): PaperAuthor {
  if (typeof input === 'string') return { name: assertString(input, 'author') };
  assertObject(input, 'author');
  return { name: assertString(input.name, 'author.name'), orcid: parseOptionalString(input.orcid) };
}

function parseLinks(input: unknown): PaperLink[] | undefined {
  if (input === undefined) return undefined;
  if (!Array.isArray(input)) throw new PaperTrailError('paper.links must be an array', 'invalid_links');
  return input.map((link) => {
    assertObject(link, 'link');
    return { label: assertString(link.label, 'link.label'), url: assertString(link.url, 'link.url') };
  });
}

function parseProvenance(input: unknown): ProvenanceEvent {
  assertObject(input, 'provenance');
  const action = assertString(input.action, 'provenance.action');
  if (!allowedActions.has(action)) throw new PaperTrailError(`unsupported provenance action: ${action}`, 'invalid_action');
  return {
    id: assertString(input.id, 'provenance.id'),
    paperId: assertString(input.paperId, 'provenance.paperId'),
    action: action as ProvenanceEvent['action'],
    source: assertString(input.source, 'provenance.source'),
    query: parseOptionalString(input.query),
    at: assertString(input.at, 'provenance.at'),
    note: parseOptionalString(input.note)
  };
}

function parseOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function parseOptionalNumber(value: unknown, label: string): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new PaperTrailError(`${label} must be a finite number`, 'invalid_number');
  return value;
}

function parseOptionalStringArray(value: unknown, label: string): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new PaperTrailError(`${label} must be an array`, 'invalid_string_array');
  return value.map((item) => assertString(item, label));
}
