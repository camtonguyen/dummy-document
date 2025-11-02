# 100 Most Popular React Interview Questions

## Table of Contents
1. [Fundamentals (1-25)](#fundamentals)
2. [Components & Props (26-40)](#components-and-props)
3. [State & Lifecycle (41-55)](#state-and-lifecycle)
4. [Hooks (56-70)](#hooks)
5. [Advanced Concepts (71-85)](#advanced-concepts)
6. [Performance & Optimization (86-95)](#performance-and-optimization)
7. [Testing & Best Practices (96-100)](#testing-and-best-practices)

---

## Fundamentals (1-25)

### 1. What is React?
**Answer:** React is an open-source JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and manage the application state efficiently.

**Core Concept:** Component-based architecture, declarative programming
**Tip:** Emphasize React's virtual DOM and its efficiency in updating the UI

### 2. What are the main features of React?
**Answer:**
- JSX (JavaScript XML)
- Virtual DOM
- Component-based architecture
- Unidirectional data flow
- Reusability and composability
- Strong community and ecosystem

**Tip:** Mention how these features contribute to better performance and developer experience

### 3. What is JSX?
**Answer:** JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code in JavaScript files. JSX gets compiled to regular JavaScript function calls.

```javascript
const element = <h1>Hello, World!</h1>;
// Compiles to:
const element = React.createElement('h1', null, 'Hello, World!');
```

**Tip:** JSX is not mandatory but is widely used and recommended

### 4. What is the Virtual DOM?
**Answer:** The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a virtual DOM tree in memory. When state changes, React creates a new virtual DOM tree, compares it with the previous one (diffing), and updates only the changed parts in the real DOM.

**Core Concept:** Reconciliation process
**Tip:** Explain how this improves performance compared to direct DOM manipulation

### 5. What is the difference between Real DOM and Virtual DOM?
**Answer:**

| Real DOM | Virtual DOM |
|----------|-------------|
| Updates are slow | Updates are fast |
| Directly updates HTML | Creates a copy and updates changes |
| Creates a new DOM if element updates | Updates JSX if element updates |
| Memory wastage is high | No memory wastage |
| Can't update directly | Can update directly |

**Tip:** Use this to explain React's performance advantages

### 6. What are React components?
**Answer:** Components are independent, reusable pieces of UI that split the interface into independent pieces. They accept inputs (props) and return React elements describing what should appear on the screen.

**Types:**
- Functional Components
- Class Components

**Tip:** Modern React favors functional components with hooks

### 7. What is the difference between Functional and Class components?
**Answer:**

**Functional Components:**
```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**Class Components:**
```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**Key Differences:**
- Functional: Simpler, use hooks for state/lifecycle
- Class: More verbose, use lifecycle methods
- Functional components are now preferred

**Tip:** Mention that functional components with hooks can do everything class components can

### 8. What are Props in React?
**Answer:** Props (properties) are read-only inputs passed from parent to child components. They enable component reusability and data flow in a React application.

```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

<Greeting name="John" />
```

**Core Concept:** Unidirectional data flow
**Tip:** Props are immutable within the receiving component

### 9. What is State in React?
**Answer:** State is a built-in object that stores component-specific data that can change over time. When state changes, the component re-renders.

```javascript
const [count, setCount] = useState(0);
```

**Tip:** State changes trigger re-renders; use state for dynamic data

### 10. What is the difference between State and Props?
**Answer:**

| Props | State |
|-------|-------|
| Passed from parent | Managed within component |
| Immutable | Mutable (via setState/useState) |
| Used to pass data | Used to manage data |
| Accessed via this.props or props | Accessed via this.state or useState |

**Tip:** "Props flow down, events flow up"

### 11. What are keys in React?
**Answer:** Keys are special string attributes that help React identify which items in a list have changed, been added, or removed. Keys should be unique among siblings.

```javascript
const listItems = items.map((item) =>
  <li key={item.id}>{item.text}</li>
);
```

**Tip:** Never use array index as key in dynamic lists; it can cause issues with component state

### 12. What is the significance of keys in lists?
**Answer:** Keys help React optimize rendering by identifying which items have changed. Without proper keys, React may re-render all items unnecessarily or maintain incorrect component state.

**Best Practices:**
- Use stable, unique identifiers (like database IDs)
- Don't use array indices for dynamic lists
- Keys must be unique among siblings

**Tip:** Poor key choice can lead to bugs and performance issues

### 13. What are Synthetic Events in React?
**Answer:** Synthetic Events are React's cross-browser wrapper around native browser events. They provide a consistent API across different browsers.

```javascript
function handleClick(event) {
  // event is a SyntheticEvent
  event.preventDefault();
  console.log(event.type);
}
```

**Tip:** Synthetic events are pooled for performance; access properties synchronously

### 14. What is event handling in React?
**Answer:** Event handling in React is similar to DOM events but with camelCase naming and passing functions as handlers.

```javascript
<button onClick={handleClick}>Click me</button>
```

**Important differences from HTML:**
- Use camelCase (onClick vs onclick)
- Pass function reference, not string
- Use preventDefault() explicitly

**Tip:** Bind methods or use arrow functions to preserve `this` context

### 15. How do you pass data from child to parent component?
**Answer:** Pass a callback function from parent to child via props. The child calls this function with data.

```javascript
// Parent
function Parent() {
  const handleData = (data) => console.log(data);
  return <Child onData={handleData} />;
}

// Child
function Child({ onData }) {
  return <button onClick={() => onData('Hello')}>Send</button>;
}
```

**Tip:** This maintains unidirectional data flow while enabling communication

### 16. What is lifting state up?
**Answer:** Lifting state up means moving state to the closest common ancestor when multiple components need to share the same state. This maintains a single source of truth.

**Example:** Two sibling components needing shared state should have that state in their parent.

**Tip:** This is a key pattern for managing shared state in React

### 17. What are controlled and uncontrolled components?
**Answer:**

**Controlled Components:**
```javascript
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />
```
State is controlled by React.

**Uncontrolled Components:**
```javascript
const inputRef = useRef();
<input ref={inputRef} />
// Access via inputRef.current.value
```
State is controlled by the DOM.

**Tip:** Prefer controlled components for better control and validation

### 18. What are Refs in React?
**Answer:** Refs provide a way to access DOM nodes or React elements directly. They're useful for managing focus, text selection, or triggering animations.

```javascript
const inputRef = useRef(null);
inputRef.current.focus();

<input ref={inputRef} />
```

**Tip:** Use refs sparingly; prefer declarative approaches when possible

### 19. When should you use Refs?
**Answer:** Use refs for:
- Managing focus, text selection
- Triggering imperative animations
- Integrating with third-party DOM libraries
- Accessing DOM measurements

**Tip:** Don't use refs for things that can be done declaratively

### 20. What is React Fragment?
**Answer:** Fragments let you group multiple children without adding extra DOM nodes.

```javascript
<React.Fragment>
  <ChildA />
  <ChildB />
</React.Fragment>

// Shorthand
<>
  <ChildA />
  <ChildB />
</>
```

**Tip:** Use fragments to avoid unnecessary wrapper divs

### 21. What is prop drilling?
**Answer:** Prop drilling is passing props through multiple levels of components to reach a deeply nested child component.

**Problem:** Makes code hard to maintain and refactor.

**Solutions:**
- Context API
- State management libraries (Redux, Zustand)
- Component composition

**Tip:** If drilling more than 2-3 levels, consider alternatives

### 22. What is the children prop?
**Answer:** `children` is a special prop that contains the content between component's opening and closing tags.

```javascript
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h1>Title</h1>
  <p>Content</p>
</Card>
```

**Tip:** Great for wrapper components and composition

### 23. What is the difference between createElement and cloneElement?
**Answer:**

**createElement:** Creates a new React element
```javascript
React.createElement('div', { className: 'container' }, 'Hello');
```

**cloneElement:** Clones an existing element and modifies props
```javascript
React.cloneElement(element, { newProp: 'value' });
```

**Tip:** cloneElement is useful when wrapping/modifying children

### 24. What are Higher-Order Components (HOC)?
**Answer:** HOCs are functions that take a component and return a new component with additional props or functionality.

```javascript
function withLogger(Component) {
  return function EnhancedComponent(props) {
    console.log('Rendering with props:', props);
    return <Component {...props} />;
  };
}
```

**Tip:** Hooks have largely replaced HOCs for code reuse

### 25. What is conditional rendering?
**Answer:** Rendering different UI based on conditions.

**Methods:**
```javascript
// If statement
if (isLoggedIn) return <UserPanel />;
return <LoginForm />;

// Ternary operator
{isLoggedIn ? <UserPanel /> : <LoginForm />}

// Logical AND
{isLoggedIn && <UserPanel />}

// Null for no render
{!isVisible && null}
```

**Tip:** Choose the method based on readability for your specific case

---

## Components & Props (26-40)

### 26. What are Pure Components?
**Answer:** Pure Components are components that only re-render when their props or state actually change. They implement a shallow comparison of props and state.

```javascript
class MyComponent extends React.PureComponent {
  // Automatically does shallow comparison
}

// Functional equivalent
const MyComponent = React.memo(function MyComponent(props) {
  // Component logic
});
```

**Tip:** Use for performance optimization, but ensure props are immutable

### 27. What is React.memo()?
**Answer:** React.memo() is a higher-order component that memoizes functional components, preventing unnecessary re-renders when props haven't changed.

```javascript
const MyComponent = React.memo(function MyComponent({ name }) {
  return <div>{name}</div>;
});

// With custom comparison
const MyComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
```

**Tip:** Use when component renders often with same props

### 28. What is the difference between Component and PureComponent?
**Answer:**

| Component | PureComponent |
|-----------|---------------|
| Always re-renders when parent re-renders | Shallow compares props/state before re-rendering |
| Needs manual shouldComponentUpdate | Has built-in shouldComponentUpdate |
| Suitable for complex state | Best for simple props/state |

**Tip:** PureComponent can improve performance but may cause bugs with mutable data

### 29. How do you pass multiple props efficiently?
**Answer:** Use the spread operator to pass all props at once.

```javascript
const props = { name: 'John', age: 30, city: 'NYC' };

// Instead of
<Component name={props.name} age={props.age} city={props.city} />

// Use
<Component {...props} />
```

**Tip:** Combine with explicit props for override capability

### 30. What are default props?
**Answer:** Default props define fallback values when props aren't provided.

```javascript
// Functional component
function Button({ text = 'Click me', onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

// Class component
class Button extends React.Component {
  static defaultProps = {
    text: 'Click me'
  };
}
```

**Tip:** Essential for component robustness and API clarity

### 31. What is prop validation (PropTypes)?
**Answer:** PropTypes provide type checking for component props.

```javascript
import PropTypes from 'prop-types';

function User({ name, age, email }) {
  return <div>{name}</div>;
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string.isRequired
};
```

**Tip:** Use TypeScript for better type safety in production apps

### 32. How do you destructure props?
**Answer:** Extract specific props from the props object.

```javascript
// In function parameters
function User({ name, age }) {
  return <div>{name} is {age}</div>;
}

// In function body
function User(props) {
  const { name, age } = props;
  return <div>{name} is {age}</div>;
}
```

**Tip:** Makes code cleaner and more readable

### 33. What is component composition?
**Answer:** Building complex UIs by combining simpler components rather than using inheritance.

```javascript
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <h1>{title}</h1>
      <div className="content">{children}</div>
    </div>
  );
}

function WelcomeDialog() {
  return (
    <Dialog title="Welcome">
      <p>Thank you for visiting!</p>
    </Dialog>
  );
}
```

**Tip:** Prefer composition over inheritance in React

### 34. What are render props?
**Answer:** A technique for sharing code between components using a prop whose value is a function.

```javascript
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
```

**Tip:** Hooks have largely replaced this pattern

### 35. What is the difference between render props and HOC?
**Answer:**

**Render Props:**
- Runtime composition
- More explicit
- Better TypeScript support
- Can lead to nested callbacks

**HOC:**
- Wraps component at definition time
- Can cause prop name collisions
- Less explicit data flow

**Tip:** Modern React prefers hooks over both patterns

### 36. How do you prevent component re-renders?
**Answer:**

1. Use React.memo() for functional components
2. Use PureComponent for class components
3. Implement shouldComponentUpdate()
4. Use useMemo() and useCallback() hooks
5. Split components to isolate state changes

**Tip:** Profile before optimizing; premature optimization wastes time

### 37. What is the difference between props.children and props.render?
**Answer:**

**props.children:**
```javascript
<Layout>
  <Content />
</Layout>
```
Static content passed between tags.

**props.render:**
```javascript
<Layout render={(data) => <Content data={data} />} />
```
Dynamic content generation with access to parent's data.

**Tip:** children is simpler; render props offer more control

### 38. How do you pass data through nested components?
**Answer:**

**Methods:**
1. Props (for shallow nesting)
2. Context API (for deep nesting)
3. State management (Redux, Zustand)
4. Component composition

**Tip:** Choose based on nesting depth and update frequency

### 39. What are stateless components?
**Answer:** Components that don't manage their own state, only receiving props and rendering UI.

```javascript
function Header({ title }) {
  return <h1>{title}</h1>;
}
```

**Benefits:**
- Simpler to test
- More reusable
- Better performance

**Tip:** Prefer stateless components when possible

### 40. What is the purpose of displayName?
**Answer:** A string property used in debugging messages to identify components.

```javascript
const MyComponent = React.memo(function MyComponent() {
  return <div>Hello</div>;
});
MyComponent.displayName = 'MyComponent';
```

**Tip:** Most build tools set this automatically; useful for HOCs

---

## State & Lifecycle (41-55)

### 41. What are lifecycle methods in React?
**Answer:** Methods that get called at specific stages of a component's existence.

**Mounting:**
- constructor()
- static getDerivedStateFromProps()
- render()
- componentDidMount()

**Updating:**
- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

**Unmounting:**
- componentWillUnmount()

**Tip:** Functional components use hooks (useEffect) instead

### 42. What is componentDidMount()?
**Answer:** Lifecycle method called after component is mounted (inserted into the DOM). Perfect for:
- API calls
- DOM manipulations
- Setting up subscriptions
- Initializing timers

```javascript
class MyComponent extends React.Component {
  componentDidMount() {
    fetchData().then(data => this.setState({ data }));
  }
}

// Functional equivalent
useEffect(() => {
  fetchData().then(setData);
}, []);
```

**Tip:** In useEffect, empty dependency array mimics componentDidMount

### 43. What is componentWillUnmount()?
**Answer:** Called right before component is unmounted and destroyed. Used for cleanup:
- Cancel network requests
- Remove event listeners
- Clear timers
- Unsubscribe from subscriptions

```javascript
componentWillUnmount() {
  clearInterval(this.timer);
  this.subscription.unsubscribe();
}

// Functional equivalent
useEffect(() => {
  return () => {
    // Cleanup code
  };
}, []);
```

**Tip:** Always clean up to prevent memory leaks

### 44. What is componentDidUpdate()?
**Answer:** Called after component updates (re-renders). Receives previous props and state.

```javascript
componentDidUpdate(prevProps, prevState) {
  if (this.props.id !== prevProps.id) {
    this.fetchData(this.props.id);
  }
}

// Functional equivalent
useEffect(() => {
  fetchData(id);
}, [id]);
```

**Tip:** Always compare with previous values to avoid infinite loops

### 45. What is shouldComponentUpdate()?
**Answer:** Determines if component should re-render. Returns boolean.

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

**Tip:** PureComponent and React.memo() automate this

### 46. What is getDerivedStateFromProps()?
**Answer:** Static method that returns an object to update state based on props changes, or null.

```javascript
static getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.value !== prevState.value) {
    return { value: nextProps.value };
  }
  return null;
}
```

**Tip:** Rarely needed; usually indicates a design issue

### 47. What is getSnapshotBeforeUpdate()?
**Answer:** Called right before DOM updates. Return value is passed to componentDidUpdate().

```javascript
getSnapshotBeforeUpdate(prevProps, prevState) {
  if (prevProps.list.length < this.props.list.length) {
    return this.listRef.scrollHeight;
  }
  return null;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  if (snapshot !== null) {
    // Use snapshot value
  }
}
```

**Tip:** Useful for preserving scroll position

### 48. How do you update state in React?
**Answer:**

**Class components:**
```javascript
this.setState({ count: this.state.count + 1 });

// Functional update
this.setState(prevState => ({ count: prevState.count + 1 }));
```

**Functional components:**
```javascript
const [count, setCount] = useState(0);
setCount(count + 1);

// Functional update
setCount(prevCount => prevCount + 1);
```

**Tip:** Use functional updates when new state depends on previous state

### 49. Why should you not update state directly?
**Answer:** Direct mutation doesn't trigger re-renders and breaks React's reactivity.

```javascript
// Wrong
this.state.count = 5;

// Correct
this.setState({ count: 5 });
```

**Consequences:**
- Component won't re-render
- React's change detection breaks
- Unpredictable behavior

**Tip:** Treat state as immutable

### 50. Can setState() be called in componentWillUnmount()?
**Answer:** No. The component is being removed, so setState() would have no effect and may cause memory leaks.

**Tip:** Cancel any pending setState() calls in componentWillUnmount

### 51. What is the difference between setState() in class and useState() in functional components?
**Answer:**

**setState():**
- Merges objects
- Batches updates automatically
- Can accept callback

```javascript
this.setState({ name: 'John' }, () => {
  console.log('Updated');
});
```

**useState():**
- Replaces entire value
- Use separate state variables
- Multiple useState calls for different values

```javascript
const [name, setName] = useState('');
const [age, setAge] = useState(0);
```

**Tip:** useState is more granular and flexible

### 52. Is setState() synchronous or asynchronous?
**Answer:** setState() is asynchronous and batched for performance.

```javascript
// Don't rely on immediate updates
this.setState({ count: 1 });
console.log(this.state.count); // May not be 1 yet

// Use callback or functional update
this.setState({ count: 1 }, () => {
  console.log(this.state.count); // Definitely 1
});
```

**Tip:** In React 18+, batching is more comprehensive (automatic batching)

### 53. What is state batching?
**Answer:** React groups multiple setState() calls into a single update for performance.

```javascript
// These are batched into one re-render
setName('John');
setAge(30);
setCity('NYC');
```

**React 18+:** Automatic batching in all contexts (timeouts, promises, native events)

**Tip:** Reduces unnecessary re-renders significantly

### 54. How do you handle forms in React?
**Answer:**

**Controlled approach:**
```javascript
function Form() {
  const [value, setValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
    </form>
  );
}
```

**Tip:** Controlled components provide better validation and UX

### 55. What are error boundaries?
**Answer:** Components that catch JavaScript errors in their child component tree, log them, and display fallback UI.

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Limitations:** Only catch errors in rendering, lifecycle methods, and constructors.

**Tip:** No hook equivalent yet; use class components for error boundaries

---

## Hooks (56-70)

### 56. What are React Hooks?
**Answer:** Functions that let you use state and lifecycle features in functional components.

**Built-in Hooks:**
- useState
- useEffect
- useContext
- useReducer
- useCallback
- useMemo
- useRef
- useLayoutEffect
- useImperativeHandle
- useDebugValue

**Tip:** Hooks must follow Rules of Hooks

### 57. What are the Rules of Hooks?
**Answer:**

1. **Only call Hooks at the top level**
   - Don't call in loops, conditions, or nested functions
   
2. **Only call Hooks from React functions**
   - Functional components
   - Custom Hooks

```javascript
// Wrong
if (condition) {
  const [state, setState] = useState(0);
}

// Correct
const [state, setState] = useState(0);
if (condition) {
  // Use state here
}
```

**Tip:** ESLint plugin enforces these rules

### 58. What is useState()?
**Answer:** Hook that adds state to functional components.

```javascript
const [count, setCount] = useState(0);

// With function
const [count, setCount] = useState(() => {
  return expensiveComputation();
});

// Update function
setCount(prevCount => prevCount + 1);
```

**Tip:** Use functional update when new state depends on previous state

### 59. What is useEffect()?
**Answer:** Hook for side effects (data fetching, subscriptions, DOM manipulation).

```javascript
// componentDidMount + componentDidUpdate
useEffect(() => {
  document.title = `Count: ${count}`;
});

// componentDidMount only
useEffect(() => {
  fetchData();
}, []);

// With cleanup (componentWillUnmount)
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// On specific dependency change
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

**Tip:** Always specify dependencies to avoid bugs

### 60. What is the difference between useEffect() and useLayoutEffect()?
**Answer:**

**useEffect:**
- Runs after paint
- Asynchronous
- Doesn't block browser painting
- Use for most side effects

**useLayoutEffect:**
- Runs before paint
- Synchronous
- Blocks browser painting
- Use for DOM measurements/mutations

**Tip:** Use useLayoutEffect only when necessary to avoid performance issues

### 61. What is useContext()?
**Answer:** Hook to consume context values without Context.Consumer wrapper.

```javascript
const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}

// Provide value
<ThemeContext.Provider value="dark">
  <ThemedButton />
</ThemeContext.Provider>
```

**Tip:** Component re-renders when context value changes

### 62. What is useReducer()?
**Answer:** Alternative to useState for complex state logic. Similar to Redux.

```javascript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

**Tip:** Use when state logic is complex or multiple sub-values

### 63. What is useCallback()?
**Answer:** Returns memoized callback function that only changes if dependencies change.

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b]
);
```

**Use cases:**
- Passing callbacks to optimized child components
- Avoiding unnecessary re-renders

**Tip:** Only optimize when you have a performance problem

### 64. What is useMemo()?
**Answer:** Returns memoized value that only recomputes when dependencies change.

```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

**Difference from useCallback:**
- useMemo returns a value
- useCallback returns a function

**Tip:** Profile before adding; can make code slower if overused

### 65. What is useRef()?
**Answer:** Hook that returns a mutable ref object persisting for the component's lifetime.

```javascript
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return <input ref={inputRef} />;
}

// Store mutable values (doesn't cause re-render)
const countRef = useRef(0);
countRef.current++;
```

**Use cases:**
- Access DOM elements
- Store mutable values
- Keep previous values

**Tip:** Changing ref.current doesn't cause re-renders

### 66. When would you use useRef instead of useState?
**Answer:**

**Use useRef when:**
- Accessing DOM elements
- Storing mutable values that don't need to trigger re-renders
- Keeping previous values
- Storing timers/intervals

**Use useState when:**
- Value changes should trigger re-renders
- Value is part of UI

**Tip:** useRef is like instance variables in class components

### 67. What are custom Hooks?
**Answer:** JavaScript functions starting with "use" that can call other Hooks.

```javascript
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}

// Usage
function MyComponent() {
  const width = useWindowWidth();
  return <div>Window width: {width}</div>;
}
```

**Benefits:**
- Reusable logic
- Better than HOCs/render props
- Easier to test

**Tip:** Extract complex logic into custom hooks

### 68. What is useImperativeHandle()?
**Answer:** Customizes the instance value exposed to parent when using ref.

```javascript
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    scrollIntoView: () => {
      inputRef.current.scrollIntoView();
    }
  }));
  
  return <input ref={inputRef} />;
});
```

**Tip:** Rarely needed; prefer declarative patterns

### 69. What is useDebugValue()?
**Answer:** Displays a label for custom hooks in React DevTools.

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  
  useDebugValue(isOnline ? 'Online' : 'Offline');
  
  // ... rest of hook
  return isOnline;
}
```

**Tip:** Only for custom hooks used in multiple components

### 70. How do you migrate from class to functional components?
**Answer:**

**Steps:**
1. Convert class to function
2. Replace state with useState
3. Replace lifecycle methods with useEffect
4. Replace this.props with props parameter
5. Convert methods to functions
6. Remove this keyword

**Example:**
```javascript
// Class
class Counter extends React.Component {
  state = { count: 0 };
  
  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}

// Functional
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  const increment = () => setCount(count + 1);
  
  return <button onClick={increment}>{count}</button>;
}
```

**Tip:** Migrate incrementally; both can coexist

---

## Advanced Concepts (71-85)

### 71. What is the Context API?
**Answer:** Built-in way to share values between components without passing props through every level.

```javascript
// Create context
const ThemeContext = React.createContext('light');

// Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// Consumer
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Button</button>;
}
```

**Use cases:**
- Theme data
- User authentication
- Language/locale
- UI state

**Tip:** Don't overuse; can make components less reusable

### 72. What are the limitations of Context API?
**Answer:**

**Limitations:**
- All consumers re-render when value changes (no automatic optimization)
- Not designed for high-frequency updates
- No built-in middleware or dev tools
- Can cause unnecessary re-renders

**Tip:** For complex global state, consider Redux, Zustand, or Jotai

### 73. What is Lazy Loading in React?
**Answer:** Loading components only when needed, reducing initial bundle size.

```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**Benefits:**
- Smaller initial bundle
- Faster initial load
- Better performance

**Tip:** Use for routes and heavy components

### 74. What is Suspense?
**Answer:** Component that lets you wait for code to load and specify a loading state.

```javascript
<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

**Future capabilities:**
- Data fetching (React 18+)
- Image loading
- Any asynchronous operation

**Tip:** Currently best for code splitting; data features coming

### 75. What is Code Splitting?
**Answer:** Splitting code into smaller chunks loaded on demand.

**Methods:**
1. Dynamic import()
2. React.lazy()
3. Route-based splitting

```javascript
// Route-based splitting
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

**Tip:** Great for large apps; split at route level first

### 76. What is React.StrictMode?
**Answer:** Development tool that highlights potential problems.

```javascript
<React.StrictMode>
  <App />
</React.StrictMode>
```

**Features:**
- Identifies unsafe lifecycles
- Warns about legacy APIs
- Detects unexpected side effects
- Double-invokes functions (development only)

**Tip:** Always use in development; no impact on production

### 77. What are Portals?
**Answer:** Render children into a DOM node outside the parent component hierarchy.

```javascript
function Modal({ children }) {
  return ReactDOM.createPortal(
    children,
    document.getElementById('modal-root')
  );
}
```

**Use cases:**
- Modals
- Tooltips
- Dropdowns
- Notifications

**Tip:** Events still bubble through React hierarchy

### 78. What is forwardRef()?
**Answer:** Passes refs through to child components.

```javascript
const FancyButton = forwardRef((props, ref) => (
  <button ref={ref} className="fancy">
    {props.children}
  </button>
));

// Usage
const ref = useRef();
<FancyButton ref={ref}>Click me</FancyButton>
```

**Tip:** Useful for reusable component libraries

### 79. What are Render Props vs Children as Function?
**Answer:**

**Render Props:**
```javascript
<DataProvider render={data => <Display data={data} />} />
```

**Children as Function:**
```javascript
<DataProvider>
  {data => <Display data={data} />}
</DataProvider>
```

Both share logic, children pattern is more idiomatic.

**Tip:** Hooks have mostly replaced both patterns

### 80. What is reconciliation?
**Answer:** The algorithm React uses to diff one tree with another to determine what needs to change.

**Process:**
1. Compare element types
2. Compare attributes
3. Recursively compare children
4. Use keys to match children

**Tip:** Understanding reconciliation helps optimize performance

### 81. What is the Diffing Algorithm?
**Answer:** React's method of comparing virtual DOM trees to find minimal changes.

**Assumptions:**
1. Different element types produce different trees
2. Elements with same key are stable across renders

**Optimizations:**
- Compare only same-level elements
- Use keys for list items
- Component type matters

**Tip:** Proper keys are crucial for performance

### 82. What is React Fiber?
**Answer:** Reimplementation of React's core algorithm enabling:
- Incremental rendering
- Ability to pause, abort, reuse work
- Priority for different types of updates
- New concurrency primitives

**Benefits:**
- Better perceived performance
- Smoother animations
- Better responsiveness

**Tip:** Foundation for features like Suspense and Concurrent Mode

### 83. What is Concurrent Mode (now Concurrent Features)?
**Answer:** Set of features helping React apps stay responsive by rendering trees without blocking main thread.

**Features:**
- Interruptible rendering
- Reusable state
- Prioritized updates
- Automatic batching

```javascript
// React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

**Tip:** Opt-in via createRoot() in React 18

### 84. What are Transitions in React 18?
**Answer:** Mark updates as non-urgent, keeping UI responsive.

```javascript
import { startTransition } from 'react';

// Urgent update
setInputValue(input);

// Non-urgent update
startTransition(() => {
  setSearchQuery(input);
});
```

**Or with hook:**
```javascript
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setTab(nextTab);
});
```

**Tip:** Use for updates that can be interrupted (searches, tabs)

### 85. What is Server-Side Rendering (SSR)?
**Answer:** Rendering React components on the server and sending HTML to client.

**Benefits:**
- Better SEO
- Faster initial load
- Better perceived performance
- Works without JavaScript

**Implementation:**
```javascript
// Server
import { renderToString } from 'react-dom/server';
const html = renderToString(<App />);

