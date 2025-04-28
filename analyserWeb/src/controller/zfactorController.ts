import { GridGenerator } from '@src/model/gridGenerator';
import { MouseTool } from './mouseTool';

export class ZFactorController implements MouseTool {
  private SENSITIVITY: number = 0.01;
  private Z_FACTOR_MIN: number = 0.1;
  private Z_FACTOR_MAX: number = 99;
  private gridGenerator: GridGenerator;  
  private onUpdateCallback: () => void;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const factor = 1 + deltaY * this.SENSITIVITY;
    const newZFactor = Math.max(this.Z_FACTOR_MIN, Math.min(this.Z_FACTOR_MAX, this.gridGenerator.getZFactor() * factor));
    this.gridGenerator.scaleZFactor(newZFactor / this.gridGenerator.getZFactor());
    this.onUpdateCallback();
  }

  public getZFactor(): number {
    return this.gridGenerator.getZFactor();
  }
}
