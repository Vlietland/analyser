import * as THREE from 'three';
import { ViewState } from '../core/transform/viewState'; // Assuming ViewState might be needed

let animationFrameId: number | null = null;

function renderLoop(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(() => renderLoop(renderer, scene, camera));
}

function handleResize(canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

export function setupRenderer(
  canvas: HTMLCanvasElement,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): () => void {
  const resizeObserver = new ResizeObserver(() => {
    handleResize(canvas, camera, renderer);
  });
  resizeObserver.observe(canvas);
  handleResize(canvas, camera, renderer);
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  renderLoop(renderer, scene, camera);
  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    resizeObserver.disconnect();
  };
}

// Simple spherical coordinates update based on rotation and zoom
export function updateCamera(camera: THREE.PerspectiveCamera, viewState: ViewState) {
  const radius = 10 / viewState.zoom; // Zoom affects distance
  // Convert spherical coordinates (radius, phi=rotationZ, theta=rotationX) to Cartesian
  // Assuming Z is up, X is right, Y is forward initially. Adjust if coordinate system differs.
  // Theta (rotationX) is angle from positive Y-axis (downwards).
  // Phi (rotationZ) is angle from positive X-axis (counter-clockwise).
  camera.position.x = radius * Math.sin(viewState.rotationX) * Math.cos(viewState.rotationZ);
  camera.position.z = radius * Math.sin(viewState.rotationX) * Math.sin(viewState.rotationZ); // Z is up
  camera.position.y = radius * Math.cos(viewState.rotationX); // Y is depth/height depending on convention

  camera.lookAt(0, 0, 0); // Always look at the origin for orbit controls
  camera.updateProjectionMatrix(); // Needed after changing position/lookAt
}
