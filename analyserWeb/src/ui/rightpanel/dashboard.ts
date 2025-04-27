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
      <div class="range-group">
        <div class="range-label">X Axis Range</div>
        <div class="range-visual">
          <div class="range-bar" style="--min: ${currentRange.xMin}; --max: ${currentRange.xMax}"></div>
          <div class="range-values">${currentRange.xMin.toFixed(2)} to ${currentRange.xMax.toFixed(2)}</div>
        </div>
      </div>
      <div class="range-group">
        <div class="range-label">Y Axis Range</div>
        <div class="range-visual">
          <div class="range-bar" style="--min: ${currentRange.yMin}; --max: ${currentRange.yMax}"></div>
          <div class="range-values">${currentRange.yMin.toFixed(2)} to ${currentRange.yMax.toFixed(2)}</div>
        </div>
      </div>
      <div>zfactor: ${zFactor.toFixed(2)}</div>
      <div>theta: ${theta.toFixed(2)}</div>
      <div>phi: ${phi.toFixed(2)}</div>
    `;
  }
}
