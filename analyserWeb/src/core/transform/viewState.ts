export interface ViewState {
  readonly zoomCamera: number;
  readonly rotationX: number;
  readonly rotationZ: number;
  readonly zFactor: number;
  readonly targetX: number;
  readonly targetY: number;
  readonly targetZ: number;
}

export const DEFAULT_VIEW_STATE: ViewState = {
  zoomCamera: 0.05,
  rotationX: 0.78,
  rotationZ: 3.92,
  zFactor: 1.0,
  targetX: 0,
  targetY: 0,
  targetZ: 0
};

export function updateViewState(currentState: ViewState, updates: Partial<ViewState>): ViewState {
  const newState = { ...currentState, ...updates };

  console.log('[ViewState] updateViewState called');

  Object.keys(DEFAULT_VIEW_STATE).forEach((key) => {
    const k = key as keyof ViewState;
    const before = currentState[k];
    const after = newState[k];
    if (before !== after) {
      console.log(`  ${k}: ${before} → ${after}`);
    }
  });

  return newState;
}

export function normalizeRotation(rotation: number): number {
  const TWO_PI = Math.PI * 2;
  return (rotation % TWO_PI + TWO_PI) % TWO_PI;
}
