import * as THREE from 'three';

export function buildScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  const aspectRatio = canvas.clientWidth / canvas.clientHeight;
  const frustumSize = 10;

  const halfHeight = frustumSize / 2;
  const halfWidth = halfHeight * aspectRatio;

  const camera = new THREE.OrthographicCamera(
    -halfWidth,   // left
    halfWidth,    // right
    halfHeight,   // top
    -halfHeight,  // bottom
    0.1,          // near
    1000          // far
  );

  // Fixed camera position looking down -Z axis, Y is up
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 1, 0); // Ensure Y is up

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 15);
  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return { scene, camera, renderer };
}