// Client (hydration)
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

**Tip:** Use frameworks like Next.js for easier SSR

---

## Performance & Optimization (86-95)

### 86. How do you optimize React app performance?
**Answer:**

**Techniques:**
1. Use React.memo() for expensive components
2. Implement code splitting with lazy()
3. Use useMemo() for expensive calculations
4. Use useCallback() for function stability
5. Virtualize long lists (react-window)
6. Optimize images (lazy loading, compression)
7. Avoid inline functions in JSX
8. Use production build
9. Profile with React DevTools
10. Optimize bundle size

**Tip:** Always profile first; premature optimization wastes time

### 87. What is React.lazy() and how does it improve performance?
**Answer:** Dynamically imports components, splitting code and reducing initial bundle size.

```javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Benefits:**
- Smaller initial bundle
- Faster time to interactive
- Better resource utilization

**Tip:** Best for routes and conditionally-rendered heavy components

### 88. What is the purpose of useMemo() and useCallback()?
**Answer:**

**useMemo():** Memoize expensive calculations
```javascript
const expensiveResult = useMemo(() => {
  return calculateExpensiveValue(a, b);
}, [a, b]);
```

**useCallback():** Memoize functions
```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**Use when:**
- Expensive computations
- Passing callbacks to React.memo'd components
- Dependencies in other hooks

