import * as THREE from 'three';

export class OrbitControls {
  public radius: number;
  public theta: number;
  public phi: number;
  public target: THREE.Vector3;

  private rotationMatrix: THREE.Matrix4;
  private up: THREE.Vector3;

  constructor(
    initialRadius: number = 100,
    initialTheta: number = Math.PI / 4,
    initialPhi: number = Math.PI / 4,
    target: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) {
    this.radius = initialRadius;
    this.theta = initialTheta;
    this.phi = initialPhi;
    this.target = target.clone();
    this.rotationMatrix = new THREE.Matrix4();
    this.up = new THREE.Vector3(0, 0, 1);
    this.updateMatrix();
  }

  private updateMatrix(): void {
    const rotZ = new THREE.Matrix4().makeRotationZ(this.theta);
    const rotX = new THREE.Matrix4().makeRotationX(this.phi);
    this.rotationMatrix.identity().multiply(rotZ).multiply(rotX);
  }

  public setTheta(angle: number): void {
    this.theta = angle;
    this.updateMatrix();
  }

  public setPhi(angle: number): void {
    this.phi = angle;
    this.updateMatrix();
  }

  public setRadius(distance: number): void {
    this.radius = Math.max(0.1, distance);
  }

  public setZCenter(zCenter: number): void {
    this.target.set(0, 0, zCenter);
  }

  public getTarget(): THREE.Vector3 {
    return this.target.clone();
  }

  public getPosition(): THREE.Vector3 {
    const offset = new THREE.Vector3(0, -this.radius, 0).applyMatrix4(this.rotationMatrix);
    console.log('camera position:', offset.clone().add(this.target));        
    return offset.add(this.target);
  }

  public getQuaternion(): THREE.Quaternion {
    const eye = this.getPosition();
    const matrix = new THREE.Matrix4().lookAt(eye, this.target, this.up);
    return new THREE.Quaternion().setFromRotationMatrix(matrix);
  }
}
