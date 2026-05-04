import { normalizeText, paperHaystack } from './normalize.js';
import type { PaperRecord, SearchOptions } from './types.js';

export function searchPapers(papers: PaperRecord[], options: SearchOptions): PaperRecord[] {
  const terms = normalizeText(options.query).split(/\s+/).filter(Boolean);
  const scored = papers
    .filter((paper) => options.tag ? (paper.tags ?? []).includes(options.tag) : true)
    .filter((paper) => options.year ? paper.year === options.year : true)
    .map((paper) => ({ paper, score: scorePaper(paper, terms) }))
    .filter((entry) => entry.score > 0 || terms.length === 0)
    .sort((a, b) => b.score - a.score || (b.paper.year ?? 0) - (a.paper.year ?? 0) || a.paper.title.localeCompare(b.paper.title));
  return scored.slice(0, options.limit ?? 20).map((entry) => entry.paper);
}

export function scorePaper(paper: PaperRecord, terms: string[]): number {
  if (terms.length === 0) return 1;
  const haystack = paperHaystack(paper);
  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) score += 1;
    if (normalizeText(paper.title).includes(term)) score += 2;
    if ((paper.tags ?? []).map(normalizeText).includes(term)) score += 2;
  }
  return score;
}
