import type { InspectSummary, PaperTrailDataset } from './types.js';

export function summarizeDataset(dataset: PaperTrailDataset): InspectSummary {
  const sources: Record<string, number> = {};
  const years: Record<string, number> = {};
  const tags: Record<string, number> = {};
  for (const paper of dataset.papers) {
    sources[paper.source] = (sources[paper.source] ?? 0) + 1;
    if (paper.year) years[String(paper.year)] = (years[String(paper.year)] ?? 0) + 1;
    for (const tag of paper.tags ?? []) tags[tag] = (tags[tag] ?? 0) + 1;
  }
  return {
    paperCount: dataset.papers.length,
    provenanceCount: dataset.provenance.length,
    sources: sortRecord(sources),
    years: sortRecord(years),
    tags: sortRecord(tags)
  };
}

function sortRecord(record: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}
