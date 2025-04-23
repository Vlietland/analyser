import * as THREE from 'three';
import { CanvasViewport } from '@src/ui/canvasViewport';

export class Camera {
  private camera: THREE.OrthographicCamera;

  constructor(canvasViewport: CanvasViewport) {
    const aspect = canvasViewport.getElement().width / canvasViewport.getElement().height;
    const frustumSize = 10;

    this.camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    this.camera.up.set(0, 0, 1); // Set Z as up
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0); // Initial lookAt
  }

  public getCamera(): THREE.OrthographicCamera {
    return this.camera;
  }

  public updateOrbit(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    this.camera.position.copy(position);
    this.camera.quaternion.copy(quaternion);
  }
}
