import { PIN_DATA } from "./data.js";

export const calculateColumns = (
  containerWidth,
  columnWidth = 300,
  gap = 16
) => {
  return Math.floor((containerWidth + gap) / (columnWidth + gap));
};

export const getShortestColumn = (columns) => {
  return columns.reduce((shortest, current) =>
    current.height < shortest.height ? current : shortest
  );
};

export const fetchPins = async (page = 1, limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      resolve(PIN_DATA.items.slice(start, end));
    }, 1000);
  });
};
