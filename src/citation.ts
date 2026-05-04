import type { PaperRecord } from './types.js';

export function citationFor(paper: PaperRecord): string {
  if (paper.citation) return paper.citation;
  const authors = formatAuthors(paper.authors.map((author) => author.name));
  const year = paper.year ? ` (${paper.year}).` : '.';
  const venue = paper.venue ? ` ${paper.venue}.` : '';
  const doi = paper.doi ? ` https://doi.org/${paper.doi}` : '';
  return `${authors}${year} ${paper.title}.${venue}${doi}`.replace(/\s+/g, ' ').trim();
}

export function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return 'Unknown authors';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors.slice(0, -1).join(', ')}, & ${authors.at(-1)}`;
}
