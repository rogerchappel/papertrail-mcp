import { PaperTrailError } from './errors.js';
import { parsePaper } from './schema.js';
import type { PaperRecord } from './types.js';

export function parseJsonlPapers(content: string): PaperRecord[] {
  return content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line, index) => {
    try {
      return parsePaper(JSON.parse(line));
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new PaperTrailError(`invalid JSON on JSONL line ${index + 1}`, 'invalid_jsonl');
      }
      throw error;
    }
  });
}

export function toJsonlPapers(papers: PaperRecord[]): string {
  return `${papers.map((paper) => JSON.stringify(paper)).join('\n')}\n`;
}
