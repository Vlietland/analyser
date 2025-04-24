import * as THREE from 'three';
import { MouseTool } from '@src/controller/mouseTool';

export class CameraOrbitController implements MouseTool{
  private radius: number;
  private theta: number;
  private phi: number;
  private target: THREE.Vector3;
  private rotationMatrix: THREE.Matrix4;
  private rotationSpeed: number = 0.003; // Adjust sensitivity  
  private up: THREE.Vector3;
  private TWO_PI = Math.PI * 2;
  private onUpdateCallback: () => void; // Added callback property

  constructor(onUpdateCallback: () => void) { // Added callback parameter
    this.onUpdateCallback = onUpdateCallback; // Store callback
    this.radius = 100;
    this.theta = 0.78;
    this.phi = 3.92;
    this.target = new THREE.Vector3(0, 0, 0);
    this.rotationMatrix = new THREE.Matrix4();
    this.up = new THREE.Vector3(0, 0, 1);
    this.updateMatrix();
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const newPhi = (this.phi + deltaY * this.rotationSpeed);    
    this.phi = ((newPhi % this.TWO_PI) + this.TWO_PI) % this.TWO_PI;
    const newTheta = (this.theta - deltaX * this.rotationSpeed);
    this.theta = ((newTheta % this.TWO_PI) + this.TWO_PI) % this.TWO_PI;

    this.updateMatrix();
    this.onUpdateCallback();
  }

  public setRadius(distance: number): void {
    this.radius = Math.max(0.1, distance);
  }

  public setZCenter(zCenter: number): void {
    this.target.set(0, 0, zCenter);
  }

  public getPosition(): THREE.Vector3 {
    const offset = new THREE.Vector3(0, -this.radius, 0).applyMatrix4(this.rotationMatrix);
    return offset.add(this.target);
  }

  public getQuaternion(): THREE.Quaternion {
    const eye = this.getPosition();
    const matrix = new THREE.Matrix4().lookAt(eye, this.target, this.up);
    return new THREE.Quaternion().setFromRotationMatrix(matrix);
  }

  private updateMatrix(): void {
    const rotZ = new THREE.Matrix4().makeRotationZ(this.theta);
    const rotX = new THREE.Matrix4().makeRotationX(this.phi);
    this.rotationMatrix.identity().multiply(rotZ).multiply(rotX);
  }

  public getPhi() {
    return this.phi;
  }  

  public getTheta() {
    return this.theta;
  }  
}
