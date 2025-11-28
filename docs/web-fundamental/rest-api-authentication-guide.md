# REST API Authentication Methods for React.js

A comprehensive guide covering the four most commonly used authentication methods in REST APIs and how to implement them in React applications.

---

## Table of Contents

1. [JWT (JSON Web Token) Authentication](#1-jwt-json-web-token-authentication)
2. [OAuth 2.0](#2-oauth-20)
3. [Session-Based Authentication (Cookies)](#3-session-based-authentication-cookies)
4. [API Key Authentication](#4-api-key-authentication)
5. [Comparison Summary](#comparison-summary)
6. [Common Interview Questions](#common-interview-questions)

---

## 1. JWT (JSON Web Token) Authentication

### What is JWT?

JWT is a self-contained token format that securely transmits information between parties as a JSON object. The token is digitally signed, making it verifiable and trustworthy.

### JWT Structure

A JWT consists of three parts separated by dots: `xxxxx.yyyyy.zzzzz`

- **Header**: Contains the token type and signing algorithm
- **Payload**: Contains claims (user data, expiration, etc.)
- **Signature**: Verifies the token hasn't been tampered with

### How It Works

1. User submits credentials to the server
2. Server validates credentials and generates a JWT
3. Client stores the JWT (localStorage, sessionStorage, or memory)
4. Client sends JWT in the `Authorization` header for subsequent requests
5. Server validates the JWT and processes the request

### React Implementation

```jsx
// authContext.jsx - Authentication Context
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Decode and validate token on mount
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 > Date.now()) {
        setUser(payload);
      } else {
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const { accessToken, refreshToken } = await response.json();
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// apiClient.js - Axios instance with JWT interceptor
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request interceptor - attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });

        localStorage.setItem('token', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### Security Considerations

- **Never store JWTs in localStorage for sensitive apps** — vulnerable to XSS attacks
- Use `httpOnly` cookies for better security when possible
- Implement token refresh mechanisms
- Keep access tokens short-lived (15 minutes)
- Validate tokens on every request

---

## 2. OAuth 2.0

### What is OAuth 2.0?

OAuth 2.0 is an authorization framework that enables third-party applications to access user resources without exposing credentials. It's commonly used for "Login with Google/Facebook/GitHub" features.

### OAuth 2.0 Flows

- **Authorization Code Flow**: Most secure, for server-side apps
- **Authorization Code Flow with PKCE**: For SPAs and mobile apps (recommended)
- **Implicit Flow**: Deprecated, avoid using
- **Client Credentials Flow**: For machine-to-machine communication

### How Authorization Code Flow with PKCE Works

1. Generate a code verifier and code challenge
2. Redirect user to authorization server with code challenge
3. User authenticates and grants permission
4. Authorization server redirects back with authorization code
5. Exchange code + verifier for access token
6. Use access token to access protected resources

### React Implementation

```jsx
// oauth.js - PKCE utilities
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function initiateOAuthLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store verifier for later exchange
  sessionStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: crypto.randomUUID(), // CSRF protection
  });

  window.location.href = `https://auth.provider.com/authorize?${params}`;
}
```

```jsx
// OAuthCallback.jsx - Handle the callback
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './authContext';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useAuth();

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const code = searchParams.get('code');
      const codeVerifier = sessionStorage.getItem('code_verifier');

      if (!code || !codeVerifier) {
        navigate('/login?error=missing_params');
        return;
      }

      try {
        const response = await fetch('https://auth.provider.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
            code,
            redirect_uri: `${window.location.origin}/callback`,
            code_verifier: codeVerifier,
          }),
        });

        const tokens = await response.json();
        sessionStorage.removeItem('code_verifier');

        setTokens(tokens.access_token, tokens.refresh_token);
        navigate('/dashboard');
      } catch (error) {
        navigate('/login?error=token_exchange_failed');
      }
    };

    exchangeCodeForToken();
  }, [searchParams, navigate, setTokens]);

  return <div>Completing login...</div>;
}
```

```jsx
// LoginButton.jsx - Social login buttons
import { initiateOAuthLogin } from './oauth';

