import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ViewState } from '../core/transform/viewState';

let animationFrameId: number | null = null;

const GIZMO_SIZE = 100;
const GIZMO_MARGIN = 10;

function createGizmo() {
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

function renderLoop(
  renderer: THREE.WebGLRenderer,
  mainScene: THREE.Scene,
  mainCamera: THREE.Camera,
  controls: OrbitControls,
  gizmoScene: THREE.Scene,
  gizmoCamera: THREE.PerspectiveCamera,
  gizmoGroup: THREE.Group
) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  controls.update();

  renderer.setViewport(0, 0, width, height);
  renderer.setScissor(0, 0, width, height);
  renderer.setScissorTest(true);
  renderer.render(mainScene, mainCamera);

  renderer.clearDepth();

  gizmoGroup.quaternion.copy(mainCamera.quaternion).invert();

  const gizmoX = width - GIZMO_SIZE - GIZMO_MARGIN;
  const gizmoY = height - GIZMO_SIZE - GIZMO_MARGIN;

  renderer.setViewport(gizmoX, gizmoY, GIZMO_SIZE, GIZMO_SIZE);
  renderer.setScissor(gizmoX, gizmoY, GIZMO_SIZE, GIZMO_SIZE);
  renderer.setScissorTest(true);
  gizmoCamera.aspect = 1;
  gizmoCamera.updateProjectionMatrix();
  renderer.render(gizmoScene, gizmoCamera);

  animationFrameId = requestAnimationFrame(() => renderLoop(renderer, mainScene, mainCamera, controls, gizmoScene, gizmoCamera, gizmoGroup));
}

function handleResize(canvas: HTMLCanvasElement, camera: THREE.Camera, renderer: THREE.WebGLRenderer, controls: OrbitControls, zCenter: number) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.OrthographicCamera) {
      const aspect = width / height;
      const currentZoom = camera.zoom;
      const currentHeight = (camera.top - camera.bottom) / currentZoom;
      const targetWidth = currentHeight * aspect;
      const halfTargetWidth = targetWidth / 2;
      const halfCurrentHeight = currentHeight / 2;
      camera.left = -halfTargetWidth;
      camera.right = halfTargetWidth;
      camera.top = halfCurrentHeight;
      camera.bottom = -halfCurrentHeight;
      camera.updateProjectionMatrix();
    }
    controls.target.set(0, 0, zCenter);
    controls.update();
  }
}

export function setupRenderer(
  canvas: HTMLCanvasElement,
  mainScene: THREE.Scene,
  mainCamera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  initialViewState: ViewState,
  zCenter: number
): { cleanup: () => void; controls: OrbitControls } {
  const controls = new OrbitControls(mainCamera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 50;
  
  if (mainCamera instanceof THREE.OrthographicCamera) {
    mainCamera.zoom = initialViewState.zoomCamera;
    mainCamera.updateProjectionMatrix();
    controls.update();
  }

  const { gizmoScene, gizmoCamera, gizmoGroup } = createGizmo();

  const resizeObserver = new ResizeObserver(() => {
    handleResize(canvas, mainCamera, renderer, controls, zCenter);
  });
  resizeObserver.observe(canvas);
  handleResize(canvas, mainCamera, renderer, controls, zCenter);

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  renderLoop(renderer, mainScene, mainCamera, controls, gizmoScene, gizmoCamera, gizmoGroup);

  const cleanup = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    resizeObserver.disconnect();
    controls.dispose();
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
  };

  return { cleanup, controls };
}