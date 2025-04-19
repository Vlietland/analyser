import * as THREE from 'three';
import { ViewState, DEFAULT_VIEW_STATE } from '../core/transform/viewState';

export function buildScene(canvas: HTMLCanvasElement, viewState: ViewState = DEFAULT_VIEW_STATE) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  const frustumSize = 10;

  const halfHeight = frustumSize / 2;
  const halfWidth = halfHeight * aspectRatio;

  const camera = new THREE.OrthographicCamera(
    -halfWidth,   // left
    halfWidth,    // right
    halfHeight,   // top
    -halfHeight,  // bottom
    0,          // near
    10000         
  );

  // Set camera zoom from viewState
  camera.zoom = viewState.zoomCamera;
  camera.updateProjectionMatrix();

  // Set camera position based on viewState rotations
  const r = 1000; // Distance from origin
  const x = r * Math.cos(viewState.rotationZ) * Math.cos(viewState.rotationX);
  const y = r * Math.sin(viewState.rotationZ) * Math.cos(viewState.rotationX);
  const z = r * Math.sin(viewState.rotationX);

  camera.up.set(0, 0, 1);
  camera.position.set(x, y, z);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return { scene, camera, renderer };
}
