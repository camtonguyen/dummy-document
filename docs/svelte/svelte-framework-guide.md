# Svelte Framework: Comprehensive Concepts Guide

## What is Svelte?

**Svelte** is a radical new approach to building user interfaces. Unlike React or Vue which do most of their work in the browser, Svelte shifts that work into a compile step that happens at build time. It's a compiler, not a framework with a runtime.

**Created by:** Rich Harris  
**First Release:** 2016  
**Latest Version:** Svelte 5 (2024)

### Key Differentiator
- **No Virtual DOM** - compiles to highly efficient imperative code
- **No Runtime** - ships pure vanilla JavaScript
- **Truly Reactive** - reactivity built into the language
- **Less Code** - write significantly less code than other frameworks

---

## 1. Basic Component Structure

Svelte components use `.svelte` files with three sections:

```svelte
<script>
  // JavaScript logic
  let name = 'World';
  let count = 0;
  
  function increment() {
    count += 1;
  }
</script>

<style>
  /* Component-scoped CSS */
  h1 {
    color: purple;
  }
</style>

<!-- HTML Template -->
<h1>Hello {name}!</h1>
<button on:click={increment}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
```

**Key Points:**
- No className or JSX syntax
- Styles are scoped by default
- Logic, styles, and markup in one file
- Reactive by default

---

## 2. Reactivity

### Reactive Declarations

Svelte's reactivity is built into the language itself using `$:` label syntax.

```svelte
<script>
  let count = 0;
  
  // Reactive declaration - automatically updates when count changes
  $: doubled = count * 2;
  
  // Reactive statement - runs whenever count changes
  $: if (count >= 10) {
    alert('Count is getting high!');
  }
  
  // Reactive block
  $: {
    console.log(`Count is ${count}`);
    console.log(`Doubled is ${doubled}`);
  }
</script>

<p>{count} doubled is {doubled}</p>
<button on:click={() => count += 1}>Increment</button>
```

**How it works:**
- Svelte analyzes your code at compile time
- Creates efficient update code
- No need for `setState`, `useState`, or observables
- Just reassign variables: `count = count + 1` or `count += 1`

---

## 3. Props (Component Communication)

### Parent to Child

```svelte
<!-- Child.svelte -->
<script>
  // Declare props with 'export'
  export let name;
  export let age = 25; // Default value
</script>

<p>{name} is {age} years old</p>

<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
</script>

<Child name="Alice" age={30} />
<Child name="Bob" /> <!-- Uses default age -->
```

### Props Destructuring and Spread

```svelte
<script>
  export let { name, age, email } = $props(); // Svelte 5 runes
  
  // Or traditional way
  export let name;
  export let age;
  export let email;
</script>

<!-- Using spread -->
<Child {...userData} />
```

---

## 4. Events

### Built-in Events

```svelte
<script>
  let count = 0;
  
  function handleClick() {
    count += 1;
  }
  
  function handleMouseover(event) {
    console.log('Mouse at:', event.clientX, event.clientY);
  }
</script>

<!-- Event handlers -->
<button on:click={handleClick}>Click me</button>
<button on:click={() => count += 1}>Inline handler</button>
<div on:mouseover={handleMouseover}>Hover me</div>

<!-- Event modifiers -->
<button on:click|once={handleClick}>Click once</button>
<form on:submit|preventDefault={handleSubmit}>
  <button type="submit">Submit</button>
</form>
```

**Event Modifiers:**
- `preventDefault` - calls event.preventDefault()
- `stopPropagation` - calls event.stopPropagation()
- `passive` - improves scrolling performance
- `capture` - fires in capture phase
- `once` - remove handler after first run
- `self` - only trigger if event.target is element itself
- `trusted` - only trigger if event is trusted

### Custom Events (Component Events)

