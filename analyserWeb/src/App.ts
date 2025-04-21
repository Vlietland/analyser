import * as THREE from 'three';
import { UI } from '@src/ui/ui'; // Import the new UI class
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { Camera } from '@src/renderer/camera';

export class App {
  // Keep core logic components
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private renderer: THREE.WebGLRenderer;
  private camera: Camera;
  private currentTool: string = "";
  private ui: UI;

  constructor() {
    // Instantiate core components first
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    // Instantiate UI, passing handlers and defaults
    this.ui = new UI(
      {
        onFormulaChange: this.handleFormulaChange.bind(this),
        onSampleChange: this.handleSampleChange.bind(this),
        onToolChange: this.handleToolChange.bind(this)
      },
    );
    this.ui.getFormulaInput().setValue(this.expressionParser.DEFAULT_EXPRESSION)    

    // Get canvas and renderer from UI
    const canvas = this.ui.getCanvasViewport();
    this.renderer = this.ui.getRenderer();

    // Instantiate rendering components using the canvas
    this.sceneBuilder = new SceneBuilder(this.ui.getCanvasElement());
    this.camera = new Camera(this.ui.getCanvasViewport()); // Assuming Camera constructor takes canvas or viewport

    // Get initial tool selection from UI (Toolbar) if needed
    // this.currentTool = this.ui.getSelectedTool(); // Assuming UI provides this

    // Trigger initial formula processing via UI
    this.ui.triggerFormulaChange(); 
  }

  // --- UI Event Handlers ---

  private handleFormulaChange(value: string): void {
    console.log('App: Formula changed:', value);
    const compilationResult = this.expressionParser.compileExpression(value);
    
    if (this.expressionParser.isParseError(compilationResult)) { 
      console.log('App: Parse Error:', compilationResult.message);
      this.clearSurface(); 
      return;
    }
    
    this.updateSurface(); 
  }

  private handleSampleChange(newValue: number): void {
    console.log('App: Samples changed:', newValue);
    if (this.expressionParser.hasCompiledExpression()) { 
       this.updateSurface();
    } else {
        console.log("App: No valid formula compiled yet, ignoring sample change.")
    }
  }

  private handleToolChange(newTool: string): void {
    console.log('App: Tool changed:', newTool);
    this.currentTool = newTool;
    // Add logic here based on the tool
  }

  // --- Core Logic ---

  private clearSurface(): void {
    const scene = this.sceneBuilder.getScene();
    const existingMesh = scene.getObjectByName("mesh");
    if (existingMesh) {
      scene.remove(existingMesh);
      console.log('App: Previous mesh removed');
      this.renderer.render(scene, this.camera.getCamera()); 
    }
  }

  private updateSurface(): void {
    // Ensure a formula is compiled before trying to generate grid
    if (!this.expressionParser.hasCompiledExpression()) {
        console.log("App: updateSurface called without a compiled expression.");
        this.clearSurface();
        return;
    }

    console.log(`App: Updating surface with ${this.gridGenerator.DEFAULT_SAMPLES} samples.`);
    let surfaceGrid: SurfaceGrid | null = null;
    
    try {
      surfaceGrid = this.gridGenerator.generateGrid(undefined, this.gridGenerator.DEFAULT_SAMPLES); 
      console.log('App: Surface Grid:', surfaceGrid);
    } catch (error) {
      console.error('App: Grid Generation Error:', error instanceof Error ? error.message : String(error));
      this.clearSurface();
      return; 
    }
    
    this.clearSurface(); 

    if (surfaceGrid) {
      const surfaceRenderer = new SurfaceRenderer();
      const { mesh } = surfaceRenderer.createMesh(surfaceGrid);
      if (mesh) {
        mesh.name = "mesh"; 
        this.sceneBuilder.addObject(mesh); 
        console.log('App: Mesh added to scene');
      } else {
         console.error('App: Mesh creation failed');
      }
    } else {
      console.error('App: Failed to generate surface grid');
    }
    
    this.renderer.render(this.sceneBuilder.getScene(), this.camera.getCamera()); 
  }
}

// initApp remains the same, assuming it's called from main.ts or similar
export function initApp(): void {
  new App();
}
