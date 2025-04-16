export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface SurfaceGrid {
  readonly points: Point3D[][];
  readonly samplesX: number;
  readonly samplesY: number;
}

export interface SampleRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
