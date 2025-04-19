import { SampleRange } from '../types';

export const DEFAULT_SAMPLE_RANGE: SampleRange = {
  xMin: -4,
  xMax: 4,
  yMin: -4,
  yMax: 4,
};

export function validateRange(range: SampleRange): boolean {
  if (range.xMin >= range.xMax || range.yMin >= range.yMax) {
    console.error("Invalid range: Min value must be less than Max value.", range);
    return false;
  }
  if (!Number.isFinite(range.xMin) || !Number.isFinite(range.xMax) ||
      !Number.isFinite(range.yMin) || !Number.isFinite(range.yMax)) {
    console.error("Invalid range: Values must be finite numbers.", range);
    return false;
  }
  return true;
}

export function createSampleRange(xMin: number, xMax: number, yMin: number, yMax: number): SampleRange | null {
    const range: SampleRange = { xMin, xMax, yMin, yMax };
    if (validateRange(range)) {
        return range;
    }
    return null;
}
