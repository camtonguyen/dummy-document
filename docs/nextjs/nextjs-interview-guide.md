# 50 Most Popular Next.js Interview Questions

A comprehensive guide covering the most frequently asked Next.js interview questions with detailed answers, core concepts, and tips to remember.

---

## Table of Contents

1. [Core Concepts & Fundamentals](#core-concepts--fundamentals)
2. [Routing](#routing)
3. [Data Fetching](#data-fetching)
4. [Rendering Strategies](#rendering-strategies)
5. [Server Components vs Client Components](#server-components-vs-client-components)
6. [API Routes & Server Actions](#api-routes--server-actions)
7. [Performance Optimization](#performance-optimization)
8. [Styling & Assets](#styling--assets)
9. [Authentication & Middleware](#authentication--middleware)
10. [Deployment & Production](#deployment--production)

---

## Core Concepts & Fundamentals

### 1. What is Next.js and why use it over plain React?

Next.js is a React framework that provides structure, features, and optimizations for production applications. While React is a library focused on building UI components, Next.js adds server-side rendering, file-based routing, API routes, and built-in optimizations.

**Key Advantages:**

- Server-side rendering (SSR) and static site generation (SSG) out of the box
- Automatic code splitting per route
- File-based routing system
- API routes for backend functionality
- Built-in image and font optimization
- Zero-config TypeScript support
- Excellent developer experience with Fast Refresh

**💡 Tip:** Emphasize that Next.js solves React's SEO limitations through server rendering and provides significantly better initial page load performance through automatic optimizations.

---

### 2. Explain the difference between Pages Router and App Router

| Feature        | Pages Router                           | App Router                    |
| -------------- | -------------------------------------- | ----------------------------- |
| Directory      | `/pages`                               | `/app`                        |
| Components     | Client by default                      | Server by default             |
| Data Fetching  | `getServerSideProps`, `getStaticProps` | `async` components, `fetch()` |
| Layouts        | Manual with `_app.js`                  | Nested `layout.js` files      |
| Loading States | Manual implementation                  | Built-in `loading.js`         |
| Error Handling | `_error.js`                            | `error.js` per segment        |
| Introduced     | Next.js 1.0                            | Next.js 13+                   |

**💡 Tip:** App Router is the future of Next.js. New projects should use App Router, but understand Pages Router for legacy codebases.

---

### 3. What is the file-based routing system in Next.js?

Next.js uses the file system to define routes. Files and folders in the `/app` or `/pages` directory automatically become routes.

```
app/
├── page.js          → /
├── about/
│   └── page.js      → /about
├── blog/
│   ├── page.js      → /blog
│   └── [slug]/
│       └── page.js  → /blog/:slug
└── (marketing)/
    └── pricing/
        └── page.js  → /pricing
```

**Special Files in App Router:**

- `page.js` - Unique UI for a route
- `layout.js` - Shared UI wrapper
- `loading.js` - Loading UI
- `error.js` - Error boundary
- `not-found.js` - 404 UI
- `route.js` - API endpoint

**💡 Tip:** Route groups using `(folderName)` organize code without affecting URL structure.

---

### 4. What is the purpose of `next.config.js`?

`next.config.js` is the configuration file for customizing Next.js behavior.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Configure image domains
  images: {
    domains: ['example.com', 'cdn.example.com'],
  },

  // Environment variables
  env: {
    API_URL: process.env.API_URL,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },

  // Rewrites (URL masking)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

**💡 Tip:** Know the difference between `redirects` (changes URL) and `rewrites` (masks URL without changing it).

---

### 5. How does Next.js handle environment variables?

Next.js has built-in support for environment variables with specific conventions:

```bash
# .env.local (gitignored, local overrides)
# .env.development (development mode)
# .env.production (production mode)
# .env (all environments)

# Server-only (default)
DATABASE_URL=postgres://localhost:5432/db
API_SECRET=my-secret-key

# Exposed to browser (prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=UA-12345
```

**Key Rules:**

- Variables without `NEXT_PUBLIC_` prefix are only available server-side
- `NEXT_PUBLIC_` variables are inlined at build time
- `.env.local` always overrides other env files
- Never commit secrets to version control

**💡 Tip:** Always use `NEXT_PUBLIC_` prefix consciously—exposing secrets to the client is a common security mistake.

---

## Routing

### 6. How do dynamic routes work in Next.js?

Dynamic routes use bracket notation to capture URL parameters:

```
app/
├── blog/
│   └── [slug]/
│       └── page.js      → /blog/hello-world
├── shop/
│   └── [...categories]/
│       └── page.js      → /shop/clothes/mens/shirts
└── docs/
    └── [[...slug]]/
        └── page.js      → /docs OR /docs/a/b/c
```

**Accessing Parameters:**

```jsx
// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  const { slug } = params; // 'hello-world'
  return <h1>Post: {slug}</h1>;
}

// app/shop/[...categories]/page.js
export default function Shop({ params }) {
  const { categories } = params; // ['clothes', 'mens', 'shirts']
  return <h1>Categories: {categories.join(' > ')}</h1>;
}
```

**Pattern Summary:**

- `[slug]` - Single dynamic segment
- `[...slug]` - Catch-all (required, matches one or more)
- `[[...slug]]` - Optional catch-all (matches zero or more)

**💡 Tip:** Use `generateStaticParams` to pre-render dynamic routes at build time.

---

### 7. What are Route Groups and when would you use them?

Route groups organize routes without affecting the URL structure using parentheses:

```
app/
├── (marketing)/
│   ├── layout.js       → Shared marketing layout
│   ├── about/
│   │   └── page.js     → /about
│   └── pricing/
│       └── page.js     → /pricing
├── (shop)/
│   ├── layout.js       → Shared shop layout
│   └── products/
│       └── page.js     → /products
└── (auth)/
    ├── layout.js       → Auth-specific layout
    ├── login/
    │   └── page.js     → /login
    └── register/
        └── page.js     → /register
```

**Use Cases:**

- Apply different layouts to route groups
- Organize routes by feature or team
- Create multiple root layouts
- Separate public and authenticated routes

**💡 Tip:** Route groups are purely organizational—they're removed from the URL path.

---

### 8. Explain Parallel Routes and Intercepting Routes

**Parallel Routes** render multiple pages simultaneously in the same layout using slots:

```
app/
├── @dashboard/
│   └── page.js
├── @analytics/
│   └── page.js
└── layout.js
```

```jsx
// app/layout.js
export default function Layout({ children, dashboard, analytics }) {
  return (
    <div>
      {children}
      <div className='grid grid-cols-2'>
        {dashboard}
        {analytics}
      </div>
    </div>
  );
}
```

**Intercepting Routes** show a route in a modal while preserving context:

```
app/
├── feed/
│   └── page.js
├── photo/
│   └── [id]/
│       └── page.js       → Direct navigation: /photo/123
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.js   → Intercepted: shows modal over feed
```

**Interception Conventions:**

- `(.)` - Same level
- `(..)` - One level up
- `(..)(..)` - Two levels up
- `(...)` - From root

**💡 Tip:** Instagram-style photo modals are the classic use case for intercepting routes.

---

### 9. How does the Link component work and how does it differ from anchor tags?

```jsx
import Link from 'next/link';

// Basic usage
<Link href="/about">About</Link>

// With dynamic routes
<Link href={`/blog/${post.slug}`}>Read More</Link>

// With query parameters
<Link href={{ pathname: '/search', query: { q: 'nextjs' } }}>
  Search
</Link>

// Prefetch disabled
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>

// Replace history instead of push
<Link href="/login" replace>Login</Link>
```

**Key Differences from `<a>` tags:**

| Feature     | `<Link>`          | `<a>`               |
| ----------- | ----------------- | ------------------- |
| Navigation  | Client-side (SPA) | Full page reload    |
| Prefetching | Automatic         | None                |
| Performance | Fast, no reload   | Slower, full reload |
| State       | Preserved         | Lost                |

**💡 Tip:** `Link` automatically prefetches pages in viewport during production. Disable with `prefetch={false}` for rarely-visited pages.

---

### 10. What is the `useRouter` hook and when do you use it?

```jsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Programmatic navigation
  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
  };

  // Replace current history entry
  const handleLogout = () => {
    router.replace('/login');
  };

  // Go back/forward
  const goBack = () => router.back();
  const goForward = () => router.forward();

  // Refresh current route (re-fetch server components)
  const refresh = () => router.refresh();

  // Prefetch a route
  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  return (
    <div>
      <p>Current path: {pathname}</p>
      <p>Search: {searchParams.get('q')}</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

**💡 Tip:** In App Router, use `useRouter` from `next/navigation`, not `next/router` (Pages Router).

---

## Data Fetching

### 11. How does data fetching work in Server Components?

Server Components can be `async` and fetch data directly:

```jsx
// app/users/page.js - This is a Server Component by default
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    cache: 'force-cache', // Default: cached indefinitely
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Fetch Caching Options:**

```jsx
// Cached indefinitely (default, like getStaticProps)
fetch(url, { cache: 'force-cache' });

// Never cached (like getServerSideProps)
fetch(url, { cache: 'no-store' });

// Revalidate every 60 seconds (ISR)
fetch(url, { next: { revalidate: 60 } });

// Tag-based revalidation
fetch(url, { next: { tags: ['users'] } });
```

**💡 Tip:** Server Components eliminate the need for `useEffect` + `useState` for data fetching—just use `async/await`.

---

### 12. Explain `getServerSideProps` (Pages Router)

```jsx
// pages/dashboard.js
export async function getServerSideProps(context) {
  const { req, res, params, query } = context;

  // Check authentication
  const session = await getSession(req);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Fetch data
  const data = await fetchDashboardData(session.userId);

  return {
    props: {
      user: session.user,
      data,
    },
  };
}

export default function Dashboard({ user, data }) {
  return <h1>Welcome, {user.name}</h1>;
}
```

**Key Points:**

- Runs on every request
- Has access to request/response objects
- Can redirect or return 404
- Data is passed as props
- Blocks rendering until complete

**💡 Tip:** Use `getServerSideProps` when you need request-time data (auth, cookies, personalization).

---

### 13. Explain `getStaticProps` and `getStaticPaths` (Pages Router)

```jsx
// pages/blog/[slug].js

// Define which paths to pre-render
export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: 'blocking', // or true, or false
  };
}

// Fetch data at build time
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60, // ISR: regenerate every 60 seconds
  };
}

export default function BlogPost({ post }) {
  return <article>{post.content}</article>;
}
```

**Fallback Options:**

- `false` - Return 404 for unknown paths
- `true` - Show loading state, then render
- `'blocking'` - SSR on first request, then cache

**💡 Tip:** `getStaticPaths` + `getStaticProps` = Static Site Generation (SSG). Add `revalidate` for ISR.

---

### 14. What is Incremental Static Regeneration (ISR)?

ISR allows you to update static pages after build without rebuilding the entire site:

```jsx
// Pages Router
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: { data },
    revalidate: 60, // Regenerate page every 60 seconds
  };
}

// App Router
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

**How ISR Works:**

1. Page is generated at build time
2. Cached page is served for 60 seconds
3. After 60 seconds, next request triggers background regeneration
4. Once regenerated, new page is served
5. If regeneration fails, old page continues to be served

**On-Demand Revalidation:**

```jsx
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const { path, tag } = await request.json();

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);

  return Response.json({ revalidated: true });
}
```

**💡 Tip:** ISR gives you the best of both worlds—static performance with dynamic freshness.

---

### 15. How do you handle loading and error states?

**App Router Built-in Files:**

```jsx
// app/dashboard/loading.js
export default function Loading() {
  return <div className="skeleton">Loading dashboard...</div>;
}

// app/dashboard/error.js
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/dashboard/not-found.js
export default function NotFound() {
  return <h2>Dashboard not found</h2>;
}
```

**Triggering Not Found:**

```jsx
import { notFound } from 'next/navigation';

async function getPost(slug) {
  const post = await fetchPost(slug);
  if (!post) notFound();
  return post;
}
```

**💡 Tip:** `loading.js` uses React Suspense under the hood. You can also use `<Suspense>` directly for more granular control.

---

### 16. What is React Suspense and how does Next.js use it?

```jsx
import { Suspense } from 'react';

// Async Server Component
async function UserProfile({ userId }) {
  const user = await fetchUser(userId); // Takes 2 seconds
  return <div>{user.name}</div>;
}

async function UserPosts({ userId }) {
  const posts = await fetchPosts(userId); // Takes 3 seconds
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

// Page with streaming
export default function ProfilePage({ params }) {
  return (
    <div>
      <h1>Profile</h1>

      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile userId={params.id} />
      </Suspense>

      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts userId={params.id} />
      </Suspense>
    </div>
  );
}
```

**Benefits:**

- Components stream in as they're ready
- Page is interactive faster
- Each component loads independently
- Better user experience than waiting for everything

**💡 Tip:** Wrap slow components in `<Suspense>` to prevent them from blocking the entire page.

---

## Rendering Strategies

### 17. Explain CSR, SSR, SSG, and ISR

| Strategy | When Rendered      | Use Case                          | SEO       |
| -------- | ------------------ | --------------------------------- | --------- |
| **CSR**  | Browser            | Dashboards, authenticated content | Poor      |
| **SSR**  | Every request      | Personalized, real-time data      | Good      |
| **SSG**  | Build time         | Blogs, docs, marketing            | Excellent |
| **ISR**  | Build + revalidate | E-commerce, news                  | Excellent |

**CSR (Client-Side Rendering):**

```jsx
'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{data.content}</div>;
}
```

**SSR (Server-Side Rendering):**

```jsx
// App Router - no-store cache
async function getData() {
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}
```

**SSG (Static Site Generation):**

```jsx
// App Router - default caching
async function getData() {
  const res = await fetch(url); // Cached by default
  return res.json();
}
```

**ISR (Incremental Static Regeneration):**

```jsx
async function getData() {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  return res.json();
}
```

**💡 Tip:** Choose based on data freshness needs and performance requirements. Most sites use a mix of strategies.

---

### 18. What is Streaming and how does it improve performance?

Streaming allows the server to send HTML in chunks as it's ready:

```jsx
// Without streaming: Wait for ALL data before sending anything
// Total wait: 5 seconds (sum of all fetches)

// With streaming: Send HTML progressively
// Initial HTML: Immediate
// Each component: As soon as its data is ready
```

**Implementation:**

```jsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      {/* Sent immediately */}
      <Header />

      {/* Streams in after 1 second */}
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>

      {/* Streams in after 3 seconds */}
      <Suspense fallback={<Skeleton />}>
        <VerySlowComponent />
      </Suspense>
    </main>
  );
}
```

**Benefits:**

- Faster Time to First Byte (TTFB)
- Improved Core Web Vitals
- Better user experience
- Page is interactive sooner

**💡 Tip:** Streaming is automatic in App Router. Use `loading.js` or `<Suspense>` to control loading states.

---

### 19. What is Partial Prerendering (PPR)?

PPR (experimental) combines static and dynamic rendering in a single route:

```jsx
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
};

// app/page.js
import { Suspense } from 'react';

// Static shell (prerendered at build)
export default function Page() {
  return (
    <main>
      <Header /> {/* Static */}
      <StaticContent /> {/* Static */}
      {/* Dynamic hole - streams in at request time */}
      <Suspense fallback={<CartSkeleton />}>
        <DynamicCart />
      </Suspense>
    </main>
  );
}

async function DynamicCart() {
  const cart = await getCart(); // Dynamic, user-specific
  return <Cart items={cart.items} />;
}
```

**How it works:**

1. Static parts are served instantly from CDN
2. Dynamic "holes" are streamed in at request time
3. Suspense boundaries define the static/dynamic split

**💡 Tip:** PPR is the future—static speed with dynamic personalization.

---

## Server Components vs Client Components

### 20. What are React Server Components (RSC)?

Server Components render on the server and send HTML to the client with zero JavaScript:

```jsx
// app/page.js - Server Component by default
import db from '@/lib/db';

export default async function Page() {
  // Direct database access - no API needed
  const users = await db.user.findMany();

  // Sensitive logic stays on server
  const secret = process.env.API_SECRET;

  // Large dependencies don't increase bundle
  import { format } from 'date-fns';

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**Benefits:**

- Zero client-side JavaScript for the component
- Direct backend access (database, file system)
- Secrets stay on server
- Large dependencies don't affect bundle size
- Better performance, especially on slow devices

**💡 Tip:** Server Components are the default in App Router. Only add `'use client'` when you need interactivity.

---

### 21. When should you use Client Components?

Add `'use client'` directive when you need:

```jsx
'use client';

import { useState, useEffect } from 'react';

export default function Counter() {
  // ✅ React hooks
  const [count, setCount] = useState(0);

  // ✅ Browser APIs
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // ✅ Event handlers
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

**Use Client Components for:**

- `useState`, `useEffect`, `useContext`, etc.
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `document`, `localStorage`)
- Third-party libraries that use hooks

**Use Server Components for:**

- Data fetching
- Backend access
- Static content
- Components without interactivity

**💡 Tip:** Keep Client Components as small as possible. Push `'use client'` as far down the tree as you can.

---

### 22. How do Server and Client Components compose together?

```jsx
// ❌ WRONG: Can't import Server Component into Client Component
'use client';
import ServerComponent from './ServerComponent'; // Error!

// ✅ RIGHT: Pass Server Components as children
// app/page.js (Server Component)
import ClientWrapper from './ClientWrapper';
import ServerContent from './ServerContent';

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* Passed as children */}
    </ClientWrapper>
  );
}

// ClientWrapper.js
'use client';
export default function ClientWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}  {/* Server Component renders here */}
    </div>
  );
}
```

**Key Rules:**

1. Server Components can import Client Components ✅
2. Client Components cannot import Server Components ❌
3. Client Components can render Server Components passed as props/children ✅
4. `'use client'` creates a boundary—everything it imports becomes client code

**💡 Tip:** Think of `'use client'` as a fence. Keep the fence as small as possible.

---

### 23. What are the limitations of Server Components?

**Cannot use in Server Components:**

- React hooks (`useState`, `useEffect`, `useContext`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, `document`)
- Class components with lifecycle methods
- Custom hooks that use state/effects

```jsx
// ❌ This will error
async function ServerComponent() {
  const [count, setCount] = useState(0); // Error!

  return <button onClick={() => setCount(c + 1)}>Count</button>; // Error!
}

