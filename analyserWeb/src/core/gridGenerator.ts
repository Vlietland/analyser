import { ExpressionParser } from './expressionParser';

export class GridGenerator {
  private readonly expressionParser: ExpressionParser;  
  private readonly MIN_SAMPLES = 2;
  private readonly MAX_SAMPLES = 200;
  public readonly DEFAULT_SAMPLES = 50;
  public readonly DEFAULT_SAMPLE_RANGE = {xMin: -4, xMax: 4, yMin: -4, yMax: 4};

  constructor(expressionParser: ExpressionParser) {
    this.expressionParser = expressionParser;
  }

  public generateGrid(
    range = this.DEFAULT_SAMPLE_RANGE,
    samples = this.DEFAULT_SAMPLES
  ) {
    if (!this.validateRange(range)) {
      console.error("generateGrid received an invalid range.", range);
      return null;
    }
    
    const validatedSamples = Math.max(this.MIN_SAMPLES, Math.min(this.MAX_SAMPLES, Math.floor(samples)));
    if (validatedSamples !== samples) {
      console.warn(`Samples adjusted from ${samples} to ${validatedSamples} (min: ${this.MIN_SAMPLES}, max: ${this.MAX_SAMPLES})`);
    }
    
    const samplesX = validatedSamples;
    const samplesY = validatedSamples;
    const points = [];
    const stepX = (range.xMax - range.xMin) / (samplesX - 1);
    const stepY = (range.yMax - range.yMin) / (samplesY - 1);

    for (let j = 0; j < samplesY; j++) {
      const y = range.yMin + j * stepY;
      const row = [];
      for (let i = 0; i < samplesX; i++) {
        const x = range.xMin + i * stepX;
        let z;
        try {
          z = this.expressionParser.evaluateExpression({ x, y });
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
}
