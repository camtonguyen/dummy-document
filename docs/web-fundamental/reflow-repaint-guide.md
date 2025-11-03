# Reflow and Repaint in Browser Rendering

## What is Reflow?

**Reflow (also called Layout)** is when the browser recalculates the positions and dimensions of elements in the document. This happens when:

- DOM elements are added, removed, or modified
- Content changes (text, images)
- Window is resized
- Stylesheet changes
- Element dimensions/positions change (width, height, margin, padding, border)
- Font changes
- Scrolling (in some cases)
- Reading layout properties like `offsetHeight`, `scrollTop`, etc.

**Why it's expensive:** The browser must recalculate the geometry of affected elements and potentially all their children and ancestors. This is computationally intensive.

---

## What is Repaint?

**Repaint (also called Redraw)** is when the browser redraws elements due to visual changes that don't affect layout:

- Color changes
- Background changes
- Visibility changes
- Outline changes
- Box shadows
- Text decoration

**Why it's less expensive:** Only the visual appearance changes; no geometry calculations needed. Still requires GPU work to redraw pixels.

---

## The Critical Difference

- **Reflow always triggers a repaint** (geometry changed, so must redraw)
- **Repaint doesn't always trigger reflow** (just visual updates)

---

## The Rendering Pipeline

```
JavaScript → Style Calculation → Layout (Reflow) → Paint (Repaint) → Composite
```

Modern browsers can sometimes skip steps if only certain properties change.

---

## Optimization Strategies

### 1. **Batch DOM Changes**

❌ **Bad:** Multiple reflows
```javascript
element.style.width = '100px';   // Reflow
element.style.height = '200px';  // Reflow
element.style.margin = '10px';   // Reflow
```

✅ **Good:** Single reflow
```javascript
// Using cssText
element.style.cssText = 'width: 100px; height: 200px; margin: 10px;';

// Or using classes
element.className = 'new-styles';
```

### 2. **Use Document Fragments**

❌ **Bad:** Multiple reflows
```javascript
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  document.body.appendChild(div); // Reflow each time
}
```

✅ **Good:** Single reflow
```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment); // One reflow
```

### 3. **Clone, Modify, Replace**

For complex changes to existing elements:

```javascript
const clone = element.cloneNode(true);
// Make all your changes to clone
clone.style.width = '100px';
clone.style.height = '200px';
// ... more changes
element.parentNode.replaceChild(clone, element); // One reflow
```

### 4. **Take Elements Out of Flow**

```javascript
// Remove from flow
element.style.display = 'none'; // 1 reflow

// Make multiple changes
element.style.width = '100px';
element.style.height = '200px';
element.innerHTML = 'New content';

// Put back in flow
element.style.display = 'block'; // 1 reflow
// Total: 2 reflows instead of many
```

### 5. **Avoid Layout Thrashing**

❌ **Bad:** Reading and writing in a loop (forced synchronous layout)
```javascript
elements.forEach(el => {
  const height = el.offsetHeight; // Read (forces reflow)
  el.style.height = height + 10 + 'px'; // Write (queues reflow)
});
```

✅ **Good:** Separate reads and writes
```javascript
// Read phase
const heights = elements.map(el => el.offsetHeight);

// Write phase
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';
});
```

### 6. **Use CSS Transform and Opacity**

These properties don't trigger layout or paint, only composite:

❌ **Triggers reflow:**
```javascript
element.style.left = '100px';
element.style.top = '50px';
```

✅ **Only triggers composite:**
```javascript
element.style.transform = 'translate(100px, 50px)';
```

✅ **Only triggers composite:**
```javascript
element.style.opacity = 0.5; // Better than visibility
```

### 7. **Use `requestAnimationFrame`**

Synchronize DOM updates with browser's repaint cycle:

```javascript
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 8. **Minimize Affected Scope**

- Position animated elements as `fixed` or `absolute` to remove them from normal flow
- Use `will-change` CSS property to hint the browser (sparingly):

```css
.animated-element {
  will-change: transform, opacity;
}
```

⚠️ **Warning:** Don't overuse `will-change` - it consumes memory.

### 9. **Avoid Expensive Properties**

Properties that always force reflow when read:
- `offsetTop`, `offsetLeft`, `offsetWidth`, `offsetHeight`
- `scrollTop`, `scrollLeft`, `scrollWidth`, `scrollHeight`
- `clientTop`, `clientLeft`, `clientWidth`, `clientHeight`
- `getComputedStyle()`
- `getBoundingClientRect()`

Cache these values if you need them multiple times.

**Example:**
```javascript
// Bad: Reading multiple times
for (let i = 0; i < 100; i++) {
  console.log(element.offsetHeight); // Forces reflow each time
}

// Good: Cache the value
const height = element.offsetHeight;
for (let i = 0; i < 100; i++) {
  console.log(height);
}
```

### 10. **Use CSS Containment**

Tell the browser an element's contents are independent:

```css
.isolated-component {
  contain: layout style paint;
}
```

This limits reflow scope to that element only.

### 11. **Debounce Resize/Scroll Handlers**

```javascript
let timeout;
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Your resize logic here
  }, 150);
});
```

Or use a debounce utility:
```javascript
import { debounce } from 'lodash';

