# 100 Next.js Interview Questions & Answers (2025 Edition)

This guide covers everything from the basics to the bleeding edge of Next.js 15, React 19, and advanced system design.

---

## 🔹 Part 1: Fundamentals & Core Concepts (1-20)

### 1. What is Next.js and how does it improve upon React?

- **Answer:** Next.js is a full-stack React framework. While React handles the View (UI), Next.js handles routing, data fetching, server-side rendering (SSR), and build optimization. It solves common React problems like SEO (Search Engine Optimization) and initial load performance.
- **Core Concept:** Framework vs. Library.

### 2. What are the key features of Next.js 15?

- **Answer:** Asynchronous Request APIs (breaking change), `fetch` defaults to `no-store` (uncached) in specific cases, Turbopack (stable for dev), React 19 support (Server Actions, `useActionState`), and partial prerendering (experimental).

### 3. What is the difference between SSR, SSG, and ISR?

- **Answer:**
  - **SSR (Server-Side Rendering):** Page generated on every request. Slower TTB (Time to Byte), but data is always fresh.
  - **SSG (Static Site Generation):** Page generated once at build time. Fastest, but data can be stale.
  - **ISR (Incremental Static Regeneration):** SSG pages are rebuilt in the background after a specific time interval when a request comes in.

### 4. What is Client-Side Rendering (CSR) in Next.js?

- **Answer:** The browser downloads a minimal HTML shell and a large JS bundle. The JS executes to render the UI and fetch data. This is the standard React behavior, used in Next.js when you use `"use client"` and fetch data inside `useEffect`.

### 5. What is Hydration?

- **Answer:** The process where React attaches event listeners (click, hover) to the static HTML served by the server, making the page interactive.
- **Tip:** Mismatched HTML between server and client causes "Hydration Errors."

### 6. What is the difference between `app/` and `pages/` directories?

- **Answer:** `pages/` uses the classic router (file-system based, no nested layouts). `app/` uses the new App Router with Server Components by default, nested layouts, streaming, and colocation of test/style files.

### 7. What are React Server Components (RSC)?

- **Answer:** Components that run **only** on the server. They reduce bundle size because their dependencies (like `date-fns` or database clients) are not sent to the browser. They cannot use hooks like `useState` or `useEffect`.

### 8. What is the `"use client"` directive?

- **Answer:** A boundary marker. It tells the bundler: "Everything below this import is part of the client bundle." It is required if you use state, effects, or browser APIs (like `window`).

### 9. What is the `"use server"` directive?

- **Answer:** It marks a function as a **Server Action**. These functions can be called from the client (e.g., in a form action) but execute securely on the server.

### 10. How does `Link` work in Next.js?

- **Answer:** It performs client-side navigation (SPA feel) by fetching the destination's JSON data and swapping the content without a full browser refresh. It also prefetches routes in the viewport.

### 11. What is the purpose of `layout.js`?

- **Answer:** It defines UI that is shared across multiple pages (like a Navbar or Sidebar). It preserves state (does not remount) when navigating between sibling pages.

### 12. What is `template.js` vs `layout.js`?

- **Answer:** `template.js` is similar to a layout but **creates a new instance** on navigation. Use it when you need to reset state (e.g., enter/exit animations or resetting a form) on every page view.

### 13. How do you handle metadata (SEO) in the App Router?

- **Answer:** Export a static `metadata` object or a dynamic `generateMetadata` function from a `page.js` or `layout.js`.

### 14. What is a "Catch-all" route?

- **Answer:** A file named `[...slug]/page.js` matches `/a`, `/a/b`, and `/a/b/c`. The parameters are available as an array. `[[...slug]]` (double brackets) makes it optional (matches the root `/` too).

### 15. What is the `loading.js` file?

- **Answer:** An instant loading state built on React Suspense. It shows immediately while the server component for the page is fetching data.

### 16. What is the `error.js` file?

- **Answer:** A client component that acts as an Error Boundary. It catches errors in its route segment and displays a fallback UI without crashing the whole app. It receives `error` and `reset()` props.

### 17. What is `not-found.js`?

- **Answer:** Rendered when `notFound()` is thrown or when a URL doesn't match any route. It replaces the default 404 page.

### 18. What are Route Groups?