```svelte
<!-- Child.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function sayHello() {
    dispatch('message', {
      text: 'Hello from child!'
    });
  }
</script>

<button on:click={sayHello}>Send Message</button>

<!-- Parent.svelte -->
<script>
  function handleMessage(event) {
    console.log(event.detail.text);
  }
</script>

<Child on:message={handleMessage} />
```

---

## 5. Bindings

Svelte provides powerful two-way binding with `bind:`.

### Input Bindings

```svelte
<script>
  let name = '';
  let agreed = false;
  let flavor = 'vanilla';
  let colors = [];
</script>

<!-- Text input -->
<input bind:value={name}>
<p>Hello {name}!</p>

<!-- Checkbox -->
<label>
  <input type="checkbox" bind:checked={agreed}>
  I agree to terms
</label>

<!-- Radio buttons -->
<label>
  <input type="radio" bind:group={flavor} value="vanilla">
  Vanilla
</label>
<label>
  <input type="radio" bind:group={flavor} value="chocolate">
  Chocolate
</label>

<!-- Select multiple -->
<select multiple bind:value={colors}>
  <option value="red">Red</option>
  <option value="blue">Blue</option>
  <option value="green">Green</option>
</select>
```

### Component Bindings

```svelte
<!-- Child.svelte -->
<script>
  export let value = 0;
</script>

<button on:click={() => value += 1}>
  Increment
</button>

<!-- Parent.svelte -->
<script>
  let count = 0;
</script>

<Child bind:value={count} />
<p>Count in parent: {count}</p>
```

### Element Bindings

```svelte
<script>
  let div;
  let width;
  
  $: if (div) {
    console.log('Div element:', div);
  }
</script>

<div bind:this={div} bind:clientWidth={width}>
  This div is {width}px wide
</div>
```

---

## 6. Conditional Rendering

```svelte
<script>
  let user = { loggedIn: false, name: 'Guest' };
  let count = 5;
</script>

<!-- if/else -->
{#if user.loggedIn}
  <p>Welcome back, {user.name}!</p>
{:else}
  <p>Please log in</p>
{/if}

<!-- else if -->
{#if count > 10}
  <p>High count</p>
{:else if count > 5}
  <p>Medium count</p>
{:else}
  <p>Low count</p>
{/if}
```

---

## 7. Lists and Loops

```svelte
<script>
  let items = [
    { id: 1, name: 'Apple', color: 'red' },
    { id: 2, name: 'Banana', color: 'yellow' },
    { id: 3, name: 'Orange', color: 'orange' }
  ];
</script>

<!-- Basic each -->
<ul>
  {#each items as item}
    <li>{item.name} - {item.color}</li>
  {/each}
</ul>

<!-- With index -->
{#each items as item, index}
  <p>{index + 1}: {item.name}</p>
{/each}

<!-- With key (important for performance) -->
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}

<!-- With destructuring -->
{#each items as { id, name, color }}
  <p>{name} is {color}</p>
{/each}

<!-- With else (when array is empty) -->
{#each items as item}
  <p>{item.name}</p>
{:else}
  <p>No items found</p>
{/each}
```

---

## 8. Lifecycle Hooks

```svelte
<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
  
  let photos = [];
  let timer;
  
  // Runs after component is first rendered to DOM
  onMount(async () => {
    console.log('Component mounted');
    const res = await fetch('/api/photos');
    photos = await res.json();
    
    // Return cleanup function
    return () => {
      console.log('Cleanup from onMount');
    };
  });
  
  // Runs before component is destroyed
  onDestroy(() => {
    console.log('Component destroyed');
    clearInterval(timer);
  });
  
  // Runs before DOM is updated
  beforeUpdate(() => {
    console.log('About to update');
  });
  
  // Runs after DOM is updated
  afterUpdate(() => {
    console.log('DOM updated');
  });
</script>
```

**Lifecycle Order:**
1. Component script runs
2. `beforeUpdate` (if not first render)
3. DOM updates
4. `onMount` (first render only)
5. `afterUpdate`
6. `onDestroy` (when removed)

