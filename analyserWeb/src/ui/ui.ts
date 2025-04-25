import * as THREE from 'three';
import { FormulaPane } from '@src/ui/rightpanel/formulaPane';
import { SampleSelector } from '@src/ui/rightpanel/sampleSelector';
import { Toolbar } from '@src/ui/rightpanel/toolbar';
import { CanvasViewport } from '@src/ui/canvasViewport';
import { Dashboard } from '@src/ui/rightpanel/dashboard';
import { AnalyseDashboard } from '@src/ui/rightpanel/analyseDashboard';
import { GridGenerator } from '@src/model/gridGenerator';
import { CameraController } from '@src/controller/cameraController';
import { AnalyseController } from '@src/controller/analyseController';
import { ViewportGizmo } from '@src/ui/rightpanel/viewportGizmo';
import { RightPanel } from '@src/ui/rightPanel';

interface UICallbacks {
  onFormulaChange: (value: string) => void;
  onSampleChange: (value: number) => void;
  onToolChange: (value: string) => void;
}

export class UI {
  private formulaPane: FormulaPane;
  private sampleSelector: SampleSelector;
  private toolbar: Toolbar;
  private canvasViewport: CanvasViewport;
  private dashboard: Dashboard;
  private viewportGizmo: ViewportGizmo;
  private analyseDashboard: AnalyseDashboard;
  private callbacks: UICallbacks;

  constructor(
    callbacks: UICallbacks,
    gridGenerator: GridGenerator,
    cameraController: CameraController,
    analyseController: AnalyseController
  ) {
    this.callbacks = callbacks;
    this.formulaPane = new FormulaPane();
    this.sampleSelector = new SampleSelector(this.handleSampleChange.bind(this));
    this.toolbar = new Toolbar(this.handleToolChange.bind(this));
    this.canvasViewport = new CanvasViewport();
    this.dashboard = new Dashboard(gridGenerator, cameraController);
    this.viewportGizmo = new ViewportGizmo(cameraController);
    this.analyseDashboard = new AnalyseDashboard(analyseController);
    const rightPanel = new RightPanel(
      this.formulaPane,
      this.sampleSelector,
      this.toolbar,
      this.dashboard,
      this.analyseDashboard,
      this.viewportGizmo
    );

    this.formulaPane.onChange(this.handleFormulaChange.bind(this));
    document.body.appendChild(rightPanel.getElement());
    document.body.appendChild(this.canvasViewport.getElement());
  }

  public getFormulaPane(): FormulaPane {
    return this.formulaPane;
  }

  public getCanvasViewport(): CanvasViewport {
    return this.canvasViewport;
  }

  public getRenderer(): THREE.WebGLRenderer {
      return this.canvasViewport.getRenderer();
  }
  
  public getDashboard(): Dashboard {
    return this.dashboard;
  }

  public getAnalyseDashboard(): AnalyseDashboard {
    return this.analyseDashboard;
  }

  public getToolbar(): Toolbar {
    return this.toolbar;
  }

  public getGizmo(): ViewportGizmo {
    return this.viewportGizmo;
  }

  public triggerFormulaChange(): void {
      this.formulaPane.triggerChange();
  }

  private handleFormulaChange(value: string): void {
    this.callbacks.onFormulaChange(value);
  }

  private handleSampleChange(value: number): void {
    this.callbacks.onSampleChange(value);
  }

  private handleToolChange(value: string): void {
    this.callbacks.onToolChange(value);
  }
}
