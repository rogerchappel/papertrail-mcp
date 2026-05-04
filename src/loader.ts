import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseDataset } from './schema.js';
import type { PaperTrailDataset } from './types.js';

export async function loadDataset(inputPath: string): Promise<PaperTrailDataset> {
  const resolved = path.resolve(inputPath);
  const stats = await stat(resolved);
  const filePath = stats.isDirectory() ? path.join(resolved, 'papers.json') : resolved;
  const content = await readFile(filePath, 'utf8');
  return parseDataset(JSON.parse(content));
}

export async function loadDatasets(paths: string[]): Promise<PaperTrailDataset> {
  const datasets = await Promise.all(paths.map(loadDataset));
  return mergeDatasets(datasets);
}

export function mergeDatasets(datasets: PaperTrailDataset[]): PaperTrailDataset {
  const papers = new Map<string, PaperTrailDataset['papers'][number]>();
  const provenance = new Map<string, PaperTrailDataset['provenance'][number]>();
  for (const dataset of datasets) {
    for (const paper of dataset.papers) papers.set(paper.id, paper);
    for (const event of dataset.provenance) provenance.set(event.id, event);
  }
  return { papers: [...papers.values()], provenance: [...provenance.values()] };
}