- **Answer:** Folders wrapped in parenthesis `(folder)`. They are purely organizational and do not affect the URL path (e.g., grouping `(marketing)` and `(dashboard)` pages).

### 19. What are Parallel Routes?

- **Answer:** Defined with `@folder`. They allow rendering multiple pages in the same layout simultaneously (e.g., `@analytics` and `@team` on a dashboard).

### 20. What are Intercepting Routes?

- **Answer:** Defined with `(..)` syntax. They allow you to load a route within the current layout (like a modal) while maintaining the URL, but load a full page if refreshed.

---

## 🔹 Part 2: Data Fetching & Caching (21-40)

### 21. How do you fetch data in Next.js App Router?

- **Answer:** Use `await fetch()` directly inside a Server Component. No `useEffect` is needed.

### 22. How has caching changed in Next.js 15?

- **Answer:** `fetch` requests are now **uncached by default** (`cache: 'no-store'`) if they use dynamic data (like cookies/headers), whereas in Next.js 14 they were cached by default.

### 23. What is Request Memoization?

- **Answer:** If the same `fetch` URL/options are called multiple times in one render pass (e.g., in Layout and Page), Next.js executes it only once. This is a React feature.

### 24. What is the Data Cache?

- **Answer:** A persistent HTTP cache that stores the result of fetch requests across user requests and deployments. (This is distinct from the browser cache).

### 25. How do you revalidate data?

- **Answer:**
  - **Time-based:** `fetch(url, { next: { revalidate: 3600 } })` (ISR).
  - **On-demand:** `revalidatePath('/blog')` or `revalidateTag('posts')` inside a Server Action.

### 26. What is `generateStaticParams`?

- **Answer:** A function used in dynamic routes to define which slugs should be statically generated at build time. (Replaces `getStaticPaths`).

### 27. What is the difference between `cookies()` and `headers()` in Next.js 15?

- **Answer:** In Next.js 15, `cookies()` and `headers()` are **asynchronous** functions. You must `await` them (e.g., `const cookieStore = await cookies()`).

### 28. Can you use `axios` in Server Components?

- **Answer:** Yes, but you lose the automatic integration with Next.js's Data Cache and Request Memoization unless you manually wrap it with `unstable_cache` or React's `cache`.

### 29. What is a Server Action?

- **Answer:** An async function that runs on the server, callable from Client Components. It is primarily used for **mutations** (form submissions, database updates).

### 30. How do you redirect from a Server Component?

- **Answer:** `import { redirect } from 'next/navigation'; redirect('/login');`. This throws an internal error to stop rendering.

### 31. What happens if you fetch data in a Client Component?

- **Answer:** You must handle loading states and hydration manually (usually with `useEffect` or libraries like SWR/TanStack Query). The fetch happens on the user's browser, not the server.

### 32. What is `unstable_cache`?

- **Answer:** A Next.js utility to cache the results of expensive database queries (or non-fetch data) in the Data Cache.

### 33. What is Partial Prerendering (PPR)?

- **Answer:** An advanced rendering strategy where a static shell is served immediately (SSG), and dynamic parts (holes) are streamed in via Suspense (SSR).

### 34. What is the `dynamic` route segment config?

- **Answer:** `export const dynamic = 'force-dynamic'` forces a page to be SSR (no caching). `'force-static'` forces SSG.

### 35. How do you implement Infinite Scroll in App Router?

- **Answer:** Usually involves a Client Component observing a scroll target and calling a Server Action (or API route) to fetch the next page of data, appending it to the list.

### 36. What is `revalidateTag`?

- **Answer:** A precise cache invalidation strategy. You tag fetches: `fetch(url, { next: { tags: ['collection'] } })`. Later, calling `revalidateTag('collection')` purges all matching entries.

### 37. What is "Draft Mode"?

- **Answer:** Allows you to view non-published content from a headless CMS on a static site by bypassing the cache.

### 38. How do you secure a Server Action?

- **Answer:** Server Actions are public API endpoints. You must validate inputs (Zod) and check authentication/authorization inside the action function itself.

### 39. What is the difference between Server Actions and API Routes?

- **Answer:** API Routes (`route.js`) follow REST standards and return JSON. Server Actions return JS objects/void and are integrated directly into React's event lifecycle.

