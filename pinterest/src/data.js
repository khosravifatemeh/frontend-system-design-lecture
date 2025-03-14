export const PIN_DATA = {
  items: Array.from({ length: 100 }, (_, index) => {
    const aspectRatio = (Math.random() * 1.2 + 0.6).toFixed(2);

    return {
      id: index + 1,
      images: {
        small: `https://picsum.photos/300/400?random=${index}`,
        medium: `https://picsum.photos/600/800?random=${index}`,
        large: `https://picsum.photos/900/1200?random=${index}`,
      },
      aspectRatio: parseFloat(aspectRatio),
      title: `Pin ${index + 1}`,
    };
  }),
};