// ✅ Split into Server + Client
// ServerComponent.js
async function ServerComponent() {
  const data = await fetchData();
  return <ClientCounter initialData={data} />;
}

// ClientCounter.js
('use client');
function ClientCounter({ initialData }) {
  const [count, setCount] = useState(initialData);
  return <button onClick={() => setCount(c + 1)}>{count}</button>;
}
```

**💡 Tip:** If you get a hooks error in App Router, you probably forgot `'use client'`.

---

## API Routes & Server Actions

### 24. How do API Routes work in Next.js?

**App Router (Route Handlers):**

```jsx
// app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });

  return NextResponse.json(user, { status: 201 });
}

export async function DELETE(request) {
  // Implementation
  return new Response(null, { status: 204 });
}
```

**Pages Router:**

```jsx
// pages/api/users.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await db.user.findMany();
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const user = await db.user.create({ data: req.body });
    return res.status(201).json(user);
  }

  res.status(405).end();
}
```

**💡 Tip:** Route Handlers support Web APIs (`Request`, `Response`). Use `NextResponse` for convenience methods.

---

### 25. What are Server Actions?

Server Actions allow you to run server code directly from components without creating API routes:

```jsx
// app/actions.js
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData) {
  const title = formData.get('title');
  const content = formData.get('content');

  await db.post.create({
    data: { title, content },
  });

  revalidatePath('/posts');
  redirect('/posts');
}

