import { describe, it, expect, vi } from 'vitest';
import { generateGrid, MIN_SAMPLES, MAX_SAMPLES, DEFAULT_SAMPLES } from '../../../src/core/grid/gridCalculator';
import { compileExpression } from '../../../src/core/evaluator/expressionEngine';
import { isCompiledExpression, CompiledExpression } from '../../../src/core/evaluator/expressionTypes';
import { SampleRange } from '../../../src/core/types';
import { DEFAULT_SAMPLE_RANGE } from '../../../src/core/grid/sampleRange';

// Mock console outputs
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

// Mock compiled expression for testing grid generation
const mockExpression = compileExpression('x + y');
if (!isCompiledExpression(mockExpression)) {
  throw new Error("Failed to compile mock expression for testing"); // Ensure mock is valid
}
const mockCompiledExpr: CompiledExpression = mockExpression;

const mockErrorExpression = compileExpression('1/x'); // Will cause error at x=0
if (!isCompiledExpression(mockErrorExpression)) {
  throw new Error("Failed to compile mock error expression for testing");
}
const mockCompiledErrorExpr: CompiledExpression = mockErrorExpression;


describe('generateGrid', () => {
  it('should return null if expression is invalid', () => {
    const invalidExpr = { input: 'invalid', message: 'Error' }; // Mock ParseError
    const result = generateGrid(invalidExpr as any); // Cast to any to bypass type check for test
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith("generateGrid requires a valid CompiledExpression.");
  });

  it('should return null if range is invalid', () => {
    const invalidRange: SampleRange = { xMin: 10, xMax: 0, yMin: 0, yMax: 10 };
    const result = generateGrid(mockCompiledExpr, invalidRange);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith("generateGrid received an invalid range.", invalidRange);
  });

  it('should generate a grid with default samples and range', () => {
    const result = generateGrid(mockCompiledExpr);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.samplesX).toBe(DEFAULT_SAMPLES);
      expect(result.samplesY).toBe(DEFAULT_SAMPLES);
      expect(result.points.length).toBe(DEFAULT_SAMPLES); // Number of rows (Y)
      expect(result.points[0].length).toBe(DEFAULT_SAMPLES); // Number of columns (X)
      // Check a corner point
      expect(result.points[0][0].x).toBeCloseTo(DEFAULT_SAMPLE_RANGE.xMin);
      expect(result.points[0][0].y).toBeCloseTo(DEFAULT_SAMPLE_RANGE.yMin);
      expect(result.points[0][0].z).toBeCloseTo(DEFAULT_SAMPLE_RANGE.xMin + DEFAULT_SAMPLE_RANGE.yMin);
      // Check opposite corner point
      const lastY = DEFAULT_SAMPLES - 1;
      const lastX = DEFAULT_SAMPLES - 1;
      expect(result.points[lastY][lastX].x).toBeCloseTo(DEFAULT_SAMPLE_RANGE.xMax);
      expect(result.points[lastY][lastX].y).toBeCloseTo(DEFAULT_SAMPLE_RANGE.yMax);
      expect(result.points[lastY][lastX].z).toBeCloseTo(DEFAULT_SAMPLE_RANGE.xMax + DEFAULT_SAMPLE_RANGE.yMax);
    }
  });

  it('should generate a grid with specified samples and range', () => {
    const range: SampleRange = { xMin: 0, xMax: 1, yMin: 0, yMax: 2 };
    const samples = 3; // 3x3 grid
    const result = generateGrid(mockCompiledExpr, range, samples);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.samplesX).toBe(samples);
      expect(result.samplesY).toBe(samples);
      expect(result.points.length).toBe(samples);
      expect(result.points[0].length).toBe(samples);
      // Check points (0,0), (0.5, 1), (1, 2)
      expect(result.points[0][0]).toEqual({ x: 0, y: 0, z: 0 });
      expect(result.points[1][1]).toEqual({ x: 0.5, y: 1, z: 1.5 });
      expect(result.points[2][2]).toEqual({ x: 1, y: 2, z: 3 });
    }
  });

  it('should clamp samples to MIN_SAMPLES and MAX_SAMPLES', () => {
    const resultMin = generateGrid(mockCompiledExpr, DEFAULT_SAMPLE_RANGE, 1);
    expect(resultMin?.samplesX).toBe(MIN_SAMPLES);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(`Samples adjusted from 1 to ${MIN_SAMPLES}`));

    const resultMax = generateGrid(mockCompiledExpr, DEFAULT_SAMPLE_RANGE, MAX_SAMPLES + 100);
    expect(resultMax?.samplesX).toBe(MAX_SAMPLES);
     expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(`Samples adjusted from ${MAX_SAMPLES + 100} to ${MAX_SAMPLES}`));
  });

  it('should set Z to NaN for evaluation errors', () => {
     const range: SampleRange = { xMin: -1, xMax: 1, yMin: -1, yMax: 1 };
     const samples = 3; // Includes x=0
     const result = generateGrid(mockCompiledErrorExpr, range, samples);
     expect(result).not.toBeNull();
     if (result) {
        // Point where x=0 should have NaN for Z
        const midXIndex = Math.floor(samples / 2); // Index 1 for samples=3
        expect(result.points[0][midXIndex].x).toBeCloseTo(0);
        expect(result.points[0][midXIndex].z).toBeNaN();
        expect(result.points[1][midXIndex].z).toBeNaN();
        expect(result.points[2][midXIndex].z).toBeNaN();
        // Other points should be finite
        expect(result.points[0][0].z).not.toBeNaN();
        expect(result.points[0][samples-1].z).not.toBeNaN();
     }
  });
});
