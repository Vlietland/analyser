export class Toolbar {
  private selectedTool: string = '';
  private onToolChangeCallback: (tool: string) => void;
  private tools: string[] = ['Analyse', 'Rotate', 'Shift', 'Zoom', 'Zfactor', 'Configure'];

  constructor(onToolChange: (tool: string) => void) {
    this.onToolChangeCallback = onToolChange;
  }

  public getElement(): HTMLElement {
    const toolbarContainer = document.createElement('div');
    toolbarContainer.style.marginTop = '5px';
    toolbarContainer.style.display = 'flex';
    toolbarContainer.style.gap = '5px';

    this.tools.forEach(tool => {
      const button = document.createElement('button');
      button.textContent = tool;
      button.title = tool;
      button.style.padding = '5px 10px';
      button.style.border = '1px solid #ccc';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = this.selectedTool === tool ? '#4a90e2' : '#f0f0f0';
      button.style.color = this.selectedTool === tool ? 'white' : 'black';
      button.addEventListener('click', () => this.handleToolChange(tool));

      toolbarContainer.appendChild(button);
    });
    return toolbarContainer;
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
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      if (button.textContent === this.selectedTool) {
        button.style.backgroundColor = '#4a90e2';
        button.style.color = 'white';
      } else {
        button.style.backgroundColor = '#f0f0f0';
        button.style.color = 'black';
      }
    });
  }
}
