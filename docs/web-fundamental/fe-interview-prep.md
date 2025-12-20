# Frontend Developer Interview Preparation Guide

## Complete Coderbyte Test Preparation

---

## Table of Contents

1. [JavaScript Fundamentals](#javascript-fundamentals)
2. [Array Manipulation](#array-manipulation)
3. [DOM Manipulation & Events](#dom-manipulation--events)
4. [React Basics](#react-basics)
5. [React + TypeScript](#react--typescript)
6. [API Calls with AbortController](#api-calls-with-abortcontroller)
7. [CSS & Styling](#css--styling)
8. [Best Practices & Tips](#best-practices--tips)

---

## JavaScript Fundamentals

### 1. First Reverse

**Problem:** Reverse a string without using built-in reverse methods.

```javascript
function firstReverse(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Alternative with array
function firstReverse(str) {
  return str.split('').reverse().join('');
}

// Test
console.log(firstReverse('Hello')); // "olleH"
```

### 2. Longest Word

**Problem:** Find the longest word in a string, handling punctuation.

```javascript
function longestWord(str) {
  // Remove punctuation and split into words
  const words = str.replace(/[^\w\s]/g, '').split(' ');

  let longest = '';
  for (let word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }
  return longest;
}

// Test
console.log(longestWord('Hello world!!!')); // "Hello" or "world"
console.log(longestWord('fun&!! time')); // "time"
```

### 3. Letter Changes

**Problem:** Replace each letter with the next letter in the alphabet, capitalizing vowels.

```javascript
function letterChanges(str) {
  const vowels = 'aeiou';
  let result = '';

  for (let char of str) {
    if (/[a-zA-Z]/.test(char)) {
      // Get next letter
      let nextChar =
        char === 'z'
          ? 'a'
          : char === 'Z'
          ? 'A'
          : String.fromCharCode(char.charCodeAt(0) + 1);

      // Capitalize if vowel
      if (vowels.includes(nextChar.toLowerCase())) {
        nextChar = nextChar.toUpperCase();
      }
      result += nextChar;
    } else {
      result += char;
    }
  }
  return result;
}

// Test
console.log(letterChanges('hello')); // "Ifmmp"
console.log(letterChanges('fun times!')); // "gvO UJnft!"
```

### 4. Simple Adding

**Problem:** Add all numbers from 1 to a given number.

```javascript
function simpleAdding(num) {
  let sum = 0;
  for (let i = 1; i <= num; i++) {
    sum += i;
  }
  return sum;
}

// Mathematical approach (faster)
function simpleAdding(num) {
  return (num * (num + 1)) / 2;
}

// Test
console.log(simpleAdding(12)); // 78
console.log(simpleAdding(4)); // 10
```

### 5. Check Nums

**Problem:** Compare two numbers and return specific strings based on conditions.

```javascript
function checkNums(num1, num2) {
  if (num2 > num1) {
    return true;
  } else if (num1 > num2) {
    return false;
  } else {
    return -1;
  }
}

// Test
console.log(checkNums(3, 122)); // true
console.log(checkNums(67, 67)); // -1
```

### 6. Time Convert

**Problem:** Convert minutes into hours and minutes format.

```javascript
function timeConvert(num) {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours}:${minutes}`;
}

// Test
console.log(timeConvert(126)); // "2:6"
console.log(timeConvert(45)); // "0:45"
```

---

## Array Manipulation

### 7. Array Addition

**Problem:** Determine if any combination of numbers in an array (except the largest) equals the largest number.

```javascript
function arrayAddition(arr) {
  const max = Math.max(...arr);
  const nums = arr.filter((n) => n !== max);

  function canSum(target, numbers, index = 0) {
    if (target === 0) return true;
    if (index >= numbers.length) return false;

    // Include current number
    if (canSum(target - numbers[index], numbers, index + 1)) {
      return true;
    }

    // Exclude current number
    return canSum(target, numbers, index + 1);
  }

  return canSum(max, nums);
}

// Test
console.log(arrayAddition([4, 6, 23, 10, 1, 3])); // true (4+6+10+3 = 23)
console.log(arrayAddition([5, 7, 16, 1, 2])); // false
```

### 8. Array Matching

**Problem:** Find matching elements between two arrays.

```javascript
function arrayMatching(arr1, arr2) {
  const result = [];

  for (let item of arr1) {
    if (arr2.includes(item) && !result.includes(item)) {
      result.push(item);
    }
  }

  return result;
}

// Using Set (more efficient)
function arrayMatching(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1.filter((item) => set2.has(item)))];
}

// Test
console.log(arrayMatching([1, 2, 3, 4], [2, 4, 6, 8])); // [2, 4]
```

### 9. Min-Max Array

**Problem:** Return the difference between the largest and smallest numbers.

```javascript
function minMax(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  return max - min;
}

// Without spread operator
function minMax(arr) {
  let max = arr[0];
  let min = arr[0];

  for (let num of arr) {
    if (num > max) max = num;
    if (num < min) min = num;
  }

  return max - min;
}

// Test
console.log(minMax([1, 5, 10, 3])); // 9
```

### 10. Remove Duplicates

**Problem:** Remove duplicate values from an array while maintaining order.

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Without Set
function removeDuplicates(arr) {
  const result = [];
  for (let item of arr) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}

// Test
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
```

---

## DOM Manipulation & Events

### 11. Button Toggle

**Problem:** Create buttons that change color or text when clicked.

```html
<!DOCTYPE html>
<html>
  <body>
    <button id="toggleBtn">Click Me</button>
    <button id="colorBtn">Change Color</button>

    <script>
      // Toggle text
      const toggleBtn = document.getElementById('toggleBtn');
      let isOn = false;

      toggleBtn.addEventListener('click', () => {
        isOn = !isOn;
        toggleBtn.textContent = isOn ? 'ON' : 'OFF';
        toggleBtn.style.backgroundColor = isOn ? 'green' : 'red';
      });

      // Toggle color
      const colorBtn = document.getElementById('colorBtn');
      const colors = ['red', 'blue', 'green', 'yellow'];
      let colorIndex = 0;

      colorBtn.addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        colorBtn.style.backgroundColor = colors[colorIndex];
      });
    </script>
  </body>
</html>
```

### 12. Form Validation

**Problem:** Validate email, password, or other form inputs with specific requirements.

```html
<!DOCTYPE html>
<html>
  <body>
    <form id="myForm">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <span id="error" style="color: red;"></span>
      <button type="submit">Submit</button>
    </form>

    <script>
      const form = document.getElementById('myForm');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const errorSpan = document.getElementById('error');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorSpan.textContent = '';

        const email = emailInput.value;
        const password = passwordInput.value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errorSpan.textContent = 'Invalid email format';
          return;
        }

        // Password validation (min 8 chars, 1 number, 1 uppercase)
        if (password.length < 8) {
          errorSpan.textContent = 'Password must be at least 8 characters';
          return;
        }

        if (!/[A-Z]/.test(password)) {
          errorSpan.textContent = 'Password must contain uppercase letter';
          return;
        }

        if (!/[0-9]/.test(password)) {
          errorSpan.textContent = 'Password must contain a number';
          return;
        }

        alert('Form submitted successfully!');
      });
    </script>
  </body>
</html>
```

### 13. Dynamic List

**Problem:** Add/remove items from a list dynamically with user input.

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="text" id="itemInput" placeholder="Enter item" />
    <button id="addBtn">Add Item</button>
    <ul id="itemList"></ul>

    <script>
      const input = document.getElementById('itemInput');
      const addBtn = document.getElementById('addBtn');
      const list = document.getElementById('itemList');

      function addItem() {
        const value = input.value.trim();
        if (!value) return;

        const li = document.createElement('li');
        li.textContent = value;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', () => {
          list.removeChild(li);
        });

        li.appendChild(deleteBtn);
        list.appendChild(li);
        input.value = '';
      }

      addBtn.addEventListener('click', addItem);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
      });
    </script>
  </body>
</html>
```

### 14. Interactive Counter

**Problem:** Build increment/decrement buttons that update a displayed number.

```html
<!DOCTYPE html>
<html>
  <body>
    <button id="decrement">-</button>
    <span id="counter">0</span>
    <button id="increment">+</button>
    <button id="reset">Reset</button>

    <script>
      let count = 0;
      const counterDisplay = document.getElementById('counter');
      const incrementBtn = document.getElementById('increment');
      const decrementBtn = document.getElementById('decrement');
      const resetBtn = document.getElementById('reset');

      function updateDisplay() {
        counterDisplay.textContent = count;
      }

      incrementBtn.addEventListener('click', () => {
        count++;
        updateDisplay();
      });

      decrementBtn.addEventListener('click', () => {
        count--;
        updateDisplay();
      });

      resetBtn.addEventListener('click', () => {
        count = 0;
        updateDisplay();
      });
    </script>
  </body>
</html>
```

---

## React Basics

### 15. React Todo App

**Problem:** Build a simple todo list with add, delete, and toggle functionality.

```jsx
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        placeholder='Add a todo'
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

### 16. API Data Fetch

**Problem:** Fetch data from an API and display it in a component.

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
```

### 17. Conditional Rendering

**Problem:** Show/hide elements based on state or props.

```jsx
import { useState } from 'react';

function ConditionalComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h2>Welcome back!</h2>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>

          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide' : 'Show'} Details
          </button>

          {showDetails && (
            <div>
              <p>User details go here...</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Please log in</h2>
          <button onClick={() => setIsLoggedIn(true)}>Login</button>
        </div>
      )}
    </div>
  );
}

