import { describe, it, expect, vi } from 'vitest';
import { SampleRange } from '../../../src/core/types';
import { validateRange, createSampleRange, DEFAULT_SAMPLE_RANGE } from '../../../src/core/grid/sampleRange';

// Mock console.error to avoid polluting test output
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('validateRange', () => {
  it('should return true for a valid range', () => {
    const validRange: SampleRange = { xMin: -10, xMax: 10, yMin: -5, yMax: 5 };
    expect(validateRange(validRange)).toBe(true);
  });

  it('should return false if xMin >= xMax', () => {
    const invalidRange: SampleRange = { xMin: 10, xMax: -10, yMin: -5, yMax: 5 };
    expect(validateRange(invalidRange)).toBe(false);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Min value must be less than Max value"), invalidRange);
  });

  it('should return false if yMin >= yMax', () => {
    const invalidRange: SampleRange = { xMin: -10, xMax: 10, yMin: 5, yMax: -5 };
    expect(validateRange(invalidRange)).toBe(false);
     expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Min value must be less than Max value"), invalidRange);
  });

  it('should return false for non-finite values', () => {
    const invalidRange1: SampleRange = { xMin: NaN, xMax: 10, yMin: -5, yMax: 5 };
    const invalidRange2: SampleRange = { xMin: -10, xMax: Infinity, yMin: -5, yMax: 5 };
    expect(validateRange(invalidRange1)).toBe(false);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Values must be finite numbers"), invalidRange1);
    expect(validateRange(invalidRange2)).toBe(false);
     expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Values must be finite numbers"), invalidRange2);
  });
});

describe('createSampleRange', () => {
  it('should create a range object for valid inputs', () => {
    const range = createSampleRange(-1, 1, -2, 2);
    expect(range).toEqual({ xMin: -1, xMax: 1, yMin: -2, yMax: 2 });
  });

  it('should return null for invalid inputs (xMin >= xMax)', () => {
    const range = createSampleRange(1, -1, -2, 2);
    expect(range).toBeNull();
  });

   it('should return null for invalid inputs (non-finite)', () => {
    const range = createSampleRange(-1, 1, -Infinity, 2);
    expect(range).toBeNull();
  });
});

describe('DEFAULT_SAMPLE_RANGE', () => {
   it('should be a valid range', () => {
    expect(validateRange(DEFAULT_SAMPLE_RANGE)).toBe(true);
  });
});