---

## 9. Stores (State Management)

Svelte has built-in state management with stores.

### Writable Store

```svelte
<!-- store.js -->
import { writable } from 'svelte/store';

export const count = writable(0);
export const user = writable({ name: 'Guest', loggedIn: false });

<!-- Component.svelte -->
<script>
  import { count } from './store.js';
  
  // Subscribe manually
  let countValue;
  const unsubscribe = count.subscribe(value => {
    countValue = value;
  });
  
  // Auto-subscribe with $ prefix
  // Automatically unsubscribes when component is destroyed
  import { count } from './store.js';
</script>

<h1>Count: {$count}</h1>
<button on:click={() => $count += 1}>Increment</button>
<button on:click={() => count.set(0)}>Reset</button>
<button on:click={() => count.update(n => n + 10)}>Add 10</button>
```

### Readable Store

```svelte
<!-- store.js -->
import { readable } from 'svelte/store';

export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  return function stop() {
    clearInterval(interval);
  };
});

<!-- Component.svelte -->
<script>
  import { time } from './store.js';
</script>

<p>Current time: {$time.toLocaleTimeString()}</p>
```

### Derived Store

```svelte
<!-- store.js -->
import { writable, derived } from 'svelte/store';

export const count = writable(0);

export const doubled = derived(count, $count => $count * 2);

export const sum = derived(
  [count, doubled],
  ([$count, $doubled]) => $count + $doubled
);

<!-- Component.svelte -->
<script>
  import { count, doubled, sum } from './store.js';
</script>

<p>Count: {$count}</p>
<p>Doubled: {$doubled}</p>
<p>Sum: {$sum}</p>
```

### Custom Store

```svelte
<!-- store.js -->
import { writable } from 'svelte/store';

function createCounter() {
  const { subscribe, set, update } = writable(0);
  
  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(0)
  };
}

export const counter = createCounter();

<!-- Component.svelte -->
<script>
  import { counter } from './store.js';
</script>

<h1>{$counter}</h1>
<button on:click={counter.increment}>+</button>
<button on:click={counter.decrement}>-</button>
<button on:click={counter.reset}>Reset</button>
```

---

## 10. Slots (Content Projection)

```svelte
<!-- Card.svelte -->
<div class="card">
  <header>
    <slot name="header">
      Default header
    </slot>
  </header>
  
  <main>
    <slot>
      <!-- Default content -->
      No content provided
    </slot>
  </main>
  
  <footer>
    <slot name="footer" />
  </footer>
</div>

<!-- App.svelte -->
<Card>
  <h1 slot="header">Card Title</h1>
  
  <p>This is the main content</p>
  <p>Multiple elements work!</p>
  
  <div slot="footer">
    <button>Action</button>
  </div>
</Card>
```

### Slot Props

```svelte
<!-- List.svelte -->
<script>
  export let items;
</script>

<ul>
  {#each items as item}
    <li>
      <slot item={item}>
        {item.name}
      </slot>
    </li>
  {/each}
</ul>

<!-- App.svelte -->
<List items={users} let:item>
  <strong>{item.name}</strong> - {item.email}
</List>
```

---

## 11. Transitions and Animations

### Built-in Transitions

```svelte
<script>
  import { fade, fly, slide, scale, blur } from 'svelte/transition';
  let visible = true;
</script>

<button on:click={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:fade>Fades in and out</div>
  <div transition:fly={{ y: 200, duration: 500 }}>Flies in</div>
  <div transition:slide>Slides in</div>
  <div transition:scale>Scales in</div>
{/if}

<!-- Separate in/out transitions -->
{#if visible}
  <div in:fly={{ x: -200 }} out:fade>
    Flies in from left, fades out
  </div>
{/if}
```

### Custom Transitions

