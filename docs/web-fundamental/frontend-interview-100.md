# 100 Practical Frontend Interview Questions & Answers
**Focus:** Realistic Scenarios, System Design, React (Hooks/Patterns), Next.js, TypeScript, and Performance.

---

## I. JavaScript Core: Logic & Async
*Deep understanding of the language runtime and asynchronous patterns.*

### 1. Explain the Event Loop.
**Answer:** JavaScript is single-threaded. The Event Loop monitors the **Call Stack** and the **Callback Queue**. If the Stack is empty, it pushes the first item from the Queue to the Stack.
* **Microtasks (Promises/queueMicrotask):** High priority, run immediately after the current script.
* **Macrotasks (setTimeout/setInterval):** Run in the next loop iteration.

### 2. Implement a `debounce` function.
**Scenario:** Prevent an API from being hit on every keystroke.
```javascript
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
```

### 3. Implement a `throttle` function.
**Scenario:** Limit a function (like a scroll event handler) to run at most once every `limit` ms.
```javascript
function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

### 4. `var` vs `let` vs `const` & Hoisting.
* **var:** Function scoped, hoisted (initialized as `undefined`).
* **let/const:** Block scoped, hoisted but in "Temporal Dead Zone" (accessing before declaration throws an error).

### 5. Deep Clone an Object.
**Best modern way:** `const clone = structuredClone(obj);` (Handles Dates, undefined, circular refs natively).
**Old way:** `JSON.parse(JSON.stringify(obj))` (Lossy; loses Dates and Functions).

### 6. Explain Closures with a practical use case.
**Answer:** A function retaining access to variables from its outer scope even after the outer function has finished.
**Use Case:** Data privacy (creating private variables).
```javascript
const createCounter = () => {
  let count = 0; // Private variable
  return () => ++count; 
};
```

### 7. Flatten a nested array (Recursion).
```javascript
const flatten = (arr) => arr.reduce((acc, item) => 
  Array.isArray(item) ? acc.concat(flatten(item)) : acc.concat(item), []
);
// Modern alternative: arr.flat(Infinity)
```

### 8. `Promise.all` vs `Promise.allSettled`.
* `Promise.all`: Fails immediately if *any* promise rejects.
* `Promise.allSettled`: Waits for *all* to finish, regardless of success or failure.

### 9. What is the prototype chain?
**Answer:** When accessing a property on an object, if it’s not found, JS looks at the object's `__proto__`, then that object's `__proto__`, until `null` is reached.

### 10. `this` keyword behavior.
* **Global:** window/global.
* **Object method:** the object itself.
* **Arrow function:** inherits `this` from the surrounding lexical scope.
* **Event listener:** the element that fired the event.

### 11. Implement `Function.prototype.bind`.
```javascript
Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  return function(...newArgs) {
    return fn.apply(context, [...args, ...newArgs]);
  };
};
```

### 12. Generator Functions (`function*`).
Allows pausing (`yield`) and resuming function execution. Used in Redux-Saga or processing large data streams.

### 13. Map vs WeakMap.
* **Map:** Keys can be anything. Keys are held strongly (prevents garbage collection).
* **WeakMap:** Keys must be objects. References are weak (allows GC if the object is not used elsewhere).

### 14. What is Event Delegation?
Attaching a single listener to a parent element to manage events for all current and future descendants (using `event.target`).

### 15. `==` vs `===`.
Always use `===` (Strict Equality) to check value and type. `==` performs type coercion (e.g., `0 == '0'` is true).

---

## II. TypeScript
*Essential for modern enterprise React apps.*

### 16. `interface` vs `type`.
* **Interface:** Better for defining object shapes, supports "Declaration Merging" (extensible).
* **Type:** More flexible, supports Unions (`A | B`) and Intersections.

### 17. What are Generics?
**Answer:** Reusable code components that work with a variety of types (Type variables).
```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

### 18. `Pick` and `Omit` utility types.
* `Pick<Type, Keys>`: Creates a type by selecting a set of properties.
* `Omit<Type, Keys>`: Creates a type by removing a set of properties.

### 19. What is `Partial<T>`?
Makes all properties in `T` optional. Useful for update/patch operations where you might only send a subset of data.

### 20. `any` vs `unknown`.
* `any`: Disables type checking (unsafe).
* `unknown`: Safer counterpart. You must perform type narrowing (checks) before using the value.

### 21. How to type a React Functional Component?
```typescript
const Button: React.FC<{ label: string }> = ({ label }) => <button>{label}</button>;
```

### 22. What is Type Assertion (`as`)?
Telling the compiler "I know more about the type than you do." `const input = e.target as HTMLInputElement;`.

