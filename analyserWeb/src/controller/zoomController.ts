import { GridGenerator } from '@src/core/gridGenerator';
import { MouseTool } from '@src/controller/mouseTool';

export class ZoomController implements MouseTool {
  private gridGenerator: GridGenerator;
  private static readonly SENSITIVITY: number = 0.01;
  private onUpdateCallback: () => void;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    let factor: number;
    if (deltaY < 0) {
      const absY = Math.abs(deltaY);
      factor = 1 / (1 + absY * ZoomController.SENSITIVITY);
    } else {
      factor = 1 + deltaY * ZoomController.SENSITIVITY;
    }
    this.gridGenerator.scaleRange(factor);
    this.onUpdateCallback();
  }
}