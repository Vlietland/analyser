import { CompiledExpression, isCompiledExpression } from '../evaluator/expressionTypes';
import { SampleRange, SurfaceGrid, Point3D } from '../types';
import { validateRange, DEFAULT_SAMPLE_RANGE } from './sampleRange';

export const MIN_SAMPLES = 2;
export const MAX_SAMPLES = 200;
export const DEFAULT_SAMPLES = 50;

export function generateGrid(
  expression: CompiledExpression,
  range: SampleRange = DEFAULT_SAMPLE_RANGE,
  samples: number = DEFAULT_SAMPLES
): SurfaceGrid | null {
  if (!isCompiledExpression(expression)) {
    console.error("generateGrid requires a valid CompiledExpression.");
    return null;
  }
  if (!validateRange(range)) {
    console.error("generateGrid received an invalid range.", range);
    return null;
  }
  const validatedSamples = Math.max(MIN_SAMPLES, Math.min(MAX_SAMPLES, Math.floor(samples)));
  if (validatedSamples !== samples) {
      console.warn(`Samples adjusted from ${samples} to ${validatedSamples} (min: ${MIN_SAMPLES}, max: ${MAX_SAMPLES})`);
  }
  const samplesX = validatedSamples;
  const samplesY = validatedSamples;
  const points: Point3D[][] = [];
  const stepX = (range.xMax - range.xMin) / (samplesX - 1);
  const stepY = (range.yMax - range.yMin) / (samplesY - 1);

  for (let j = 0; j < samplesY; j++) {
    const y = range.yMin + j * stepY;
    const row: Point3D[] = [];
    for (let i = 0; i < samplesX; i++) {
      const x = range.xMin + i * stepX;
      let z: number;
      try {
        z = expression.evaluate({ x, y });
        if (!Number.isFinite(z)) {
          z = NaN;
        }
      } catch (error) {
        z = NaN;
      }
      row.push({ x, y, z });
    }
    points.push(row);
  }

  const surfaceGrid: SurfaceGrid = {
    points,
    samplesX,
    samplesY,
  };

  return surfaceGrid;
}
