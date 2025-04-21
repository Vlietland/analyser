import * as THREE from 'three';
import { FormulaInput } from '@src/ui/formulaInput';
import { CanvasViewport } from '@src/ui/canvasViewport';
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';

export class App {
  private formulaInput: FormulaInput;
  private canvasViewport: CanvasViewport;
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  constructor() {
    this.formulaInput = new FormulaInput();
    this.canvasViewport = new CanvasViewport(); 
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    this.sceneBuilder = new SceneBuilder(this.canvasViewport.getElement());
    this.renderer = this.canvasViewport.getRenderer();

    this.camera = new THREE.PerspectiveCamera(75, this.canvasViewport.getElement().width / this.canvasViewport.getElement().height, 0.1, 1000);
    this.camera.position.z = 30; 

    document.body.appendChild(this.formulaInput.getElement());
    document.body.appendChild(this.canvasViewport.getElement());

    this.formulaInput.onChange((value) => {
      console.log('Formula changed:', value);
    
      let surfaceGrid: SurfaceGrid | null = null;
      const compilationResult = this.expressionParser.compileExpression(value);
      
      if (this.expressionParser.isParseError(compilationResult)) { 
        console.log('Parse Error:', compilationResult.message);
        // Potentially clear previous mesh from scene here
        return;
      }
      
      // If it's not a parse error, compilation was successful (result is true)
      try {
        const scope = { x: 3, y: 4 };
        const evaluationResult = this.expressionParser.evaluateExpression(scope);
        console.log('Evaluation Result:', evaluationResult);
        
           
        surfaceGrid = this.gridGenerator.generateGrid(); 
        console.log('Surface Grid:', surfaceGrid);
      } catch (error) {
        console.error('Grid Generation Error:', error instanceof Error ? error.message : String(error));
        // Potentially clear previous mesh
      }
      
      // Clear previous mesh before adding a new one
      const scene = this.sceneBuilder.getScene();
      const existingMesh = scene.getObjectByName("surfaceMesh"); // Assuming we name the mesh
      if (existingMesh) {
        scene.remove(existingMesh);
      }

      if (surfaceGrid) {
        const surfaceRenderer = new SurfaceRenderer();
        const { mesh } = surfaceRenderer.createMesh(surfaceGrid);
        if (mesh) {
          mesh.name = "surfaceMesh"; // Give the mesh a name for easy removal
          this.sceneBuilder.addObject(mesh); 
          console.log('Mesh added to scene');
          this.renderer.render(scene, this.camera); 
        }
      } else {
        console.error('Failed to generate surface grid');
        // Ensure scene is rendered even if grid fails, showing an empty scene
        this.renderer.render(scene, this.camera); 
      }   
    });
    
    this.renderer.render(this.sceneBuilder.getScene(), this.camera);
  }
}

export function initApp(): void {
  new App();
}