export async function deletePost(id) {
  await db.post.delete({ where: { id } });
  revalidatePath('/posts');
}
```

**Using in Components:**

```jsx
// Server Component - form action
import { createPost } from './actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name='title' required />
      <textarea name='content' required />
      <button type='submit'>Create Post</button>
    </form>
  );
}

// Client Component - call directly
('use client');
import { deletePost } from './actions';

export function DeleteButton({ id }) {
  return <button onClick={() => deletePost(id)}>Delete</button>;
}
```

**💡 Tip:** Server Actions are great for mutations. They're type-safe and work without JavaScript enabled.

---

### 26. How do you handle form validation with Server Actions?

```jsx
// app/actions.js
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

export async function signup(prevState, formData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = schema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  try {
    await createUser(result.data);
    redirect('/dashboard');
  } catch (error) {
    return { message: 'Email already exists' };
  }
}
```

```jsx
// app/signup/page.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions';

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <form action={formAction}>
      <input name='email' type='email' />
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <input name='password' type='password' />
      {state?.errors?.password && <p>{state.errors.password}</p>}

      <button disabled={pending}>
        {pending ? 'Signing up...' : 'Sign Up'}
      </button>

      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

**💡 Tip:** Use `useActionState` (React 19) or `useFormState` (React 18) for form state management with Server Actions.

