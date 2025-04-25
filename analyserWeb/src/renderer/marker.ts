import * as THREE from 'three';

export class Marker {
  private mesh: THREE.Mesh;
  
  constructor() {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = false;
  }

  public setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }

  public setScale(rangeX: number): void {
    const scale = rangeX * 0.2;
    this.mesh.scale.set(scale, scale, scale);
  }

  public setVisible(visible: boolean): void {
    this.mesh.visible = visible;
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
