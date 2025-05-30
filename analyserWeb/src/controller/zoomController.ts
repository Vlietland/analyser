import { GridGenerator } from '@src/model/gridGenerator';
import { MouseTool } from '@src/controller/mouseTool';
import { CameraController } from '@src/controller/cameraController';

export class ZoomController implements MouseTool {
  private SENSITIVITY: number = 0.01;  
  private gridGenerator: GridGenerator;
  private onUpdateCallback: () => void;
  private cameraController: CameraController | undefined;

  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    let factor: number;
    if (deltaY > 0) {
      factor = 1 / (1 + deltaY * this.SENSITIVITY);
    } else {
      const absY = Math.abs(deltaY);      
      factor = 1 + absY * this.SENSITIVITY;
    }
    if (this.gridGenerator.scaleRange(factor)) {
      this.cameraController?.scaleZoom(factor);
      this.onUpdateCallback();
    }
  }

  public setCameraController(cameraController: CameraController) {
    this.cameraController = cameraController;
  }
}