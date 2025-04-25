import * as THREE from 'three';
import { GridGenerator } from '@src/model/gridGenerator';
import { MouseTool } from '@src/controller/mouseTool';

export class AnalyseController implements MouseTool {
  private gridGenerator: GridGenerator;
  private static readonly SENSITIVITY: number = 0.1;
  private onUpdateCallback: () => void;
  private currentSampleX: number;
  private currentSampleY: number;
  private analysisResult: THREE.Vector3;
  private marker?: THREE.Object3D;  
  
  constructor(gridGenerator: GridGenerator, onUpdateCallback: () => void) {
    this.gridGenerator = gridGenerator;
    this.onUpdateCallback = onUpdateCallback;
    this.currentSampleX = 0;
    this.currentSampleY = 0;
    this.analysisResult = new THREE.Vector3(0, 0, 0);
  }

  public handleMouseDrag(deltaX: number = 0, deltaY: number = 0): void {
    const grid = this.gridGenerator.getGrid();
    if (!grid) return;
    this.currentSampleX = Math.min(
      grid.samplesX - 1,
      Math.max(0, this.currentSampleX + Math.round(deltaX * AnalyseController.SENSITIVITY))
    );    
    this.currentSampleY = Math.min(
      grid.samplesY - 1,
      Math.max(0, this.currentSampleY - Math.round(deltaY * AnalyseController.SENSITIVITY))
    );
    const points = grid.points;
    const point = points[this.currentSampleY][this.currentSampleX];
    this.analysisResult.set(point.x, point.y, isFinite(point.z) ? point.z : 0);

    if (this.marker) this.marker.position.set(point.x, point.y, this.analysisResult.z + 0.01);    
    this.onUpdateCallback();
  }
  
  public getAnalysisResult(): THREE.Vector3 {
    return this.analysisResult.clone();
  }
  
  public reset(): void {
    const grid = this.gridGenerator.getGrid();
    if (!grid) return;
    this.currentSampleX = grid.samplesX / 2;
    this.currentSampleY = grid.samplesY / 2;
    const point = grid.points[this.currentSampleY][this.currentSampleX];        
    this.analysisResult.set(point.x, point.y, isFinite(point.z) ? point.z : 0);
    this.onUpdateCallback();
  }

  public setMarker(marker: THREE.Object3D) {
    this.marker = marker;
    this.reset();
  }  
}