---

## Performance Optimization

### 27. How does Next.js Image component optimize images?

```jsx
import Image from 'next/image';

// Local image (automatically optimized)
import heroImage from '../public/hero.jpg';

export default function Page() {
  return (
    <>
      {/* Local image - width/height inferred */}
      <Image
        src={heroImage}
        alt='Hero'
        placeholder='blur' // Built-in blur placeholder
        priority // Preload for LCP images
      />

      {/* Remote image - must specify dimensions */}
      <Image
        src='https://example.com/photo.jpg'
        alt='Remote'
        width={800}
        height={600}
        sizes='(max-width: 768px) 100vw, 50vw'
      />

      {/* Fill container */}
      <div className='relative h-64'>
        <Image
          src='/background.jpg'
          alt='Background'
          fill
          className='object-cover'
        />
      </div>
    </>
  );
}
```

**Configuration:**

```jsx
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};
```

**Key Benefits:**

- Automatic WebP/AVIF conversion
- Lazy loading by default
- Prevents layout shift (CLS)
- Responsive `srcset` generation
- Built-in blur placeholders

**💡 Tip:** Always add `priority` to above-the-fold images (LCP). Use `sizes` prop for responsive images.

---

### 28. How does font optimization work in Next.js?

```jsx
// app/layout.js
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

```css
/* Use CSS variables */
body {
  font-family: var(--font-inter);
}

