export class Toolbar {
  private selectedTool: string = '';
  private onToolChangeCallback: (tool: string) => void;
  private tools: string[] = ['Analyse', 'Rotate', 'Shift', 'Zoom', 'Zfactor'];
  private toolbarContainer: HTMLElement;

  constructor(onToolChange: (tool: string) => void) {
    this.onToolChangeCallback = onToolChange;
    this.toolbarContainer = this.buildToolbar();
  }

  private buildToolbar(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'toolbar'; // only class, no styles

    this.tools.forEach(tool => {
      const button = document.createElement('button');
      button.textContent = tool;
      button.title = tool;
      button.className = ''; // Reset to empty string
      button.addEventListener('click', () => this.handleToolChange(tool));
      container.appendChild(button);
    });

    return container;
  }

  public getElement(): HTMLElement {
    return this.toolbarContainer;
  }

  public getSelection(): string {
    return this.selectedTool;
  }

  public setTool(tool: string) {
    this.handleToolChange(tool);
  }

  private handleToolChange(tool: string) {
    if (this.selectedTool !== tool) {
      this.selectedTool = tool;
      this.onToolChangeCallback(tool);
      this.updateButtonStyles();
    }
  }

  private updateButtonStyles() {
    const buttons = this.toolbarContainer.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      button.classList.remove('toolbar__button--selected'); // <<< Clear selection class
      if (button.textContent === this.selectedTool) {
        button.classList.add('toolbar__button--selected'); // <<< Add selection class
      }
    });
  }
}
