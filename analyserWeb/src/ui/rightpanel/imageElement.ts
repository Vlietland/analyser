export class ImageElement {
  private element: HTMLImageElement;

  constructor(src: string) {
    this.element = document.createElement('img');
    this.element.src = src;
    this.element.classList.add('image-element');
  }

  getElement(): HTMLImageElement {
    return this.element;
  }
}
