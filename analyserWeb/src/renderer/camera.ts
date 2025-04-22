import * as THREE from 'three';
import { CanvasViewport } from '@src/ui/canvasViewport';

export class Camera {
  private camera: THREE.OrthographicCamera;

  constructor(canvasViewport: CanvasViewport) {
    const aspect = canvasViewport.getElement().width / canvasViewport.getElement().height;
    const frustumSize = 10; // The size of the camera frustum (viewable area)

    this.camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, // left
      frustumSize * aspect / 2,  // right
      frustumSize / 2,          // top
      -frustumSize / 2,         // bottom
      0.1,                      // near
      1000                      // far
    );

    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
  }

  public getCamera(): THREE.OrthographicCamera {
    return this.camera;
  }
}
