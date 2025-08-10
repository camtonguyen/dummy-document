## Throttle vs Debounce in JavaScript

Interactive pages fire lots of events (scroll, resize, input, mousemove). Running your code on every event can be slow. Two small helpers—debounce and throttle—let you control how often your function runs.

### Quick definitions

- **Debounce**: Wait for a “pause” in events, then run once. Useful when you only care about the final result after the user stops.
- **Throttle**: Run at most once every X ms, even if events keep firing. Useful when you want regular updates but not too many.

### Mental model

- **Debounce** = “call later.” If new events arrive, reset the timer.
- **Throttle** = “speed limit.” Let some events pass, ignore the rest until the next window.

### When to use which

- **Debounce**
  - Typing in a search box (wait for pause before fetching)
  - Auto-save after user stops editing
  - Live form validation on pause
- **Throttle**
  - Window `scroll` or `resize` handlers
  - Dragging/resizing elements (position updates)
  - Preventing button spam while still allowing periodic clicks

### Side-by-side

|                | Debounce                 | Throttle                  |
| -------------- | ------------------------ | ------------------------- |
| Runs           | After no events for X ms | At most once per X ms     |
| Good for       | “Wait until user stops”  | “Update at a steady rate” |
| Typical events | input, keyup, change     | scroll, resize, mousemove |

---

## Code you can use

### Debounce (with optional immediate/leading call)

```js
function debounce(callback, delay, immediate = false) {
  let timeout = null;
  return function (...args) {
    const shouldCallNow = immediate && !timeout;
    if (shouldCallNow) callback.apply(this, args);
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!immediate) callback.apply(this, args);
      timeout = null;
    }, delay);
  };
}
```

Use it like:

```js
const searchInput = document.querySelector('#search');

const onType = debounce((e) => {
  const q = e.target.value.trim();
  if (!q) return;
  // Fetch after user stops typing for 300ms
  fetch(`/search?q=${encodeURIComponent(q)}`).then(/* ... */);
}, 300);

searchInput.addEventListener('input', onType);
```

- Set `immediate = true` if you want a leading call (run first, then wait for quiet period).

### Throttle

```js
function throttle(callback, delay) {
  let timeout = null;
  let lastExecTime = 0;
  function callExec(context, args) {
    callback.apply(context, args);
    lastExecTime = Date.now();
  }
  function throttler(...args) {
    const now = Date.now();
    const timeSinceLastExec = now - lastExecTime;
    const remainingDelay = delay - timeSinceLastExec;
    if (timeSinceLastExec >= delay) {
      callExec(this, args);
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        callExec(this, args);
      }, remainingDelay);
    }
  }
  throttler.cancel = () => {
    timeout && clearTimeout(timeout);
    timeout = null;
  };
  return throttler;
}
```

Use it like:

```js
const onScroll = throttle(() => {
  // Runs at most once every 100ms even if scroll fires constantly
  console.log(window.scrollY);
}, 100);

window.addEventListener('scroll', onScroll);

// You can cancel a pending trailing call if needed
// onScroll.cancel();
```

---

## Choosing quickly

- **Typing / search / validation / autosave** → Debounce (wait for pause)
- **Scroll / resize / drag / progress updates** → Throttle (limit the rate)

## Gotchas and tips

- **Leading vs trailing**:
  - Debounce: `immediate=true` = leading call then wait for silence.
  - Throttle: common variants are leading-only, trailing-only, or both.
- **Keep one instance**: Create the debounced/throttled function once and reuse it. Don’t recreate inside another handler every time.
- **Preserve `this` and args**: Use `fn.apply(this, args)` (as shown) to forward context and parameters.
- **Libraries**: `lodash` provides `_.debounce` and `_.throttle` with more options.

---
