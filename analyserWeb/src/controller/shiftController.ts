import { GridGenerator } from '@src/core/gridGenerator';
import { MouseTool } from '@src/controller/mouseTool';

export class ShiftController implements MouseTool {
  private gridGenerator: GridGenerator;
  private static readonly SENSITIVITY: number = 0.01;
  private onUpdateCallback: () => void;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const currentRange = this.gridGenerator.getCurrentRange();
    const deltaGridX = -deltaX * (currentRange.xMax - currentRange.xMin) * ShiftController.SENSITIVITY;
    const deltaGridY = -deltaY * (currentRange.yMax - currentRange.yMin) * ShiftController.SENSITIVITY;
    
    this.gridGenerator.shiftRange(deltaGridX, deltaGridY);
    this.onUpdateCallback();
  }
}
