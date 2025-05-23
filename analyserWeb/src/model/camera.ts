import * as THREE from 'three';
import { ViewportMain } from '@src/ui/viewportMain';

export class Camera {
  private camera: THREE.OrthographicCamera;

  constructor(viewPortMain: ViewportMain) {
    const aspect = viewPortMain.getElement().width / viewPortMain.getElement().height;
    const frustumSize = 8;

    this.camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000000
    );
  }

  public getCamera(): THREE.OrthographicCamera {
    return this.camera;
  }

  public setTarget(target: THREE.Vector3) {
    this.camera.lookAt(target);
  }

  public updateOrbit(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    this.camera.position.copy(position);
    this.camera.quaternion.copy(quaternion);
  }
  
  public zoomCamera(factor: number): void {
    this.camera.zoom *= factor;
    this.camera.updateProjectionMatrix();
  }  
}