**Tip:** Don't use everywhere; adds overhead

### 89. How do you prevent unnecessary re-renders?
**Answer:**

**Techniques:**
1. React.memo() for components
2. useMemo() for values
3. useCallback() for functions
4. Split components (isolate state)
5. Move state down (closer to where it's used)
6. Use proper keys in lists
7. Avoid creating objects/arrays inline

```javascript
// Bad
<Child onChange={() => {}} />
<Child style={{ margin: 10 }} />

// Good
const handleChange = useCallback(() => {}, []);
const style = useMemo(() => ({ margin: 10 }), []);
<Child onChange={handleChange} style={style} />
```

**Tip:** Profile with React DevTools Profiler

### 90. What is windowing/virtualization?
**Answer:** Rendering only visible items in long lists.

**Libraries:**
- react-window (lightweight)
- react-virtualized (feature-rich)

```javascript
import { FixedSizeList } from 'react-window';

function MyList({ items }) {
  return (
    <FixedSizeList
      height={500}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}
```

**Tip:** Essential for lists with 1000+ items

### 91. What is the React Profiler?
**Answer:** Built-in API to measure rendering performance.

```javascript
import { Profiler } from 'react';

function onRenderCallback(
  id, // component id
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

**Tip:** Use React DevTools Profiler for visual analysis

### 92. How do you optimize bundle size?
**Answer:**

**Strategies:**
1. Code splitting (lazy loading)
2. Tree shaking (remove unused code)
3. Analyze bundle (webpack-bundle-analyzer)
4. Import only what you need
5. Use production build
6. Compress assets
7. Use CDN for large libraries
8. Remove console.logs
9. Minimize dependencies

```javascript
// Bad
import _ from 'lodash';

// Good
import debounce from 'lodash/debounce';
```

**Tip:** Aim for <200KB initial JavaScript bundle

### 93. What are Performance Metrics in React?
**Answer:**

**Key metrics:**
- **FCP (First Contentful Paint):** When first content appears
- **LCP (Largest Contentful Paint):** When main content loads
- **TTI (Time to Interactive):** When page becomes interactive
- **FID (First Input Delay):** Response time to first interaction
- **CLS (Cumulative Layout Shift):** Visual stability

**Measure with:**
- Lighthouse
- Web Vitals
- React DevTools Profiler

**Tip:** Focus on LCP and TTI for perceived performance

### 94. What is debouncing and throttling in React?
**Answer:**

**Debouncing:** Execute after delay, reset timer on new calls
```javascript
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((value) => {
    search(value);
  }, 300),
  []
);
```

**Throttling:** Execute at most once per time period
```javascript
import { throttle } from 'lodash';

