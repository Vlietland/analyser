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
      <div class="range-group">
        <div class="range-label">Z Factor</div>
        <div class="exponential-slider">
          <div class="exponential-track"></div>
          <div class="exponential-thumb" style="left: ${((Math.log10(zFactor) + 1) / 3) * 75}%"></div>
        <div class="range-values">${zFactor.toFixed(2)}</div>
        </div>
      </div>
      <div class="range-group">
        <div class="range-label">X-axis</div>
        <div class="angle-slider">
          <div class="angle-track"></div>
          <div class="angle-dot" style="left: ${(phi / (2 * Math.PI)) * 100}%"></div>
          <div class="range-values">${phi.toFixed(2)} rad</div>
        </div>
      </div>
      <div class="range-group">
        <div class="range-label">Z-axis</div>
        <div class="angle-slider">
          <div class="angle-track"></div>
          <div class="angle-dot" style="left: ${(theta / (2 * Math.PI)) * 100}%"></div>
          <div class="range-values">${theta.toFixed(2)} rad</div>
        </div>
      </div>
    `;
  }
}