export default function LoginButton({ provider }) {
  const handleLogin = () => {
    initiateOAuthLogin(provider);
  };

  return (
    <button onClick={handleLogin}>
      Continue with {provider}
    </button>
  );
}
```

### Security Considerations

- **Always use PKCE** for SPAs — prevents authorization code interception
- Validate the `state` parameter to prevent CSRF attacks
- Store tokens securely (prefer `httpOnly` cookies via BFF pattern)
- Implement proper token refresh logic

---

## 3. Session-Based Authentication (Cookies)

### What is Session-Based Authentication?

The server creates a session and stores session data server-side. A session ID is sent to the client as a cookie, which is automatically included in subsequent requests.

### How It Works

1. User submits credentials
2. Server validates and creates a session (stored in memory/database)
3. Server sends session ID as an `httpOnly` cookie
4. Browser automatically sends cookie with every request
5. Server validates session ID and retrieves session data

### React Implementation

```jsx
// authContext.jsx - Session-based auth context
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Important: include cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const userData = await response.json();
    setUser(userData);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// apiClient.js - Fetch wrapper for session-based auth
const apiClient = {
  async request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }

    return response;
  },

  get(url) {
    return this.request(url);
  },

  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(url) {
    return this.request(url, { method: 'DELETE' });
  },
};

export default apiClient;
```

### CSRF Protection

```jsx
// useCsrfToken.js - CSRF token hook
import { useState, useEffect } from 'react';

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get CSRF token from cookie or meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.content
      || getCookie('XSRF-TOKEN');
    setCsrfToken(token);
  }, []);

  return csrfToken;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}

// Usage in API calls
export function useApi() {
  const csrfToken = useCsrfToken();

  const post = async (url, data) => {
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(data),
    });
  };

  return { post };
}
```

### Security Considerations

- Use `httpOnly` cookies — JavaScript can't access them (XSS protection)
- Set `Secure` flag — cookies only sent over HTTPS
- Set `SameSite=Strict` or `Lax` — CSRF protection
- Implement CSRF tokens for state-changing operations
- Set appropriate cookie expiration

---

## 4. API Key Authentication

### What is API Key Authentication?

A simple authentication method where a unique key is passed with each request to identify and authenticate the client. Commonly used for server-to-server communication or public APIs.

### How It Works

1. Client obtains an API key (usually from a dashboard)
2. Client includes the API key in requests (header, query param, or body)
3. Server validates the API key and processes the request

### React Implementation

```jsx
// apiKeyClient.js - API key in headers
const API_KEY = process.env.REACT_APP_API_KEY;

