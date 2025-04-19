import * as THREE from 'three';

export function buildScene(canvas: HTMLCanvasElement) {
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
    10000          // far
  );

  camera.up.set(0, 0, 1);
  camera.position.set(0, 0, 1000);
  camera.lookAt(0, 0, 0);  
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return { scene, camera, renderer };
}
