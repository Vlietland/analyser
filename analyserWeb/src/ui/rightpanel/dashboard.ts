import { GridGenerator } from '@src/model/gridGenerator';
import { CameraController } from '@src/controller/cameraController';

export class Dashboard {
  private gridGenerator: GridGenerator;
  private cameraOrbitController: CameraController;

  private dashboardContainer: HTMLElement;

  constructor(gridGenerator: GridGenerator, cameraOrbitController: CameraController) {
    this.gridGenerator = gridGenerator;
    this.cameraOrbitController = cameraOrbitController;

    this.dashboardContainer = document.createElement('div');
    this.dashboardContainer.style.marginTop = '5px';

    this.updateDashboard();
  }

  public getElement(): HTMLElement {
    return this.dashboardContainer;
  }

  public updateDashboard(): void {
    const currentRange = this.gridGenerator.getCurrentRange();
    const zFactor = this.gridGenerator.getZFactor();
    const theta = this.cameraOrbitController.getTheta();
    const phi = this.cameraOrbitController.getPhi();

    this.dashboardContainer.innerHTML = `
      <div>xmin: ${currentRange.xMin.toFixed(2)}</div>
      <div>xmax: ${currentRange.xMax.toFixed(2)}</div>
      <div>ymin: ${currentRange.yMin.toFixed(2)}</div>
      <div>ymax: ${currentRange.yMax.toFixed(2)}</div>
      <div>zfactor: ${zFactor.toFixed(2)}</div>
      <div>theta: ${theta.toFixed(2)}</div>
      <div>phi: ${phi.toFixed(2)}</div>
    `;
  }
}
