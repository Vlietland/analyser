import * as THREE from 'three';

export class CanvasViewport {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;

  constructor(width: number = 800, height: number = 600) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.display = 'block'; // Prevent extra space below canvas

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  public getElement(): HTMLCanvasElement {
    return this.canvas;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.renderer.setSize(width, height);
    // Note: Camera aspect ratio might need updating here as well, 
    // but camera logic is handled separately for now.
  }
}
