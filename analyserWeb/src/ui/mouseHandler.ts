import { MouseTool } from '@src/controller/mouseTool';

export class MouseHandler {
  private domElement: HTMLCanvasElement;
  private activeTool: MouseTool | null = null;

  private isDragging: boolean = false;
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  private boundOnMouseDown: (event: MouseEvent) => void;
  private boundOnMouseMove: (event: MouseEvent) => void;
  private boundOnMouseUp: (event: MouseEvent) => void;
  private boundOnTouchStart: (event: TouchEvent) => void;
  private boundOnTouchMove: (event: TouchEvent) => void;
  private boundOnTouchEnd: (event: TouchEvent) => void;

  constructor(domElement: HTMLCanvasElement) {
    this.domElement = domElement;
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnTouchStart = this.onTouchStart.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchEnd = this.onTouchEnd.bind(this);
    this.addEventListeners();
  }
  
  public setTool(tool: MouseTool | null = null): void {
    this.activeTool = tool;
  }

  public addEventListeners(): void {
    this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false);
    window.addEventListener('mousemove', this.boundOnMouseMove, false);
    window.addEventListener('mouseup', this.boundOnMouseUp, false);

    this.domElement.addEventListener('touchstart', this.boundOnTouchStart, false);
    window.addEventListener('touchmove', this.boundOnTouchMove, false);
    window.addEventListener('touchend', this.boundOnTouchEnd, false);

    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  public removeEventListeners(): void {
    this.domElement.removeEventListener('mousedown', this.boundOnMouseDown);
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundOnMouseUp);

    this.domElement.removeEventListener('touchstart', this.boundOnTouchStart);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchEnd);

    this.domElement.removeEventListener('contextmenu', (event) => event.preventDefault());
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.previousMousePosition.x = event.clientX;
    this.previousMousePosition.y = event.clientY;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.activeTool) return;
    event.preventDefault();
    this.handleDrag(event.clientX, event.clientY);
  }

  private onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  private onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    event.preventDefault();
    this.isDragging = true;
    this.previousMousePosition.x = event.touches[0].clientX;
    this.previousMousePosition.y = event.touches[0].clientY;
  }

  private onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !this.activeTool) return;
    if (event.touches.length !== 1) return;
    event.preventDefault();
    this.handleDrag(event.touches[0].clientX, event.touches[0].clientY);
  }

  private onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  private handleDrag(currentX: number, currentY: number): void {
    const deltaX = currentX - this.previousMousePosition.x;
    const deltaY = currentY - this.previousMousePosition.y;

    this.activeTool?.handleMouseDrag(deltaX, deltaY);

    this.previousMousePosition.x = currentX;
    this.previousMousePosition.y = currentY;
  }
}
