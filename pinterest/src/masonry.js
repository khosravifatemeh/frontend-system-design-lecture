import { calculateColumns, getShortestColumn } from "./utils.js";

export class Masonry {
  constructor(container, options = {}) {
    this.container = container;
    this.columns = [];
    this.columnWidth = options.columnWidth || 300;
    this.maxRecycledNodes = options.maxRecycledNodes || 100;
    this.gap = options.gap || 16;
    this.recycledNodes = new Map();
    this.pins = [];
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

  positionedPins(pins) {
    const positions = [];
    const columnHeights = this.columns.map((x) => x.height);

    for (const pin of pins) {
      const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const top = columnHeights[columnIndex];
      const height = this.columnWidth / pin.aspectRatio + this.gap;
      columnHeights[columnIndex] += height;
      positions.push({ columnIndex, top, height, pinData: pin });
    }
    return positions;
  }

  addPin(pin, node) {
    const shortestColumn = getShortestColumn(this.columns);
    const pinElement = this.createPinElement(pin.pinData);
    if (!node) {
      shortestColumn.element.appendChild(pinElement);
      shortestColumn.height += pinElement.offsetHeight + this.gap;

      const tallestHeight = Math.max(...this.columns.map((col) => col.height));
      this.container.style.height = `${tallestHeight}px`;
    } else {
      node.replaceWith(pinElement);
    }
  }

  createPinElement(pin) {
    const element = document.createElement("div");
    element.dataset.pinId = pin.id;
    element.className = "pin";
    const element1 = document.createElement("div");
    element1.className = "pin-wrapper";

    // Create image wrapper for aspect ratio preservation
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "pin-image-wrapper";
    imageWrapper.style.paddingBottom = `${pin.aspectRatio * 100}%`;

    const image = document.createElement("img");
    image.className = "pin-image";
    image.srcset = this.createSrcset(pin.images);
    image.sizes = this.createSizes();
    image.alt = pin.title;
    image.loading = "lazy";
    image.onload = () => {
      image.classList.add("loaded");
    };
    image.onerror = () => {
      image.src = pin.images.small;
    };

    imageWrapper.appendChild(image);
    element1.appendChild(imageWrapper);
    element.appendChild(element1);

    const title = document.createElement("h3");
    title.textContent = pin.title;
    element1.appendChild(title);
    return element;
  }
  createSrcset(images) {
    return `
    ${images.small} 300W,
    ${images.medium} 600w,
    ${images.large} 900w
    `.trim();
  }
  createSizes() {
    return `
  (max-width:600px) 300px,
  (max-width:900px) 600px,
  900px
    `.trim();
  }
  removeElement(element, index) {
    element.style.height = element.offsetHeight;
    element.firstChild.remove();
  }
}
