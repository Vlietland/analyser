import * as THREE from 'three';

const GIZMO_SIZE = 100;
const GIZMO_MARGIN = 10;

export interface GizmoResources {
  gizmoScene: THREE.Scene;
  gizmoCamera: THREE.PerspectiveCamera;
  gizmoGroup: THREE.Group;
}

export function createGizmo(): GizmoResources {
  const gizmoScene = new THREE.Scene();
  const gizmoCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  gizmoCamera.position.set(0, 0, 2.5);
  gizmoCamera.lookAt(0, 0, 0);

  const axesHelper = new THREE.AxesHelper(1);

  const createTextSprite = (text: string, color: string, position: THREE.Vector3) => {
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
  };

  const labelX = createTextSprite('X', '#ff0000', new THREE.Vector3(1.2, 0, 0));
  const labelY = createTextSprite('Y', '#00ff00', new THREE.Vector3(0, 1.2, 0));
  const labelZ = createTextSprite('Z', '#0000ff', new THREE.Vector3(0, 0, 1.2));

  const gizmoGroup = new THREE.Group();
  gizmoGroup.add(axesHelper);
  if (labelX) gizmoGroup.add(labelX);
  if (labelY) gizmoGroup.add(labelY);
  if (labelZ) gizmoGroup.add(labelZ);
  gizmoScene.add(gizmoGroup);

  return { gizmoScene, gizmoCamera, gizmoGroup };
}

export function renderGizmo(
  renderer: THREE.WebGLRenderer,
  mainCamera: THREE.Camera,
  gizmoResources: GizmoResources,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { gizmoScene, gizmoCamera, gizmoGroup } = gizmoResources;

  renderer.clearDepth();

  gizmoGroup.quaternion.copy(mainCamera.quaternion).invert();

  const gizmoX = canvasWidth - GIZMO_SIZE - GIZMO_MARGIN;
  const gizmoY = canvasHeight - GIZMO_SIZE - GIZMO_MARGIN;

  renderer.setViewport(gizmoX, gizmoY, GIZMO_SIZE, GIZMO_SIZE);
  renderer.setScissor(gizmoX, gizmoY, GIZMO_SIZE, GIZMO_SIZE);
  renderer.setScissorTest(true);
  gizmoCamera.aspect = 1;
  gizmoCamera.updateProjectionMatrix();
  renderer.render(gizmoScene, gizmoCamera);
}

export function disposeGizmo(gizmoResources: GizmoResources): void {
  const { gizmoScene } = gizmoResources;
  
  gizmoScene.traverse((object) => {
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
