import { getSuggestions, debounce } from "./utils.js";
const inputBox = document.getElementById("search-input");
const resultBox = document.getElementById("resultList");
const MIN_QUERY_LENGTH = 3;
const TIMEOUT_DURATION = 3000;
const ITEMS_PER_Virtualize_PAGE = 20;
let fetchPage = 0;
let virtualPage = 0;
let allResults = [];
let isLoading = false;
let lastQuery = "";

const showLoading = () => {
  isLoading = true;
  resultBox.insertAdjacentHTML(
    "beforeend",
    "<p class='loading'>loading...</p>"
  );
  resultBox.classList.add("show");
};

const removeLoading = () => {
  isLoading = false;
  const loadEl = resultBox.querySelector(".loading");
  if (loadEl) {
    loadEl.remove();
  }
};

const handleSearch = async (keyword) => {
  try {
    fetchPage = 0;
    showLoading();
    lastQuery = keyword;
    virtualPage = 0;
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Error"));
      }, TIMEOUT_DURATION);
    });
    const result = await Promise.race([
      getSuggestions(keyword, fetchPage),
      timeoutPromise,
    ]);
    allResults = result || [];

    renderVirtualizedList(result);
  } catch (error) {
    resultBox.innerHTML = "<p class='error'>An error occurred</p>";
    resultBox.classList.add("show");
  } finally {
    removeLoading();
  }
};

const renderVirtualizedList = (result) => {
  if (!allResults.length) {
    resultBox.innerHTML = "<p>No Items...</p>";
    resultBox.classList.add("show");
  }
  const { start, end } = getVisibleRange();
  const visibleItems = allResults.slice(start, end);
  const contentList = visibleItems
    .map((item) => `<p class='result-item'>${item}</p>`)
    .join("");

  if (virtualPage === 0) {
    resultBox.innerHTML = contentList;
  } else {
    resultBox.insertAdjacentHTML("beforeend", contentList);
  }

  resultBox.classList.add("show");

  const lastItem = resultBox.lastElementChild;
  if (lastItem) {
    observer.observe(lastItem);
  }
};

const loadMore = async () => {
  if (isLoading) return;
  try {
    showLoading();
    fetchPage++;
    const newResults = await getSuggestions(lastQuery, fetchPage);
    if (newResults?.length) {
      allResults = [...allResults, ...newResults];
      renderVirtualizedList();
    }
  } catch (error) {
    console.log("Error");
  } finally {
    removeLoading();
  }
};

const getVisibleRange = () => {
  const start = virtualPage * ITEMS_PER_Virtualize_PAGE;
  const end = Math.min(start + ITEMS_PER_Virtualize_PAGE, allResults.length);
  return { start, end };
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        const { end } = getVisibleRange();
        if (end < allResults.length) {
          virtualPage++;
          renderVirtualizedList();
        } else {
          loadMore();
        }
      }
    });
  },
  {
    root: resultBox,
    threshold: 0.1,
  }
);

const handleInputChange = (event) => {
  const value = event.target.value;
  // if (value?.length >= MIN_QUERY_LENGTH) handleSearch(value);
  handleSearch(value);
};

const removeResult = () => {
  resultBox.innerHTML = "";
  resultBox.classList.remove("show");
};
(() => {
  inputBox.focus();
  inputBox.addEventListener("input", debounce(handleInputChange, 300));
  // inputBox.addEventListener("blur", removeResult);
  resultBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("result-item")) {
      inputBox.value = e.target.innerText;
      removeResult();
    }
  });
})();