### 40. How do you handle form loading states with Server Actions?

- **Answer:** Use the `useActionState` (React 19) or `useFormStatus` hook in a Client Component to see if a submission is pending.

---

## 🔹 Part 3: Next.js 15 & React 19 Specifics (41-55)

### 41. What is the "Async Request APIs" breaking change in Next.js 15?

- **Answer:** APIs that rely on runtime request data (`params`, `searchParams`, `cookies`, `headers`) are now Promises. You must `await` them.
  - _Old:_ `const id = params.id`
  - _New:_ `const { id } = await params`

### 42. What is the React `use()` hook?

- **Answer:** A new hook that can read the value of a Promise or Context. In Next.js 15, it is used to unwrap `params` in Client Components: `const params = use(props.params)`.

### 43. Why did Next.js 15 change caching defaults?

- **Answer:** To reduce confusion. Previously, Next.js tried to cache everything, often leading to stale data bugs. Now, it defaults to dynamic (uncached) if you touch cookies/headers, requiring explicit opt-in for caching.

### 44. What is Turbopack?

- **Answer:** A Rust-based bundler replacing Webpack. In Next.js 15, it is stable for development (`next dev --turbo`), offering significantly faster startup and HMR times.

### 45. What is `next.config.ts`?

- **Answer:** Next.js 15 allows using TypeScript for the configuration file natively, providing autocomplete for config options.

### 46. What is the `Instrumentation` file?

- **Answer:** `instrumentation.ts` (or .js) allows you to run code when the Next.js server starts up (e.g., initializing OpenTelemetry or database connections).

### 47. What is the `use cache` directive (Experimental)?

- **Answer:** A proposed directive to cache the output of expensive computations or components automatically at the framework level.

### 48. How does `useFormStatus` work?

- **Answer:** It must be used inside a child component of the form. It returns `{ pending, data, method, action }` regarding the parent form's submission state.

### 49. What is `useActionState` (formerly `useFormState`)?

- **Answer:** A hook that allows you to update state based on the result of a Server Action (e.g., showing a success message or validation errors).

### 50. How do you define a Route Handler (API) in App Router?

- **Answer:** Create a `route.js` file. Export async functions named `GET`, `POST`, `PUT`, etc.

### 51. How do URL search parameters work in Server Components?

- **Answer:** They are passed as a prop: `await searchParams`. Using them forces the page to be dynamic (SSR) because query strings are known only at request time.

### 52. What is strict Content Security Policy (CSP) support in Next.js?

- **Answer:** Next.js supports generating nonces for inline scripts (`next/script`) to prevent XSS attacks.

### 53. What is the `image` response helper in Route Handlers?

- **Answer:** `import { ImageResponse } from 'next/og'`. It allows you to generate dynamic Open Graph (OG) images using JSX syntax on the edge.

### 54. How do you handle third-party scripts efficiently?

- **Answer:** Use `next/script`. The `strategy="lazyOnload"` or `"worker"` (experimental) moves script execution off the main thread or delays it until idle.

### 55. What is the difference between `router.push` and `router.replace`?

- **Answer:** `push` adds a new entry to the browser history stack (user can click back). `replace` overwrites the current entry (user cannot click back to the previous state).

---

## 🔹 Part 4: Optimization, Images & Fonts (56-70)

### 56. Why use `next/image` over `<img>`?

