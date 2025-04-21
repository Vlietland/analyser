import * as THREE from 'three';
import { FormulaInput } from '@src/ui//formulaInput';
import { SampleSelector } from '@src/ui/sampleSelector';
import { Toolbar } from '@src/ui/toolbar';
import { CanvasViewport } from '@src/ui//canvasViewport';

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
  private callbacks: UICallbacks;

  constructor(callbacks: UICallbacks) {
    this.callbacks = callbacks;

    // Instantiate UI components
    this.formulaInput = new FormulaInput();
    this.sampleSelector = new SampleSelector(this.handleSampleChange.bind(this));
    this.toolbar = new Toolbar(this.handleToolChange.bind(this));
    this.canvasViewport = new CanvasViewport(); // Use default size or pass config

    // Setup internal listeners
    this.formulaInput.onChange(this.handleFormulaChange.bind(this));

    // Append elements to the body in a specific order
    // Toolbar constructor already appends itself, handle others
    document.body.appendChild(this.formulaInput.getElement());
    document.body.appendChild(this.sampleSelector.getElement());
    document.body.appendChild(this.toolbar.getElement());    
    document.body.appendChild(this.canvasViewport.getElement());    
  }

  // --- Internal Handlers ---
  private handleFormulaChange(value: string): void {
    this.callbacks.onFormulaChange(value);
  }

  private handleSampleChange(value: number): void {
    this.callbacks.onSampleChange(value);
  }

  private handleToolChange(value: string): void {
    this.callbacks.onToolChange(value);
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
  
  public triggerFormulaChange(): void {
      this.formulaInput.triggerChange();
  }
  
  // Add getters for other elements/components if needed by App
}