const apiKeyClient = {
  async request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  get(endpoint) {
    return this.request(`${process.env.REACT_APP_API_URL}${endpoint}`);
  },

  post(endpoint, data) {
    return this.request(`${process.env.REACT_APP_API_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default apiKeyClient;
```

```jsx
// useApiKey.js - Custom hook for API key management
import { useState, useCallback } from 'react';

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => 
    localStorage.getItem('user_api_key')
  );

  const saveApiKey = useCallback((key) => {
    localStorage.setItem('user_api_key', key);
    setApiKey(key);
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem('user_api_key');
    setApiKey(null);
  }, []);

  const createAuthenticatedFetch = useCallback((key = apiKey) => {
    return async (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-API-Key': key,
        },
      });
    };
  }, [apiKey]);

  return { apiKey, saveApiKey, clearApiKey, createAuthenticatedFetch };
}
```

```jsx
// ApiKeyInput.jsx - Component for API key entry
import { useState } from 'react';
import { useApiKey } from './useApiKey';

export default function ApiKeyInput() {
  const [inputKey, setInputKey] = useState('');
  const { apiKey, saveApiKey, clearApiKey } = useApiKey();

  const handleSubmit = (e) => {
    e.preventDefault();
    saveApiKey(inputKey);
    setInputKey('');
  };

  if (apiKey) {
    return (
      <div>
        <p>API Key: {apiKey.slice(0, 8)}...</p>
        <button onClick={clearApiKey}>Remove Key</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
        placeholder="Enter your API key"
      />
      <button type="submit">Save Key</button>
    </form>
  );
}
```

### Backend for Frontend (BFF) Pattern

For better security, use a backend proxy to hide API keys from the client:

```jsx
// Using a BFF proxy - client code
async function fetchData() {
  // API key is stored on your backend, not exposed to client
  const response = await fetch('/api/proxy/external-service', {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
}
```

### Security Considerations

- **Never expose API keys in client-side code** for sensitive APIs
- Use environment variables during build time only for public APIs
- Implement rate limiting on the server
- Use the BFF pattern to proxy requests and hide keys
- Rotate API keys regularly
- Use different keys for development and production

---

## Comparison Summary

| Feature | JWT | OAuth 2.0 | Session/Cookies | API Key |
|---------|-----|-----------|-----------------|---------|
| **Stateless** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Storage** | Client-side | Client-side | Server-side | Client/Server |
| **Best For** | SPAs, Mobile | Third-party login | Traditional web apps | Public APIs, M2M |
| **XSS Risk** | High (if localStorage) | High (if localStorage) | Low (httpOnly) | Medium |
| **CSRF Risk** | Low | Low | High (needs tokens) | Low |
| **Scalability** | High | High | Medium | High |
| **Complexity** | Medium | High | Low | Low |

---

## Common Interview Questions

### JWT Questions

**Q: What happens if a JWT is stolen?**
A: The attacker can impersonate the user until the token expires. Mitigations include short expiration times, token blacklisting, refresh token rotation, and storing tokens in httpOnly cookies.

**Q: How do you handle JWT expiration in React?**
A: Use axios interceptors to catch 401 responses, attempt a token refresh using the refresh token, and retry the original request. If refresh fails, redirect to login.

**Q: Why not store JWTs in localStorage?**
A: localStorage is vulnerable to XSS attacks. Any JavaScript running on the page can access it. Prefer httpOnly cookies or in-memory storage with refresh tokens.

### OAuth Questions

**Q: What is PKCE and why is it important for SPAs?**
A: PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks. Since SPAs can't securely store client secrets, PKCE provides security through a dynamically generated code verifier and challenge.

**Q: What's the difference between access tokens and refresh tokens?**
A: Access tokens are short-lived and used to access protected resources. Refresh tokens are long-lived and used to obtain new access tokens without re-authentication.

### Session Questions

**Q: How do cookies work with cross-origin requests?**
A: Cookies require `credentials: 'include'` in fetch and proper CORS headers (`Access-Control-Allow-Credentials: true`). SameSite attribute controls cross-site cookie sending.

**Q: How do you prevent CSRF attacks?**
A: Use CSRF tokens for state-changing requests, set `SameSite=Strict` or `Lax` on cookies, and validate the Origin/Referer headers.

### General Questions

**Q: Which authentication method would you choose for a new SPA?**
A: For a typical SPA, I'd recommend JWT with refresh tokens stored in httpOnly cookies (requires a BFF) or OAuth 2.0 with PKCE for third-party authentication. The choice depends on whether you need social login and your backend architecture.

**Q: How do you implement "remember me" functionality?**
A: Use longer-lived refresh tokens stored in persistent storage, while keeping access tokens short-lived. On "remember me," issue a refresh token with extended expiration.

---

## Additional Resources

- [OAuth 2.0 Specification](https://oauth.net/2/)
- [JWT.io](https://jwt.io/) - JWT debugger and library reference
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [React Query Auth](https://tanstack.com/query/latest/docs/react/examples/react/auth) - Managing auth state with React Query