export default ConditionalComponent;
```

---

## React + TypeScript

### Component Creation & Props

#### 1. Typed Props Component

```tsx
interface UserProps {
  name: string;
  age: number;
  email?: string;
  isAdmin?: boolean;
}

const UserCard: React.FC<UserProps> = ({
  name,
  age,
  email,
  isAdmin = false,
}) => {
  return (
    <div className='user-card'>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
      {isAdmin && <span>Admin</span>}
    </div>
  );
};

export default UserCard;
```

#### 2. Props with Children

```tsx
interface ContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={className}>
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default Container;
```

#### 3. Event Handlers

```tsx
import { useState } from 'react';

const FormComponent = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted:', value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleChange} />
      <button type='button' onClick={handleClick}>
        Click
      </button>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default FormComponent;
```

#### 4. Union Types for Props

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  onClick,
  children,
  disabled = false,
}) => {
  const variantClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    danger: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

#### 5. Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
}

function UserList() {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  return (
    <List
      items={users}
      renderItem={(user) => <span>{user.name}</span>}
      keyExtractor={(user) => user.id}
    />
  );
}
```

### State Management with TypeScript

#### 6. useState with Types

```tsx
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const StateExamples = () => {
  // Primitive types
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);

  // Object type
  const [user, setUser] = useState<User | null>(null);

  // Array type
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Complex state
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    age: number;
  }>({
    username: '',
    email: '',
    age: 0,
  });

  return <div>State Examples</div>;
};
```