window.addEventListener('resize', debounce(() => {
  // Your resize logic here
}, 150));
```

### 12. **Use Virtual Scrolling**

For long lists, render only visible items:
- React: `react-window`, `react-virtualized`
- Vanilla JS: Intersection Observer API

**Example with Intersection Observer:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load content when visible
      entry.target.src = entry.target.dataset.src;
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

---

## Performance Measurement

### Use browser DevTools to identify issues:

```javascript
// Chrome DevTools Performance tab
// Look for:
// - Purple bars (Rendering)
// - Yellow bars (JavaScript)
// - Green bars (Painting)

// Programmatic measurement
performance.mark('start');
// ... your code
performance.mark('end');
performance.measure('operation', 'start', 'end');
console.table(performance.getEntriesByType('measure'));
```

### Chrome DevTools Steps:

1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform actions on your page
5. Stop recording
6. Analyze:
   - Long tasks (yellow)
   - Layout/Reflow events (purple)
   - Paint events (green)
   - Look for forced synchronous layouts

---

## Quick Reference: CSS Properties Impact

### Trigger Reflow + Repaint:
- **Position**: `top`, `left`, `right`, `bottom`
- **Dimensions**: `width`, `height`, `padding`, `margin`, `border`
- **Display**: `display`, `float`, `clear`
- **Text**: `font-size`, `font-weight`, `line-height`
- **Other**: `overflow`, `position`, `vertical-align`

### Trigger Repaint Only:
- **Colors**: `color`, `background-color`
- **Visual**: `box-shadow`, `border-radius`, `outline`
- **Other**: `visibility`, `text-decoration`

### Trigger Composite Only (Best Performance):
- `transform`
- `opacity`
- `filter`
- `backdrop-filter`

---

## Best Practices Summary

1. **Batch** DOM manipulations together
2. **Read** layout properties first, then **write** styles
3. **Use** CSS transforms instead of positional properties
4. **Minimize** layout thrashing with proper read/write separation
5. **Leverage** browser optimization with `requestAnimationFrame`
6. **Isolate** animated elements with `position: absolute/fixed`
7. **Cache** layout property values instead of repeated reads
8. **Profile** with DevTools to identify bottlenecks
9. **Avoid** unnecessary DOM queries in loops
10. **Use** CSS classes instead of inline styles when possible

---

## Common Performance Pitfalls

### ❌ Anti-Pattern 1: Alternating Reads and Writes
```javascript
// Forces multiple reflows
div1.style.height = div1.offsetHeight + 10 + 'px';
div2.style.height = div2.offsetHeight + 10 + 'px';
div3.style.height = div3.offsetHeight + 10 + 'px';
```

### ✅ Solution: Batch Reads and Writes
```javascript
// Read all
const heights = [div1, div2, div3].map(d => d.offsetHeight);

// Write all
div1.style.height = heights[0] + 10 + 'px';
div2.style.height = heights[1] + 10 + 'px';
div3.style.height = heights[2] + 10 + 'px';
```

### ❌ Anti-Pattern 2: Animating Layout Properties
```javascript
// Causes reflow on every frame
function animate() {
  element.style.left = x + 'px';
  x += 1;
  requestAnimationFrame(animate);
}
```

### ✅ Solution: Use Transform
```javascript
// Only composites, no reflow
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(animate);
}
```

### ❌ Anti-Pattern 3: Reading Layout in Scroll Handler
```javascript
window.addEventListener('scroll', () => {
  const rect = element.getBoundingClientRect(); // Reflow!
  // Do something with rect
});
```

### ✅ Solution: Use Intersection Observer
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // No forced reflow
    if (entry.isIntersecting) {
      // Element is visible
    }
  });
});

observer.observe(element);
```

---

## Advanced Optimization Techniques

### 1. Use CSS `will-change` Wisely

```css
/* Good: For elements that will animate */
.modal {
  will-change: transform, opacity;
}

/* Bad: Applied to too many elements */
* {
  will-change: transform; /* Don't do this! */
}
```

Remove `will-change` after animation completes:
```javascript
element.style.willChange = 'transform';
// ... animate
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

### 2. Use CSS Containment

```css
/* Isolate component's internal layout */
.widget {
  contain: layout style;
}

/* Full containment (use carefully) */
.isolated {
  contain: strict;
}
```

### 3. Optimize Animations

```css
/* GPU-accelerated properties */
.animated {
  transform: translateX(0); /* Instead of left */
  will-change: transform;
}

/* Avoid animating these */
.slow-animation {
  /* Don't animate: width, height, margin, padding, top, left */
}
```

---

## The Golden Rule

**Make the browser's job easier by minimizing and batching changes to the render tree.**

The best optimization is the one you don't have to make - write performant code from the start by understanding how browsers render content.

---

## Additional Resources

- [Google Web Fundamentals - Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering)
- [Paul Irish - What Forces Layout/Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [CSS Triggers](https://csstriggers.com/)
- [Chrome DevTools Performance Documentation](https://developer.chrome.com/docs/devtools/performance/)

---

## Testing Your Optimizations

Always measure before and after:

```javascript
// Measure reflow count (Chrome only)
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'measure') {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  }
});

observer.observe({ entryTypes: ['measure'] });

performance.mark('start');
// Your code here
performance.mark('end');
performance.measure('My Operation', 'start', 'end');
```

Remember: **Profile in production-like conditions** with real devices and network speeds!