---

## III. React: Core, Hooks & Patterns
*Component architecture and lifecycle.*

### 23. Real DOM vs Virtual DOM.
**Answer:** Updating Real DOM is slow. React updates Virtual DOM (lightweight JS object), diffs it with the previous version, and batches updates to the Real DOM (Reconciliation).

### 24. `useEffect` cleanup function.
**Scenario:** A component sets up a WebSocket or Timer.
**Answer:** Return a function from `useEffect` to clean up resources when the component unmounts.

### 25. Why do we need `keys` in lists?
**Answer:** Keys allow React to identify which items changed, added, or removed. Using `index` as a key is bad if the list order changes (leads to bugs with local state).

### 26. `useMemo` vs `useCallback`.
* **useMemo:** Caches a *calculated value*.
* **useCallback:** Caches a *function reference* (prevents child re-renders).

### 27. What is Prop Drilling? How to solve it?
Passing data through many layers.
**Fixes:** Context API, Composition (passing `children`), or State Management (Redux/Zustand).

### 28. React.memo().
HOC that prevents a functional component from re-rendering if its props haven't changed.

### 29. `useRef` use cases.
1.  Accessing DOM elements directly.
2.  Storing mutable values that **do not cause re-renders** when updated.

### 30. Custom Hook: `useLocalStorage`.
```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { return initialValue; }
  });
  // ... setValue logic
  return [storedValue, setStoredValue];
}
```

### 31. Error Boundaries.
Class components used to catch JS errors in the child component tree, log them, and show a fallback UI.

### 32. What is the "Compound Component" pattern?
**Answer:** Components that work together to share state implicitly (e.g., `<Select>` and `<Option>`). Usually uses `Context` internally.

### 33. Controlled vs Uncontrolled components.
* **Controlled:** React state drives the input value (`value={state}`).
* **Uncontrolled:** DOM drives the value (`ref`).

### 34. `useLayoutEffect`.
Fires synchronously *after* DOM mutations but *before* painting. Used for measuring DOM elements to prevent visual flickering.

### 35. What is React Portals?
Renders a child into a DOM node outside the parent hierarchy. (Modals, Tooltips).

### 36. High Order Components (HOC).
A function that takes a component and returns a new component (`withAuth(UserPage)`).

### 37. Suspense & Lazy Loading.
```javascript
const LazyComp = React.lazy(() => import('./Comp'));
// Usage: <Suspense fallback={<Spinner />}><LazyComp /></Suspense>
```

### 38. Batching in React 18.
React 18 batches state updates automatically, even inside promises or timeouts, triggering only one re-render.

---

## IV. Data Fetching & Caching Strategies
*Crucial for performance. Includes requested code implementations.*

