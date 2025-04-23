import { ExpressionParser } from '@src/core/expressionParser';

export interface SampleRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export class GridGenerator {
  private readonly expressionParser: ExpressionParser;
  private readonly MIN_SAMPLES = 2;
  private readonly MAX_SAMPLES = 200;
  private readonly DEFAULT_SAMPLES = 50;
  private samples = this.DEFAULT_SAMPLES
  private validatedSamples = this.DEFAULT_SAMPLES;
  private readonly DEFAULT_RANGE = {xMin: -4, xMax: 4, yMin: -4, yMax: 4};
  private range = this.DEFAULT_RANGE;
  private zFactor = 1; // Default zFactor

  constructor(expressionParser: ExpressionParser) {
    this.expressionParser = expressionParser;
  }

  public generateGrid() {
    if (!this.validateRange(this.range)) {
      console.error("generateGrid received an invalid range.", this.range);
      return null;
    }
    
    this.validatedSamples = Math.max(this.MIN_SAMPLES, Math.min(this.MAX_SAMPLES, Math.floor(this.samples)));
    if (this.validatedSamples !== this.samples) {
      console.warn(`Samples adjusted from ${this.samples} to ${this.validatedSamples} (min: ${this.MIN_SAMPLES}, max: ${this.MAX_SAMPLES})`);
    }
    
    const samplesX = this.validatedSamples;
    const samplesY = this.validatedSamples;
    const points = [];
    const stepX = (this.range.xMax - this.range.xMin) / (samplesX - 1);
    const stepY = (this.range.yMax - this.range.yMin) / (samplesY - 1);

    for (let j = 0; j < samplesY; j++) {
      const y = this.range.yMin + j * stepY;
      const row = [];
      for (let i = 0; i < samplesX; i++) {
        const x = this.range.xMin + i * stepX;
        let z;
        try {
          z = this.expressionParser.evaluateExpression({ x, y });
          if (!Number.isFinite(z)) {
            z = NaN;
          }
        } catch (error) {
          z = NaN;
        }
        row.push({ x, y, z: z / this.zFactor }); // Scale z by zFactor
      }
      points.push(row);
    }

    return {
      points,
      samplesX,
      samplesY,
    };
  }

  private validateRange(range: any) {
    return (
      range.xMin < range.xMax &&
      range.yMin < range.yMax &&
      Number.isFinite(range.xMin) &&
      Number.isFinite(range.xMax) &&
      Number.isFinite(range.yMin) &&
      Number.isFinite(range.yMax)
    );
  }

  public getCurrentSamples() {
    return this.validatedSamples;
  }

  public scaleRange(factor: number): void {
    const xCenter = (this.range.xMin + this.range.xMax) / 2;
    const yCenter = (this.range.yMin + this.range.yMax) / 2;
    const xRange = (this.range.xMax - this.range.xMin) * factor;
    const yRange = (this.range.yMax - this.range.yMin) * factor;
    this.range = {
      xMin: xCenter - xRange / 2,
      xMax: xCenter + xRange / 2,
      yMin: yCenter - yRange / 2,
      yMax: yCenter + yRange / 2,
    };
  }

  public getCurrentRange(): SampleRange {
    return { ...this.range };
  }

  public shiftRange(deltaX: number, deltaY: number): void {
    this.range = {
      xMin: this.range.xMin + deltaX,
      xMax: this.range.xMax + deltaX,
      yMin: this.range.yMin + deltaY,
      yMax: this.range.yMax + deltaY,
    };
  }

  public scaleZFactor(factor: number): void {
    this.zFactor *= factor;
  }

  public getZFactor(): number {
    return this.zFactor;
  }
}