#### 7. Complex State Updates

```tsx
import { useState } from 'react';

interface FormState {
  username: string;
  email: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
}

const ComplexForm = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    preferences: {
      notifications: true,
      theme: 'light',
      language: 'en',
    },
  });

  // Update top-level property
  const updateUsername = (username: string) => {
    setForm((prev) => ({ ...prev, username }));
  };

  // Update nested property
  const updateTheme = (theme: 'light' | 'dark') => {
    setForm((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, theme },
    }));
  };

  // Update multiple properties
  const updateMultiple = (username: string, email: string) => {
    setForm((prev) => ({ ...prev, username, email }));
  };

  return <div>Complex Form</div>;
};
```

#### 8. useReducer with TypeScript

```tsx
import { useReducer } from 'react';

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number }
  | { type: 'RESET' };

interface State {
  count: number;
  history: number[];
}

const initialState: State = {
  count: 0,
  history: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    case 'DECREMENT':
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1],
      };
    case 'SET':
      return {
        count: action.payload,
        history: [...state.history, action.payload],
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>
        Set to 10
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
};
```

#### 9. Custom Hooks with TypeScript

```tsx
import { useState, useEffect } from 'react';

// useLocalStorage hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// useToggle hook
function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = () => setValue((prev) => !prev);
  return [value, toggle];
}

// usePrevious hook
function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T | undefined>();

  useEffect(() => {
    setPrevious(current);
    setCurrent(value);
  }, [value]);

  return previous;
}

// Usage
const MyComponent = () => {
  const [name, setName] = useLocalStorage<string>('name', '');
  const [isOpen, toggleOpen] = useToggle(false);
  const previousName = usePrevious(name);

  return <div>Custom Hooks</div>;
};
```

#### 10. useRef with TypeScript

