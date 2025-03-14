import { calculateColumns, getShortestColumn } from "./utils.js";

export class Masonry {
  constructor(container, options = {}) {
    this.container = container;
    this.columns = [];
    this.columnWidth = options.columnWidth || 300;
    this.maxRecycledNodes = options.maxRecycledNodes || 100;
    this.gap = options.gap || 16;
    this.recycledNodes = new Map();
    this.init();
  }

  init() {
    const containerWidth = this.container.clientWidth;
    const numColumns = calculateColumns(containerWidth, this.columnWidth);
    this.columns = Array.from({ length: numColumns }, (_, i) => ({
      element: this.createColumn(i),
      height: 0,
    }));
  }
  createColumn(index) {
    const column = document.createElement("div");
    column.className = "masonry-column";
    column.style.width = `${this.columnWidth}px`;
    column.style.position = "absolute";
    column.style.left = `${index * (this.columnWidth + this.gap)}`;
    this.container.appendChild(column);
    return column;
  }
  addPin(pin) {
    const shortestColumn = getShortestColumn(this.columns);
    const pinElement = this.createPinElement(pin);

    shortestColumn.element.appendChild(pinElement);
    shortestColumn.height += pinElement.offsetHeight + this.gap;

    const tallestHeight = Math.max(...this.columns.map((col) => col.height));
    this.container.style.height = `${tallestHeight}px`;
  }

  createPinElement(pin) {
    const element = document.createElement("div");
    element.className = "pin";
    element.dataset.pinId = pin.id;

    // Create image wrapper for aspect ratio preservation
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "pin-image-wrapper";
    imageWrapper.style.paddingBottom = `${pin.aspectRatio * 100}%`;

    const image = document.createElement("img");
    image.className = "pin-image";
    image.srcset = `
    ${pin.images.small} 300W,
    ${pin.images.medium} 600w,
    ${pin.images.large} 900w
    `.trim();
    image.sizes = `
  (max-width:600px) 300px,
  (max-width:900px) 600px,
  900px
    `.trim();
    image.alt = pin.title;
    image.loading = "lazy";
    image.onload = () => {
      image.classList.add("loaded");
    };
    image.onerror = () => {
      image.src = pin.images.small;
    };

    imageWrapper.appendChild(image);
    element.appendChild(imageWrapper);
    const title = document.createElement("h3");
    title.textContent = pin.title;
    element.appendChild(title);
    return element;
  }
}
