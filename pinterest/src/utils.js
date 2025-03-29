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
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 1000;
  const fetchWithRetry = async () => {
    await new Promise((res) => setTimeout(res, INITIAL_DELAY));
    const start = (page - 1) * limit;
    const end = start + limit;
    const pins = PIN_DATA.items.slice(start, end);
    if (pins?.length === 0) {
      throw new Error("No More Pins Available");
    }
    return pins;
  };
  for (let attemp = 0; attemp < MAX_RETRIES; attemp++) {
    try {
      return await fetchWithRetry();
    } catch (error) {
      if (attemp === MAX_RETRIES - 1) {
        throw error;
      }
    }
  }
};
