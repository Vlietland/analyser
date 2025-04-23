import { GridGenerator } from '@src/core/gridGenerator';
import { MouseTool } from '@src/controller/mouseTool';

export class ZFactorController implements MouseTool {
  private gridGenerator: GridGenerator;
  private SENSIVITITY: number = 0.01;
  private onUpdateCallback: () => void;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const factor = 1 + deltaY * this.SENSIVITITY;
    this.gridGenerator.scaleZFactor(factor);
    this.onUpdateCallback();
  }

  public getZFactor(): number {
    return this.gridGenerator.getZFactor();
  }
}
