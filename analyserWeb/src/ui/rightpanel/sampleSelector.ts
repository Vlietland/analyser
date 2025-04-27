export class SampleSelector {
  private readonly MIN_SAMPLES = 5;
  private readonly MAX_SAMPLES = 99;
  public readonly DEFAULT_SAMPLES = 50;
  private value: number = this.DEFAULT_SAMPLES;
  private onChangeCallback: (newValue: number) => void;

  constructor(onChange: (newValue: number) => void) {
    this.onChangeCallback = onChange;
  }

  private validateAndUpdate(target: HTMLInputElement): void {
    const cleaned = target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(cleaned, 10);

    if (!isNaN(numValue)) {
      const clampedValue = Math.max(this.MIN_SAMPLES, Math.min(this.MAX_SAMPLES, numValue));
      target.value = String(clampedValue);
      this.value = clampedValue;
      this.onChangeCallback(clampedValue);
    } else {
      target.value = String(this.MIN_SAMPLES);
      this.value = this.MIN_SAMPLES;
      this.onChangeCallback(this.MIN_SAMPLES);
    }
  }

  private handleBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    this.validateAndUpdate(target);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      this.validateAndUpdate(target);
      target.blur(); // Optional: move focus away after Enter
    }
  }

  public getElement(): HTMLInputElement {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.title = `Samples (${this.MIN_SAMPLES}-${this.MAX_SAMPLES})`;
    inputElement.value = String(this.value);
    inputElement.classList.add('sample-selector');
    inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    inputElement.addEventListener('blur', this.handleBlur.bind(this));
    return inputElement;
  }

  public setValue(value: number): void {
    this.value = value;
  }
}

export default SampleSelector;
