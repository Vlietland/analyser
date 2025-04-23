import { CameraOrbitController } from '@src/controller/cameraOrbitController';

export class MouseHandler {
  private cameraOrbitController: CameraOrbitController;
  private domElement: HTMLCanvasElement;

  private isDragging: boolean = false;
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  // Bound event listeners
  private boundOnMouseDown: (event: MouseEvent) => void;
  private boundOnMouseMove: (event: MouseEvent) => void;
  private boundOnMouseUp: (event: MouseEvent) => void;

  private currentTool: string = '';

  constructor(
    cameraOrbitController: CameraOrbitController, 
    domElement: HTMLCanvasElement, 
  ) {
    this.cameraOrbitController = cameraOrbitController;
    this.domElement = domElement;
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.addEventListeners();
  }

  public addEventListeners(): void {
    this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false);
    window.addEventListener('mousemove', this.boundOnMouseMove, false);
    window.addEventListener('mouseup', this.boundOnMouseUp, false);
    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  public removeEventListeners(): void {
    this.domElement.removeEventListener('mousedown', this.boundOnMouseDown);
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundOnMouseUp);
    this.domElement.removeEventListener('contextmenu', (event) => event.preventDefault());
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.previousMousePosition.x = event.clientX;
    this.previousMousePosition.y = event.clientY;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;

    if (this.currentTool == "Rotate") {
      this.cameraOrbitController.setDeltaX(deltaX);
      this.cameraOrbitController.setDeltaY(deltaY);
    }

    this.previousMousePosition.x = event.clientX;
    this.previousMousePosition.y = event.clientY;
  }

  private onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  public setTool(newTool: string) {
    this.currentTool = newTool;
  }
}
