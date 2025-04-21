import * as THREE from 'three';
import { FormulaInput } from '@src/ui/formulaInput';
import SampleSelector from '@src/ui/sampleSelector'; // Default export
import { CanvasViewport } from '@src/ui/canvasViewport';
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { Camera } from '@src/renderer/camera';

export class App {
  private formulaInput: FormulaInput;
  private sampleSelector: SampleSelector;
  private canvasViewport: CanvasViewport;
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private renderer: THREE.WebGLRenderer;
  private camera: Camera;
  private currentSamples: number;

  constructor() {
    const DEFAULT_SAMPLES = 50; // Or get from GridGenerator.DEFAULT_SAMPLES if made public/static

    this.formulaInput = new FormulaInput();
    this.canvasViewport = new CanvasViewport(); 
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    this.sceneBuilder = new SceneBuilder(this.canvasViewport.getElement());
    this.renderer = this.canvasViewport.getRenderer();
    this.camera = new Camera(this.canvasViewport);
    this.currentSamples = DEFAULT_SAMPLES;
    this.sampleSelector = new SampleSelector(
      this.currentSamples, 
      this.handleSampleChange.bind(this)
    );

    document.body.appendChild(this.formulaInput.getElement());
    document.body.appendChild(this.sampleSelector.getElement()); // Add sample selector
    document.body.appendChild(this.canvasViewport.getElement());

    this.formulaInput.onChange((value) => {
      console.log('Formula changed:', value);
      const compilationResult = this.expressionParser.compileExpression(value);
      
      if (this.expressionParser.isParseError(compilationResult)) { 
        console.log('Parse Error:', compilationResult.message);
        this.clearSurface(); // Clear mesh on error
        return;
      }
      
      // If compilation successful, update the surface
      this.updateSurface(); 
    });

    this.formulaInput.setValue('x^2+y^2'); 
    this.formulaInput.triggerChange(); 
  }

  private handleSampleChange(newValue: number): void {
    console.log('Samples changed:', newValue);
    this.currentSamples = newValue;
    // Only update if a valid expression is already compiled
    if (this.expressionParser.hasCompiledExpression()) { // Assuming this method exists
       this.updateSurface();
    } else {
        console.log("No valid formula compiled yet, ignoring sample change.")
    }
  }

  private clearSurface(): void {
      const scene = this.sceneBuilder.getScene();
      const existingMesh = scene.getObjectByName("mesh");
      if (existingMesh) {
        scene.remove(existingMesh);
        console.log('Previous mesh removed');
        this.renderer.render(scene, this.camera.getCamera()); // Re-render empty scene
      }
  }

  private updateSurface(): void {
    console.log(`Updating surface with ${this.currentSamples} samples.`);
    let surfaceGrid: SurfaceGrid | null = null;
    
    try {
      // Generate grid with current samples, using default range
      surfaceGrid = this.gridGenerator.generateGrid(undefined, this.currentSamples); 
      console.log('Surface Grid:', surfaceGrid);
    } catch (error) {
      console.error('Grid Generation Error:', error instanceof Error ? error.message : String(error));
      this.clearSurface();
      return; // Stop if grid generation fails
    }
    
    this.clearSurface(); // Remove old mesh before adding new one

    if (surfaceGrid) {
      const surfaceRenderer = new SurfaceRenderer();
      const { mesh } = surfaceRenderer.createMesh(surfaceGrid);
      if (mesh) {
        mesh.name = "mesh"; 
        this.sceneBuilder.addObject(mesh); 
        console.log('Mesh added to scene');
      } else {
         console.error('Mesh creation failed');
      }
    } else {
      console.error('Failed to generate surface grid');
    }
    
    // Always render, even if mesh creation failed (shows empty scene or cleared scene)
    this.renderer.render(this.sceneBuilder.getScene(), this.camera.getCamera()); 
  }
}

export function initApp(): void {
  new App();
}
