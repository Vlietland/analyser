import * as THREE from 'three';
import { UI } from '@src/ui/ui'; 
import { ExpressionParser } from '@src/model/expressionParser';
import { GridGenerator } from '@src/model/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { Camera } from '@src/model/camera'; 
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { CameraController } from '@src/controller/cameraController';
import { MouseHandler } from '@src/ui/mouseHandler'; 
import { ZFactorController } from '@src/controller/zfactorController'; 
import { ShiftController } from '@src/controller/shiftController'; 
import { ZoomController } from '@src/controller/zoomController'; 

export class App {
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private camera: Camera;
  private cameraController: CameraController; 
  private mouseHandler: MouseHandler; 
  private zFactorController: ZFactorController; 
  private shiftController: ShiftController; 
  private zoomController: ZoomController; 
  private ui: UI;
  
  constructor() {
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    this.zFactorController = new ZFactorController(this.gridGenerator, this.updateSurface.bind(this)); 
    this.shiftController = new ShiftController(this.gridGenerator, this.updateSurface.bind(this)); 
    this.zoomController = new ZoomController(this.gridGenerator, this.updateSurface.bind(this)); 
    this.cameraController = new CameraController(this.handleRender.bind(this));     
    
    this.ui = new UI(
      {
        onFormulaChange: this.handleFormulaChange.bind(this),
        onSampleChange: this.handleSampleChange.bind(this), 
        onToolChange: this.handleToolChange.bind(this)
      },
      this.gridGenerator,
      this.cameraController
    );
    this.ui.getFormulaInput().setValue(this.expressionParser.getCompiledInput());  
    
    this.camera = new Camera(this.ui.getCanvasViewport()); 
    this.cameraController.setCamera(this.camera);
    this.zoomController.setCameraController(this.cameraController);
    this.mouseHandler = new MouseHandler(this.ui.getCanvasElement());    
    this.sceneBuilder = new SceneBuilder(this.ui.getCanvasElement()); 
   
    this.ui.triggerFormulaChange(); 
    this.handleRender(); 
  }

  private handleFormulaChange(value: string): void {
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
      case 'Rotate':  this.mouseHandler.setTool(this.cameraController);  break;
      case 'Shift':   this.mouseHandler.setTool(this.shiftController);   break;
      case 'Zoom':    this.mouseHandler.setTool(this.zoomController);    break;
      case 'Zfactor': this.mouseHandler.setTool(this.zFactorController); break;
      default:
        console.warn(`App: Unknown tool "${newTool}"`);
        this.mouseHandler.setTool(null);
        break;
    }
  }

  private updateSurface(samples?: number): void { 
    if (!this.expressionParser.hasCompiledExpression()) {
        this.clearSurface();
        return;
    }
    let surfaceGrid: SurfaceGrid | null = null;
    try {
      surfaceGrid = this.gridGenerator.generateGrid(); 
    } catch (error) {
      this.clearSurface();
      return; 
    }
    this.clearSurface(); 
    if (surfaceGrid) {
      const surfaceRenderer = new SurfaceRenderer();
      const range = this.gridGenerator.getCurrentRange()      
      const { mesh } = surfaceRenderer.createMesh(surfaceGrid, range);
      if (mesh) {
        mesh.name = "mesh";
        this.sceneBuilder.addObject(mesh); 
        this.cameraController.setTarget(this.gridGenerator.getTarget());
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
      this.handleRender(); 
    }
  }

  private handleRender(): void {
    const position = this.cameraController.getPosition();
    const quaternion = this.cameraController.getQuaternion();
    this.camera.updateOrbit(position, quaternion); 
    this.ui.getGizmo().updateGizmo();    
    this.ui.getRenderer().render(this.sceneBuilder.getScene(), this.camera.getCamera());
    this.ui.getDashboard().updateDashboard();
  }
}

export function initApp(): void {
  new App();
}
