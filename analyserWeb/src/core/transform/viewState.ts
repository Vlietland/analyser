export interface ViewState {
  readonly zoomCamera: number;
  readonly rotationX: number;
  readonly rotationZ: number;
  readonly zFactor: number;
}

export const DEFAULT_VIEW_STATE: ViewState = {
  zoomCamera: 1.0,
  rotationX: 0.5,
  rotationZ: 0.5,
  zFactor: 1.0,
};

export function updateViewState(currentState: ViewState, updates: Partial<ViewState>): ViewState {
  const newState = { ...currentState, ...updates };
  // Potential validation/clamping could be added here
  return newState;
}