```tsx
import { useRef, useEffect } from 'react';

const RefExamples = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    // Access div dimensions
    if (divRef.current) {
      console.log('Width:', divRef.current.offsetWidth);
    }
  }, []);

  const handleClick = () => {
    countRef.current += 1;
    console.log('Clicked:', countRef.current, 'times');
  };

  return (
    <div>
      <input ref={inputRef} />
      <div ref={divRef}>Content</div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};
```

---

## API Calls with AbortController

### Basic Fetch with AbortController

```typescript
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://api.example.com/users', {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: User[] = await response.json();

        if (!abortController.signal.aborted) {
          setUsers(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }

        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
};
```

### Custom useFetch Hook with AbortController

```typescript
import { useEffect, useState } from 'react';

interface UseFetchOptions {
  autoFetch?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(
  url: string,
  options: UseFetchOptions = { autoFetch: true }
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    if (!options.autoFetch && refetchIndex === 0) return;

    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: T = await response.json();

        if (!abortController.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }

        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, refetchIndex, options.autoFetch]);

  const refetch = () => {
    setRefetchIndex((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}

// Usage
const MyComponent = () => {
  const { data, loading, error, refetch } = useFetch<User[]>(
    'https://api.example.com/users'
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Search with Debounce and AbortController

```typescript
import { useEffect, useState, useRef } from 'react';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

const SearchComponent = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    const searchWithDebounce = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.example.com/search?q=${encodeURIComponent(query)}`,
          {
            signal: currentController.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data: SearchResult[] = await response.json();

        if (!currentController.signal.aborted) {
          setResults(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Search aborted');
          return;
        }
        console.error('Search error:', err);
      } finally {
        if (!currentController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500); // 500ms debounce

    // Cleanup
    return () => {
      clearTimeout(searchWithDebounce);
      currentController.abort();
    };
  }, [query]);

  return (
    <div>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search...'
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <h4>{result.title}</h4>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Manual Trigger with AbortController

```typescript
import { useState, useRef } from 'react';

interface Data {
  id: number;
  value: string;
}

const ManualFetchComponent = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.example.com/data', {
        signal: currentController.signal,
      });

      if (!response.ok) {
        throw new Error('Fetch failed');
      }

      const result: Data = await response.json();

      if (!currentController.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }

      if (!currentController.signal.aborted) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (!currentController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {loading && <button onClick={cancelRequest}>Cancel Request</button>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

### Multiple Parallel Requests with AbortController

```typescript
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

const UserWithPosts = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch both user and posts in parallel
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`https://api.example.com/users/${userId}`, {
            signal: abortController.signal,
          }),
          fetch(`https://api.example.com/posts?userId=${userId}`, {
            signal: abortController.signal,
          }),
        ]);

        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [userData, postsData] = await Promise.all([
          userResponse.json(),
          postsResponse.json(),
        ]);

        if (!abortController.signal.aborted) {
          setUser(userData);
          setPosts(postsData);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }

        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Posts:</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

---

## CSS & Styling

### 18. Responsive Layout

