import * as THREE from 'three';

export class SceneBuilder {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
  }

  public addObject(object: THREE.Object3D | null): void {
    if (object) {
      this.scene.add(object);
    }
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true 
    });
    
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    return renderer;
  }
}
