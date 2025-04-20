import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SurfaceGrid } from '../../../core/types';
import { ViewState } from '../../../core/transform/viewState';
import * as transformEngine from '../../../core/transform/transformEngine';
import { renderSurface } from '../../../renderer/surfaceRenderer';
import { RendererRefs } from './types';

export function useRenderSurface(
  rendererRef: React.RefObject<RendererRefs | null>,
  gridData: SurfaceGrid | null,
  viewState: ViewState
) {
  // Create local refs that we can mutate
  const meshRef = useRef<THREE.Mesh | null>(null);
  const zCenterRef = useRef<number>(0);

  useEffect(() => {
    if (rendererRef.current && rendererRef.current.scene && rendererRef.current.camera) {
      const { scene, camera, controls } = rendererRef.current;
      
      // Clean up previous mesh
      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        meshRef.current = null;
      }
      
      if (gridData) {
        // Apply transformations to grid data
        const transformedGrid = transformEngine.applyTransform(gridData, viewState);
        const result = renderSurface(scene, transformedGrid);
        
          // Store the mesh and zCenter
          if (result?.mesh) {
            meshRef.current = result.mesh;
            zCenterRef.current = result.zCenter ?? 0;
            
            // Store zCenter in scene userData so it can be accessed by other hooks
            scene.userData.zCenter = zCenterRef.current;
            
            // Add the mesh to the scene
            scene.add(meshRef.current);
          }
        
        if (camera instanceof THREE.OrthographicCamera) {
          // Set camera zoom from viewState
          camera.zoom = viewState.zoomCamera;
          camera.updateProjectionMatrix();
          
          // Set target position - use the actual zCenter value without dividing by zFactor
          // This ensures the image stays centered at (zMax + zMin) / 2
          const target = new THREE.Vector3(viewState.targetX, viewState.targetY, zCenterRef.current);
          controls.target.copy(target);
          
          // Set camera position based on viewState rotations
          const cameraPosition = transformEngine.calculateCameraPosition(viewState);
          camera.position.copy(cameraPosition);
          
          camera.lookAt(target);
          controls.update();
        }
      }
    }
    
    // Cleanup function
    return () => {
      if (meshRef.current && rendererRef.current?.scene) {
        rendererRef.current.scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        meshRef.current = null;
      }
    };
  }, [gridData, viewState, rendererRef]);

  return {
    meshRef,
    zCenterRef
  };
}
