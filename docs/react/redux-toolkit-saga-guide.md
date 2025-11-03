# Redux Toolkit & Redux Saga: Comprehensive Guide

## Table of Contents
1. [Redux Toolkit Basics](#redux-toolkit-basics)
2. [Redux Saga Basics](#redux-saga-basics)
3. [Integration & Best Practices](#integration--best-practices)

---

# Redux Toolkit Basics

## What is Redux Toolkit?

**Redux Toolkit (RTK)** is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies Redux code and includes utilities to simplify common use cases like store setup, creating reducers, and writing immutable update logic.

**Created by:** Redux team  
**Purpose:** Reduce Redux boilerplate and complexity  
**Package:** `@reduxjs/toolkit`

### Why Redux Toolkit?

❌ **Problems with Classic Redux:**
- Too much boilerplate code
- Manual configuration required
- Need additional packages for async logic
- Difficult to write immutable updates
- Easy to make mistakes

✅ **Redux Toolkit Solutions:**
- Simplified store setup
- Built-in immutability with Immer
- Automatic action creators
- Built-in thunk middleware
- TypeScript support out of the box

---

## 1. Installation

```bash
# Install Redux Toolkit
npm install @reduxjs/toolkit react-redux

# Or with yarn
yarn add @reduxjs/toolkit react-redux
```

---

## 2. Core API: `configureStore`

Simplifies store creation with good defaults.

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  },
  // middleware, devTools, and other options are automatically configured
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**What `configureStore` does automatically:**
- Combines reducers
- Adds Redux Thunk middleware
- Enables Redux DevTools Extension
- Adds development-only middleware for common mistakes
- Sets up immutability checks

### Connecting to React

```javascript
// index.js / main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## 3. Core API: `createSlice`

Creates reducer, actions, and action creators in one place.

```javascript
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  status: 'idle'
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // Action creators automatically generated
    increment: (state) => {
      // Can write "mutating" logic thanks to Immer
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    }
  }
});

// Export actions
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;

// Export selectors
export const selectCount = (state) => state.counter.value;
export const selectStatus = (state) => state.counter.status;
```

### Using in Components

```javascript
// Counter.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, selectCount } from './counterSlice';

function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}

export default Counter;
```

---

## 4. Async Logic with `createAsyncThunk`

Handles async operations and generates pending/fulfilled/rejected action types.

```javascript
// features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Another async thunk
export const updateUser = createAsyncThunk(
  'user/update',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/users/${userData.id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserById cases
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // updateUser cases
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
```

### Using Async Thunks in Components

```javascript
// UserProfile.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserById,
  updateUser,
  selectUser,
  selectUserLoading,
  selectUserError
} from './userSlice';

function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  const handleUpdate = async () => {
    const resultAction = await dispatch(updateUser({
      id: userId,
      name: 'New Name'
    }));
    
    if (updateUser.fulfilled.match(resultAction)) {
      console.log('User updated successfully');
    } else {
      console.error('Failed to update user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={handleUpdate}>Update User</button>
    </div>
  );
}

export default UserProfile;
```

---

## 5. RTK Query (Bonus Feature)

Powerful data fetching and caching tool built into Redux Toolkit.

```javascript
// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User']
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }]
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser
      }),
      invalidatesTags: ['User']
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = api;

// Add to store
// store.js
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

### Using RTK Query in Components

```javascript
// UsersList.jsx
import React from 'react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation
} from './services/api';

function UsersList() {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleCreate = async () => {
    try {
      await createUser({ name: 'New User', email: 'user@example.com' }).unwrap();
      alert('User created!');
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      alert('User deleted!');
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreate} disabled={isCreating}>
        Add User
      </button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 6. TypeScript with Redux Toolkit

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle'
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const { increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

---

# Redux Saga Basics

## What is Redux Saga?

**Redux Saga** is a middleware library that aims to make application side effects (asynchronous things like data fetching and impure things like accessing browser cache) easier to manage, more efficient to execute, and better at handling failures.

**Key Concept:** Uses ES6 Generators to make async flows easy to read, write, and test.

### Why Redux Saga?

✅ **Advantages:**
- Complex async workflows
- Better testability
- Centralized side effect logic
- Cancellation of async operations
- Debouncing and throttling
- Parallel and sequential execution
- Error handling

❌ **Trade-offs:**
- Steeper learning curve
- More boilerplate than thunks
- Generator syntax can be unfamiliar

---

## 1. Installation

```bash
npm install redux-saga

# Or with yarn
yarn add redux-saga
```

---

## 2. Basic Concepts

### Generator Functions

Redux Saga uses ES6 generator functions.

```javascript
// Regular function
function normalFunction() {
  return 'Hello';
}