code {
  font-family: var(--font-roboto-mono);
}
```

**Local Fonts:**

```jsx
import localFont from 'next/font/local';

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  display: 'swap',
});
```

**Benefits:**

- Zero layout shift (CLS = 0)
- Self-hosted (no Google requests)
- Automatic subsetting
- Preloaded and cached

**💡 Tip:** Using `next/font` eliminates render-blocking font requests and CLS caused by font loading.

---

### 29. What is code splitting and how does Next.js handle it?

Next.js automatically code-splits by route. Each page only loads its required JavaScript.

**Dynamic Imports for Components:**

```jsx
import dynamic from 'next/dynamic';

// Load component only when needed
const HeavyChart = dynamic(() => import('../components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Disable SSR if component uses browser APIs
});

// Named exports
const Modal = dynamic(() =>
  import('../components/Modal').then((mod) => mod.Modal)
);

export default function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <HeavyChart />}
    </>
  );
}
```

**Dynamic Imports in Server Components:**

```jsx
// Regular import() works in Server Components
export default async function Page() {
  const { processData } = await import('heavy-library');
  const result = processData(data);

  return <div>{result}</div>;
}
```

**💡 Tip:** Use `dynamic` for heavy components that aren't immediately visible. Use `ssr: false` for browser-only libraries.

---

### 30. How do you analyze and reduce bundle size?

**Enable Bundle Analyzer:**

```bash
npm install @next/bundle-analyzer
```

```jsx
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});
```

```bash
ANALYZE=true npm run build
```

**Strategies to Reduce Bundle Size:**

```jsx
// 1. Import only what you need
import { format } from 'date-fns';  // ✅ Tree-shakeable
import * as dateFns from 'date-fns'; // ❌ Imports everything

// 2. Dynamic imports for heavy components
const Chart = dynamic(() => import('recharts').then(m => m.LineChart));

// 3. Move to Server Components (zero client JS)
// Server Components don't add to client bundle

// 4. Use smaller alternatives
// moment.js (300kb) → date-fns (tree-shakeable)
// lodash → lodash-es or native methods

// 5. Check for duplicate dependencies
npm dedupe
```

**💡 Tip:** Server Components are the biggest bundle size win—they send zero JavaScript to the client.

---

### 31. What are the key Core Web Vitals and how does Next.js help?

| Metric      | What it measures         | Good Score | Next.js Solution                     |
| ----------- | ------------------------ | ---------- | ------------------------------------ |
| **LCP**     | Largest Contentful Paint | < 2.5s     | Image optimization, priority loading |
| **FID/INP** | Interactivity delay      | < 100ms    | Code splitting, Server Components    |
| **CLS**     | Cumulative Layout Shift  | < 0.1      | Image dimensions, Font optimization  |

**Best Practices:**

```jsx
// LCP: Prioritize hero images
<Image src={hero} priority />

// CLS: Always set image dimensions
<Image src={img} width={800} height={600} />

// CLS: Font optimization
const font = Inter({ display: 'swap' });

// INP: Reduce JavaScript
// Use Server Components (default in App Router)
// Lazy load non-critical components
const Modal = dynamic(() => import('./Modal'));
```

**💡 Tip:** Use `npx next info` to check your Next.js setup. Use Lighthouse and Web Vitals library to measure.

---

## Styling & Assets

### 32. What styling options does Next.js support?

**1. CSS Modules (Recommended):**

```jsx
// Button.module.css
.button {
  background: blue;
  color: white;
}

// Button.js
import styles from './Button.module.css';

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

**2. Tailwind CSS:**

```jsx
export function Button({ children }) {
  return (
    <button className='bg-blue-500 text-white px-4 py-2 rounded'>
      {children}
    </button>
  );
}
```

