import { Masonry } from "./masonry.js";
import { fetchPins } from "./utils.js";

const container = document.getElementById("masonry-grid");
const loadingElement = document.getElementById("loading");
let isLoading = false;
let page = 1;

const masonryView = new Masonry(container, { columnWidth: 300, gap: 16 });

function createObservers() {
  const loadMoreObserver = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        loadPins();
      }
    },
    {
      rootMargin: "200px",
    }
  );

  return { loadMoreObserver };
}

const init = async () => {
  const { loadMoreObserver } = createObservers();
  loadMoreObserver.observe(loadingElement);
  await loadPins();
};

const loadPins = async () => {
  if (isLoading) return;
  isLoading = true;
  try {
    const pins = await fetchPins(page);
    pins.forEach((element) => {
      masonryView.addPin(element);
    });
    page++;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading = false;
  }
};

(() => {
  init();
})();
