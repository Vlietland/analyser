import { UI } from '@src/ui/ui'; 
import { ExpressionParser } from '@src/model/expressionParser';
import { Marker } from '@src/renderer/marker';
import { GridGenerator } from '@src/model/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { Camera } from '@src/model/camera'; 
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { MouseHandler } from '@src/ui/mouseHandler'; 
import { AnalyseController } from '@src/controller/analyseController';
import { CameraController } from '@src/controller/cameraController';
import { ZFactorController } from '@src/controller/zfactorController'; 
import { ShiftController } from '@src/controller/shiftController'; 
import { ZoomController } from '@src/controller/zoomController'; 

export class App {
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private camera: Camera;
  private mouseHandler: MouseHandler; 
  private cameraController: CameraController; 
  private analyseController: AnalyseController;
  private zFactorController: ZFactorController; 
  private shiftController: ShiftController; 
  private zoomController: ZoomController; 
  private marker: Marker;
  private ui: UI;
  
  constructor() {
    this.expressionParser = new ExpressionParser(); 
    this.marker = new Marker();
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    this.analyseController = new AnalyseController(this.gridGenerator, this.marker, this.handleRender.bind(this));
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
      this.cameraController,
      this.analyseController
    );
    this.ui.getFormulaInput().setValue(this.expressionParser.getCompiledInput());  
    
    this.camera = new Camera(this.ui.getCanvasViewport()); 
    this.cameraController.setCamera(this.camera);
    this.zoomController.setCameraController(this.cameraController);
    this.mouseHandler = new MouseHandler(this.ui.getCanvasElement());    
    this.sceneBuilder = new SceneBuilder(this.ui.getCanvasElement()); 
   
    this.sceneBuilder.addObject(this.marker.getMesh());
    this.ui.triggerFormulaChange();
    this.ui.getToolbar().setTool('Analyse')
    this.analyseController.setTool(this.ui.getToolbar().getSelection())
  }

  private handleFormulaChange(value: string): void {
    const compilationResult = this.expressionParser.compileExpression(value);
    if (this.expressionParser.isParseError(compilationResult)) { 
      console.log('App: Parse Error:', compilationResult.message);
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
    this.analyseController.setTool(this.ui.getToolbar().getSelection())  
    switch (newTool) {
      case 'Analyse': this.mouseHandler.setTool(this.analyseController); break;
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
    const scene = this.sceneBuilder.getScene();
    const existingMesh = scene.getObjectByName("mesh");
    if (existingMesh) scene.remove(existingMesh);    

    if (!this.expressionParser.hasCompiledExpression()) return;
    let surfaceGrid: SurfaceGrid | null = null;
    try {
      surfaceGrid = this.gridGenerator.generateGrid(); 
    } catch (error) {
      return; 
    }
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

  private handleRender(): void {
    this.ui.getGizmo().updateGizmo();  
    this.ui.getDashboard().updateDashboard();
    this.ui.getAnalyseDashboard().updateDashboard();
    this.ui.getRenderer().render(this.sceneBuilder.getScene(), this.camera.getCamera());    
  }
}

export function initApp(): void {
  new App();
}
