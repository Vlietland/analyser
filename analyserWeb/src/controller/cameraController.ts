import * as THREE from 'three';
import { MouseTool } from '@src/controller/mouseTool';
import { Camera } from '@src/model/camera';

export class CameraController implements MouseTool{
  private TWO_PI = 2 * Math.PI ;
  private ROTATION_SPEED: number = 0.003; // Adjust sensitivity  
  private DEFAULT_THETA = 2.36;
  private DEFAULT_PHI = 1.15;
  private theta: number;
  private phi: number;
  private target: THREE.Vector3;

  private onUpdateCallback: () => void;
  private camera: Camera | undefined;


  constructor(onUpdateCallback: () => void) { // Added callback parameter
    this.onUpdateCallback = onUpdateCallback; // Store callback
    this.theta = this.DEFAULT_THETA;
    this.phi = this.DEFAULT_PHI;
    this.target = new THREE.Vector3(0, 0, 0);
  }

  public setCamera(camera: Camera){
    this.camera = camera;
    this.setRotation(this.phi, this.theta)    
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const newPhi = (this.phi - deltaY * this.ROTATION_SPEED);    
    this.phi = ((newPhi % this.TWO_PI) + this.TWO_PI) % this.TWO_PI;
    const newTheta = (this.theta - deltaX * this.ROTATION_SPEED);
    this.theta = ((newTheta % this.TWO_PI) + this.TWO_PI) % this.TWO_PI;

    this.setRotation(this.phi, this.theta);
    this.onUpdateCallback();
  }

  public scaleZoom(factor: number) {
    this.camera?.zoomCamera(1/factor);
  }

  public setTarget(target: THREE.Vector3): void {
    if (this.camera) {
      this.target.copy(target);
      this.camera.setTarget(target);       
    }
  }

  public setRotation(phi: number, theta: number): void {
    const xQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), phi)
    const zQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), theta)
    const orientation = new THREE.Quaternion().multiplyQuaternions(zQuat, xQuat)
    const offset = new THREE.Vector3(0, 0, 10000).applyQuaternion(orientation)
    this.camera?.getCamera().position.copy(offset)
    const upDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(orientation)    
    this.camera?.getCamera().up.copy(upDirection)
    this.camera?.getCamera().lookAt(this.target);
  }  

  public getPhi() {
    return this.phi;
  }  

  public getTheta() {
    return this.theta;
  }  
}
