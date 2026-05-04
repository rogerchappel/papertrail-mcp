import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseDataset } from './schema.js';
import type { PaperRecord, PaperTrailDataset, ProvenanceEvent } from './types.js';

export async function readCache(cachePath: string): Promise<PaperTrailDataset> {
  try {
    const raw = await readFile(cachePath, 'utf8');
    return parseDataset(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { papers: [], provenance: [] };
    throw error;
  }
}

export async function writeCache(cachePath: string, dataset: PaperTrailDataset): Promise<void> {
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
}

export function upsertPapers(dataset: PaperTrailDataset, papers: PaperRecord[], events: ProvenanceEvent[] = []): PaperTrailDataset {
  const paperMap = new Map(dataset.papers.map((paper) => [paper.id, paper]));
  for (const paper of papers) paperMap.set(paper.id, paper);
  const eventMap = new Map(dataset.provenance.map((event) => [event.id, event]));
  for (const event of events) eventMap.set(event.id, event);
  return { papers: [...paperMap.values()], provenance: [...eventMap.values()] };
}
