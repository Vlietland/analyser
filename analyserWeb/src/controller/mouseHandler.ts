import { OrbitControls } from '@src/controller/orbitControls';

export class MouseHandler {
  private orbitControls: OrbitControls;
  private domElement: HTMLCanvasElement;
  private onUpdateCallback: () => void;

  private isDragging: boolean = false;
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private rotationSpeed: number = 0.003; // Adjust sensitivity

  // Bound event listeners
  private boundOnMouseDown: (event: MouseEvent) => void;
  private boundOnMouseMove: (event: MouseEvent) => void;
  private boundOnMouseUp: (event: MouseEvent) => void;

  constructor(
    orbitControls: OrbitControls, 
    domElement: HTMLCanvasElement, 
    onUpdateCallback: () => void
  ) {
    this.orbitControls = orbitControls;
    this.domElement = domElement;
    this.onUpdateCallback = onUpdateCallback;

    // Bind methods to ensure 'this' context is correct
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);

    this.addEventListeners();
  }

  public addEventListeners(): void {
    this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false);
    // Add move/up listeners to window/document to capture events outside the canvas
    window.addEventListener('mousemove', this.boundOnMouseMove, false);
    window.addEventListener('mouseup', this.boundOnMouseUp, false);
    // Prevent context menu on right-click (optional, useful for orbit controls)
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

    // Vertical movement (deltaY) controls phi (vertical angle)
    // Screen Y increases upwards, phi increases upwards (towards +Z pole)
    const newPhi = this.orbitControls.phi + deltaY * this.rotationSpeed; 
    this.orbitControls.setPhi(newPhi);

    // Horizontal movement (deltaX) controls theta (horizontal angle around Z)
    // Screen X increases rightwards, theta increases counter-clockwise
    const newTheta = this.orbitControls.theta - deltaX * this.rotationSpeed; 
    this.orbitControls.setTheta(newTheta);

    this.previousMousePosition.x = event.clientX;
    this.previousMousePosition.y = event.clientY;

    // Notify the application that controls have updated
    this.onUpdateCallback();
  }

  private onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
}
