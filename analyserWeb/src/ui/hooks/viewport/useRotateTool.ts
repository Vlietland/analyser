import { useEffect } from 'react';
import * as THREE from 'three';
import { ViewState } from '../../../core/transform/viewState';
import * as transformEngine from '../../../core/transform/transformEngine';
import { RendererRefs } from './types';

export function useRotateTool(
  rendererRef: React.RefObject<RendererRefs | null>,
  activeTool: string,
  onViewStateChange?: (updates: Partial<ViewState>) => void
) {
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
          
          // Get the zCenter value from the scene userData
          const zCenter = rendererRef.current.scene.userData.zCenter || 0;
          
          // Use transformEngine function
          const { rotationX, rotationZ } = transformEngine.extractRotationFromCamera(position, target);

          console.log('[RotateTool] Applying zCenter as targetZ:', zCenter);          
          onViewStateChange({
            rotationX,
            rotationZ,
            targetX: target.x,
            targetY: target.y,
            targetZ: zCenter // Use zCenter instead of target.z
          });
        };

        controls.addEventListener('change', updateRotationFromCamera);
        return () => {
          controls.removeEventListener('change', updateRotationFromCamera);
        };
      }
    }
  }, [activeTool, onViewStateChange, rendererRef]);
}
