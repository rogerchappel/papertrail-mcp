import type { PaperRecord } from './types.js';

export function normalizeText(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function paperHaystack(paper: PaperRecord): string {
  return normalizeText([
    paper.title,
    paper.abstract,
    paper.venue,
    paper.doi,
    paper.arxivId,
    paper.query,
    ...(paper.tags ?? []),
    ...paper.authors.map((author) => author.name)
  ].filter(Boolean).join(' '));
}

export function stablePaperId(title: string, year?: number): string {
  const slug = normalizeText(title).replace(/\s+/g, '-').slice(0, 72) || 'paper';
  return year ? `${slug}-${year}` : slug;
}
