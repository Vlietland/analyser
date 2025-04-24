import * as THREE from 'three';
import { UI } from '@src/ui/ui'; 
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { Camera } from '@src/renderer/camera';
import { CameraOrbitController } from '@src/controller/cameraOrbitController';
import { MouseHandler } from '@src/ui/mouseHandler'; 
import { ZFactorController } from '@src/controller/zfactorController'; 
import { ShiftController } from '@src/controller/shiftController'; 
import { ZoomController } from '@src/controller/zoomController'; 

export class App {
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  //private renderer: THREE.WebGLRenderer;
  private camera: Camera;
  private cameraOrbitController: CameraOrbitController; 
  private mouseHandler: MouseHandler; 
  private zFactorController: ZFactorController; 
  private shiftController: ShiftController; 
  private zoomController: ZoomController; 
  private ui: UI;
  
  constructor() {
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    
    this.cameraOrbitController = new CameraOrbitController(this.handleRender.bind(this));
    this.zFactorController = new ZFactorController(this.gridGenerator, this.updateSurface.bind(this)); 
    this.shiftController = new ShiftController(this.gridGenerator, this.updateSurface.bind(this)); 
    this.zoomController = new ZoomController(this.gridGenerator, this.updateSurface.bind(this)); 
    
    this.ui = new UI(
      {
        onFormulaChange: this.handleFormulaChange.bind(this),
        onSampleChange: this.handleSampleChange.bind(this), 
        onToolChange: this.handleToolChange.bind(this)
      },
      this.gridGenerator,
      this.cameraOrbitController
    );
    this.ui.getFormulaInput().setValue(this.expressionParser.getCompiledInput());    
    
    const canvasElement = this.ui.getCanvasElement(); 
    const canvasViewport = this.ui.getCanvasViewport(); 
    this.mouseHandler = new MouseHandler(canvasElement);    
    this.sceneBuilder = new SceneBuilder(canvasElement); 
    this.camera = new Camera(canvasViewport); 

    //this.renderer = this.ui.getRenderer(); 
    //const initialCameraPos = this.camera.getCamera().position;
  
    this.ui.triggerFormulaChange(); 
    this.handleRender(); 
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
       this.updateSurface(newValue); 
    } else {
        console.log("App: No valid formula compiled yet, ignoring sample change.")
    }
  }

  private handleToolChange(newTool: string): void {
    console.log('App: Tool changed:', newTool);
  
    switch (newTool) {
      case 'Rotate':
        this.mouseHandler.setTool(this.cameraOrbitController);
        break;
      case 'Shift':
        this.mouseHandler.setTool(this.shiftController);
        break;
      case 'Zoom':
        this.mouseHandler.setTool(this.zoomController);
        break;
      case 'Zfactor':
        this.mouseHandler.setTool(this.zFactorController);
        break;
      default:
        console.warn(`App: Unknown tool "${newTool}"`);
        this.mouseHandler.setTool(null);
        break;
    }
  }

  private updateSurface(samples?: number): void { 
    if (!this.expressionParser.hasCompiledExpression()) {
        console.log("App: updateSurface called without a compiled expression.");
        this.clearSurface();
        return;
    }
    const currentSamples = samples ?? this.gridGenerator.getCurrentSamples(); 
    console.log(`App: Updating surface with ${currentSamples} samples.`);
    let surfaceGrid: SurfaceGrid | null = null;
    try {
      surfaceGrid = this.gridGenerator.generateGrid(); 
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
    const quaternion = this.cameraOrbitController.getQuaternion(); 
    this.camera.updateOrbit(position, quaternion); 
    this.ui.getRenderer().render(this.sceneBuilder.getScene(), this.camera.getCamera());
    this.ui.getDashboard().updateDashboard();
  }
}

export function initApp(): void {
  new App();
}
