import * as THREE from 'three';
import { SampleRange } from '@src/model/gridGenerator';

export interface SurfaceGrid {
  points: { x: number; y: number; z: number }[][];
  samplesX: number;
  samplesY: number;
}

export class SurfaceRenderer {
  private material: THREE.Material;

  constructor(options?: { material?: THREE.Material }) {
    this.material = options?.material || new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide
    });
  }

  public createMesh(grid: SurfaceGrid | null, range: SampleRange): { mesh: THREE.Mesh | null } {
    if (!grid || grid.points.length < 2 || grid.points[0].length < 2) {
      return { mesh: null };
    }
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const numRows = grid.samplesY;
    const numCols = grid.samplesX;

    for (let j = 0; j < numRows; j++) {
      for (let i = 0; i < numCols; i++) {
        const point = grid.points[j][i];
        const zValue = Number.isFinite(point.z) ? point.z : 0;
        vertices.push(point.x, point.y, zValue);
        const color = this.getColorForZ(point.z, range.zMin, range.zMax);
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let j = 0; j < numRows - 1; j++) {
      for (let i = 0; i < numCols - 1; i++) {
        const a = j * numCols + i;
        const b = j * numCols + (i + 1);
        const c = (j + 1) * numCols + i;
        const d = (j + 1) * numCols + (i + 1);
        const za = grid.points[j][i].z;
        const zb = grid.points[j][i+1].z;
        const zc = grid.points[j+1][i].z;
        const zd = grid.points[j+1][i+1].z;
        if (Number.isFinite(za) && Number.isFinite(zb) && Number.isFinite(zc)) {
          indices.push(a, c, b);
        }
        if (Number.isFinite(zb) && Number.isFinite(zc) && Number.isFinite(zd)) {
          indices.push(b, c, d);
        }
      }
    }
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, this.material);
    return { mesh };
  }

  private getColorForZ(z: number, zMin: number, zMax: number): THREE.Color {
    if (!Number.isFinite(z) || zMin === zMax) {
      return new THREE.Color(0x888888);
    }
    const normalizedZ = (z - zMin) / (zMax - zMin);
    const color = new THREE.Color();
    if (normalizedZ < 0.5) {
      color.setRGB(0, normalizedZ * 2, 1 - normalizedZ * 2);
    } else {
      color.setRGB((normalizedZ - 0.5) * 2, 1 - (normalizedZ - 0.5) * 2, 0);
    }
    return color;
  }
 /*
  const analysisMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  //scene.add(analysisMarker); */ 
}
