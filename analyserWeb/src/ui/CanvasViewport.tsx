import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SurfaceGrid, SampleRange } from '../core/types';
import { ViewState } from '../core/transform/viewState';
import { validateRange } from '../core/grid/sampleRange';
import { buildScene } from '../renderer/sceneBuilder';
import { renderSurface } from '../renderer/surfaceRenderer';
import { setupRenderer } from '../renderer/rendererState';
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
    controls: OrbitControls
  } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cleanupRef = useRef<CleanupFunction | null>(null);
  const zCenterRef = useRef<number>(0);
  const MOUSE_SENSITIVITY = 0.01;
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  
  useEffect(() => {
    let localCleanup: CleanupFunction | null = null;
    if (canvasRef.current && !rendererRef.current) {
      const { scene, camera, renderer } = buildScene(canvasRef.current);
      const initialZCenter = 0;
      const { cleanup, controls } = setupRenderer(
        canvasRef.current,
        scene,
        camera,
        renderer,
        viewState,
        initialZCenter
      );
      rendererRef.current = { scene, camera, renderer, controls };
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
  }, []);

  useEffect(() => {
    if (rendererRef.current?.controls) {
      rendererRef.current.controls.enabled = activeTool === 'rotate';
    }
  }, [activeTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current || !currentSampleRange || !onSampleRangeChange || !onViewStateChange) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (activeTool === 'rotate') return;
      isDraggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || activeTool === 'rotate' || !currentSampleRange) return;
      
      const deltaX = e.clientX - lastPosRef.current.x;
      const deltaY = e.clientY - lastPosRef.current.y;
      
      switch (activeTool) {
        case 'shift': {
          const centerX = (currentSampleRange.xMax + currentSampleRange.xMin) / 2;
          const centerY = (currentSampleRange.yMax + currentSampleRange.yMin) / 2;
          const width = currentSampleRange.xMax - currentSampleRange.xMin;
          const height = currentSampleRange.yMax - currentSampleRange.yMin;
          
          const shiftX = deltaX * width * MOUSE_SENSITIVITY;
          const shiftY = -deltaY * height * MOUSE_SENSITIVITY;
          
          const newRange = {
            xMin: currentSampleRange.xMin + shiftX,
            xMax: currentSampleRange.xMax + shiftX,
            yMin: currentSampleRange.yMin + shiftY,
            yMax: currentSampleRange.yMax + shiftY
          };
          
          if (validateRange(newRange)) onSampleRangeChange(newRange);
          break;
        }
        case 'zoom': {
          const zoomFactor = 1 + (deltaY * MOUSE_SENSITIVITY);
          const centerX = (currentSampleRange.xMax + currentSampleRange.xMin) / 2;
          const centerY = (currentSampleRange.yMax + currentSampleRange.yMin) / 2;
          const halfWidth = (currentSampleRange.xMax - currentSampleRange.xMin) * zoomFactor / 2;
          const halfHeight = (currentSampleRange.yMax - currentSampleRange.yMin) * zoomFactor / 2;
          
          const newRange = {
            xMin: centerX - halfWidth,
            xMax: centerX + halfWidth,
            yMin: centerY - halfHeight,
            yMax: centerY + halfHeight
          };
          
          if (validateRange(newRange)) onSampleRangeChange(newRange);
          break;
        }
        case 'zfactor': {
          const newZFactor = viewState.zFactor + (deltaY * MOUSE_SENSITIVITY * -1);
          if (newZFactor > 0.1) {
            onViewStateChange({ zFactor: newZFactor });
          }
          break;
        }
      }
      
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTool, viewState, currentSampleRange, onViewStateChange, onSampleRangeChange]);

  useEffect(() => {
    if (rendererRef.current && rendererRef.current.scene && rendererRef.current.camera) {
      const { scene, camera, controls } = rendererRef.current;
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
      }
      if (gridData) {
        const result = renderSurface(scene, gridData);
        meshRef.current = result?.mesh || null;
        zCenterRef.current = result?.zCenter ?? 0;
        if (meshRef.current) {
          meshRef.current.scale.set(1, 1, viewState.zFactor);
          scene.add(meshRef.current);
        }
        if (camera instanceof THREE.OrthographicCamera) {
          camera.zoom = viewState.zoomCamera;
          camera.updateProjectionMatrix();
          camera.lookAt(0, 0, zCenterRef.current * viewState.zFactor);
          controls.target.set(0, 0, zCenterRef.current * viewState.zFactor);
          controls.update();
        }
      }
    }
  }, [gridData, viewState.zoomCamera, viewState.zFactor]); 

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

export default CanvasViewport;
