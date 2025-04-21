export class FormulaInput {
  public readonly INITIAL_FORMULA = 'x^2+y^2';
  private inputElement: HTMLInputElement;
  private onChangeCallback: ((value: string) => void) | null = null;

  constructor(initialValue: string = '') {
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = this.INITIAL_FORMULA;
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
      this.onChangeCallback(this.inputElement.value);
    }
  }

  onChange(callback: (value: string) => void): void {
    this.onChangeCallback = callback;
  }
}
