import { AnalyseController } from '@src/controller/analyseController';

export class AnalyseDashboard {
  private analyseController: AnalyseController;
  private dashboardContainer: HTMLElement;

  constructor(analyseController: AnalyseController) {
    this.analyseController = analyseController;
    
    this.dashboardContainer = document.createElement('div');
    this.dashboardContainer.style.marginTop = '5px';
    this.dashboardContainer.style.display = 'flex';
    this.dashboardContainer.style.gap = '10px';
    this.dashboardContainer.style.fontFamily = 'monospace';

    this.updateDashboard();
  }

  public getElement(): HTMLElement {
    return this.dashboardContainer;
  }

  public updateDashboard(): void {
    const result = this.analyseController.getAnalysisResult();
    this.dashboardContainer.innerHTML = `
      <div style="color: #ff4444">X: ${result.x.toFixed(2)}</div>
      <div style="color: #44ff44">Y: ${result.y.toFixed(2)}</div>
      <div style="color: #4444ff">Z: ${result.z.toFixed(2)}</div>
    `;
  }
}
