import * as THREE from 'three';
import { UI } from '@src/ui/ui'; 
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { Camera } from '@src/renderer/camera';
import { CameraOrbitController } from '@src/controller/cameraOrbitController';
import { MouseHandler } from '@src/ui/mouseHandler'; 

export class App {
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private renderer: THREE.WebGLRenderer;
  private camera: Camera;
  private cameraOrbitController: CameraOrbitController; 
  private mouseHandler: MouseHandler; 
  private ui: UI;
  
  constructor() {
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    
    this.ui = new UI(
      {
        onFormulaChange: this.handleFormulaChange.bind(this),
        onSampleChange: this.handleSampleChange.bind(this), 
        onToolChange: this.handleToolChange.bind(this)
      }
    );
    this.ui.getFormulaInput().setValue(this.expressionParser.getCompiledInput());    
    
    const canvasElement = this.ui.getCanvasElement(); // Get HTMLCanvasElement
    const canvasViewport = this.ui.getCanvasViewport(); // Get CanvasViewport object
    this.renderer = this.ui.getRenderer(); 
    this.sceneBuilder = new SceneBuilder(canvasElement); // Pass element
    this.camera = new Camera(canvasViewport); // Pass viewport object

    const initialCameraPos = this.camera.getCamera().position;
    this.cameraOrbitController = new CameraOrbitController(this.handleRender.bind(this));
    this.mouseHandler = new MouseHandler(this.cameraOrbitController, canvasElement);
    this.ui.triggerFormulaChange(); 
    //this.render(); 
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

  private handleSampleChange(newValue: number): void {
    console.log('App: Samples changed:', newValue);
     console.warn("GridGenerator needs method to update samples from App");
    if (this.expressionParser.hasCompiledExpression()) { 
       this.updateSurface(newValue); // Pass new value to updateSurface
    } else {
        console.log("App: No valid formula compiled yet, ignoring sample change.")
    }
  }

  private handleToolChange(newTool: string): void {
    console.log('App: Tool changed:', newTool);
    this.mouseHandler.setTool(newTool);
  }

  private updateSurface(samples?: number): void { 
    if (!this.expressionParser.hasCompiledExpression()) {
        console.log("App: updateSurface called without a compiled expression.");
        this.clearSurface();
        return;
    }
    const currentSamples = samples ?? this.gridGenerator.currentSamples(); 
    console.log(`App: Updating surface with ${currentSamples} samples.`);
    let surfaceGrid: SurfaceGrid | null = null;
    try {
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
      const { mesh, zCenter } = surfaceRenderer.createMesh(surfaceGrid);
      if (mesh) {
        mesh.name = "mesh"; 
        this.sceneBuilder.addObject(mesh); 
        this.cameraOrbitController.setZCenter(zCenter);
        console.log('App: Mesh added to scene');
      } else {
         console.error('App: Mesh creation failed');
      }
    } else {
      console.error('App: Failed to generate surface grid');
    }
    
    this.handleRender(); 
  }

  private clearSurface(): void {
    const scene = this.sceneBuilder.getScene();
    const existingMesh = scene.getObjectByName("mesh");
    if (existingMesh) {
      scene.remove(existingMesh);
      console.log('App: Previous mesh removed');
      this.handleRender(); 
    }
  }

  private handleRender(): void {
    const position = this.cameraOrbitController.getPosition();
    const quaternion = this.cameraOrbitController.getQuaternion(); // Get quaternion
    this.camera.updateOrbit(position, quaternion); // Pass quaternion
    this.renderer.render(this.sceneBuilder.getScene(), this.camera.getCamera());
  }
}

export function initApp(): void {
  new App();
}
