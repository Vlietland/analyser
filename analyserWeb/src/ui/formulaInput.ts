export class FormulaInput {
  private inputElement: HTMLInputElement;
  private onChangeCallback: ((value: string) => void) | null = null;

  constructor(initialValue: string = '') {
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = 'x^2+y^2';
    this.inputElement.value = initialValue;
    this.inputElement.style.marginRight = '10px';
    this.inputElement.style.padding = '5px';

    this.inputElement.addEventListener('input', () => {
      if (this.onChangeCallback) {
        this.onChangeCallback(this.inputElement.value);
      }
    });
  }

  getElement(): HTMLInputElement {
    return this.inputElement;
  }

  getValue(): string {
    return this.inputElement.value;
  }

  setValue(value: string): void {
    this.inputElement.value = value;
  }

  triggerChange(): void {
    if (this.onChangeCallback) {
      this.onChangeCallback(this.inputElement.value); // Call the correct callback
    }
  }

  onChange(callback: (value: string) => void): void {
    this.onChangeCallback = callback;
  }
}