const throttledScroll = useMemo(
  () => throttle(() => {
    handleScroll();
  }, 100),
  []
);
```

**Tip:** Debounce for search, throttle for scroll/resize

### 95. How do you handle images for better performance?
**Answer:**

**Techniques:**
1. Lazy loading
2. WebP format
3. Responsive images (srcset)
4. Compression
5. CDN delivery
6. Blur-up technique
7. Dimension specification (avoid layout shift)

```javascript
<img 
  src="image.webp"
  srcSet="image-small.webp 480w, image-large.webp 1024w"
  sizes="(max-width: 600px) 480px, 1024px"
  loading="lazy"
  alt="Description"
  width="800"
  height="600"
/>
```

**Tip:** Use Next.js Image component for automatic optimization

---

## Testing & Best Practices (96-100)

### 96. How do you test React components?
**Answer:**

**Libraries:**
- Jest (test runner)
- React Testing Library (component testing)
- Cypress/Playwright (E2E testing)

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments counter', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Best practices:**
- Test behavior, not implementation
- Use accessible queries (getByRole)
- Avoid testing internal state

**Tip:** Focus on user interactions, not implementation details

### 97. What are React Testing Best Practices?
**Answer:**

**Guidelines:**
1. Test user behavior, not implementation
2. Use semantic queries (getByRole)
3. Don't test third-party libraries
4. Test one thing per test
5. Keep tests simple and readable
6. Mock external dependencies
7. Test error states
8. Use data-testid sparingly
9. Test accessibility
10. Maintain good coverage (80%+)

**Tip:** If refactoring breaks tests, you're testing implementation

### 98. What are common React anti-patterns?
**Answer:**

**Anti-patterns:**
1. Mutating state directly
2. Using index as key in dynamic lists
3. Props drilling excessively
4. Not cleaning up effects
5. Inline function definitions in JSX
6. Not memoizing expensive calculations
7. Over-using Context
8. Giant components (not splitting)
9. Not handling loading/error states
10. Ignoring accessibility

**Tip:** Follow official React docs and ESLint rules

### 99. What are React Design Patterns?
**Answer:**

**Common patterns:**

1. **Container/Presentational:**
```javascript
// Container
function UserContainer() {
  const [user, setUser] = useState(null);
  useEffect(() => fetchUser().then(setUser), []);
  return <UserDisplay user={user} />;
}