**3. CSS-in-JS (Client Components only):**

```jsx
'use client';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: blue;
  color: white;
`;
```

**4. Global CSS:**

```jsx
// app/layout.js
import './globals.css';
```

**5. Sass:**

```bash
npm install sass
```

```jsx
import styles from './Button.module.scss';
```

**💡 Tip:** CSS Modules are recommended for component styles. Use Tailwind for rapid development. Avoid CSS-in-JS in Server Components.

---

### 33. How do you handle static assets in Next.js?

```
public/
├── images/
│   └── logo.png
├── fonts/
│   └── custom.woff2
├── favicon.ico
└── robots.txt
```

**Accessing Static Files:**

```jsx
// Images - use next/image for optimization
import Image from 'next/image';

<Image src="/images/logo.png" width={200} height={100} alt="Logo" />

// Other static files
<a href="/documents/guide.pdf">Download Guide</a>
<link rel="icon" href="/favicon.ico" />
```

**App Router Metadata:**

```jsx
// app/layout.js
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};
```

**💡 Tip:** Don't put images directly in `public` if they need optimization—use `next/image` which handles optimization automatically.

---

## Authentication & Middleware

### 34. How does Middleware work in Next.js?

Middleware runs before a request is completed, allowing you to modify the response:

```jsx
// middleware.js (root of project)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect example
  if (pathname === '/old-page') {
    return NextResponse.redirect(new URL('/new-page', request.url));
  }

  // Rewrite example (URL masking)
  if (pathname.startsWith('/api/')) {
    return NextResponse.rewrite(
      new URL(`https://api.example.com${pathname}`, request.url)
    );
  }

  // Add headers
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  return response;
}

// Run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/((?!_next/static|favicon.ico).*)',
  ],
};
```

**💡 Tip:** Middleware runs on the Edge. Keep it fast—heavy operations should be in API routes or Server Components.

---

### 35. How do you implement authentication in Next.js?

**Using NextAuth.js (Auth.js):**

```jsx
// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await validateUser(credentials);
        return user || null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

**Protecting Routes with Middleware:**

```jsx
// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({ req: request });

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

**Using in Components:**

```jsx
// Server Component
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  return <h1>Welcome, {session.user.name}</h1>;
}

// Client Component
('use client');
import { useSession, signIn, signOut } from 'next-auth/react';

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return <button onClick={() => signOut()}>Sign Out</button>;
  }
  return <button onClick={() => signIn()}>Sign In</button>;
}
```

**💡 Tip:** Use `getServerSession` in Server Components, `useSession` in Client Components. Protect sensitive routes with middleware.

---

### 36. How do you handle cookies and sessions?

```jsx
// Server Component - Reading cookies
import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value;

  return <div className={theme}>Content</div>;
}

// Server Action - Setting cookies
('use server');
import { cookies } from 'next/headers';

export async function setTheme(theme) {
  cookies().set('theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function deleteSession() {
  cookies().delete('session');
}

// Route Handler
import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true });

  response.cookies.set('session', sessionId, {
    httpOnly: true,
    secure: true,
  });

  return response;
}
```

**💡 Tip:** Use `httpOnly` cookies for sensitive data like sessions. Never store sensitive data in client-accessible cookies.

---

## Deployment & Production

### 37. How do you deploy a Next.js application?

**Vercel (Recommended):**

```bash
# Automatic deployment via GitHub integration
git push origin main
```

**Self-hosted Node.js:**

```bash
npm run build
npm run start  # Starts production server on port 3000
```

**Docker:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```jsx
// next.config.js for standalone output
module.exports = {
  output: 'standalone',
};
```

**Static Export:**

```jsx
// next.config.js
module.exports = {
  output: 'export', // Generates static HTML
};
```

**💡 Tip:** Use `output: 'standalone'` for Docker. Use `output: 'export'` for static hosting (Netlify, S3).

---

### 38. What is the difference between `next build` and `next export`?

| Feature            | `next build`   | `output: 'export'`              |
| ------------------ | -------------- | ------------------------------- |
| Output             | `.next` folder | `out` folder (static HTML)      |
| Server Required    | Yes            | No                              |
| SSR                | Supported      | Not supported                   |
| API Routes         | Supported      | Not supported                   |
| ISR                | Supported      | Not supported                   |
| Image Optimization | Automatic      | Need external loader            |
| Dynamic Routes     | Supported      | Must use `generateStaticParams` |

```jsx
// For static export
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Or use a loader
  },
};
```

**💡 Tip:** Static export is great for CDN-hosted sites, but you lose server features. Most apps should use regular `next build`.

---

### 39. How do you handle environment variables in production?

```bash
# .env.local - Development (git-ignored)
DATABASE_URL=postgres://localhost/dev
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env.production - Production defaults
NEXT_PUBLIC_API_URL=https://api.mysite.com

# Set secrets in deployment platform, not in files
# DATABASE_URL, API_SECRET, etc.
```

**Runtime vs Build-time:**

```jsx
// Build-time (NEXT_PUBLIC_*) - Inlined at build
console.log(process.env.NEXT_PUBLIC_API_URL); // Works client & server

// Runtime (server-only) - Read at runtime
console.log(process.env.DATABASE_URL); // Server only

