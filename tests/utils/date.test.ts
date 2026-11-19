import { describe, expect, it } from 'vitest';
import { parseDDMMYYYY } from '../../src/utils/date';

describe('parseDDMMYYYY', () => {
  it('parses a valid date', () => {
    expect(parseDDMMYYYY('31.12.2024')).toBe(Date.UTC(2024, 11, 31));
  });

  it('rejects an invalid date', () => {
    expect(parseDDMMYYYY('31.02.2024')).toBeNull();
  });

  it('rejects unsupported formats', () => {
    expect(parseDDMMYYYY('2024-12-31')).toBeNull();
  });
});