// Presentational
function UserDisplay({ user }) {
  return <div>{user?.name}</div>;
}
```

2. **Compound Components:**
```javascript
<Tabs>
  <Tabs.List>
    <Tabs.Tab>Tab 1</Tabs.Tab>
    <Tabs.Tab>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content 1</Tabs.Panel>
  <Tabs.Panel>Content 2</Tabs.Panel>
</Tabs>
```

3. **Custom Hooks:** Extract reusable logic

4. **Provider Pattern:** Context API for shared state

**Tip:** Choose patterns based on problem, not popularity

### 100. What are React Best Practices for 2024/2025?
**Answer:**

**Modern React best practices:**

1. **Use functional components with hooks**
2. **TypeScript for type safety**
3. **Proper folder structure:**
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.module.css
  hooks/
  utils/
  pages/
```

4. **State management:**
   - Local state: useState/useReducer
   - Global state: Context/Zustand/Redux Toolkit

5. **Performance:**
   - Code splitting
   - Lazy loading
   - Memoization (when needed)

6. **Code quality:**
   - ESLint + Prettier
   - Consistent naming
   - Meaningful component names

7. **Testing:**
   - Unit tests for logic
   - Integration tests for user flows
   - E2E tests for critical paths

8. **Accessibility:**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

9. **Error handling:**
   - Error boundaries
   - Loading states
   - Graceful degradation

