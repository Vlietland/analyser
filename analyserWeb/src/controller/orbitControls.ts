import * as THREE from 'three';

export class OrbitControls {
  public radius: number;
  public theta: number;
  public phi: number; // Vertical angle (elevation)
  public target: THREE.Vector3;

  // Clamping limits for phi
  private minPhi: number = -Math.PI / 2 + 0.01; 
  private maxPhi: number = Math.PI / 2 - 0.01;  

  constructor(
    initialRadius: number = 100,
    initialTheta: number = Math.PI / 4, // Keep previous default
    initialPhi: number = Math.PI / 4, // Keep previous default
    target: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) {
    this.radius = initialRadius;
    this.theta = initialTheta;
    this.phi = THREE.MathUtils.clamp(initialPhi, this.minPhi, this.maxPhi); // Apply clamping
    this.target = target.clone();
  }

  // Keep setTheta as is

  public setTheta(angle: number): void {
    this.theta = angle;
  } // Added missing brace
  
  public setPhi(angle: number): void {
    this.phi = THREE.MathUtils.clamp(angle, this.minPhi, this.maxPhi); // Apply clamping
  }

  // Keep setRadius as is

  public setRadius(distance: number): void {
    this.radius = Math.max(0.1, distance);
  } // Added missing brace
  
  public getPosition(): THREE.Vector3 {
    // Z-up spherical coordinates
    const x = this.radius * Math.cos(this.phi) * Math.cos(this.theta);
    const y = this.radius * Math.cos(this.phi) * Math.sin(this.theta);
    const z = this.radius * Math.sin(this.phi);

    return new THREE.Vector3(x, y, z).add(this.target);
  }

  // Calculate quaternion to look at target from current position, assuming Z-up world
  public getQuaternion(): THREE.Quaternion {
    const eye = this.getPosition();
    const center = this.target;
    const worldUp = new THREE.Vector3(0, 0, 1); // Use Z-up

    const matrix = new THREE.Matrix4();
    matrix.lookAt(eye, center, worldUp); 

    const quaternion = new THREE.Quaternion();
    quaternion.setFromRotationMatrix(matrix);

    return quaternion;
  }

  // Keep getTarget (added previously)
  public getTarget(): THREE.Vector3 {
    return this.target.clone(); 
  }
}
