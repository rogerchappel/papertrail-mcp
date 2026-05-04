import assert from 'node:assert/strict';
import test from 'node:test';
import { loadDataset } from './loader.js';
import { renderMarkdownExport } from './markdown.js';

test('markdown export includes citations and provenance', async () => {
  const dataset = await loadDataset('fixtures/sample');
  const markdown = renderMarkdownExport(dataset, dataset.papers.slice(0, 1));
  assert.match(markdown, /# PaperTrail Export/);
  assert.match(markdown, /Attention Is All You Need/);
  assert.match(markdown, /Provenance/);
  assert.match(markdown, /No network call performed/i);
});
