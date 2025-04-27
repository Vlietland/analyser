import { FormulaPane } from '@src/ui/rightpanel/formulaPane';
import { SampleSelector } from '@src/ui/rightpanel/sampleSelector';
import { Toolbar } from '@src/ui/rightpanel/toolbar';
import { Dashboard } from '@src/ui/rightpanel/dashboard';
import { AnalyseDashboard } from '@src/ui/rightpanel/analyseDashboard';
import { ViewportGizmo } from '@src/ui/rightpanel/viewportGizmo';
import { ImageElement } from '@src/ui/rightpanel/imageElement';

export class RightPanel {
  private container: HTMLDivElement;
  private formulaPane: FormulaPane;
  private sampleSelector: SampleSelector;
  private toolbar: Toolbar;
  private dashboard: Dashboard;
  private analyseDashboard: AnalyseDashboard;
  private viewportGizmo: ViewportGizmo;
  private imageElement: ImageElement;

  constructor(
    formulaPane: FormulaPane,
    sampleSelector: SampleSelector,
    toolbar: Toolbar,
    dashboard: Dashboard,
    analyseDashboard: AnalyseDashboard,
    viewportGizmo: ViewportGizmo,
    imageElement: ImageElement
  ) {
    this.container = document.createElement('div');
    this.container.className = 'right-panel';

    this.formulaPane = formulaPane;
    this.sampleSelector = sampleSelector;
    this.toolbar = toolbar;
    this.dashboard = dashboard;
    this.analyseDashboard = analyseDashboard;
    this.viewportGizmo = viewportGizmo;
    this.imageElement = imageElement;

    this.container.appendChild(this.imageElement.getElement());
    this.container.appendChild(this.viewportGizmo.getElement());
    this.container.appendChild(this.formulaPane.getElement());
    this.container.appendChild(this.sampleSelector.getElement());
    this.container.appendChild(this.analyseDashboard.getElement());    
    this.container.appendChild(this.dashboard.getElement());
    this.container.appendChild(this.toolbar.getElement());
  }

  public getElement(): HTMLDivElement {
    return this.container;
  }
}
