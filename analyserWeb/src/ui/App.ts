import * as THREE from 'three';
import { FormulaInput } from '@src/ui/formulaInput';
import { SampleSelector } from '@src/ui/sampleSelector';
import { CanvasViewport } from '@src/ui/canvasViewport';
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';
import { SurfaceGrid, SurfaceRenderer } from '@src/renderer/surfaceRenderer';
import { SceneBuilder } from '@src/renderer/sceneBuilder';
import { Camera } from '@src/renderer/camera';

export class App {
  private formulaInput: FormulaInput;
  private canvasViewport: CanvasViewport;
  private expressionParser: ExpressionParser;
  private gridGenerator: GridGenerator;
  private sceneBuilder: SceneBuilder;
  private renderer: THREE.WebGLRenderer;
  private camera: Camera;

  constructor() {
    this.formulaInput = new FormulaInput();
    this.canvasViewport = new CanvasViewport(); 
    this.expressionParser = new ExpressionParser(); 
    this.gridGenerator = new GridGenerator(this.expressionParser); 
    this.sceneBuilder = new SceneBuilder(this.canvasViewport.getElement());
    this.renderer = this.canvasViewport.getRenderer();
    this.camera = new Camera(this.canvasViewport);

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
      
      const scene = this.sceneBuilder.getScene();
      const camera = this.camera.getCamera();
      const existingMesh = scene.getObjectByName("mesh");
      if (existingMesh) {
        scene.remove(existingMesh);
      }

      if (surfaceGrid) {
        const surfaceRenderer = new SurfaceRenderer();
        const { mesh, zCenter } = surfaceRenderer.createMesh(surfaceGrid);
        if (mesh) {
          mesh.name = "mesh"; // Give the mesh a name for easy removal
          this.sceneBuilder.addObject(mesh); 
          console.log('Mesh added to scene');
          this.renderer.render(scene, camera); 
        }
      } else {
        console.error('Failed to generate surface grid');
        this.renderer.render(scene, camera); 
      }
    });

    // THEN set value and trigger the handler
    this.formulaInput.setValue('x^2+y^2'); 
    this.formulaInput.triggerChange(); 
  }
}

export function initApp(): void {
  new App();
}
