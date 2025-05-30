import * as THREE from 'three';

export class ViewportMain {
  private onUIChangeCallback: () => void;  
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;

  constructor(onUIChange: () => void) {
    this.onUIChangeCallback = onUIChange;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'viewportMain';
    document.body.appendChild(this.canvas);
  
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000);
  
    requestAnimationFrame(() => this.updateSize());
  
    window.addEventListener('resize', () => {
      this.updateSize();
    });
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

  private updateSize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const needResize = this.canvas.width !== width * window.devicePixelRatio || this.canvas.height !== height * window.devicePixelRatio;
    if (needResize) {
      this.renderer.setSize(width, height, false);
      this.onUIChangeCallback();
    }
  }
}
