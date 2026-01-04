# Frontend Engineering Concepts Guide

## JavaScript Core Concepts

### Event Loop and Call Stack

The call stack is where JavaScript tracks function execution. When a function is called, it's added to the stack; when it returns, it's removed. JavaScript is single-threaded, so it can only execute one thing at a time.

The event loop monitors the call stack and task queues. When the stack is empty, it takes the first task from the queue and pushes it onto the stack. This enables asynchronous behavior in a single-threaded environment.

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// Output: 1, 3, 2
```

### Microtasks vs Macrotasks

**Microtasks** (higher priority): Promises, `queueMicrotask()`, MutationObserver
**Macrotasks** (lower priority): `setTimeout`, `setInterval`, I/O operations

The event loop processes all microtasks before moving to the next macrotask.

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

### Closures and Lexical Scoping

A closure is a function that remembers variables from its outer scope even after that scope has finished executing. Lexical scoping means functions are executed using the variable scope that was in effect when they were defined, not when they're called.

```javascript
function createCounter() {
  let count = 0;
  return function () {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

### Hoisting and the Temporal Dead Zone

Hoisting moves variable and function declarations to the top of their scope during compilation. However, `let` and `const` exist in a "temporal dead zone" from the start of the block until the declaration is reached.

```javascript
console.log(x); // undefined (var is hoisted)
var x = 5;

console.log(y); // ReferenceError (TDZ)
let y = 10;

foo(); // Works! Function declarations are fully hoisted
function foo() {
  console.log('bar');
}
```

### The "this" Keyword

In regular functions, `this` depends on how the function is called. In arrow functions, `this` is lexically bound (inherited from the enclosing scope).

```javascript
const obj = {
  name: 'Alice',
  regular: function () {
    return this.name;
  },
  arrow: () => this.name,
};

obj.regular(); // 'Alice'
obj.arrow(); // undefined (this refers to outer scope)
```

### Object References vs Primitive Comparisons

Primitives (string, number, boolean, null, undefined, symbol) are compared by value. Objects are compared by reference (memory address).

```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b; // false (different references)
a === c; // true (same reference)

1 === 1; // true (same value)
```

### Prototypal Inheritance

JavaScript objects inherit properties from other objects through the prototype chain. When accessing a property, JavaScript first checks the object itself, then walks up the prototype chain until it finds the property or reaches `null`.

```javascript
const animal = {
  makeSound() {
    return 'Some sound';
  },
};

const dog = Object.create(animal);
dog.bark = function () {
  return 'Woof!';
};

dog.bark(); // 'Woof!' (own property)
dog.makeSound(); // 'Some sound' (inherited)
```

### Shallow vs Deep Copy

**Shallow copy** copies only the first level of properties. Nested objects are still referenced.
**Deep copy** recursively copies all levels, creating entirely independent objects.

```javascript
const original = { a: 1, b: { c: 2 } };

// Shallow copy
const shallow = { ...original };
shallow.b.c = 3;
console.log(original.b.c); // 3 (reference shared)

// Deep copy
const deep = JSON.parse(JSON.stringify(original));
deep.b.c = 4;
console.log(original.b.c); // 3 (independent)
```

### Debounce vs Throttle

**Debounce** delays execution until after a specified time has passed since the last call. Use for search input, resize events.

**Throttle** ensures a function runs at most once per specified interval. Use for scroll events, mouse movement.

```javascript
// Debounce: waits for pause in calls
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Throttle: limits frequency
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}
```

### Implicit vs Explicit Type Coercion

**Implicit coercion** happens automatically when JavaScript converts types.
**Explicit coercion** is when you manually convert types.

```javascript
// Implicit
'5' + 3; // '53' (number to string)
'5' - 3; // 2 (string to number)

// Explicit
Number('5'); // 5
String(123); // '123'
Boolean(0); // false
```

### Truthy and Falsy Values

**Falsy values**: `false`, `0`, `''`, `null`, `undefined`, `NaN`
Everything else is truthy.

**== vs ===**:

- `==` performs type coercion before comparison
- `===` checks both value and type without coercion

```javascript
0 == false; // true (coerced)
0 === false; // false (different types)
'' == false; // true (coerced)
'' === false; // false (different types)
```

### call, apply, and bind

These methods control the `this` context of functions.

```javascript
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

const person = { name: 'Alice' };

greet.call(person, 'Hello'); // 'Hello, Alice'
greet.apply(person, ['Hello']); // 'Hello, Alice'
const boundGreet = greet.bind(person);
boundGreet('Hello'); // 'Hello, Alice'
```

### Event Delegation and Bubbling

Events bubble up from the target element through its ancestors. Event delegation leverages this by attaching a single listener to a parent instead of many listeners to children.

```javascript
// Instead of adding listeners to each button
document.getElementById('parent').addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    console.log('Button clicked:', e.target.textContent);
  }
});
```

### typeof, instanceof, and Type Checking

```javascript
typeof 'hello'; // 'string'
typeof 42; // 'number'
typeof null; // 'object' (historical bug)
typeof undefined; // 'undefined'

[] instanceof Array; // true
({}) instanceof Object; // true

// Accurate type checking
Object.prototype.toString.call([]); // '[object Array]'
Array.isArray([]); // true
```

### Spread vs Rest Operators

Both use `...` syntax but serve opposite purposes.

**Spread** expands elements.
**Rest** collects elements into an array.

```javascript
// Spread
const arr = [1, 2, 3];
const arr2 = [...arr, 4, 5]; // [1, 2, 3, 4, 5]

// Rest
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

### map, filter, reduce

```javascript
const numbers = [1, 2, 3, 4];

// map: transforms each element
numbers.map((n) => n * 2); // [2, 4, 6, 8]

// filter: selects elements
numbers.filter((n) => n > 2); // [3, 4]

// reduce: combines elements into single value
numbers.reduce((sum, n) => sum + n, 0); // 10
```

**When NOT to use them**: Large datasets where performance matters (use for loops), when you need to break early, or when side effects are the primary goal.

### Currying and Partial Application

**Currying** transforms a function with multiple arguments into a sequence of single-argument functions.

**Partial application** fixes some arguments of a function, returning a new function with fewer arguments.

```javascript
// Currying
const curry = (a) => (b) => (c) => a + b + c;
curry(1)(2)(3); // 6

// Partial application
function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2);
double(5); // 10
```

### async/await vs Promises vs Callbacks

**Callbacks**: Functions passed as arguments (callback hell risk).
**Promises**: Objects representing eventual completion or failure.
**async/await**: Syntactic sugar over promises for cleaner code.

```javascript
// Callback
getData((error, data) => {
  if (error) return console.error(error);
  console.log(data);
});

// Promise
getData()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// async/await
async function fetchData() {
  try {
    const data = await getData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

### Error Handling in Async JavaScript

```javascript
// Promise error handling
promise
  .then((result) => processResult(result))
  .catch((error) => console.error('Error:', error))
  .finally(() => console.log('Cleanup'));

// async/await error handling
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/user/${id}`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
```

## Browser and Performance

### Critical Rendering Path

The sequence of steps browsers take to render a page:

1. **Parse HTML** → DOM tree
2. **Parse CSS** → CSSOM tree
3. **Combine** → Render tree (visible elements only)
4. **Layout** → Calculate positions and sizes
5. **Paint** → Draw pixels to screen

**What blocks it**: CSS blocks rendering, JavaScript blocks parsing (unless async/defer), large DOM trees slow layout.

### Repaint vs Reflow

**Reflow (Layout)**: Recalculates element positions and sizes. Expensive. Triggered by: adding/removing elements, changing dimensions, window resize.

**Repaint**: Updates pixel values without layout changes. Less expensive. Triggered by: color changes, visibility changes.

**Minimizing layout thrashing**: Batch DOM reads and writes, use `requestAnimationFrame`, avoid forced synchronous layouts.

```javascript
// Bad: causes multiple reflows
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = box.offsetWidth + 'px'; // read then write
}

// Good: batch reads and writes
const width = box.offsetWidth;
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = width + 'px';
}
```

### DNS Resolution, TCP Handshake, TLS, Request Lifecycle

1. **DNS Resolution**: Converts domain name to IP address (cached for speed)
2. **TCP Handshake**: 3-way handshake establishes connection (SYN, SYN-ACK, ACK)
3. **TLS Negotiation**: For HTTPS, encrypts the connection (adds ~2 round trips)
4. **HTTP Request**: Browser sends request to server
5. **Server Processing**: Server generates response
6. **HTTP Response**: Data sent back to browser

Optimizations: DNS prefetch, HTTP/2 multiplexing, connection reuse, CDNs.

### How Browsers Render HTML, CSS, and JS

1. HTML parser creates DOM tree incrementally
2. CSS parser creates CSSOM (blocks rendering)
3. JavaScript execution can modify DOM/CSSOM (blocks parsing unless async/defer)
4. Render tree constructed from DOM + CSSOM
5. Layout calculates geometry
6. Paint renders pixels
7. Composite layers together

### Preload, Prefetch, and Lazy Loading

**Preload**: High-priority loading of critical resources.

```html
<link rel="preload" href="font.woff2" as="font" />
```

**Prefetch**: Low-priority loading of resources for future navigation.

```html
<link rel="prefetch" href="next-page.html" />
```

**Lazy Loading**: Delays loading until needed (images, components).

```html
<img loading="lazy" src="image.jpg" />
```

### Service Workers and Caching Strategies

Service workers are scripts that run in the background, enabling offline functionality and advanced caching.

**Caching strategies**:

- **Cache First**: Serve from cache, fallback to network (good for static assets)
- **Network First**: Try network, fallback to cache (good for dynamic content)
- **Stale While Revalidate**: Serve cached version immediately, update cache from network
- **Cache Only**: Only serve cached content
- **Network Only**: Always fetch from network

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### CORS, Preflight Requests, and SameSite Cookies

**CORS (Cross-Origin Resource Sharing)**: Security mechanism that allows servers to specify which origins can access their resources.

**Preflight requests**: OPTIONS requests sent before actual requests for cross-origin requests that modify data or use custom headers.

**SameSite cookies**: Control when cookies are sent with cross-site requests.

- `Strict`: Never sent with cross-site requests
- `Lax`: Sent with top-level navigations (default)
- `None`: Sent with all requests (requires Secure flag)

```javascript
// Server sets CORS headers
res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

// Cookie with SameSite
document.cookie = 'session=abc; SameSite=Lax; Secure';
```

### Web Storage APIs

**localStorage**: Persistent storage (~5-10MB), synchronous, never expires.
**sessionStorage**: Tab-specific, cleared when tab closes.
**Cookies**: Sent with every request (~4KB), can set expiration.

**Use cases**:

- localStorage: User preferences, cached data
- sessionStorage: Form data, temporary state
- Cookies: Authentication tokens (with httpOnly and Secure flags)

**Limitations**: Synchronous (blocks main thread), no worker access, storage limits.

### Accessibility Best Practices

**ARIA roles**: Semantic information for screen readers when HTML isn't sufficient.

```html
<div role="button" tabindex="0">Click me</div>
```

**Focus management**: Ensure keyboard navigation works, visible focus indicators.

```javascript
element.focus();
element.setAttribute('tabindex', '0');
```

**Semantic HTML**: Use proper elements (`<button>`, `<nav>`, `<main>`, `<header>`).

```html
<button>Submit</button>
<!-- Not <div onclick="submit()"> -->
```

Other practices: Alt text for images, sufficient color contrast (4.5:1), captions for videos, keyboard-accessible interactions.

### Responsive Design Principles

**Mobile-first**: Start with mobile styles, add complexity for larger screens.

```css
/* Mobile styles */
.container {
  width: 100%;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
```

**Media queries**: Apply styles based on device characteristics.

```css
@media (max-width: 768px) {
  /* mobile */
}
@media (min-width: 769px) and (max-width: 1024px) {
  /* tablet */
}
```

**Viewport units**: Relative to viewport size (vw, vh, vmin, vmax).

```css
.hero {
  height: 100vh;
  width: 100vw;
}
```

**Flexible layouts**: Use flexbox, grid, and percentage-based widths instead of fixed pixels.

---
