import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ViewState } from '../core/transform/viewState';
import { createGizmo, renderGizmo, disposeGizmo, GizmoResources } from '../ui/viewportGizmo';

let animationFrameId: number | null = null;

function renderLoop(
  renderer: THREE.WebGLRenderer,
  mainScene: THREE.Scene,
  mainCamera: THREE.Camera,
  controls: OrbitControls,
  gizmoResources: GizmoResources
) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  controls.update();

  renderer.setViewport(0, 0, width, height);
  renderer.setScissor(0, 0, width, height);
  renderer.setScissorTest(true);
  renderer.render(mainScene, mainCamera);

  renderGizmo(renderer, mainCamera, gizmoResources, width, height);

  animationFrameId = requestAnimationFrame(() => renderLoop(renderer, mainScene, mainCamera, controls, gizmoResources));
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
): { cleanup: () => void; controls: OrbitControls; gizmoResources: GizmoResources } {
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
  
    const r = 1000;
    const x = r * Math.cos(initialViewState.rotationZ) * Math.cos(initialViewState.rotationX);
    const y = r * Math.sin(initialViewState.rotationZ) * Math.cos(initialViewState.rotationX);
    const z = r * Math.sin(initialViewState.rotationX);
  
    mainCamera.position.set(x, y, z);
    mainCamera.lookAt(0, 0, zCenter);
    controls.target.set(0, 0, zCenter);
    controls.update();
  }

  const gizmoResources = createGizmo();

  const resizeObserver = new ResizeObserver(() => {
    handleResize(canvas, mainCamera, renderer, controls, zCenter);
  });
  resizeObserver.observe(canvas);
  handleResize(canvas, mainCamera, renderer, controls, zCenter);

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  renderLoop(renderer, mainScene, mainCamera, controls, gizmoResources);

  const cleanup = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    resizeObserver.disconnect();
    controls.dispose();
    disposeGizmo(gizmoResources);
  };

  return { cleanup, controls, gizmoResources };
}