// Dynamic runtime config
// next.config.js
module.exports = {
  serverRuntimeConfig: {
    mySecret: process.env.MY_SECRET,
  },
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
};
```

**💡 Tip:** `NEXT_PUBLIC_` variables are embedded at build time. For runtime configuration, use server-side environment variables.

---

### 40. How do you implement caching strategies in production?

**Fetch Caching:**

```jsx
// Static (cached forever until revalidated)
fetch(url, { cache: 'force-cache' });

// Dynamic (no caching)
fetch(url, { cache: 'no-store' });

// Time-based revalidation
fetch(url, { next: { revalidate: 3600 } }); // 1 hour

// Tag-based revalidation
fetch(url, { next: { tags: ['products'] } });
```

**Route Segment Config:**

```jsx
// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force static rendering
export const dynamic = 'force-static';

// Set revalidation time for entire route
export const revalidate = 3600;
```

**On-Demand Revalidation:**

```jsx
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate specific path
revalidatePath('/products');

// Revalidate all routes with tag
revalidateTag('products');
```

**💡 Tip:** Use tags for related data (revalidate all products when inventory changes). Use paths for specific pages.

---

## Advanced Topics

### 41. How do you implement internationalization (i18n)?

**App Router with next-intl:**

```jsx
// middleware.js
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

```
app/
├── [locale]/
│   ├── layout.js
│   └── page.js
└── messages/
    ├── en.json
    ├── de.json
    └── fr.json
```

```jsx
// app/[locale]/page.js
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

```json
// messages/en.json
{
  "HomePage": {
    "title": "Welcome",
    "description": "This is the homepage"
  }
}
```

**💡 Tip:** Use `next-intl` for App Router i18n. Structure routes as `/[locale]/...` for URL-based locale detection.

---

### 42. How do you implement SEO in Next.js?

**App Router Metadata:**

```jsx
// app/layout.js - Global metadata
export const metadata = {
  title: {
    template: '%s | My Site',
    default: 'My Site',
  },
  description: 'My site description',
  openGraph: {
    title: 'My Site',
    description: 'My site description',
    url: 'https://mysite.com',
    siteName: 'My Site',
    images: [
      {
        url: 'https://mysite.com/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Site',
    description: 'My site description',
    images: ['https://mysite.com/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// app/blog/[slug]/page.js - Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

**Sitemap & Robots:**

```jsx
// app/sitemap.js
export default async function sitemap() {
  const posts = await getAllPosts();

  return [
    { url: 'https://mysite.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://mysite.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}

// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://mysite.com/sitemap.xml',
  };
}
```

**💡 Tip:** Use `generateMetadata` for dynamic pages. Include OpenGraph images for social sharing.

---

### 43. How do you handle errors globally in Next.js?

**App Router Error Handling:**

```jsx
// app/error.js - Catches errors in route tree
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/global-error.js - Catches errors in root layout
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

// Throwing errors in Server Components
import { notFound } from 'next/navigation';

async function getPost(slug) {
  const post = await db.post.findUnique({ where: { slug } });

  if (!post) {
    notFound(); // Triggers not-found.js
  }

  return post;
}
```

**💡 Tip:** `error.js` must be a Client Component. `global-error.js` replaces the root layout, so it needs `<html>` and `<body>`.

---

### 44. How do you implement testing in Next.js?

**Jest Setup:**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

```jsx
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customConfig);

// jest.setup.js
import '@testing-library/jest-dom';
```

**Component Testing:**

```jsx
// __tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**E2E Testing with Playwright:**

```jsx
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My Site/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL('/about');
});
```

**💡 Tip:** Use Jest for unit/component tests, Playwright for E2E tests. Mock `next/router` and `next/navigation` in tests.

---

### 45. What is Turbopack and how does it differ from Webpack?

Turbopack is Next.js's new Rust-based bundler, designed for faster development:

```bash
# Enable Turbopack in development
next dev --turbo
```

| Feature     | Webpack        | Turbopack           |
| ----------- | -------------- | ------------------- |
| Language    | JavaScript     | Rust                |
| Cold Start  | Slow (seconds) | Fast (milliseconds) |
| HMR         | Good           | Very fast           |
| Incremental | Partial        | Full incremental    |
| Stability   | Stable         | Beta (dev only)     |

**Key Differences:**

- Turbopack only compiles what's needed
- Native Rust performance
- Better caching and incremental compilation
- Currently only available for development

**💡 Tip:** Use Turbopack for faster dev experience. Production still uses Webpack (for now).

---

### 46. How do you handle state management in Next.js?

**Server State (React Query / SWR):**

```jsx
'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export function UserProfile({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;
  return <div>{data.name}</div>;
}
```

**Client State (Zustand):**

```jsx
// store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Component.jsx
('use client');
import { useStore } from './store';

export function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

**React Context (Built-in):**

```jsx
// app/providers.js
'use client';
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**💡 Tip:** Use SWR/React Query for server state, Zustand for simple client state, Redux for complex state. Server Components don't need client state—data is fetched on the server.

---

### 47. How do you implement real-time features in Next.js?

**WebSocket with Socket.io:**

```jsx
// app/api/socket/route.js
import { Server } from 'socket.io';

export function GET(req) {
  if (!global.io) {
    global.io = new Server(3001);

    global.io.on('connection', (socket) => {
      socket.on('message', (msg) => {
        global.io.emit('message', msg);
      });
    });
  }

  return new Response('Socket server running');
}
```

```jsx
// Client component
'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = (text) => {
    socket?.emit('message', text);
  };

  return (/* chat UI */);
}
```

**Server-Sent Events (SSE):**

```jsx
// app/api/events/route.js
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const data = await getLatestData();
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        await new Promise((r) => setTimeout(r, 1000));
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