**Problem:** Create a layout that adapts to different screen sizes using flexbox or grid.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Flexbox Responsive Layout */
      .flex-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding: 20px;
      }

      .flex-item {
        flex: 1 1 300px; /* grow, shrink, basis */
        background: #3498db;
        padding: 20px;
        color: white;
        border-radius: 8px;
      }

      /* Grid Responsive Layout */
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
      }

      .grid-item {
        background: #e74c3c;
        padding: 20px;
        color: white;
        border-radius: 8px;
      }

      /* Media Queries */
      @media (max-width: 768px) {
        .flex-container {
          flex-direction: column;
        }

        .grid-container {
          grid-template-columns: 1fr;
        }
      }

      @media (min-width: 769px) and (max-width: 1024px) {
        .grid-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* Mobile First Approach */
      .responsive-box {
        width: 100%;
        padding: 15px;
      }

      @media (min-width: 768px) {
        .responsive-box {
          width: 50%;
          padding: 20px;
        }
      }

      @media (min-width: 1200px) {
        .responsive-box {
          width: 33.333%;
          padding: 30px;
        }
      }
    </style>
  </head>
  <body>
    <!-- Flexbox Example -->
    <div class="flex-container">
      <div class="flex-item">Item 1</div>
      <div class="flex-item">Item 2</div>
      <div class="flex-item">Item 3</div>
    </div>

    <!-- Grid Example -->
    <div class="grid-container">
      <div class="grid-item">Card 1</div>
      <div class="grid-item">Card 2</div>
      <div class="grid-item">Card 3</div>
      <div class="grid-item">Card 4</div>
    </div>
  </body>
</html>
```

### 19. CSS Positioning

**Problem:** Position elements absolutely or relatively within containers.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Relative Positioning */
      .relative-container {
        position: relative;
        width: 300px;
        height: 200px;
        background: #ecf0f1;
        margin: 20px;
      }

      .relative-item {
        position: relative;
        top: 20px;
        left: 30px;
        background: #3498db;
        padding: 10px;
        color: white;
      }

      /* Absolute Positioning */
      .absolute-container {
        position: relative;
        width: 300px;
        height: 200px;
        background: #ecf0f1;
        margin: 20px;
      }

      .absolute-item {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #e74c3c;
        padding: 10px;
        color: white;
      }

      /* Fixed Positioning */
      .fixed-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #2c3e50;
        color: white;
        padding: 15px;
        z-index: 1000;
      }

      /* Sticky Positioning */
      .sticky-nav {
        position: sticky;
        top: 0;
        background: #16a085;
        padding: 10px;
        color: white;
      }

      /* Centering with Position */
      .centered-absolute {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #9b59b6;
        padding: 20px;
        color: white;
      }

      /* Z-index Layering */
      .layer-1 {
        position: absolute;
        z-index: 1;
        background: rgba(52, 152, 219, 0.7);
        width: 150px;
        height: 150px;
      }

      .layer-2 {
        position: absolute;
        z-index: 2;
        top: 50px;
        left: 50px;
        background: rgba(231, 76, 60, 0.7);
        width: 150px;
        height: 150px;
      }
    </style>
  </head>
  <body>
    <!-- Relative Example -->
    <div class="relative-container">
      <div class="relative-item">Relative Position</div>
    </div>

    <!-- Absolute Example -->
    <div class="absolute-container">
      <div class="absolute-item">Absolute Position</div>
      <div class="centered-absolute">Centered</div>
    </div>

    <!-- Z-index Example -->
    <div style="position: relative; height: 300px;">
      <div class="layer-1">Layer 1</div>
      <div class="layer-2">Layer 2 (on top)</div>
    </div>
  </body>
</html>
```

### 20. Hover Effects & Transitions

**Problem:** Apply hover states and transitions to elements.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Basic Hover Effect */
      .hover-button {
        padding: 15px 30px;
        background: #3498db;
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .hover-button:hover {
        background: #2980b9;
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      /* Card Hover Effect */
      .hover-card {
        width: 250px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .hover-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      /* Image Hover Effect */
      .image-container {
        position: relative;
        width: 300px;
        overflow: hidden;
      }

      .image-container img {
        width: 100%;
        transition: transform 0.5s ease;
      }

      .image-container:hover img {
        transform: scale(1.1);
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .image-container:hover .image-overlay {
        opacity: 1;
      }

      /* Underline Animation */
      .animated-link {
        position: relative;
        text-decoration: none;
        color: #3498db;
        padding-bottom: 5px;
      }

      .animated-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: #3498db;
        transition: width 0.3s ease;
      }

      .animated-link:hover::after {
        width: 100%;
      }

      /* Gradient Hover */
      .gradient-button {
        padding: 15px 30px;
        border: none;
        color: white;
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        background-size: 200% 200%;
        transition: background-position 0.5s ease;
        cursor: pointer;
      }

      .gradient-button:hover {
        background-position: 100% 100%;
      }

      /* Rotate on Hover */
      .rotate-icon {
        display: inline-block;
        transition: transform 0.3s ease;
      }

      .rotate-icon:hover {
        transform: rotate(180deg);
      }

      /* Fade In Elements */
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }

      .fade-in:hover {
        opacity: 1;
        transform: translateY(0);
      }

      /* Border Animation */
      .border-animate {
        position: relative;
        padding: 20px;
        background: white;
      }

      .border-animate::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid #3498db;
        transition: all 0.3s ease;
        opacity: 0;
      }

      .border-animate:hover::before {
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        opacity: 1;
      }

      /* Pulse Animation */
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      .pulse-button {
        padding: 15px 30px;
        background: #e74c3c;
        color: white;
        border: none;
        cursor: pointer;
      }

      .pulse-button:hover {
        animation: pulse 0.5s infinite;
      }
    </style>
  </head>
  <body>
    <button class="hover-button">Hover Me</button>

    <div class="hover-card">
      <h3>Card Title</h3>
      <p>Hover to see effect</p>
    </div>

    <div class="image-container">
      <img src="image.jpg" alt="Sample" />
      <div class="image-overlay">
        <span>View Details</span>
      </div>
    </div>

    <a href="#" class="animated-link">Animated Link</a>

    <button class="gradient-button">Gradient Button</button>

    <div class="rotate-icon">🔄</div>

    <button class="pulse-button">Pulse Button</button>
  </body>
</html>
```

---

## Best Practices & Tips

### General JavaScript Best Practices

```javascript
// 1. Use const and let instead of var
const API_URL = 'https://api.example.com';
let count = 0;

// 2. Arrow functions for callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);

// 3. Destructuring
const user = { name: 'Alice', age: 30, email: 'alice@example.com' };
const { name, age } = user;

const colors = ['red', 'green', 'blue'];
const [first, second] = colors;

// 4. Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5, 6];

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// 5. Template literals
const greeting = `Hello, ${name}! You are ${age} years old.`;

// 6. Optional chaining
const username = user?.profile?.username;

// 7. Nullish coalescing
const displayName = username ?? 'Guest';

// 8. Array methods over loops
// ✅ Good
const evens = numbers.filter((n) => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// ❌ Avoid
const evens2 = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evens2.push(numbers[i]);
  }
}

// 9. Early returns
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;

  // Process active user
  return user.data;
}

