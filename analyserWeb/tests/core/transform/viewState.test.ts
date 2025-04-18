import { describe, it, expect } from 'vitest';
import { ViewState, updateViewState, DEFAULT_VIEW_STATE } from '../../../src/core/transform/viewState';

describe('DEFAULT_VIEW_STATE', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_VIEW_STATE.zoomCamera).toBe(1.0);
    expect(DEFAULT_VIEW_STATE.rotationX).toBe(0.5);
    expect(DEFAULT_VIEW_STATE.rotationZ).toBe(0.5);
    expect(DEFAULT_VIEW_STATE.zFactor).toBe(1.0);
  });
});

describe('updateViewState', () => {
  it('should return a new object with updated properties', () => {
    const updates: Partial<ViewState> = { zoom: 1.5, zFactor: 2.0 };
    const newState = updateViewState(DEFAULT_VIEW_STATE, updates);

    expect(newState).not.toBe(DEFAULT_VIEW_STATE); // Ensure immutability
    expect(newState.zoomCamera).toBe(1.5);
    expect(newState.rotationX).toBe(DEFAULT_VIEW_STATE.rotationX); // Unchanged
    expect(newState.rotationZ).toBe(DEFAULT_VIEW_STATE.rotationZ); // Unchanged
    expect(newState.zFactor).toBe(2.0);
  });

  it('should handle partial updates correctly', () => {
    const updates: Partial<ViewState> = { rotationX: 1.0 };
    const newState = updateViewState(DEFAULT_VIEW_STATE, updates);

    expect(newState.zoomCamera).toBe(DEFAULT_VIEW_STATE.zoomCamera);
    expect(newState.rotationX).toBe(1.0);
    expect(newState.rotationZ).toBe(DEFAULT_VIEW_STATE.rotationZ);
    expect(newState.zFactor).toBe(DEFAULT_VIEW_STATE.zFactor);
  });

  it('should overwrite existing properties with updates', () => {
    const initialState: ViewState = { zoomCamera: 2, rotationX: 1, rotationZ: 1, zFactor: 3 };
    const updates: Partial<ViewState> = { zoomCamera: 0.5, rotationZ: 0 };
    const newState = updateViewState(initialState, updates);

    expect(newState.zoomCamera).toBe(0.5);
    expect(newState.rotationX).toBe(1);
    expect(newState.rotationZ).toBe(0);
    expect(newState.zFactor).toBe(3);
  });
});