10. **Documentation:**
    - Component props documentation
    - README files
    - Code comments for complex logic

**Tip:** Stay updated with React docs and RFC proposals

---

## Quick Reference Guide

### Common Hooks Cheat Sheet

```javascript
// State
const [state, setState] = useState(initialValue);

// Side effects
useEffect(() => {
  // Effect code
  return () => {/* Cleanup */};
}, [dependencies]);

// Context
const value = useContext(MyContext);

// Reducer
const [state, dispatch] = useReducer(reducer, initialState);

// Memoization
const memoizedValue = useMemo(() => computeValue(), [deps]);
const memoizedFn = useCallback(() => fn(), [deps]);

// Refs
const ref = useRef(initialValue);

// Custom hook
function useCustomHook() {
  const [state, setState] = useState();
  // Hook logic
  return state;
}
```

### Component Patterns

```javascript
// Functional Component
function MyComponent({ prop1, prop2 }) {
  return <div>{prop1}</div>;
}

// Component with hooks
function MyComponent() {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    // Effect
  }, [state]);
  
  return <div>{state}</div>;
}

// Memoized component
const MyComponent = React.memo(function MyComponent({ prop }) {
  return <div>{prop}</div>;
});

// Component with Context
function MyComponent() {
  const contextValue = useContext(MyContext);
  return <div>{contextValue}</div>;
}
```

