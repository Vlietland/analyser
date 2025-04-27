export class SampleSelector {
  private readonly MIN_SAMPLES = 5;
  private readonly MAX_SAMPLES = 99;
  public readonly DEFAULT_SAMPLES = 50;
  private value: number = this.DEFAULT_SAMPLES;
  private onChangeCallback: (newValue: number) => void;

  constructor(onChange: (newValue: number) => void) {
    this.onChangeCallback = onChange;
  }

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const numValue = parseInt(target.value, 10);

    if (!isNaN(numValue)) {
      const clampedValue = Math.max(this.MIN_SAMPLES, Math.min(this.MAX_SAMPLES, numValue));
      this.value = clampedValue;
      this.onChangeCallback(clampedValue);
    } else if (target.value === '') {
      this.value = this.MIN_SAMPLES;
      this.onChangeCallback(this.MIN_SAMPLES);
    }
  }

  getElement(): HTMLInputElement {
    const inputElement = document.createElement('input');
    inputElement.type = 'number';
    inputElement.title = `Samples (${this.MIN_SAMPLES}-${this.MAX_SAMPLES})`; // Use title for hint
    inputElement.value = String(this.value);
    inputElement.min = String(this.MIN_SAMPLES);
    inputElement.max = String(this.MAX_SAMPLES);
    inputElement.step = '1';
    inputElement.classList.add('sample-selector');

    inputElement.addEventListener('input', this.handleChange.bind(this));

    return inputElement;
  }

  setValue(value: number): void {
    this.value = value;
  }
}

export default SampleSelector;
