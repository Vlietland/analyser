import * as THREE from 'three';

export class ViewportMain {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;

  constructor(width: number = 950, height: number = 640) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.position = 'fixed';
    this.canvas.style.left = '16';
    this.canvas.style.top = '16';
    this.canvas.style.width = 'calc(100% - 300px)';
    this.canvas.style.height = '100%';
    this.canvas.style.backgroundColor = '#000000';
    this.canvas.style.zIndex = '0';

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
  }
}
