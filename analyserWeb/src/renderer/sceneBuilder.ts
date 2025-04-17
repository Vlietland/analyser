import * as THREE from 'three';

export function buildScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  const frustumSize = 10;

  const halfHeight = frustumSize / 2;
  const halfWidth = halfHeight * aspectRatio;

  const camera = new THREE.OrthographicCamera(
    -halfWidth,
    halfWidth,
    halfHeight,
    -halfHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return { scene, camera, renderer };
}
