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
}
