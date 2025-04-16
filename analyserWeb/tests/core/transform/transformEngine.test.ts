import { describe, it, expect } from 'vitest';
import { applyTransform } from '../../../src/core/transform/transformEngine';
import { ViewState, DEFAULT_VIEW_STATE } from '../../../src/core/transform/viewState';
import { SurfaceGrid, Point3D } from '../../../src/core/types';

// Helper to create a simple mock grid
const createMockGrid = (zValue: number | number[][] = 1): SurfaceGrid => {
  const points: Point3D[][] = [];
  const samples = 2; // 2x2 grid
  for (let j = 0; j < samples; j++) {
    const row: Point3D[] = [];
    for (let i = 0; i < samples; i++) {
      let z = 1;
      if (typeof zValue === 'number') {
        z = zValue;
      } else if (Array.isArray(zValue) && Array.isArray(zValue[j]) && typeof zValue[j][i] === 'number') {
        z = zValue[j][i];
      }
      row.push({ x: i, y: j, z: z });
    }
    points.push(row);
  }
  return { points, samplesX: samples, samplesY: samples };
};

describe('applyTransform', () => {
  it('should apply zFactor to all points in the grid', () => {
    const grid = createMockGrid(2); // All points have z=2
    const viewState: ViewState = { ...DEFAULT_VIEW_STATE, zFactor: 3 };
    const transformedGrid = applyTransform(grid, viewState);

    expect(transformedGrid).not.toBe(grid); // Ensure immutability
    expect(transformedGrid.points.length).toBe(2);
    expect(transformedGrid.points[0].length).toBe(2);
    expect(transformedGrid.points[0][0].z).toBe(6); // 2 * 3
    expect(transformedGrid.points[0][1].z).toBe(6);
    expect(transformedGrid.points[1][0].z).toBe(6);
    expect(transformedGrid.points[1][1].z).toBe(6);
    // X and Y should remain unchanged by this basic transform
    expect(transformedGrid.points[0][0].x).toBe(0);
    expect(transformedGrid.points[1][1].y).toBe(1);
  });

  it('should handle zFactor of 1 correctly (no change)', () => {
    const grid = createMockGrid(5);
    const viewState: ViewState = { ...DEFAULT_VIEW_STATE, zFactor: 1 };
    const transformedGrid = applyTransform(grid, viewState);

    expect(transformedGrid.points[0][0].z).toBe(5);
    expect(transformedGrid.points[1][0].z).toBe(5);
  });

  it('should handle zFactor of 0 correctly', () => {
    const grid = createMockGrid(5);
    const viewState: ViewState = { ...DEFAULT_VIEW_STATE, zFactor: 0 };
    const transformedGrid = applyTransform(grid, viewState);

    expect(transformedGrid.points[0][0].z).toBe(0);
    expect(transformedGrid.points[1][1].z).toBe(0);
  });

   it('should handle negative zFactor correctly', () => {
    const grid = createMockGrid(5);
    const viewState: ViewState = { ...DEFAULT_VIEW_STATE, zFactor: -2 };
    const transformedGrid = applyTransform(grid, viewState);

    expect(transformedGrid.points[0][1].z).toBe(-10);
    expect(transformedGrid.points[1][0].z).toBe(-10);
  });

  it('should preserve NaN values for Z', () => {
     const grid = createMockGrid([[1, NaN], [3, 4]]);
     const viewState: ViewState = { ...DEFAULT_VIEW_STATE, zFactor: 5 };
     const transformedGrid = applyTransform(grid, viewState);

     expect(transformedGrid.points[0][0].z).toBe(5); // 1 * 5
     expect(transformedGrid.points[0][1].z).toBeNaN(); // NaN remains NaN
     expect(transformedGrid.points[1][0].z).toBe(15); // 3 * 5
     expect(transformedGrid.points[1][1].z).toBe(20); // 4 * 5
  });

  // Note: Tests for rotation and zoom are omitted as the current implementation
  // assumes these are handled by the renderer's camera based on ViewState parameters.
  // If transformEngine were to handle these, more complex matrix tests would be needed.
});
