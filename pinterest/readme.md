### ✅ Preserve Aspect Ratio

- Prevents image distortion.

- Maintains the original composition and visual integrity of images.

### ✅ Prevent Layout Shift While Loading

- Set fixed `width` and `height` attributes on `<img>` tags.

- Allows the browser to reserve space before the image loads, reducing _Cumulative Layout Shift (CLS)_.

### ✅ Maintain Consistent Column Height

- Ensures a stable visual layout in multi-column or masonry grids.

- Precalculate image sizes to avoid dynamic reflows.

### ✅ Reduce Cumulative Layout Shift (CLS)

- Reserve space using aspect ratios.

- Load fonts properly and avoid inserting content above existing content.

### ✅ Responsive Images

- Use `<picture>`, `srcset`, and `sizes` attributes to load different images based on viewport width.

- Improves performance by loading optimized images.

```html
<img
  srcset="img-small.webp 480w, img-medium.webp 1024w, img-large.webp 1600w"
  sizes="(max-width: 600px) 480px, (max-width: 1200px) 1024px, 1600px"
  src="img-large.webp"
  alt="Responsive image"
/>
```

### ✅ Infinite Scroll for Better UX (If No Footer) Improves user experience by

continuously loading content without pagination.

### ✅ Absolute Size to Prevent

Re-layout Use fixed dimensions to avoid unnecessary reflow and layout
recalculations.

### ✅ Smart Retries & Silent Ignore Implement retry logic for

failed image loads. Silently ignore non-critical failures to improve resilience.

### ✅ Lazy Loading for Images Load images only when they enter the viewport

using `loading="lazy"`

```html
<img src="image.webp" loading="lazy" alt="Lazy-loaded image" />
```

### ✅ Virtualization for Performance

- Render only the images currently visible in the viewport.
- Optimizes memory usage since memory is more critical than CPU in rendering.

### ✅ Use WebP for Better Compression

- WebP provides superior compression compared to JPEG and PNG.
- Reduces file size while maintaining image quality.

### ✅ Load Images from a Different Domain

- Improves performance by utilizing multiple browser connections.

### ✅ Use `requestAnimationFrame` for Smooth Scrolling

- Syncs updates with the browser's refresh rate for better performance.
- Reduces jank and improves user experience.

### ✅ Recycle DOM for Better Performance

- Reuse DOM elements instead of destroying and recreating them.
- Minimizes reflows and repaints, improving rendering performance.
