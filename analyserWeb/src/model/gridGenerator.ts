import * as THREE from 'three';
import { ExpressionParser } from './expressionParser';

export interface SampleRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}

export class GridGenerator {
  private MAX_RANGE = 99;
  private MIN_SAMPLES = 2;
  private MAX_SAMPLES = 200;
  private DEFAULT_SAMPLES = 50;
  private DEFAULT_ZFACTOR = 1;
  private DEFAULT_RANGE = {xMin: -4, xMax: 4, yMin: -4, yMax: 4, zMin: 0, zMax: 0};
  private expressionParser: ExpressionParser;  
  private validatedSamples;
  private range = this.DEFAULT_RANGE;
  private zFactor = this.DEFAULT_ZFACTOR;
  private currentGrid: { points: { x: number, y: number, z: number }[][], samplesX: number, samplesY: number } | null = null;

  constructor(expressionParser: ExpressionParser) {
    this.expressionParser = expressionParser;
    this.validatedSamples = this.DEFAULT_SAMPLES;
  }

  public generateGrid() {
    this.range.zMin = 0;
    this.range.zMax = 0;
    
    if (!this.validateRange(this.range)) {
      console.error("generateGrid received an invalid range.", this.range);
      return null;
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
          z = this.expressionParser.evaluateExpression({ x, y }) / this.zFactor;
          if (!Number.isFinite(z)) {
            z = NaN;
          }
          else {
            if (z < this.range.zMin) this.range.zMin = z;
            if (z > this.range.zMax) this.range.zMax = z;
          }
        } catch (error) {
          z = NaN;
        }
        row.push({ x, y, z});
      }
      points.push(row);
    }
    if (this.range.zMin === Infinity) {
      this.range.zMin = 0;
      this.range.zMax= 0;
    } else if (this.range.zMin === this.range.zMax) {
      this.range.zMax += 1e-6;
    }

    this.currentGrid = {points, samplesX, samplesY};;
    return this.currentGrid;
  }

  public getGrid() {
    return this.currentGrid;
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

  public getTarget(): THREE.Vector3 {
    return new THREE.Vector3(
      (this.range.xMin + this.range.xMax) / 2,
      (this.range.yMin + this.range.yMax) / 2,
      (this.range.zMin + this.range.zMax) / 2,
    );
  }

  public getCurrentSamples() {
    return this.validatedSamples;
  }

  public getCurrentRange(): SampleRange {
    return { ...this.range };
  }

  public scaleRange(factor: number): boolean {
    const xCenter = (this.range.xMin + this.range.xMax) / 2;
    const yCenter = (this.range.yMin + this.range.yMax) / 2;
    const xRange = (this.range.xMax - this.range.xMin) * factor;
    const yRange = (this.range.yMax - this.range.yMin) * factor;
    
    const newXMin = xCenter - xRange / 2;
    const newXMax = xCenter + xRange / 2;
    const newYMin = yCenter - yRange / 2;
    const newYMax = yCenter + yRange / 2;

    if (newXMin < -this.MAX_RANGE || newXMax > this.MAX_RANGE ||
        newYMin < -this.MAX_RANGE || newYMax > this.MAX_RANGE) {
      return false;
    }

    this.range = {
      xMin: newXMin,
      xMax: newXMax,
      yMin: newYMin,
      yMax: newYMax,
      zMin: this.range.zMin,
      zMax: this.range.zMax
    };
    return true;
  }

  public shiftRange(deltaX: number, deltaY: number): boolean {
    const newXMin = this.range.xMin + deltaX;
    const newXMax = this.range.xMax + deltaX;
    const newYMin = this.range.yMin + deltaY;
    const newYMax = this.range.yMax + deltaY;
    
    if (newXMin < -this.MAX_RANGE || newXMax > this.MAX_RANGE ||
        newYMin < -this.MAX_RANGE || newYMax > this.MAX_RANGE) {
      return false;
    }

    this.range = {
      xMin: newXMin,
      xMax: newXMax,
      yMin: newYMin,
      yMax: newYMax,
      zMin: this.range.zMin,
      zMax: this.range.zMax
    };
    console.log(this.range)
    return true;
  }

  public scaleZFactor(factor: number): void {
    this.zFactor *= factor;
  }

  public getZFactor(): number {
    return this.zFactor;
  }

  public setSamples(samples: number) {
    this.validatedSamples = Math.max(this.MIN_SAMPLES, Math.min(this.MAX_SAMPLES, Math.floor(samples)));
    if (this.validatedSamples !== samples) {
      console.warn(`Samples adjusted`);
    }
    console.log(this.validatedSamples)
  }
}
