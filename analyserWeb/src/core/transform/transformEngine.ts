import { SurfaceGrid, Point3D } from '../types';
import { ViewState } from './viewState';

export function applyTransform(grid: SurfaceGrid, viewState: ViewState): SurfaceGrid {
  const transformedPoints = grid.points.map(row =>
    row.map(point => ({
      ...point,
      z: Number.isFinite(point.z) ? point.z * viewState.zFactor : NaN
    }))
  );

  const transformedGrid: SurfaceGrid = {
    ...grid,
    points: transformedPoints,
  };

  return transformedGrid;
}
