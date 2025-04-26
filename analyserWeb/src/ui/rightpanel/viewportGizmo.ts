import * as THREE from 'three';
import { CameraController } from '@src/controller/cameraController';

export class ViewportGizmo {
  private static readonly GIZMO_SIZE = 100;
  private static readonly GIZMO_MARGIN = 10;

  private gizmoScene: THREE.Scene;
  private gizmoCamera: THREE.OrthographicCamera;
  private rotationMatrix: THREE.Matrix4;  
  private gizmoGroup: THREE.Group;
  private element: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private cameraController: CameraController;

  constructor(cameraController: CameraController) {
    
    this.rotationMatrix = new THREE.Matrix4();    
    this.cameraController = cameraController;
    this.element = document.createElement('div');
    this.element.style.top = '10px';
    this.element.style.right = '10px';
    this.element.style.width = `${ViewportGizmo.GIZMO_SIZE}px`;
    this.element.style.height = `${ViewportGizmo.GIZMO_SIZE}px`;
    this.element.style.backgroundColor = '#000000';
    this.element.style.borderRadius = '4px';
    this.element.style.zIndex = '0';

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(ViewportGizmo.GIZMO_SIZE, ViewportGizmo.GIZMO_SIZE);
    this.element.appendChild(this.renderer.domElement);

    this.gizmoScene = new THREE.Scene();
    this.gizmoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const axesHelper = new THREE.AxesHelper(1);
    this.gizmoGroup = new THREE.Group();
    this.gizmoGroup.add(axesHelper);

    const labelX = this.createTextSprite('X', '#ff4444', new THREE.Vector3(1.2, 0, 0));
    const labelY = this.createTextSprite('Y', '#44ff44', new THREE.Vector3(0, 1.2, 0));
    const labelZ = this.createTextSprite('Z', '#4444ff', new THREE.Vector3(0, 0, 1.2));
    if (labelX) this.gizmoGroup.add(labelX);
    if (labelY) this.gizmoGroup.add(labelY);
    if (labelZ) this.gizmoGroup.add(labelZ);
    this.gizmoScene.add(this.gizmoGroup);
  }

  public updateGizmo(): void {
    this.setRotation(this.cameraController.getPhi(), this.cameraController.getTheta());
    this.renderer.clearDepth();
    this.renderer.render(this.gizmoScene, this.gizmoCamera);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setRotation(phi: number, theta: number): void {
    const xQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), phi)
    const zQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), theta)
    const orientation = new THREE.Quaternion().multiplyQuaternions(zQuat, xQuat)
    const offset = new THREE.Vector3(0, 0, 2.5).applyQuaternion(orientation)
    this.gizmoCamera.position.copy(offset)
    const upDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(orientation)    
    this.gizmoCamera.up.copy(upDirection)
    this.gizmoCamera.lookAt(new THREE.Vector3(0, 0, 0))
  }  

  private createTextSprite(text: string, color: string, position: THREE.Vector3): THREE.Sprite | null {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    const fontSize = 64;
    context.font = `Bold ${fontSize}px Arial`;
    canvas.width = 128;
    canvas.height = 128;
    context.font = `Bold ${fontSize}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.3, 0.3, 0.3);
    sprite.position.copy(position);
    return sprite;
  }

  public dispose(): void {
    this.gizmoScene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Sprite) {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            mat.map?.dispose();
            mat.dispose();
          });
        } else {
          object.material?.map?.dispose();
          object.material?.dispose();
        }
      }
    });
  }
}
