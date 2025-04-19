import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SurfaceGrid, SampleRange } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import * as transformEngine from '../core/transform/transformEngine';
import { validateRange } from '../core/grid/sampleRange';
import { buildScene } from '../renderer/sceneBuilder';
import { renderSurface } from '../renderer/surfaceRenderer';
import { setupRenderer } from '../renderer/rendererState';
import { GizmoResources } from './viewportGizmo';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CanvasViewportProps {
  gridData: SurfaceGrid | null;
  viewState: ViewState;
  activeTool: string;
  currentSampleRange?: SampleRange;
  onSampleRangeChange?: (newRange: SampleRange) => void;
  onViewStateChange?: (updates: Partial<ViewState>) => void;
}

type CleanupFunction = () => void;

function CanvasViewport({ 
  gridData, 
  viewState, 
  activeTool,
  currentSampleRange,
  onSampleRangeChange,
  onViewStateChange
}: CanvasViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls,
    gizmoResources: GizmoResources
  } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<CleanupFunction | null>(null);
  const zCenterRef = useRef<number>(0);
  const MOUSE_SENSITIVITY = 0.01;
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  //run once on mount to setup the scene, camera, renderer, controls and gizmo
  useEffect(() => {
    let localCleanup: CleanupFunction | null = null;
    if (canvasRef.current && !rendererRef.current) {
      const { scene, camera, renderer } = buildScene(canvasRef.current, viewState);
      const initialZCenter = 0;
      const { cleanup, controls, gizmoResources } = setupRenderer(
        canvasRef.current,
        scene,
        camera,
        renderer,
        viewState,
        initialZCenter
      );
      rendererRef.current = { scene, camera, renderer, controls, gizmoResources };
      localCleanup = cleanup;
      cleanupRef.current = cleanup;
    }
    return () => {
      localCleanup?.();
      if (rendererRef.current) {
        if (meshRef.current) {
          rendererRef.current.scene.remove(meshRef.current);
          meshRef.current.geometry.dispose();
          meshRef.current = null;
        }
        rendererRef.current = null;
      }
    };
  }, [viewState]);

  // Listens globally for mouseup, Resets isDraggingRef to stop drag interaction regardless of tool.
  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handles mouse-based zooming. On drag: calculates a zoom factor from vertical mouse movement.
  // Adjusts currentSampleRange proportionally around the center. Updates camera and controls.
  useEffect(() => {
    if (activeTool !== 'zoom') return;
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !currentSampleRange || !onSampleRangeChange) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaY = e.clientY - lastPosRef.current.y;
      
      // Use transformEngine functions
      const zoomFactor = transformEngine.calculateZoomFactor(deltaY, MOUSE_SENSITIVITY);
      const newRange = transformEngine.applyZoomToRange(currentSampleRange, zoomFactor);

      if (validateRange(newRange)) {
        onSampleRangeChange(newRange);
        if (rendererRef.current && onViewStateChange) {
          const { controls } = rendererRef.current;
          
          // Update viewState with current target position
          onViewStateChange({
            targetX: controls.target.x,
            targetY: controls.target.y,
            targetZ: controls.target.z
          });
          
          controls.update();
        }
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange]);

  // Handles panning (shifting) of the view. On drag: shifts the currentSampleRange in X and Y.
  // Updates the camera controls.target to match the new center.
  useEffect(() => {
    if (activeTool !== 'shift') return;
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !currentSampleRange || !onSampleRangeChange || !onViewStateChange) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastPosRef.current.x;
      const deltaY = e.clientY - lastPosRef.current.y;
      
      // Use transformEngine functions
      const { shiftX, shiftY } = transformEngine.calculateShift(
        currentSampleRange, 
        deltaX, 
        deltaY, 
        MOUSE_SENSITIVITY
      );
      const newRange = transformEngine.applyShiftToRange(currentSampleRange, shiftX, shiftY);

      if (validateRange(newRange)) {
        onSampleRangeChange(newRange);
        if (rendererRef.current) {
          const { controls, camera } = rendererRef.current;
          const currentTarget = controls.target.clone();
          
          // Update controls target
          controls.target.set(
            currentTarget.x + shiftX,
            currentTarget.y + shiftY,
            currentTarget.z
          );
          
          // Update camera to look at new target
          camera.lookAt(controls.target);
          controls.update();
          
          // Update viewState with new target position
          onViewStateChange({
            targetX: controls.target.x,
            targetY: controls.target.y,
            targetZ: controls.target.z
          });
        }
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeTool, currentSampleRange, onSampleRangeChange, onViewStateChange]);

  // Runs only when activeTool === 'zfactor' updates viewState.zFactor, scaling it inversely (as per your correction: smaller = taller)
  // Clamps: keeps zFactor above 0.1 to avoid collapse/inversion. Triggers: camera control update
  useEffect(() => {
    if (activeTool !== 'zfactor') return;
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !onViewStateChange) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaY = e.clientY - lastPosRef.current.y;
      const newZFactor = viewState.zFactor + (deltaY * MOUSE_SENSITIVITY);
      
      if (newZFactor > 0.1) {
        if (rendererRef.current) {
          const { controls } = rendererRef.current;
          
          // Update viewState with new zFactor and current target position
          onViewStateChange({ 
            zFactor: newZFactor,
            targetX: controls.target.x,
            targetY: controls.target.y,
            targetZ: controls.target.z
          });
          
          controls.update();
        } else {
          onViewStateChange({ zFactor: newZFactor });
        }
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeTool, viewState.zFactor, onViewStateChange]);

  // Enables/disables OrbitControls. Attaches a 'change' listener to extract camera orientation.
  // Updates viewState.rotationX and rotationZ using camera position relative to target.
  useEffect(() => {
    if (rendererRef.current?.controls) {
      rendererRef.current.controls.enabled = activeTool === 'rotate';

      if (activeTool === 'rotate' && onViewStateChange) {
        const controls = rendererRef.current.controls;

        const updateRotationFromCamera = () => {
          const camera = rendererRef.current?.camera;
          if (!camera) return;

          const position = new THREE.Vector3();
          camera.getWorldPosition(position);
          const target = controls.target;
          
          // Use transformEngine function
          const { rotationX, rotationZ } = transformEngine.extractRotationFromCamera(position, target);
          
          onViewStateChange({
            rotationX,
            rotationZ,
            targetX: target.x,
            targetY: target.y,
            targetZ: target.z
          });
        };

        controls.addEventListener('change', updateRotationFromCamera);
        return () => {
          controls.removeEventListener('change', updateRotationFromCamera);
        };
      }
    }
  }, [activeTool, onViewStateChange]);

  // Renders new surface mesh on gridData change. Applies new zoom level (zoomCamera) and height scaling (zFactor).
  // Sets camera zoom, lookAt, and control target accordingly. Also handles disposing old mesh.
  useEffect(() => {
    if (rendererRef.current && rendererRef.current.scene && rendererRef.current.camera) {
      const { scene, camera, controls } = rendererRef.current;
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
      }
      if (gridData) {
        // Apply transformations to grid data
        const transformedGrid = transformEngine.applyTransform(gridData, viewState);
        const result = renderSurface(scene, transformedGrid);
        meshRef.current = result?.mesh || null;
        zCenterRef.current = result?.zCenter ?? 0;
        if (meshRef.current) {
          // No need to scale mesh as z-factor is already applied in transformEngine.applyTransform
          scene.add(meshRef.current);
        }
        if (camera instanceof THREE.OrthographicCamera) {
          // Set camera zoom from viewState
          camera.zoom = viewState.zoomCamera;
          camera.updateProjectionMatrix();
          
          // Set target position
          const targetZ = zCenterRef.current / viewState.zFactor;
          const target = new THREE.Vector3(viewState.targetX, viewState.targetY, targetZ);
          controls.target.copy(target);
          
          // Set camera position based on viewState rotations
          const cameraPosition = transformEngine.calculateCameraPosition(viewState);
          camera.position.copy(cameraPosition);
          
          camera.lookAt(target);
          controls.update();
        }
      }
    }
  }, [gridData, viewState.zoomCamera, viewState.zFactor, viewState.rotationX, viewState.rotationZ, viewState.targetX, viewState.targetY, viewState.targetZ]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;
