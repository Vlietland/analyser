import { GridGenerator } from '@src/model/gridGenerator';
import { MouseTool } from './mouseTool';

export class ZFactorController implements MouseTool {
  private gridGenerator: GridGenerator;
  private static readonly SENSITIVITY: number = 0.01;
  public static readonly Z_FACTOR_MIN: number = 0.1;
  public static readonly Z_FACTOR_MAX: number = 100;
  private onUpdateCallback: () => void;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const factor = 1 + deltaY * ZFactorController.SENSITIVITY;
    const newZFactor = Math.max(ZFactorController.Z_FACTOR_MIN, Math.min(ZFactorController.Z_FACTOR_MAX, this.gridGenerator.getZFactor() * factor));
    this.gridGenerator.scaleZFactor(newZFactor / this.gridGenerator.getZFactor());
    this.onUpdateCallback();
  }

  public getZFactor(): number {
    return this.gridGenerator.getZFactor();
  }
}
