import { getSuggestions, debounce } from "./utils.js";
const inputBox = document.getElementById("search-input");
const resultBox = document.getElementById("resultList");
const handleSearch = async (keyword) => {
  const result = await getSuggestions(keyword);
  const contentList = result.map(
    (item) => `<h1 class='result-item'>${item}</h1>`
  );
  resultBox.innerHTML = contentList;
  resultBox.classList.add("show");
};
const handleInputChange = (event) => {
  const value = event.target.value;
  handleSearch(value);
};
(() => {
  inputBox.addEventListener("input", debounce(handleInputChange, 300));
})();
