import * as THREE from 'three';
import { FormulaInput } from '@src/ui/formulaInput';
import { SampleSelector } from '@src/ui/sampleSelector';
import { Toolbar } from '@src/ui/toolbar';
import { CanvasViewport } from '@src/ui/canvasViewport';
import { Dashboard } from '@src/ui/dashboard'; // Import Dashboard
import { GridGenerator } from '@src/core/gridGenerator'; // Import GridGenerator
import { CameraOrbitController } from '@src/controller/cameraOrbitController'; // Import CameraOrbitController

interface UICallbacks {
  onFormulaChange: (value: string) => void;
  onSampleChange: (value: number) => void;
  onToolChange: (value: string) => void;
}

export class UI {
  private formulaInput: FormulaInput;
  private sampleSelector: SampleSelector;
  private toolbar: Toolbar;
  private canvasViewport: CanvasViewport;
  private dashboard: Dashboard; // Add Dashboard property
  private callbacks: UICallbacks;

  constructor(
    callbacks: UICallbacks,
    gridGenerator: GridGenerator, // Add gridGenerator parameter
    cameraOrbitController: CameraOrbitController // Add cameraOrbitController parameter
  ) {
    this.callbacks = callbacks;

    // Instantiate UI components
    this.formulaInput = new FormulaInput();
    this.sampleSelector = new SampleSelector(this.handleSampleChange.bind(this));
    this.toolbar = new Toolbar(this.handleToolChange.bind(this));
    this.canvasViewport = new CanvasViewport(); // Use default size or pass config
    this.dashboard = new Dashboard(gridGenerator, cameraOrbitController); // Instantiate Dashboard

    this.formulaInput.onChange(this.handleFormulaChange.bind(this));
    document.body.appendChild(this.formulaInput.getElement());
    document.body.appendChild(this.sampleSelector.getElement());
    document.body.appendChild(this.toolbar.getElement());    
    document.body.appendChild(this.dashboard.getElement()); // Append Dashboard element    
    document.body.appendChild(this.canvasViewport.getElement());    
  }

  public getFormulaInput(): FormulaInput {
    return this.formulaInput;
  }

  public getCanvasElement(): HTMLCanvasElement {
    return this.canvasViewport.getElement();
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

  public triggerFormulaChange(): void {
      this.formulaInput.triggerChange();
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
