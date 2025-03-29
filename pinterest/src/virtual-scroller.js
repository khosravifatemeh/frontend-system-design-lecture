export class VirtualScroller {
  constructor(mansory, options) {
    this.items = new Map();
    this.mansory = mansory;
    (this.buffer = 200), (this.windowHeight = window.innerHeight);
    this.scrollY = 0;
    this.updateVisibleItems = this.updateVisibleItems.bind(this);
    this.observerLastPin = options.onLastPin;
  }
  setItems(pins) {
    const positionedPins = this.mansory.positionedPins(pins);
    positionedPins.forEach((pin) => {
      this.items.set(pin.pinData.id, pin);
    });
    this.updateVisibleItems();
  }
  updateVisibleItems() {
    let lastKey = [...this.items.keys()].pop();
    const lastPin = this.items.get(lastKey);

    const currentPins = document.querySelectorAll(".pin");
    for (const [key, item] of this.items) {
      const node = Array.from(currentPins).find(
        (pin) => +pin.dataset.pinId === key
      );
      if (this.isInviewPort(item, this.scrollY)) {
        if (!node || !node.hasChildNodes()) {
          this.mansory.addPin(item, node);
        }
        if (item === lastPin) {
          const lastPinNode = document.querySelector(`[data-pin-id="${key}"]`);
          if (lastPinNode) {
            this.observerLastPin(lastPinNode);
          }
        }
      } else {
        if (node?.hasChildNodes()) {
          this.mansory.removeElement(node, item.columnIndex);
        }
      }
    }
  }
  isInviewPort(item, scrollY) {
    const topItem = item.top;
    const bottomItem = item.top + item.height;

    const viewportTop = scrollY - this.buffer;
    const viewportBottom = scrollY + this.windowHeight + this.buffer;
    return (
      (topItem >= viewportTop && topItem <= viewportBottom) ||
      (bottomItem >= viewportTop && bottomItem <= viewportBottom) ||
      (topItem <= viewportTop && bottomItem >= viewportBottom)
    );
  }
  onScroll(scrollY) {
    this.scrollY = scrollY;
    requestAnimationFrame(() => this.updateVisibleItems());
  }
}