### Performance Optimization Checklist

- [ ] Use production build
- [ ] Implement code splitting
- [ ] Lazy load routes/heavy components
- [ ] Memoize expensive calculations
- [ ] Optimize images
- [ ] Virtualize long lists
- [ ] Remove unused dependencies
- [ ] Profile with React DevTools
- [ ] Monitor bundle size
- [ ] Implement proper caching

---

## Interview Tips

1. **Understand fundamentals deeply** - Don't just memorize
2. **Explain your reasoning** - Show thought process
3. **Mention trade-offs** - Every solution has pros/cons
4. **Use examples** - Demonstrate with code snippets
5. **Stay current** - Know latest React features
6. **Practice coding** - Do live coding exercises
7. **Know your projects** - Be ready to discuss decisions
8. **Ask questions** - Show interest and engagement
9. **Be honest** - Say "I don't know" if you don't
10. **Follow up** - Learn from interview experience

---

## Additional Resources

- **Official React Docs:** https://react.dev
- **React GitHub:** https://github.com/facebook/react
- **React DevTools:** Browser extension for debugging
- **React Patterns:** https://reactpatterns.com
- **Awesome React:** Curated list of React resources

---

*This guide covers the most frequently asked React interview questions. Practice implementing these concepts and explaining them clearly to ace your interview!*