```svelte
<script>
  function typewriter(node, { speed = 1 }) {
    const valid = node.childNodes.length === 1 && 
                  node.childNodes[0].nodeType === Node.TEXT_NODE;
    
    if (!valid) return {};
    
    const text = node.textContent;
    const duration = text.length / (speed * 0.01);
    
    return {
      duration,
      tick: t => {
        const i = Math.trunc(text.length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }
</script>

{#if visible}
  <p transition:typewriter={{ speed: 1 }}>
    This text types out character by character
  </p>
{/if}
```

### Animations

```svelte
<script>
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  
  let items = [1, 2, 3, 4, 5];
  
  function shuffle() {
    items = items.sort(() => Math.random() - 0.5);
  }
</script>

<button on:click={shuffle}>Shuffle</button>

<div>
  {#each items as item (item)}
    <div animate:flip={{ duration: 500, easing: quintOut }}>
      {item}
    </div>
  {/each}
</div>
```

---

## 12. Actions (Element Directives)

Actions allow you to run code when an element is created.

```svelte
<script>
  function clickOutside(node) {
    const handleClick = event => {
      if (!node.contains(event.target)) {
        node.dispatchEvent(new CustomEvent('outclick'));
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
  
  function tooltip(node, text) {
    let tooltipElement;
    
    function mouseOver() {
      tooltipElement = document.createElement('div');
      tooltipElement.textContent = text;
      tooltipElement.style.cssText = `
        position: absolute;
        background: black;
        color: white;
        padding: 5px;
      `;
      document.body.appendChild(tooltipElement);
    }
    
    function mouseOut() {
      tooltipElement?.remove();
    }
    
    node.addEventListener('mouseover', mouseOver);
    node.addEventListener('mouseout', mouseOut);
    
    return {
      update(newText) {
        text = newText;
      },
      destroy() {
        node.removeEventListener('mouseover', mouseOver);
        node.removeEventListener('mouseout', mouseOut);
      }
    };
  }
  
  let showModal = false;
  let tooltipText = 'Hover over me';
</script>

<div 
  class="modal" 
  use:clickOutside 
  on:outclick={() => showModal = false}
>
  Modal content
</div>

<button use:tooltip={tooltipText}>
  Button with tooltip
</button>
```

---

## 13. Context API

For passing data through component tree without props drilling.

```svelte
<!-- Parent.svelte -->
<script>
  import { setContext } from 'svelte';
  import Child from './Child.svelte';
  
  const theme = {
    color: 'purple',
    size: 'large'
  };
  
  setContext('theme', theme);
</script>

<Child />

<!-- Child.svelte -->
<script>
  import { getContext } from 'svelte';
  
  const theme = getContext('theme');
</script>

<p style="color: {theme.color}">
  Themed content
</p>

<!-- With store for reactivity -->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  const theme = writable({ color: 'purple' });
  setContext('theme', theme);
</script>

<!-- In child -->
<script>
  import { getContext } from 'svelte';
  
  const theme = getContext('theme');
</script>

<p style="color: {$theme.color}">Reactive themed content</p>
```

---

## 14. Await Blocks

Handle promises directly in markup.

```svelte
<script>
  async function getUser(id) {
    const res = await fetch(`/api/users/${id}`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Failed to load user');
  }
  
  let userPromise = getUser(1);
</script>

{#await userPromise}
  <p>Loading user...</p>
{:then user}
  <p>Welcome {user.name}!</p>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<!-- Short version (no loading state) -->
{#await userPromise then user}
  <p>Welcome {user.name}!</p>
{/await}
```

---

## 15. Component Composition Patterns

### Higher-Order Components Pattern

```svelte
<!-- withAuth.svelte -->
<script>
  export let component;
  export let user;
</script>

{#if user.isAuthenticated}
  <svelte:component this={component} {user} />
{:else}
  <p>Please log in</p>
{/if}

<!-- Usage -->
<script>
  import WithAuth from './withAuth.svelte';
  import Dashboard from './Dashboard.svelte';
  
  let user = { isAuthenticated: true, name: 'Alice' };
</script>

<WithAuth component={Dashboard} {user} />
```

