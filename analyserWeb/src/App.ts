import * as THREE from 'three';
import { UI } from '@src/ui/ui'; 
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { Camera } from '@src/renderer/camera';
import { OrbitControls } from '@src/controller/orbitControls'; 
import { MouseHandler } from '@src/controller/mouseHandler'; 

export class App {
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private renderer: THREE.WebGLRenderer;
  private camera: Camera;
  private orbitControls: OrbitControls; 
  private mouseHandler: MouseHandler; 
  private ui: UI;
  private currentTool: string = ""; 
  
  constructor() {
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    
    this.ui = new UI(
      {
        onFormulaChange: this.handleFormulaChange.bind(this),
        onSampleChange: this.handleSampleChange.bind(this), 
        onToolChange: this.handleToolChange.bind(this)
      }
      // No defaults passed to UI constructor anymore
    );
    // Set default formula using value from parser
    this.ui.getFormulaInput().setValue(this.expressionParser.DEFAULT_EXPRESSION);    
    
    const canvasElement = this.ui.getCanvasElement(); // Get HTMLCanvasElement
    const canvasViewport = this.ui.getCanvasViewport(); // Get CanvasViewport object
    this.renderer = this.ui.getRenderer(); 
    this.sceneBuilder = new SceneBuilder(canvasElement); // Pass element
    this.camera = new Camera(canvasViewport); // Pass viewport object

    const initialCameraPos = this.camera.getCamera().position;
    const radius = initialCameraPos.length();
    // Calculate initial angles based on Z-up assumption
    const initialPhi = Math.asin(initialCameraPos.z / radius); 
    const initialTheta = Math.atan2(initialCameraPos.y, initialCameraPos.x);
    this.orbitControls = new OrbitControls(radius, initialTheta, initialPhi); // Correct order? Check OrbitControls constructor

    this.mouseHandler = new MouseHandler(
        this.orbitControls, 
        canvasElement, // Pass element
        this.render.bind(this) 
    );

    // this.currentTool = this.ui.getToolbar().getSelection(); // If UI exposes toolbar

    this.ui.triggerFormulaChange(); 
    this.render(); 
  }

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

  // handleSampleChange now needs to update GridGenerator's internal state
  // Option 1: Add a method to GridGenerator like setSamples()
  // Option 2: Pass samples directly to generateGrid() if it accepts it
  // Assuming Option 2 for now, but GridGenerator needs adjustment
  private handleSampleChange(newValue: number): void {
    console.log('App: Samples changed:', newValue);
    // We need a way to tell GridGenerator the new sample value
    // For now, just log it and call updateSurface which uses GridGenerator's internal state
    // This requires GridGenerator to be updated to accept new sample values
     console.warn("GridGenerator needs method to update samples from App");
    if (this.expressionParser.hasCompiledExpression()) { 
       this.updateSurface(newValue); // Pass new value to updateSurface
    } else {
        console.log("App: No valid formula compiled yet, ignoring sample change.")
    }
  }

  private handleToolChange(newTool: string): void {
    console.log('App: Tool changed:', newTool);
    this.currentTool = newTool;
  }

  // updateSurface now optionally takes samples
  private updateSurface(samples?: number): void { 
    if (!this.expressionParser.hasCompiledExpression()) {
        console.log("App: updateSurface called without a compiled expression.");
        this.clearSurface();
        return;
    }
    // Use passed samples or get from generator (which needs updating)
    const currentSamples = samples ?? this.gridGenerator.currentSamples(); 
    console.log(`App: Updating surface with ${currentSamples} samples.`);
    let surfaceGrid: SurfaceGrid | null = null;
    try {
      // Pass samples value to generateGrid
      surfaceGrid = this.gridGenerator.generateGrid(undefined, currentSamples); 
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
    
    this.render(); 
  }

  private clearSurface(): void {
    const scene = this.sceneBuilder.getScene();
    const existingMesh = scene.getObjectByName("mesh");
    if (existingMesh) {
      scene.remove(existingMesh);
      console.log('App: Previous mesh removed');
      this.render(); 
    }
  }

  private render(): void {
    const position = this.orbitControls.getPosition();
    const quaternion = this.orbitControls.getQuaternion(); // Get quaternion
    this.camera.updateOrbit(position, quaternion); // Pass quaternion
    this.renderer.render(this.sceneBuilder.getScene(), this.camera.getCamera());
  }
}

export function initApp(): void {
  new App();
}
