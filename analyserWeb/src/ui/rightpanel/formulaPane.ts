export class FormulaPane {
  public readonly INITIAL_FORMULA = 'f(x,y)'
  private inputElement: HTMLInputElement;
  private messageBox: HTMLDivElement;
  private onChangeCallback: ((value: string) => void) | null = null;

  constructor(initialValue: string = '') {
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = this.INITIAL_FORMULA;
    this.inputElement.value = initialValue;
    this.inputElement.classList.add('formula-input');

    this.messageBox = document.createElement('div');
    this.messageBox.classList.add('formula-message');
    this.messageBox.style.display = 'none';

    this.inputElement.addEventListener('input', () => {
      if (this.onChangeCallback) {
        this.onChangeCallback(this.inputElement.value);
      }
    });
  }

  getElement(): HTMLDivElement {
    const container = document.createElement('div');
    container.appendChild(this.inputElement);
    container.appendChild(this.messageBox);
    return container;
  }

  setValue(value: string): void {
    this.inputElement.value = value;
  }

  triggerChange(): void {
    if (this.onChangeCallback) {
      this.onChangeCallback(this.inputElement.value);
    }
  }

  onChange(callback: (value: string) => void): void {
    this.onChangeCallback = callback;
  }

  showError(message: string): void {
    this.messageBox.textContent = message;
    this.messageBox.style.display = 'block';
  }

  hideError(): void {
    this.messageBox.textContent = '';
    this.messageBox.style.display = 'none';
  }
}
