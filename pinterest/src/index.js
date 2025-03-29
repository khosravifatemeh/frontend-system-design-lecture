import { Masonry } from "./masonry.js";
import { fetchPins } from "./utils.js";
import { VirtualScroller } from "./virtual-scroller.js";

const container = document.getElementById("masonry-grid");
let isLoading = false;
let page = 1;

const masonryView = new Masonry(container, { columnWidth: 300, gap: 16 });
const loadMoreObserver = new IntersectionObserver(
  async (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      loadMoreObserver.disconnect();
      await loadPins();
    }
  },
  {
    rootMargin: "200px",
  }
);
const virtualScroller = new VirtualScroller(masonryView, {
  onLastPin: (lastPin) => {
    loadMoreObserver.observe(lastPin);
  },
});

const loadPins = async () => {
  if (isLoading) return;
  isLoading = true;
  try {
    const pins = await fetchPins(page);
    virtualScroller.setItems(pins);
    page++;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading = false;
  }
};

(() => {
  loadPins();
  document.addEventListener("scroll", () =>
    virtualScroller.onScroll(window.scrollY)
  );
})();
