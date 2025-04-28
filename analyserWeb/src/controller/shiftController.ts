import { GridGenerator } from '@src/model/gridGenerator';
import { MouseTool } from '@src/controller/mouseTool';

export class ShiftController implements MouseTool {
  private SENSITIVITY: number = 0.005;  
  private gridGenerator: GridGenerator;
  private onUpdateCallback: () => void;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const currentRange = this.gridGenerator.getCurrentRange();
    const deltaGridX = +deltaX * (currentRange.xMax - currentRange.xMin) * this.SENSITIVITY;
    const deltaGridY = -deltaY * (currentRange.yMax - currentRange.yMin) * this.SENSITIVITY;
    
    if (this.gridGenerator.shiftRange(deltaGridX, deltaGridY)) this.onUpdateCallback();
  }
}
