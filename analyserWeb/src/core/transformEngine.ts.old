import * as THREE from 'three';
import { SurfaceGrid, Point3D, SampleRange } from '../types';
import { ViewState, normalizeRotation } from './viewState';

export function applyTransform(grid: SurfaceGrid, viewState: ViewState): SurfaceGrid {
  const transformedPoints = grid.points.map(row =>
    row.map(point => ({
      ...point,
      z: Number.isFinite(point.z) ? point.z / viewState.zFactor : NaN
    }))
  );

  return {
    ...grid,
    points: transformedPoints,
  };
}

export function calculateCameraPosition(
  viewState: ViewState,
  distance: number = 1000
): THREE.Vector3 {
  const x = distance * Math.cos(viewState.rotationZ) * Math.cos(viewState.rotationX);
  const y = distance * Math.sin(viewState.rotationZ) * Math.cos(viewState.rotationX);
  const z = distance * Math.sin(viewState.rotationX);
  
  return new THREE.Vector3(x, y, z);
}

export function extractRotationFromCamera(
  cameraPosition: THREE.Vector3,
  target: THREE.Vector3
): { rotationX: number; rotationZ: number } {
  const direction = new THREE.Vector3().subVectors(target, cameraPosition).normalize();
  const rotationX = Math.atan2(-direction.z, Math.sqrt(direction.x ** 2 + direction.y ** 2));
  const rotationZ = Math.atan2(direction.y, direction.x);
  
  return {
    rotationX: normalizeRotation(rotationX),
    rotationZ: normalizeRotation(rotationZ)
  };
}

export function calculateZoomFactor(
  deltaY: number,
  sensitivity: number = 0.01
): number {
  return 1 + (deltaY * sensitivity);
}

export function applyZoomToRange(
  sampleRange: SampleRange,
  zoomFactor: number
): SampleRange {
  const centerX = (sampleRange.xMax + sampleRange.xMin) / 2;
  const centerY = (sampleRange.yMax + sampleRange.yMin) / 2;
  const halfWidth = (sampleRange.xMax - sampleRange.xMin) * zoomFactor / 2;
  const halfHeight = (sampleRange.yMax - sampleRange.yMin) * zoomFactor / 2;
  
  return {
    xMin: centerX - halfWidth,
    xMax: centerX + halfWidth,
    yMin: centerY - halfHeight,
    yMax: centerY + halfHeight
  };
}

export function calculateShift(
  sampleRange: SampleRange,
  deltaX: number,
  deltaY: number,
  sensitivity: number = 0.01
): { shiftX: number; shiftY: number } {
  const width = sampleRange.xMax - sampleRange.xMin;
  const height = sampleRange.yMax - sampleRange.yMin;
  
  return {
    shiftX: deltaX * width * sensitivity,
    shiftY: -deltaY * height * sensitivity
  };
}

export function applyShiftToRange(
  sampleRange: SampleRange,
  shiftX: number,
  shiftY: number
): SampleRange {
  return {
    xMin: sampleRange.xMin + shiftX,
    xMax: sampleRange.xMax + shiftX,
    yMin: sampleRange.yMin + shiftY,
    yMax: sampleRange.yMax + shiftY
  };
}

export function calculateIdealCameraZoom(range: SampleRange): number {
  const gridWidth = Math.abs(range.xMax - range.xMin);
  const gridHeight = Math.abs(range.yMax - range.yMin);
  const maxDimension = Math.max(gridWidth, gridHeight);
  const BASE_ZOOM = 5;
  return BASE_ZOOM / maxDimension;
}
