export class Toolbar {
  private selectedTool: string;
  private onToolChangeCallback: (tool: string) => void;
  private tools: string[] = ['Analyse', 'Rotate', 'Shift', 'Zoom', 'Zfactor', 'Configure'];

  constructor(onToolChange: (tool: string) => void) {
    this.selectedTool = 'Analyse'; // Default selection
    this.onToolChangeCallback = onToolChange;
  }

  // Create and return the toolbar element
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

      // Event listener for button click
      button.addEventListener('click', () => this.handleToolChange(tool));

      toolbarContainer.appendChild(button);
    });

    return toolbarContainer;
  }

  // Handle tool change and update the selected tool
  private handleToolChange(tool: string) {
    if (this.selectedTool !== tool) {
      this.selectedTool = tool;
      this.onToolChangeCallback(tool);
      this.updateButtonStyles();
    }
  }

  // Update button styles based on the selected tool
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

  // Get the currently selected tool
  public getSelection(): string {
    return this.selectedTool;
  }
}