### 39. Implementation: Caching with React Query (TanStack).
**Scenario:** Cache API response and background update.
```javascript
import { useQuery } from '@tanstack/react-query';

function UserProfile({ id }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(`/api/user/${id}`).then(r => r.json()),
    staleTime: 60000, // Fresh for 1 min (no fetch)
    gcTime: 300000,   // Kept in memory for 5 mins
  });
  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

### 40. Implementation: Manual Caching (Custom Hook).
**Scenario:** No libraries allowed. Cache in a simple global object.
```javascript
const cache = {}; // Global cache object
const useFetchWithCache = (url) => {
  const [data, setData] = useState(cache[url] || null);
  
  useEffect(() => {
    if (cache[url]) return; // Use cache if available
    
    fetch(url).then(r => r.json()).then(res => {
      cache[url] = res; // Set cache
      setData(res);
    });
  }, [url]);
  return data;
};
```

### 41. Implementation: Redux Caching (Thunk).
**Scenario:** Check store before fetching.
```javascript
export const fetchPosts = () => (dispatch, getState) => {
  const { posts, lastUpdated } = getState().data;
  // Cache Logic: Check if data exists and is less than 1 min old
  const isFresh = Date.now() - lastUpdated < 60000;

  if (posts.length > 0 && isFresh) return; // Cache hit: Do nothing

  // Cache Miss: Fetch
  fetch('/api/posts')
    .then(r => r.json())
    .then(data => dispatch({ type: 'SUCCESS', payload: data }));
};
```

### 42. HTTP Caching vs Client Caching.
* **Client (React Query):** Avoids making the request entirely.
* **HTTP (Headers):** Browser makes request -> Server says "304 Not Modified" or Browser loads from disk cache.

### 43. What is Optimistic UI?
Updating the UI *immediately* on user action (assuming success) while the API request processes. If it fails, roll back the change.

### 44. `stale-while-revalidate`.
Strategy where the browser serves stale content (instantly) while revalidating data in the background.

---

## V. Next.js & Modern Architecture
*Server Components, Routing, and Rendering.*

### 45. SSR vs SSG vs ISR.
* **SSR:** Build on request (Server). Slow TTFB, good for SEO/Dynamic.
* **SSG:** Build on deploy. Fast, good for static content.
* **ISR:** SSG + Revalidation. Updates static pages after a specific time interval.

### 46. React Server Components (RSC).
Components that run *only* on the server. No client bundle size. Direct DB access. Cannot use `useState` or `useEffect`.

### 47. Next.js App Router vs Pages Router.
App Router uses Server Components by default, folder-based routing, and nested layouts.

### 48. Dynamic Routes.
`app/blog/[slug]/page.js`. Access params via props: `params.slug`.

### 49. Next.js Image Optimization.
The `<Image />` component prevents Layout Shift (CLS), lazy loads, and resizes images on the server (WebP/AVIF).

### 50. Middleware in Next.js.
Runs before a request completes. Used for Authentication (redirects), rewriting paths, or geolocation handling.

### 51. Server Actions.
Functions executing on the server called directly from client UI forms/buttons. Eliminates the need for manual API routes for mutations.

### 52. `generateStaticParams`.
Used in App Router to define which dynamic paths (e.g., blog slugs) to pre-render at build time (replacement for `getStaticPaths`).

### 53. Hydration Error.
Mismatch between Server-rendered HTML and the first Client render (e.g., rendering `Date.now()` or `window.innerWidth`).

---

## VI. CSS & UI Engineering
*Styling, Layouts, and Responsiveness.*

### 54. Center a div (Flexbox).
```css
.parent { display: flex; justify-content: center; align-items: center; }
```

### 55. Center a div (Grid).
```css
.parent { display: grid; place-items: center; }
```

### 56. Box Model.
Content -> Padding -> Border -> Margin.
**Tip:** Always use `* { box-sizing: border-box; }`.

### 57. `rem` vs `em` vs `px`.
* `px`: Absolute.
* `rem`: Relative to root (`html`). Best for accessibility.
* `em`: Relative to parent.

### 58. CSS Specificity calculation.
Inline styles (1000) > ID (100) > Class (10) > Tag (1).
`!important` overrides everything.

### 59. CSS Grid vs Flexbox.
* **Flex:** 1D (Rows OR Cols).
* **Grid:** 2D (Rows AND Cols).

### 60. How to hide elements accessibly?
Don't use `display: none`. Use a `.sr-only` class (1px width, absolute position, overflow hidden) for Screen Readers.

### 61. CSS Variables (Custom Properties).
`--main-color: blue;` accessed via `var(--main-color)`. Scoped to the DOM.

### 62. Sticky vs Fixed position.
* **Fixed:** Relative to viewport.
* **Sticky:** Toggles between relative and fixed based on scroll position.

### 63. What is the BEM methodology?
**Block Element Modifier**. Naming convention: `.card__button--active`. Keeps CSS flat and maintainable.

### 64. Pseudo-classes vs Pseudo-elements.
* **Class (`:hover`):** State of an element.
* **Element (`::before`):** Specific part of an element.

---

## VII. State Management (Redux/Zustand)
*Managing complex application state.*

### 65. What is the Redux Data Flow?
Action -> Dispatch -> Reducer -> Store -> View. Unidirectional.

### 66. Redux Toolkit (RTK) benefits.
Reduces boilerplate. Includes `immer` (allows mutable logic in reducers), `thunk` built-in, and `createSlice`.

### 67. Context API vs Redux.
* **Context:** Good for low-frequency updates (Theme, Auth). Can cause re-render performance issues.
* **Redux:** Good for high-frequency updates, complex logic, middleware needs.

### 68. What is a "Selector"?
A function that extracts data from the Redux store. `reselect` library memoizes them to improve performance.

### 69. Zustand vs Redux.
Zustand is smaller, hook-based, no provider wrapper needed, and less boilerplate.

---

## VIII. Web Performance & Optimization
*Critical for Senior roles.*

### 70. Core Web Vitals.
1.  **LCP (Largest Contentful Paint):** Load speed.
2.  **INP (Interaction to Next Paint):** Responsiveness (Replaced FID).
3.  **CLS (Cumulative Layout Shift):** Visual stability.

### 71. Code Splitting.
Breaking the JS bundle into chunks. Load only what is needed for the current route. (Next.js does this automatically by page).

### 72. Tree Shaking.
Removing dead/unused code from the final bundle during the build process (Webpack/Rollup).

### 73. Debounce vs Throttle (See #2 and #3).
Crucial for scroll/resize performance.

### 74. Image Formats.
Use WebP or AVIF. They provide better compression than PNG/JPG.

### 75. Browser Resource Hints.
* `preload`: Load critical assets immediately.
* `prefetch`: Load assets for the *next* page.
* `lazy`: Load only when visible.

### 76. Critical Rendering Path.
The steps the browser takes to convert HTML/CSS/JS into pixels. Optimize by minimizing "Render Blocking" CSS/JS.

---

## IX. Security
*Protecting the user and application.*

### 77. XSS (Cross-Site Scripting).
Injection of malicious scripts.
**Prevention:** Sanitize inputs. React escapes content by default. Use Content Security Policy (CSP).

### 78. CSRF (Cross-Site Request Forgery).
Tricking a user into submitting a request.
**Prevention:** Anti-CSRF tokens, `SameSite` cookie attribute.

### 79. JWT vs Session Cookies.
* **JWT:** Stateless, stored on client (often local storage - vulnerable to XSS, or HttpOnly cookie).
* **Session:** Stateful, stored on server, ID sent via Cookie.

### 80. CORS.
**Cross-Origin Resource Sharing.** Browser security feature preventing a site from reading data from another domain unless headers (`Access-Control-Allow-Origin`) permit it.

---

## X. Testing (Jest / RTL)
*Ensuring reliability.*

### 81. Unit vs Integration vs E2E.
* **Unit:** Test individual function/component.
* **Integration:** Test how components work together.
* **E2E (Cypress/Playwright):** Test full user flows in a real browser.

### 82. What is Snapshot Testing?
Comparing the rendered JSON structure of a component against a saved file. Detects unintended UI changes.

### 83. Mocking a Fetch request in Jest.
```javascript
global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ data: 'mock' })
}));
```

### 84. React Testing Library philosophy.
"Test your software the way your users use it." Find elements by text/role (`getByText`), not by ID or class.

---

## XI. Web APIs & Miscellaneous
*Browser features and general knowledge.*

### 85. `IntersectionObserver`.
API to detect when an element enters the viewport. Used for Infinite Scroll or Lazy Loading.

### 86. `ResizeObserver`.
API to detect when an element changes size.

### 87. LocalStorage limits.
Synchronous. Usually ~5-10MB. Only stores strings.

### 88. Micro-frontends.
Architecture where a frontend is split into smaller, semi-independent apps (e.g., Header App, Checkout App) loaded together.

### 89. Accessibility (A11y) basics.
Semantic HTML (`<button>` not `<div>`), `alt` tags, ARIA roles, Keyboard navigation support.

### 90. Git: Merge vs Rebase.
* **Merge:** Preserves history, creates a merge commit.
* **Rebase:** Rewrites history for a linear log (cleaner, but dangerous on shared branches).

---

## XII. Behavioral / Scenario Questions
*How you think and solve problems.*

### 91. "Tell me about a hard bug you solved."
**Method (STAR):**
* **S**ituation: Production crash.
* **T**ask: Fix it ASAP.
* **A**ction: Used binary search in Git to find the commit. Found memory leak in `useEffect`. Fixed dependency array.
* **R**esult: App stability restored.

### 92. "How do you handle disagreement with a designer?"
**Answer:** Focus on the user and technical feasibility. "I love the design, but this animation will hurt performance on mobile. Can we simplify it?"

### 93. "How do you learn new tech?"
**Answer:** "I build a small project. Reading docs is good, but building breaks things and forces me to learn."

### 94. Designing a File Uploader.
**Considerations:** Drag & Drop API, Progress bars, File type validation, Chunked uploads for large files.

### 95. Designing a Chat Application.
**Considerations:** WebSockets (real-time), Optimistic UI (show message before server confirms), Virtualization (for long history).

### 96. Designing a Typeahead/Autocomplete.
**Considerations:** Debouncing inputs, caching results, keyboard navigation, highlighting matching text.

### 97. How to handle Multilingual support (i18n)?
Use libraries like `react-i18next`. Don't hardcode strings. Store translations in JSON files.

### 98. Dark Mode implementation.
Use CSS Variables (`--bg-color`). Toggle a class on the `body` tag. Persist preference in `localStorage` and check `prefers-color-scheme`.

### 99. Explain the "Single Threaded" nature of JS.
JS has one call stack. It can only do one thing at a time. Async callbacks are offloaded to the environment (Browser) and return to the queue later.

### 100. Why do you use TypeScript?
**Answer:** Catches errors at compile time (undefined is not a function), provides Intellisense/Autocomplete, and serves as self-documentation for the code.