**💡 Tip:** For real-time, consider managed services like Pusher, Ably, or Supabase Realtime for production.

---

### 48. How do you handle large file uploads in Next.js?

```jsx
// app/api/upload/route.js
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join(process.cwd(), 'uploads', file.name);
  await writeFile(path, buffer);

  return Response.json({ success: true, path });
}

// next.config.js - Increase body size limit
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

**For Large Files (use streaming):**

```jsx
// Consider using external storage
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET() {
  const command = new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: `uploads/${Date.now()}`,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return Response.json({ uploadUrl: signedUrl });
}
```

**💡 Tip:** For files > 10MB, use presigned URLs to upload directly to S3/Cloudflare R2. This avoids server memory issues.

---

### 49. How do you implement rate limiting?

```jsx
// lib/rate-limit.js
const rateLimit = new Map();

export function rateLimiter(ip, limit = 10, window = 60000) {
  const now = Date.now();
  const windowStart = now - window;

  const requestTimestamps = rateLimit.get(ip) || [];
  const recentRequests = requestTimestamps.filter((t) => t > windowStart);

  if (recentRequests.length >= limit) {
    return { success: false, remaining: 0 };
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  return { success: true, remaining: limit - recentRequests.length };
}

// app/api/data/route.js
import { rateLimiter } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  const { success, remaining } = rateLimiter(ip, 100, 60000);

  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  return Response.json({ data: 'OK' });
}
```

**For Production (use Redis):**

```jsx
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

**💡 Tip:** Use in-memory for development, Redis (Upstash) for production rate limiting across serverless functions.

---

### 50. What are the common pitfalls and best practices in Next.js?

**Common Pitfalls:**

```jsx
// ❌ Using hooks in Server Components
async function ServerComponent() {
  const [state, setState] = useState(); // Error!
}

// ❌ Importing server-only code in Client Components
('use client');
import db from './database'; // Exposes secrets!

// ❌ Forgetting to await async components
function Page() {
  return <AsyncComponent />; // Should be: await
}

// ❌ Not handling loading states
async function SlowComponent() {
  const data = await slowFetch(); // Blocks entire page
}

// ❌ Over-using 'use client'
('use client'); // Don't add this to parent components unnecessarily
```

**Best Practices:**

```jsx
// ✅ Keep Client Components small and at the leaves
// ✅ Use Suspense for streaming
<Suspense fallback={<Loading />}>
  <SlowComponent />
</Suspense>;

// ✅ Colocate data fetching with components
async function ProductList() {
  const products = await getProducts();
  return (
    <ul>
      {products.map((p) => (
        <li>{p.name}</li>
      ))}
    </ul>
  );
}

// ✅ Use server-only package for sensitive code
import 'server-only';
export function getSecretData() {
  /* ... */
}

// ✅ Parallel data fetching
const [users, posts] = await Promise.all([getUsers(), getPosts()]);

// ✅ Proper error boundaries
// ✅ Optimize images with next/image
// ✅ Use next/font for zero-CLS fonts
// ✅ Implement proper caching strategies
// ✅ Use TypeScript for type safety
```

**💡 Tip:** Think in Server Components first. Only add `'use client'` when you need interactivity. Push client boundaries down as far as possible.

---

## Quick Reference Cheat Sheet

### File Conventions (App Router)

| File           | Purpose                  |
| -------------- | ------------------------ |
| `page.js`      | Route UI                 |
| `layout.js`    | Shared wrapper           |
| `loading.js`   | Loading UI               |
| `error.js`     | Error boundary           |
| `not-found.js` | 404 UI                   |
| `route.js`     | API endpoint             |
| `template.js`  | Re-renders on navigation |
| `default.js`   | Parallel route fallback  |

### Data Fetching Quick Reference

```jsx
// Static (cached forever)
fetch(url);
fetch(url, { cache: 'force-cache' });

// Dynamic (every request)
fetch(url, { cache: 'no-store' });

// ISR (time-based)
fetch(url, { next: { revalidate: 60 } });

// Tag-based
fetch(url, { next: { tags: ['users'] } });
revalidateTag('users');
```

### Route Segment Options

```jsx
export const dynamic = 'auto' | 'force-dynamic' | 'error' | 'force-static';
export const revalidate = false | 0 | number;
export const fetchCache =
  'auto' |
  'default-cache' |
  'only-cache' |
  'force-cache' |
  'force-no-store' |
  'default-no-store' |
  'only-no-store';
export const runtime = 'nodejs' | 'edge';
```

---

## Interview Tips Summary

1. **Understand the mental model**: Server Components = default, Client Components = opt-in
2. **Know when to use what**: SSG for static, SSR for dynamic, ISR for hybrid
3. **Performance matters**: Image optimization, font optimization, code splitting
4. **Data fetching evolved**: No more `useEffect` for data—use async Server Components
5. **Caching is key**: Understand fetch caching, revalidation strategies
6. **Security awareness**: Keep secrets server-side, use middleware for auth
7. **Practical experience**: Be ready to discuss real projects and tradeoffs