// 10. Avoid nested callbacks (use async/await)
// ❌ Bad
fetchUser(id, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      // Callback hell
    });
  });
});

// ✅ Good
async function getData(id) {
  const user = await fetchUser(id);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  return { user, posts, comments };
}
```

### React Best Practices

```jsx
// 1. Component organization
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component definition
const MyComponent = ({ title, items }) => {
  // Hooks at the top
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return <div>{/* JSX */}</div>;
};

// PropTypes (or use TypeScript)
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
};

export default MyComponent;

// 2. Keep components small and focused
// ❌ Bad: One giant component
// ✅ Good: Split into smaller components
const UserProfile = ({ user }) => (
  <div>
    <UserAvatar user={user} />
    <UserInfo user={user} />
    <UserStats user={user} />
  </div>
);

// 3. Use composition over prop drilling
// ✅ Good: Use Context or composition
const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 4. Memoization for expensive operations
import { useMemo, useCallback } from 'react';

const ExpensiveComponent = ({ data, onUpdate }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map((item) => expensiveOperation(item));
  }, [data]);

  // Memoize callbacks
  const handleUpdate = useCallback(
    (id) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  return <div>{/* Render */}</div>;
};

// 5. Conditional rendering patterns
// ✅ Good patterns
const Component = ({ isLoading, error, data }) => {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!data) return null;

  return <DataDisplay data={data} />;
};

// 6. Keys in lists
// ✅ Good: Use unique, stable IDs
{
  items.map((item) => <Item key={item.id} data={item} />);
}

// ❌ Bad: Using index
{
  items.map((item, index) => <Item key={index} data={item} />);
}

// 7. Avoid inline object/array creation in render
// ❌ Bad: Creates new object on every render
<Component style={{ margin: 10 }} />;

// ✅ Good: Define outside or use useMemo
const style = { margin: 10 };
<Component style={style} />;
```

### TypeScript Best Practices

```typescript
// 1. Use interfaces for objects, types for unions/primitives
interface User {
  id: number;
  name: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

// 2. Avoid 'any' - use 'unknown' if needed
// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: unknown = fetchData();
if (typeof data === 'object' && data !== null) {
  // Safe to use
}

// 3. Use utility types
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserWithoutId = Omit<User, 'id'>;

// 4. Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 5. Type guards
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

// 6. Const assertions for literal types
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

// 7. Function overloads
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}
```

### Performance Tips

```javascript
// 1. Debounce search/input handlers
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);

// 2. Throttle scroll/resize handlers
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const handleScroll = throttle(() => {
  console.log('Scrolled');
}, 100);

// 3. Lazy loading images
<img src='placeholder.jpg' data-src='actual-image.jpg' loading='lazy' />;