// Generator function
function* generatorFunction() {
  yield 'Hello';
  yield 'World';
  return 'Done';
}

const gen = generatorFunction();
console.log(gen.next()); // { value: 'Hello', done: false }
console.log(gen.next()); // { value: 'World', done: false }
console.log(gen.next()); // { value: 'Done', done: true }
```

---

## 3. Effect Creators

Saga effects are plain JavaScript objects that describe operations.

### Common Effects

```javascript
import {
  call,      // Call a function
  put,       // Dispatch an action
  take,      // Wait for an action
  takeEvery, // Spawn saga on every action
  takeLatest,// Cancel previous, run latest
  select,    // Get state
  fork,      // Non-blocking call
  spawn,     // Detached fork
  cancel,    // Cancel a task
  delay,     // Delay execution
  all,       // Run effects in parallel
  race       // Race multiple effects
} from 'redux-saga/effects';
```

---

## 4. Basic Saga Example

```javascript
// sagas/userSaga.js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// API call function
const fetchUserApi = (userId) => {
  return axios.get(`/api/users/${userId}`);
};

// Worker saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
  try {
    // Dispatch loading action
    yield put({ type: 'USER_FETCH_PENDING' });
    
    // Call API
    const response = yield call(fetchUserApi, action.payload.userId);
    
    // Dispatch success action
    yield put({
      type: 'USER_FETCH_SUCCEEDED',
      payload: response.data
    });
  } catch (error) {
    // Dispatch failure action
    yield put({
      type: 'USER_FETCH_FAILED',
      payload: error.message
    });
  }
}

// Watcher saga: spawns new fetchUser task on each USER_FETCH_REQUESTED
function* watchFetchUser() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

export default watchFetchUser;
```

---

## 5. Setting Up Saga Middleware

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import userReducer from './features/user/userSlice';
import rootSaga from './sagas';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

// Run the root saga
sagaMiddleware.run(rootSaga);
```

### Root Saga

```javascript
// sagas/index.js
import { all, fork } from 'redux-saga/effects';
import watchFetchUser from './userSaga';
import watchFetchPosts from './postSaga';
import watchAuth from './authSaga';

// Single entry point to start all sagas at once
export default function* rootSaga() {
  yield all([
    fork(watchFetchUser),
    fork(watchFetchPosts),
    fork(watchAuth)
  ]);
}
```

---

## 6. Common Saga Patterns

### takeEvery vs takeLatest

```javascript
import { takeEvery, takeLatest } from 'redux-saga/effects';

// takeEvery: handles ALL dispatched actions
// Good for: Logging, analytics
function* watchEveryFetch() {
  yield takeEvery('FETCH_DATA', fetchDataSaga);
}

// takeLatest: cancels previous, runs latest only
// Good for: Search, autocomplete, fetch latest data
function* watchLatestSearch() {
  yield takeLatest('SEARCH_REQUESTED', searchSaga);
}
```

### Debouncing

```javascript
import { delay, takeLatest } from 'redux-saga/effects';

function* handleSearch(action) {
  // Wait 500ms before searching
  yield delay(500);
  
  // If another action comes in during delay, this saga is cancelled
  const results = yield call(searchApi, action.payload);
  yield put({ type: 'SEARCH_SUCCESS', payload: results });
}

function* watchSearch() {
  yield takeLatest('SEARCH_INPUT_CHANGED', handleSearch);
}
```

### Throttling

```javascript
import { throttle } from 'redux-saga/effects';

function* handleScroll(action) {
  // Handle scroll
  yield call(updateScrollPosition, action.payload);
}

function* watchScroll() {
  // Run at most once every 1000ms
  yield throttle(1000, 'SCROLL_EVENT', handleScroll);
}
```

### Parallel Execution

```javascript
import { all, call } from 'redux-saga/effects';

function* fetchAllData() {
  // Run all API calls in parallel
  const [users, posts, comments] = yield all([
    call(fetchUsers),
    call(fetchPosts),
    call(fetchComments)
  ]);
  
  yield put({
    type: 'FETCH_ALL_SUCCESS',
    payload: { users, posts, comments }
  });
}
```

### Sequential Execution

```javascript
function* loginFlow() {
  // Wait for login action
  const { username, password } = yield take('LOGIN_REQUEST');
  
  // Attempt login
  const user = yield call(loginApi, username, password);
  
  if (user) {
    yield put({ type: 'LOGIN_SUCCESS', payload: user });
    
    // After successful login, fetch user data
    yield call(fetchUserData, user.id);
    
    // Then fetch notifications
    yield call(fetchNotifications, user.id);
  } else {
    yield put({ type: 'LOGIN_FAILURE' });
  }
}
```

### Racing Effects