### Render Props Pattern

```svelte
<!-- DataProvider.svelte -->
<script>
  export let url;
  
  let data = null;
  let loading = true;
  let error = null;
  
  async function loadData() {
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
  
  loadData();
</script>

<slot {data} {loading} {error} />

<!-- Usage -->
<DataProvider url="/api/users" let:data let:loading let:error>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <ul>
      {#each data as user}
        <li>{user.name}</li>
      {/each}
    </ul>
  {/if}
</DataProvider>
```

---

## 16. Special Elements

### `<svelte:self>`
Recursively render component.

```svelte
<!-- Tree.svelte -->
<script>
  export let node;
</script>

<div>
  {node.name}
  {#if node.children}
    <ul>
      {#each node.children as child}
        <li>
          <svelte:self node={child} />
        </li>
      {/each}
    </ul>
  {/if}
</div>
```

### `<svelte:component>`
Dynamic component rendering.

```svelte
<script>
  import ComponentA from './ComponentA.svelte';
  import ComponentB from './ComponentB.svelte';
  
  let selected = ComponentA;
</script>

<svelte:component this={selected} someProp="value" />

<button on:click={() => selected = ComponentA}>A</button>
<button on:click={() => selected = ComponentB}>B</button>
```

### `<svelte:window>`
Listen to window events.

```svelte
<script>
  let scrollY = 0;
  let innerWidth = 0;
  
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      alert('Escape pressed!');
    }
  }
</script>

<svelte:window 
  bind:scrollY 
  bind:innerWidth
  on:keydown={handleKeydown}
/>

<p>Scroll position: {scrollY}</p>
<p>Window width: {innerWidth}</p>
```

### `<svelte:body>` and `<svelte:document>`

```svelte
<script>
  function handleMousemove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
</script>

<svelte:body on:mousemove={handleMousemove} />
<svelte:document on:visibilitychange={handleVisibility} />
```

### `<svelte:head>`
Add elements to document head.

```svelte
<svelte:head>
  <title>My Page Title</title>
  <meta name="description" content="Page description">
  <link rel="stylesheet" href="/styles.css">
</svelte:head>
```

---

## 17. SvelteKit (Full-Stack Framework)

SvelteKit is to Svelte what Next.js is to React.

### File-Based Routing

```
src/routes/
├── +page.svelte          # / route
├── about/
│   └── +page.svelte      # /about route
├── blog/
│   ├── +page.svelte      # /blog route
│   └── [slug]/
│       └── +page.svelte  # /blog/:slug route
└── api/
    └── users/
        └── +server.js    # API endpoint
```

### Page Load Function

```svelte
<!-- +page.js -->
export async function load({ params, fetch }) {
  const res = await fetch(`/api/posts/${params.slug}`);
  const post = await res.json();
  
  return {
    post
  };
}

<!-- +page.svelte -->
<script>
  export let data;
</script>

<h1>{data.post.title}</h1>
<p>{data.post.content}</p>
```

### Server-Side Rendering

```javascript
// +page.server.js
export async function load() {
  // Runs only on server
  const posts = await db.getPosts();
  
  return {
    posts
  };
}
```

### API Routes

```javascript
// src/routes/api/users/+server.js
import { json } from '@sveltejs/kit';

export async function GET() {
  const users = await db.getUsers();
  return json(users);
}

export async function POST({ request }) {
  const data = await request.json();
  const user = await db.createUser(data);
  return json(user, { status: 201 });
}
```

---

## 18. Svelte 5 Runes (New in 2024)

Svelte 5 introduces "runes" - a new syntax for reactivity.

### `$state` Rune

