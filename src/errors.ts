export class PaperTrailError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = 'PaperTrailError';
  }
}

export function assertObject(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new PaperTrailError(`${label} must be an object`, 'invalid_object');
  }
}

export function assertString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new PaperTrailError(`${label} must be a non-empty string`, 'invalid_string');
  }
  return value.trim();
}
