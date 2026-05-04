import assert from 'node:assert/strict';
import test from 'node:test';
import { PaperTrailError } from './errors.js';
import { parseDataset } from './schema.js';

test('rejects malformed paper datasets clearly', () => {
  assert.throws(() => parseDataset({ papers: [{ title: 'No id' }] }), PaperTrailError);
});

test('parses minimal valid datasets', () => {
  const dataset = parseDataset({ papers: [{ id: 'p1', title: 'Paper One', authors: ['Ada'], source: 'manual' }] });
  assert.equal(dataset.papers[0].authors[0].name, 'Ada');
});