```svelte
<script>
  let count = $state(0);
  
  let user = $state({
    name: 'Alice',
    age: 30
  });
</script>

<button on:click={() => count++}>
  Clicks: {count}
</button>
```

### `$derived` Rune

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  let quadrupled = $derived(doubled * 2);
</script>

<p>{count} × 2 = {doubled}</p>
<p>{count} × 4 = {quadrupled}</p>
```

### `$effect` Rune

```svelte
<script>
  let count = $state(0);
  
  $effect(() => {
    console.log(`Count is now ${count}`);
    
    // Cleanup function
    return () => {
      console.log('Cleaning up');
    };
  });
</script>
```

### `$props` Rune

```svelte
<script>
  let { name, age = 25 } = $props();
</script>

<p>{name} is {age} years old</p>
```

---

## 19. Performance Tips

1. **Use `{#key}` for re-rendering**
```svelte
{#key value}
  <Component />
{/key}
```

2. **Immutable data updates**
```svelte
// Good
items = [...items, newItem];

// Avoid
items.push(newItem);
items = items;
```

3. **Use `<svelte:options>`**
```svelte
<svelte:options immutable={true} />
```

4. **Lazy load components**
```svelte
<script>
  const LazyComponent = () => import('./Heavy.svelte');
</script>

{#await LazyComponent() then Component}
  <svelte:component this={Component.default} />
{/await}
```

---

## 20. Comparison with Other Frameworks

| Feature | Svelte | React | Vue | Angular |
|---------|--------|-------|-----|---------|
| **Type** | Compiler | Library | Framework | Framework |
| **Bundle Size** | ⭐⭐⭐⭐⭐ Smallest | ⭐⭐⭐ Medium | ⭐⭐⭐⭐ Small | ⭐⭐ Large |
| **Performance** | ⭐⭐⭐⭐⭐ Fastest | ⭐⭐⭐⭐ Fast | ⭐⭐⭐⭐ Fast | ⭐⭐⭐ Good |
| **Learning Curve** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Easy | ⭐⭐ Hard |
| **Code Amount** | ⭐⭐⭐⭐⭐ Least | ⭐⭐⭐ More | ⭐⭐⭐⭐ Less | ⭐⭐ Most |
| **Reactivity** | Built-in | Hooks | Refs | RxJS |
| **Runtime** | None | Yes | Yes | Yes |

---

## Key Advantages of Svelte

✅ **Less Code** - Write 30-40% less code than React  
✅ **No Virtual DOM** - Compiles to efficient vanilla JS  
✅ **True Reactivity** - Built into the language  
✅ **Scoped Styles** - CSS scoped by default  
✅ **Small Bundle** - No runtime = smaller apps  
✅ **Great DX** - Easy to learn and use  
✅ **Built-in Animations** - Transitions out of the box  
✅ **Fast** - One of the fastest frameworks

---

## Quick Start

```bash
# Create new SvelteKit app
npm create svelte@latest my-app
cd my-app
npm install
npm run dev

# Or vanilla Svelte with Vite
npm create vite@latest my-app -- --template svelte
cd my-app
npm install
npm run dev
```

---

## Resources

- **Official Site:** https://svelte.dev
- **Tutorial:** https://learn.svelte.dev
- **SvelteKit Docs:** https://kit.svelte.dev
- **REPL:** https://svelte.dev/repl
- **Discord:** https://svelte.dev/chat
- **GitHub:** https://github.com/sveltejs/svelte

---

## Conclusion

**Svelte** represents a paradigm shift in web development. By moving work from the browser to the build step, it delivers:
- Faster runtime performance
- Smaller bundle sizes
- Simpler code
- Better developer experience

Perfect for projects where performance and bundle size matter, or when you want to write less code and get more done. With SvelteKit, it's also a complete full-stack solution comparable to Next.js.

**Best for:** SPAs, static sites, progressive web apps, and any project where performance and bundle size are priorities.