- **Answer:** Automatic format selection (AVIF/WebP), lazy loading (doesn't load until scrolled into view), and placeholder generation (blur-up effect) to prevent layout shift (CLS).

### 57. What is Layout Shift (CLS) and how does Next.js prevent it?

- **Answer:** CLS is when page elements jump around as resources load. `next/image` requires `width/height` (or `fill`), ensuring the browser reserves space before the image loads.

### 58. How do you optimize fonts?

- **Answer:** Use `next/font/google`. It downloads fonts at build time and self-hosts them, eliminating external network requests and layout shifts (FOIT/FOUT).

### 59. What is `output: 'standalone'`?

- **Answer:** A build configuration that traces dependencies and outputs a minimal folder containing only the necessary files to run the app. Essential for Dockerizing Next.js apps to keep image size small.

### 60. How do you analyze bundle size?

- **Answer:** Use `@next/bundle-analyzer`. It generates a visual treemap of your JS bundles to identify large libraries.

### 61. What is Lazy Loading of components?

- **Answer:** `const HeavyComponent = dynamic(() => import('./Heavy'))`. It splits the code and only loads the JS chunk when the component is actually rendered.

### 62. What are "barrel files" and why can they be bad?

- **Answer:** `index.js` files that re-export many modules. They can cause tree-shaking tools to include unused code. Next.js 15 has an option `optimizePackageImports` to handle this automatically for libraries like `lucide-react` or `@mui/material`.

### 63. What is the Edge Runtime?

- **Answer:** A lightweight runtime (V8) that runs closer to the user. It has faster cold starts than Node.js but limited API support. Used for Middleware.

### 64. How does Next.js handle static assets?

- **Answer:** Files in the `public/` folder are served as-is at the root URL. They are not bundled or processed by Webpack.

### 65. What is Metadata inheritance?

- **Answer:** Metadata defined in a root `layout.js` is inherited by child pages. Child pages can override specific fields (like `title`) while keeping others (like `og:image`) from the parent.

### 66. How do you implement a sitemap?

- **Answer:** Add a `sitemap.ts` (or .js) file in the `app/` directory. It can be a default export function that returns an array of URLs.

### 67. How do you implement `robots.txt`?

- **Answer:** Add a `robots.ts` file in `app/`. It generates the file dynamically or statically to control crawler access.

### 68. What is `generateStaticParams` "limit"?

- **Answer:** It does not have a strict limit, but generating thousands of pages at build time slows down deployment. ISR is often better for massive datasets.

### 69. How do you optimize LCP (Largest Contentful Paint)?

- **Answer:** Preload critical images (using `priority` prop on `next/image`), use server components to send HTML fast, and optimize fonts.

### 70. What is the difference between `next/link` prefetching `null` vs `true`?

- **Answer:**
  - `prefetch={null}` (default): Prefetches only static routes.
  - `prefetch={true}`: Prefetches both static and dynamic routes (use carefully).
  - `prefetch={false}`: No prefetching (happens only on hover).

---

## 🔹 Part 5: Middleware, Auth & Testing (71-85)

### 71. What is Middleware in Next.js?

- **Answer:** A function (`middleware.ts`) that runs **before** a request completes. It is used for rewriting paths, redirecting users, or modifying headers (e.g., Auth checks).

### 72. Where does Middleware run?

- **Answer:** Typically on the **Edge Runtime**. This means you cannot use standard Node.js APIs (like `fs` or `process.cwd()`) inside middleware.

### 73. How do you handle Authentication in Next.js?

- **Answer:**
  - **NextAuth.js (Auth.js):** Standard library for OAuth/Credentials.
  - **Manual:** Using HTTP-only cookies and Middleware to validate JWTs.
  - **External:** Clerk, Supabase Auth, etc.

### 74. How do you protect a route?

- **Answer:**
  1.  **Middleware:** Check for a session cookie; redirect if missing.
  2.  **Layout/Page Check:** Check session in the Server Component; `redirect()` if invalid.

### 75. How do you access the request object in a Server Component?

- **Answer:** You generally don't access the full Request object. You use helpers like `headers()`, `cookies()`, and `searchParams`.

### 76. How do you test Next.js applications?

- **Answer:**
  - **Unit Tests:** Jest + React Testing Library (for components).
  - **E2E Tests:** Playwright or Cypress (for full user flows).

### 77. Why is Playwright often recommended for Next.js?

- **Answer:** It supports the async nature of Next.js hydration well, handles multiple browsers, and is maintained by Microsoft (good TypeScript support).

### 78. What is `jest-dom`?

- **Answer:** A library that extends Jest with custom matchers for the DOM (e.g., `toBeInTheDocument`, `toBeVisible`), making tests more readable.

### 79. How do you mock `next/navigation` in tests?

- **Answer:** You must mock `useRouter`, `usePathname`, etc., usually by creating a `__mocks__/next/navigation.js` file or using `jest.mock`.

### 80. How do you handle internationalization (i18n)?

- **Answer:**
  - **Routing:** Put a dynamic segment at the root: `app/[lang]/layout.js`.
  - **Middleware:** Detect user locale and rewrite URL to include the `[lang]` prefix.
  - **Dictionary:** Load a JSON file based on the `lang` param.

### 81. What is "Module Path Aliasing"?

- **Answer:** Configuring `tsconfig.json` to allow imports like `@/components/Button` instead of `../../../components/Button`.

### 82. What is `next start` vs `next dev`?

- **Answer:**
  - `next dev`: Starts development server with Hot Module Replacement (HMR) and debugging.
  - `next start`: Starts the production server (must run `next build` first).

### 83. Can you host Next.js on a generic Node.js server (e.g., EC2)?

- **Answer:** Yes. Run `next build` then `next start`. Alternatively, use `output: 'standalone'` and run `node server.js` for a lighter footprint.

### 84. What is Vercel's role with Next.js?

- **Answer:** Vercel creates Next.js. While Next.js is open source and host-agnostic, Vercel provides zero-config deployment, Edge Middleware support, and ISR infrastructure out of the box.

### 85. What are "Private Folders"?

- **Answer:** Folders starting with an underscore (e.g., `_utils`). They are ignored by the router and not turned into URL paths.

---

## 🔹 Part 6: Coding Challenges & Scenarios (86-100)

### 86. Scenario: Your API keys are exposed in the browser. Why?

- **Answer:** You likely prefixed them with `NEXT_PUBLIC_` in your `.env` file, or you imported a file containing the secret into a Client Component.

### 87. Scenario: A page is showing old data even after a database update.

- **Answer:** The Data Cache is likely hit. Solution: Add `revalidatePath` in your mutation, or use `export const dynamic = 'force-dynamic'` to opt out of caching.

### 88. Scenario: `window` is not defined error.

- **Answer:** You are accessing `window` in a Client Component during the initial server render pass. Solution: Wrap in `useEffect` or check `if (typeof window !== 'undefined')`.

### 89. Scenario: How to pass data from a Server Component to a Client Component?

- **Answer:** Pass it as **props**. The data must be serializable (JSON-like). You cannot pass functions or Dates (unless converted to strings).

### 90. Scenario: Fix a "Prop mismatch" hydration error.

- **Answer:** This happens when HTML rendered on server differs from client. Common causes: `new Date()` (timestamps differ), `Math.random()`, or invalid HTML nesting (e.g., `<div>` inside `<p>`).

### 91. Scenario: You need to read a cookie in a Server Action.

- **Answer:** `import { cookies } from 'next/headers'; const store = await cookies(); const val = store.get('token');`

### 92. Scenario: Implementing a Dark Mode toggle.

- **Answer:** Use `next-themes`. It handles the hydration mismatch by suppressing the warning or using a script to set the class before React hydrates.

### 93. Scenario: Create a Breadcrumb component.

- **Answer:** use `usePathname()` hook. Split the string by `/` and map them to Links.

### 94. Scenario: How to handle high-traffic pages that change every 10 minutes?

- **Answer:** Use ISR with `revalidate: 600`. The page is static (fast) but updates every 10 minutes (fresh).

### 95. Scenario: User logs in, but the header doesn't update until refresh.

- **Answer:** You need to trigger a router refresh. After login, call `router.refresh()` (from `next/navigation`) to reload Server Components while keeping client state.

### 96. Coding: Create a typed link component.

- **Answer:** Use Next.js 15's experimental `typedRoutes` in `next.config.ts`. Or manually: `Link<Route>` where `Route` is a union of valid paths.

### 97. Scenario: Protecting a specific API route from abuse.

- **Answer:** Implement Rate Limiting. You can use a library like `upstash/ratelimit` inside Middleware or the Route Handler.

### 98. Scenario: How to display a persistent Music Player across pages?

- **Answer:** Place the Player component in the **Root Layout** (`app/layout.js`). It will remain mounted while the `children` (pages) swap out.

### 99. Scenario: "Module not found: Can't resolve 'fs'".

- **Answer:** You imported a Node.js-only module (like `fs`) into a Client Component. Move that logic to a Server Action or API Route.

### 100. Scenario: Optimizing a large e-commerce product list.

- **Answer:**
  1.  Use `generateStaticParams` to build top products statically.
  2.  Use `next/image` for thumbnails.
  3.  Implement pagination or infinite scroll.
  4.  Use `Suspense` to stream the product grid if it's slow.

---
