import { FRUITS } from "./data.js";
export const getSuggestions = (keyword) => {
  const result = FRUITS.filter(
    (i) =>
      i.substring(0, keyword.length).toLowerCase() === keyword.toLowerCase()
  );

  return new Promise((res) => {
    setTimeout(() => res(result), 2000);
  });
};

export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    setTimeout(() => fn.apply(this, args), delay);
  };
};
export const throttle = (fn, delay) => {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
};