```javascript
import { race, call, put, delay } from 'redux-saga/effects';

function* fetchWithTimeout() {
  // Race between API call and timeout
  const { response, timeout } = yield race({
    response: call(fetchApi),
    timeout: delay(5000)
  });
  
  if (response) {
    yield put({ type: 'FETCH_SUCCESS', payload: response });
  } else {
    yield put({ type: 'FETCH_TIMEOUT' });
  }
}
```

### Task Cancellation

```javascript
import { take, call, cancel, fork } from 'redux-saga/effects';

function* backgroundSync() {
  while (true) {
    yield delay(5000);
    yield call(syncData);
  }
}

function* watchStartStopSync() {
  while (true) {
    yield take('START_SYNC');
    const syncTask = yield fork(backgroundSync);
    
    yield take('STOP_SYNC');
    yield cancel(syncTask);
  }
}
```

---

## 7. Accessing State with `select`

```javascript
import { select, put } from 'redux-saga/effects';

// Selector function
const getUserId = (state) => state.user.id;
const getAuthToken = (state) => state.auth.token;

function* fetchUserPosts() {
  // Get data from state
  const userId = yield select(getUserId);
  const token = yield select(getAuthToken);
  
  // Use in API call
  const posts = yield call(fetchPostsApi, userId, token);
  
  yield put({ type: 'POSTS_FETCH_SUCCESS', payload: posts });
}

// Get entire state
function* someLogic() {
  const state = yield select();
  console.log('Current state:', state);
}
```

---

## 8. Error Handling

```javascript
function* fetchUser(action) {
  try {
    const user = yield call(fetchUserApi, action.payload);
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', payload: error.message });
    
    // Log to error tracking service
    yield call(logError, error);
  }
}

// Global error handler
function* rootSaga() {
  try {
    yield all([
      fork(watchFetchUser),
      fork(watchFetchPosts)
    ]);
  } catch (error) {
    console.error('Root saga error:', error);
    // Could restart sagas or dispatch error action
    yield put({ type: 'SAGA_ERROR', payload: error });
  }
}
```

---

## 9. Testing Sagas

Sagas are easy to test because they yield plain objects.

```javascript
// userSaga.test.js
import { call, put } from 'redux-saga/effects';
import { fetchUser } from './userSaga';
import { fetchUserApi } from './api';

describe('fetchUser saga', () => {
  const generator = fetchUser({ payload: { userId: 1 } });
  
  it('should call API', () => {
    const effect = generator.next().value;
    expect(effect).toEqual(call(fetchUserApi, 1));
  });
  
  it('should dispatch success action', () => {
    const mockUser = { id: 1, name: 'John' };
    const effect = generator.next(mockUser).value;
    
    expect(effect).toEqual(
      put({
        type: 'USER_FETCH_SUCCEEDED',
        payload: mockUser
      })
    );
  });
  
  it('should handle errors', () => {
    const generator = fetchUser({ payload: { userId: 1 } });
    generator.next(); // Skip to API call
    
    const error = new Error('API Error');
    const effect = generator.throw(error).value;
    
    expect(effect).toEqual(
      put({
        type: 'USER_FETCH_FAILED',
        payload: error.message
      })
    );
  });
});
```

---

# Integration & Best Practices

## Redux Toolkit + Redux Saga Integration

You can use both together for the best of both worlds.

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import userReducer from './features/user/userSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk if only using sagas
      serializableCheck: false // Disable for sagas
    }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);
```

### Using Slice Actions with Sagas

```javascript
// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    fetchUserRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure
} = userSlice.actions;

export default userSlice.reducer;

// sagas/userSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure
} from '../features/user/userSlice';

function* handleFetchUser(action) {
  try {
    const user = yield call(fetchUserApi, action.payload);
    yield put(fetchUserSuccess(user));
  } catch (error) {
    yield put(fetchUserFailure(error.message));
  }
}

function* watchFetchUser() {
  yield takeLatest(fetchUserRequest.type, handleFetchUser);
}

export default watchFetchUser;
```

---

## When to Use What?

### Use Redux Toolkit Thunks When:
✅ Simple async operations  
✅ Single API calls  
✅ Straightforward error handling  
✅ Quick prototyping  
✅ Small to medium apps  

### Use Redux Saga When:
✅ Complex async workflows  
✅ Need cancellation  
✅ Debouncing/throttling  
✅ Polling or background tasks  
✅ Coordinating multiple actions  
✅ WebSocket connections  
✅ Complex business logic  
✅ Better testability required  

### Use Both When:
✅ Simple actions with thunks  
✅ Complex flows with sagas  
✅ Gradual migration  
✅ Large enterprise apps  

---

## Best Practices

### Redux Toolkit Best Practices

1. **Use `createSlice` for all state**
```javascript
// ✅ Good
const slice = createSlice({ name, initialState, reducers });

