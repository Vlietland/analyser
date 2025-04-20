import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GizmoResources } from '../../viewportGizmo';
import { MutableRefObject } from 'react';

export interface RendererRefs {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  gizmoResources: GizmoResources;
}

export interface ToolState {
  isDraggingRef: MutableRefObject<boolean>;
  lastPosRef: MutableRefObject<{ x: number, y: number }>;
  MOUSE_SENSITIVITY: number;
}

export type CleanupFunction = () => void;