// 4. Code splitting in React
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// 5. Virtual scrolling for long lists
// Use libraries like react-window or react-virtualized
```

### Common Coderbyte Patterns

```javascript
// 1. Two-pointer technique
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}

// 2. Hash map for frequency counting
function firstNonRepeating(str) {
  const freq = {};

  for (let char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (let char of str) {
    if (freq[char] === 1) return char;
  }

  return null;
}

// 3. Sliding window
function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let windowSum = 0;

  // Initial window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// 4. Recursion with memoization
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// 5. String manipulation
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
```

### Testing Approach

```javascript
// 1. Test edge cases
// - Empty inputs: [], "", 0
// - Single element: [1], "a"
// - All same elements: [1,1,1]
// - Negative numbers: [-5, -10]
// - Large numbers: 1000000
// - Special characters: "!@#$%"

// 2. Validate output format
// Read requirements carefully - Coderbyte is strict about exact format

// 3. Check constraints
// - Array length limits
// - String length limits
// - Number ranges
// - Time complexity requirements

// 4. Example test runner
function runTests() {
  const tests = [
    { input: [1, 2, 3], expected: 6 },
    { input: [], expected: 0 },
    { input: [-1, -2], expected: -3 },
  ];

  tests.forEach((test, index) => {
    const result = yourFunction(test.input);
    const passed = result === test.expected;
    console.log(`Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`  Expected: ${test.expected}, Got: ${result}`);
    }
  });
}
```

### Interview Day Checklist

**Before the Test:**

- [ ] Review array methods: `map`, `filter`, `reduce`, `find`, `some`, `every`
- [ ] Practice string methods: `split`, `join`, `substring`, `indexOf`, `replace`
- [ ] Know object methods: `Object.keys()`, `Object.values()`, `Object.entries()`
- [ ] Understand spread operator and destructuring
- [ ] Review async/await and promises
- [ ] Practice React hooks: `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`
- [ ] Know TypeScript basics: interfaces, types, generics
- [ ] Understand CSS flexbox and grid
- [ ] Review DOM manipulation methods

**During the Test:**

- [ ] Read requirements carefully - twice
- [ ] Identify the problem pattern (two-pointer, hash map, etc.)
- [ ] Start with brute force, then optimize
- [ ] Write clean, readable code with good variable names
- [ ] Test with edge cases
- [ ] Check output format matches requirements exactly
- [ ] Use console.log for debugging, remove before submission
- [ ] Manage your time - don't get stuck on one problem

**Common Mistakes to Avoid:**

- ❌ Not reading requirements completely
- ❌ Using `any` type in TypeScript
- ❌ Forgetting to handle edge cases (empty arrays, null values)
- ❌ Not cleaning up event listeners/subscriptions
- ❌ Mutating state directly in React
- ❌ Using array index as key in React lists
- ❌ Not aborting fetch requests on unmount
- ❌ Excessive re-renders due to inline object/array creation
- ❌ Forgetting semicolons or consistent code style
- ❌ Not testing your solution

**Time Management:**

- 2-3 problems in 90 minutes typical
- Spend ~5 minutes reading and planning
- ~20-25 minutes coding per problem
- ~5 minutes testing and refining
- Leave buffer time for unexpected issues

**Quick Reference Cheat Sheet:**

```javascript
// Array Methods
arr.map(x => x * 2)              // Transform
arr.filter(x => x > 5)           // Filter
arr.reduce((sum, x) => sum + x, 0) // Reduce
arr.find(x => x === 5)           // Find first
arr.some(x => x > 10)            // Any match
arr.every(x => x > 0)            // All match
arr.includes(5)                  // Contains
arr.slice(1, 3)                  // Extract portion
arr.splice(1, 2)                 // Remove/insert (mutates)

// String Methods
str.split('')                    // To array
str.substring(0, 5)              // Extract portion
str.indexOf('hello')             // Find position
str.replace('a', 'b')            // Replace
str.trim()                       // Remove whitespace
str.toLowerCase()                // Lowercase
str.charAt(0)                    // Get character

// Object Methods
Object.keys(obj)                 // Get keys
Object.values(obj)               // Get values
Object.entries(obj)              // Get [key, value] pairs

// Math Methods
Math.max(...arr)                 // Maximum
Math.min(...arr)                 // Minimum
Math.floor(4.7)                  // Round down
Math.ceil(4.2)                   // Round up
Math.round(4.5)                  // Round nearest
Math.random()                    // Random 0-1

// Set Operations
new Set(arr)                     // Unique values
set.has(value)                   // Check existence
set.add(value)                   // Add value
[...set]                         // Convert to array
```

**React Hooks Quick Reference:**

```jsx
// useState
const [state, setState] = useState(initialValue);

// useEffect
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);

// useRef
const ref = useRef(initialValue);
ref.current; // Access value

// useCallback
const callback = useCallback(() => {
  // Function
}, [dependencies]);

// useMemo
const memoized = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);

// useContext
const value = useContext(MyContext);
```

**TypeScript Quick Reference:**

```typescript
// Basic Types
let num: number = 5;
let str: string = 'hello';
let bool: boolean = true;
let arr: number[] = [1, 2, 3];
let tuple: [string, number] = ['hello', 5];

// Interface
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}

// Type Alias
type ID = string | number;
type Status = 'idle' | 'loading' | 'success';

// Function Types
const add = (a: number, b: number): number => a + b;
type AddFunc = (a: number, b: number) => number;

// Generic
function identity<T>(arg: T): T {
  return arg;
}

// Utility Types
Partial<T>; // All props optional
Required<T>; // All props required
Readonly<T>; // All props readonly
Pick<T, K>; // Select props
Omit<T, K>; // Exclude props
Record<K, T>; // Object with keys K and values T
```

**CSS Quick Reference:**

```css
/* Flexbox */
display: flex;
flex-direction: row | column;
justify-content: center | flex-start | flex-end | space-between;
align-items: center | flex-start | flex-end | stretch;
flex-wrap: wrap | nowrap;
gap: 10px;

/* Grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-gap: 20px;
grid-template-areas: "header header" "sidebar main";

/* Position */
position: static | relative | absolute | fixed | sticky;
top | right | bottom | left: 10px;
z-index: 10;

/* Common Properties */
display: block | inline | inline-block | flex | grid;
margin: 10px; padding: 10px;
width: 100%; height: auto;
background: #fff; color: #000;
border: 1px solid #ccc; border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* Transitions */
transition: all 0.3s ease;
transform: scale(1.1) | rotate(45deg) | translateY(-10px);
```

---

## Additional Resources

**Practice Platforms:**

- Coderbyte.com (obviously!)
- LeetCode (Easy/Medium problems)
- HackerRank (Frontend challenges)
- CodeSignal (Company assessments)
- Frontend Mentor (UI challenges)

**Documentation:**

- MDN Web Docs (JavaScript, CSS, HTML)
- React Documentation (react.dev)
- TypeScript Handbook (typescriptlang.org)
- CSS Tricks (css-tricks.com)

**Study Plan (1-2 Weeks):**

**Week 1: Foundations**

- Day 1-2: JavaScript fundamentals, array/string manipulation
- Day 3-4: DOM manipulation, event handling
- Day 5-6: React basics, hooks, component patterns
- Day 7: Practice 5-10 easy Coderbyte problems

**Week 2: Advanced + TypeScript**

- Day 8-9: TypeScript basics, typing React components
- Day 10-11: API calls, async operations, AbortController
- Day 12-13: CSS layouts, responsive design, animations
- Day 14: Mock assessment - time yourself on 3 problems

**The Day Before:**

- Review your notes and this guide
- Do 2-3 warm-up problems
- Get good sleep
- Prepare your workspace (quiet, good internet)

**Test Day:**

- Arrive/start 10 minutes early
- Have water and snacks ready
- Close distracting tabs/apps
- Read ALL instructions before starting
- Stay calm - you've got this! 💪

---

## Final Tips

**Code Quality Matters:**

```javascript
// ❌ Bad
function f(a, b) {
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b) c++;
  }
  return c;
}

// ✅ Good
function countGreaterThan(numbers, threshold) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > threshold) {
      count++;
    }
  }

  return count;
}

// ✅ Even Better
function countGreaterThan(numbers, threshold) {
  return numbers.filter((num) => num > threshold).length;
}
```

**Communication Through Code:**

- Use descriptive variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow consistent formatting
- Handle errors gracefully

**Remember:**

- There's usually multiple ways to solve a problem
- Brute force solution is better than no solution
- Optimize after you have working code
- Edge cases matter
- Read the requirements carefully

---