// ❌ Avoid
const reducer = (state = initialState, action) => { ... };
```

2. **Use `createAsyncThunk` for simple async**
```javascript
// ✅ Good for simple cases
export const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  return await api.getUser(id);
});
```

3. **Organize by feature**
```
src/
├── features/
│   ├── user/
│   │   ├── userSlice.js
│   │   └── userSaga.js
│   └── posts/
│       ├── postsSlice.js
│       └── postsSaga.js
└── store.js
```

4. **Use typed hooks with TypeScript**
```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Redux Saga Best Practices

1. **Use helper effects**
```javascript
// ✅ Good - use helpers
yield takeLatest('ACTION', saga);

// ❌ Avoid - manual take loop
while (true) {
  const action = yield take('ACTION');
  yield call(saga, action);
}
```

2. **Test your sagas**
```javascript
// Sagas are easy to test
const gen = mySaga(action);
expect(gen.next().value).toEqual(call(api.fetch));
```

3. **Handle errors properly**
```javascript
function* saga() {
  try {
    yield call(riskyOperation);
  } catch (error) {
    yield put(errorAction(error));
    yield call(logError, error);
  }
}
```

4. **Use `fork` for non-blocking calls**
```javascript
// Non-blocking
const task = yield fork(backgroundTask);

// Blocking
const result = yield call(mustWaitFor);
```

5. **Cancel tasks when needed**
```javascript
const task = yield fork(longRunningTask);
// Later...
yield cancel(task);
```

---

## Comparison Table

| Feature | Redux Toolkit Thunks | Redux Saga |
|---------|---------------------|------------|
| **Learning Curve** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Moderate |
| **Boilerplate** | ⭐⭐⭐⭐ Low | ⭐⭐⭐ Medium |
| **Async Control** | ⭐⭐⭐ Basic | ⭐⭐⭐⭐⭐ Advanced |
| **Testability** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Cancellation** | ❌ No | ✅ Yes |
| **Debouncing** | Manual | Built-in |
| **Parallel Tasks** | Promise.all | yield all() |
| **Best For** | Simple apps | Complex apps |

---

## Complete Example: Todo App

```javascript
// features/todos/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchTodosRequest: (state) => {
      state.loading = true;
    },
    fetchTodosSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchTodosFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTodoRequest: (state) => {
      state.loading = true;
    },
    addTodoSuccess: (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    }
  }
});

export const {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoRequest,
  addTodoSuccess
} = todosSlice.actions;

export default todosSlice.reducer;

// sagas/todosSaga.js
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoRequest,
  addTodoSuccess
} from '../features/todos/todosSlice';

function* fetchTodos() {
  try {
    const response = yield call(axios.get, '/api/todos');
    yield put(fetchTodosSuccess(response.data));
  } catch (error) {
    yield put(fetchTodosFailure(error.message));
  }
}

function* addTodo(action) {
  try {
    const response = yield call(axios.post, '/api/todos', action.payload);
    yield put(addTodoSuccess(response.data));
  } catch (error) {
    console.error('Failed to add todo:', error);
  }
}

export default function* todosSaga() {
  yield takeLatest(fetchTodosRequest.type, fetchTodos);
  yield takeEvery(addTodoRequest.type, addTodo);
}

// Component usage
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodosRequest, addTodoRequest } from './todosSlice';

function TodoList() {
  const { items, loading } = useSelector(state => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodosRequest());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(addTodoRequest({ text: 'New Todo' }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleAdd}>Add Todo</button>
      {items.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

---

## Resources

### Redux Toolkit
- **Docs:** https://redux-toolkit.js.org
- **GitHub:** https://github.com/reduxjs/redux-toolkit
- **Tutorial:** https://redux-toolkit.js.org/tutorials/quick-start

### Redux Saga
- **Docs:** https://redux-saga.js.org
- **GitHub:** https://github.com/redux-saga/redux-saga
- **Recipes:** https://redux-saga.js.org/docs/recipes

---

## Conclusion

**Redux Toolkit** simplifies Redux development with less boilerplate, better defaults, and built-in best practices. Perfect for most applications.

**Redux Saga** provides powerful tools for managing complex async workflows, side effects, and business logic. Ideal when you need advanced async control, cancellation, or complex coordination.

**Together**, they provide a robust solution for state management in large-scale applications, combining simplicity where possible with power where needed.

Choose based on your app's complexity:
- **Simple apps:** Redux Toolkit alone (with thunks)
- **Complex apps:** Redux Toolkit + Redux Saga
- **Enterprise apps:** Redux Toolkit + Redux Saga + RTK Query
