# REST API & GraphQL: Comprehensive Guide

## Table of Contents
1. [REST API Concepts](#rest-api-concepts)
2. [GraphQL Concepts](#graphql-concepts)
3. [Comparison & Best Practices](#comparison--best-practices)

---

# REST API Concepts

## What is REST?

**REST (Representational State Transfer)** is an architectural style for designing networked applications. It relies on a stateless, client-server protocol (typically HTTP) and treats server objects as resources that can be created, read, updated, or deleted.

**Created by:** Roy Fielding (2000)  
**Type:** Architectural style, not a protocol  
**Protocol:** Typically uses HTTP/HTTPS

---

## 1. REST Principles (Constraints)

### 1.1 Client-Server Architecture
- Separation of concerns
- Client handles UI and user experience
- Server handles data storage and business logic
- Can evolve independently

### 1.2 Stateless
- Each request contains all information needed
- Server doesn't store client context between requests
- Session state kept on client side

```
❌ Stateful (Bad)
Request 1: Login → Server stores session
Request 2: Get data → Server uses stored session

✅ Stateless (Good)
Request 1: Login → Returns token
Request 2: Get data + token → Server validates token
```

### 1.3 Cacheable
- Responses must define themselves as cacheable or non-cacheable
- Improves performance and scalability

```http
Cache-Control: max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### 1.4 Uniform Interface
- Standardized way to interact with resources
- Resource identification (URIs)
- Manipulation through representations (JSON, XML)
- Self-descriptive messages
- HATEOAS (Hypermedia as the Engine of Application State)

### 1.5 Layered System
- Client can't tell if connected directly to server
- Intermediary servers (proxies, load balancers) can be added

### 1.6 Code on Demand (Optional)
- Server can extend client functionality
- JavaScript, applets, etc.

---

## 2. HTTP Methods (Verbs)

REST APIs use HTTP methods to perform operations on resources.

### Common HTTP Methods

| Method | Purpose | Idempotent | Safe | Request Body | Response Body |
|--------|---------|------------|------|--------------|---------------|
| **GET** | Retrieve resource(s) | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **POST** | Create new resource | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **PUT** | Update/Replace resource | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **PATCH** | Partial update | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **DELETE** | Delete resource | ✅ Yes | ❌ No | ❌ Optional | ✅ Optional |
| **HEAD** | Get headers only | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **OPTIONS** | Get allowed methods | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |

### Examples

```http
# GET - Retrieve resources
GET /api/users
GET /api/users/123
GET /api/users?page=1&limit=10

# POST - Create new resource
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

# PUT - Full update (replace entire resource)
PUT /api/users/123
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 30
}

# PATCH - Partial update
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}

# DELETE - Remove resource
DELETE /api/users/123
```

---

## 3. Resource Naming Conventions

### Best Practices

✅ **Good URIs:**
```
GET    /users              # Get all users
GET    /users/123          # Get specific user
POST   /users              # Create user
PUT    /users/123          # Update user
DELETE /users/123          # Delete user
GET    /users/123/posts    # Get user's posts
GET    /posts?userId=123   # Alternative
```

❌ **Bad URIs:**
```
GET    /getUsers           # Don't use verbs
POST   /createUser         # Method conveys action
GET    /user/123           # Use plural nouns
GET    /Users              # Use lowercase
GET    /users/delete/123   # Use HTTP method
```

### URI Structure Rules

1. **Use nouns, not verbs**
   - ✅ `/users`
   - ❌ `/getUsers`

2. **Use plural nouns**
   - ✅ `/users/123`
   - ❌ `/user/123`

3. **Use hyphens for readability**
   - ✅ `/blog-posts`
   - ❌ `/blog_posts` or `/blogPosts`

4. **Use lowercase**
   - ✅ `/users/123/orders`
   - ❌ `/Users/123/Orders`

5. **Don't use file extensions**
   - ✅ `/users/123`
   - ❌ `/users/123.json`

6. **Use query parameters for filtering**
   - ✅ `/users?role=admin&status=active`
   - ❌ `/users/admin/active`

7. **Nested resources (max 2-3 levels)**
   - ✅ `/users/123/posts/456/comments`
   - ⚠️ Avoid too deep nesting

---

## 4. HTTP Status Codes

### Success Codes (2xx)

| Code | Name | Usage |
|------|------|-------|
| **200** | OK | Successful GET, PUT, PATCH, DELETE |
| **201** | Created | Successful POST (resource created) |
| **202** | Accepted | Request accepted for processing |
| **204** | No Content | Successful DELETE (no response body) |

### Redirection Codes (3xx)

| Code | Name | Usage |
|------|------|-------|
| **301** | Moved Permanently | Resource permanently moved |
| **304** | Not Modified | Cached version still valid |

### Client Error Codes (4xx)

| Code | Name | Usage |
|------|------|-------|
| **400** | Bad Request | Invalid request syntax/data |
| **401** | Unauthorized | Authentication required |
| **403** | Forbidden | Authenticated but no permission |
| **404** | Not Found | Resource doesn't exist |
| **405** | Method Not Allowed | HTTP method not supported |
| **409** | Conflict | Resource conflict (duplicate) |
| **422** | Unprocessable Entity | Validation error |
| **429** | Too Many Requests | Rate limit exceeded |

### Server Error Codes (5xx)

| Code | Name | Usage |
|------|------|-------|
| **500** | Internal Server Error | Generic server error |
| **502** | Bad Gateway | Invalid response from upstream |
| **503** | Service Unavailable | Server temporarily unavailable |
| **504** | Gateway Timeout | Upstream server timeout |

### Examples

```javascript
// 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}

// 201 Created
{
  "id": 124,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}

// 404 Not Found
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID 999 not found"
  }
}

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "abc-123-def"
  }
}
```

---

## 5. Request & Response Structure

### Request Components

```http
POST /api/v1/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
User-Agent: MyApp/1.0

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Parts:**
1. **Request Line:** Method, URI, HTTP version
2. **Headers:** Metadata about request
3. **Body:** Data being sent (for POST, PUT, PATCH)

### Response Components

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/users/123
X-RateLimit-Remaining: 99
Cache-Control: no-cache

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Parts:**
1. **Status Line:** HTTP version, status code, reason phrase
2. **Headers:** Metadata about response
3. **Body:** Data being returned

---

## 6. Authentication & Authorization

### Common Methods

#### 6.1 API Keys

```http
GET /api/users
X-API-Key: your-api-key-here
```

#### 6.2 Bearer Token (JWT)

```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 6.3 Basic Authentication

```http
GET /api/users
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

#### 6.4 OAuth 2.0

```javascript
// Authorization Code Flow
1. Client redirects to: 
   GET https://auth.example.com/oauth/authorize?
       client_id=abc123&
       redirect_uri=https://myapp.com/callback&
       response_type=code&
       scope=read write

2. User logs in and grants permission

3. Server redirects back:
   GET https://myapp.com/callback?code=xyz789

4. Exchange code for token:
   POST https://auth.example.com/oauth/token
   {
     "grant_type": "authorization_code",
     "code": "xyz789",
     "client_id": "abc123",
     "client_secret": "secret",
     "redirect_uri": "https://myapp.com/callback"
   }

5. Receive access token:
   {
     "access_token": "token123",
     "token_type": "Bearer",
     "expires_in": 3600,
     "refresh_token": "refresh456"
   }

6. Use token in requests:
   GET /api/users
   Authorization: Bearer token123
```

---

## 7. Pagination

### Offset-Based Pagination

```http
GET /api/users?page=2&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### Cursor-Based Pagination

```http
GET /api/users?cursor=eyJpZCI6MTAwfQ&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIwfQ",
    "prevCursor": "eyJpZCI6ODAwfQ",
    "hasMore": true
  }
}
```

### Link Header Pagination (GitHub style)

```http
GET /api/users?page=2

Response Headers:
Link: <https://api.example.com/users?page=3>; rel="next",
      <https://api.example.com/users?page=1>; rel="prev",
      <https://api.example.com/users?page=1>; rel="first",
      <https://api.example.com/users?page=10>; rel="last"
```

---

## 8. Filtering, Sorting, and Searching

### Filtering

```http
# Single filter
GET /api/users?role=admin

# Multiple filters
GET /api/users?role=admin&status=active&age_gt=18

# Complex filters
GET /api/products?price[gte]=100&price[lte]=500&category=electronics
```

### Sorting

```http
# Sort ascending
GET /api/users?sort=name

# Sort descending
GET /api/users?sort=-createdAt

# Multiple sort fields
GET /api/users?sort=name,-createdAt
```

### Searching

```http
# Simple search
GET /api/users?search=john

# Field-specific search
GET /api/users?name=john&email=example.com

# Full-text search
GET /api/articles?q=javascript+tutorial
```

### Field Selection (Sparse Fieldsets)

```http
# Select specific fields
GET /api/users?fields=id,name,email

Response:
{
  "data": [
    {
      "id": 1,
      "name": "John",
      "email": "john@example.com"
    }
  ]
}
```

---

## 9. Versioning

### 1. URI Versioning (Most Common)

```http
GET /api/v1/users
GET /api/v2/users
```

**Pros:** Simple, clear, cache-friendly  
**Cons:** Multiple versions in codebase

### 2. Header Versioning

```http
GET /api/users
Accept: application/vnd.example.v1+json
```

**Pros:** Clean URIs  
**Cons:** Less visible, harder to test

### 3. Query Parameter Versioning

```http
GET /api/users?version=1
```

**Pros:** Simple  
**Cons:** Pollutes query parameters

### 4. Content Negotiation

```http
GET /api/users
Accept: application/vnd.example+json; version=1
```

**Pros:** RESTful, flexible  
**Cons:** Complex

---

## 10. Rate Limiting

### Headers

```http
Response Headers:
X-RateLimit-Limit: 1000        # Max requests per window
X-RateLimit-Remaining: 999     # Requests remaining
X-RateLimit-Reset: 1640000000  # Reset timestamp
Retry-After: 3600              # Seconds until retry
```

### Response When Limited

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 3600

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 3600
  }
}
```

---

## 11. HATEOAS (Hypermedia)

Responses include links to related resources.

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "_links": {
    "self": {
      "href": "/api/users/123"
    },
    "posts": {
      "href": "/api/users/123/posts"
    },
    "followers": {
      "href": "/api/users/123/followers"
    },
    "edit": {
      "href": "/api/users/123",
      "method": "PUT"
    },
    "delete": {
      "href": "/api/users/123",
      "method": "DELETE"
    }
  }
}
```

---

## 12. REST API Example (Express.js)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' }
];

// GET all users
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredUsers = users;
  
  if (search) {
    filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  });
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      }
    });
  }
  
  res.json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Name and email are required'
      }
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201)
     .location(`/api/users/${newUser.id}`)
     .json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({
      error: { message: 'User not found' }
    });
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: { message: 'Name and email are required' }
    });
  }
  
  user.name = name;
  user.email = email;
  user.updatedAt = new Date().toISOString();
  
  res.json(user);
});

// PATCH partial update
app.patch('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({
      error: { message: 'User not found' }
    });
  }
  
  Object.assign(user, req.body);
  user.updatedAt = new Date().toISOString();
  
  res.json(user);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      error: { message: 'User not found' }
    });
  }
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

# GraphQL Concepts

## What is GraphQL?

**GraphQL** is a query language for APIs and a runtime for executing those queries with your existing data. It provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need, and makes it easier to evolve APIs over time.

**Created by:** Facebook (2012), Open-sourced (2015)  
**Type:** Query language and runtime  
**Protocol:** Typically uses HTTP (POST to single endpoint)

---

## 1. Core Concepts

### 1.1 Schema

The schema defines the API's type system and operations.

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  published: Boolean!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
  posts(authorId: ID): [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!
  createPost(title: String!, content: String!, authorId: ID!): Post!
}

type Subscription {
  userCreated: User!
  postAdded: Post!
  commentAdded(postId: ID!): Comment!
}
```

### 1.2 Types

#### Scalar Types
- `Int` - Signed 32-bit integer
- `Float` - Signed double-precision floating-point
- `String` - UTF-8 character sequence
- `Boolean` - true or false
- `ID` - Unique identifier

#### Custom Scalar Types
```graphql
scalar DateTime
scalar Email
scalar URL
```

#### Object Types
```graphql
type User {
  id: ID!
  name: String!
}
```

#### Enum Types
```graphql
enum Role {
  ADMIN
  USER
  GUEST
}

type User {
  id: ID!
  role: Role!
}
```

#### Interface Types
```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

type Post implements Node {
  id: ID!
  title: String!
}
```

#### Union Types
```graphql
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}
```

#### Input Types
```graphql
input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}
```

---

## 2. Queries

### Basic Query

```graphql
# Query
query {
  user(id: "123") {
    id
    name
    email
  }
}

# Response
{
  "data": {
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Nested Query

```graphql
query {
  user(id: "123") {
    id
    name
    posts {
      id
      title
      comments {
        id
        text
        author {
          name
        }
      }
    }
  }
}
```

### Query with Variables

```graphql
# Query
query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}

# Variables
{
  "userId": "123"
}
```

### Multiple Queries

```graphql
query {
  user1: user(id: "123") {
    name
  }
  user2: user(id: "456") {
    name
  }
}
```

### Fragments

```graphql
fragment UserInfo on User {
  id
  name
  email
}

query {
  user1: user(id: "123") {
    ...UserInfo
  }
  user2: user(id: "456") {
    ...UserInfo
  }
}
```

### Inline Fragments (for Unions/Interfaces)

```graphql
query {
  search(query: "john") {
    ... on User {
      name
      email
    }
    ... on Post {
      title
      content
    }
    ... on Comment {
      text
    }
  }
}
```

---

## 3. Mutations

### Basic Mutation

```graphql
mutation {
  createUser(name: "Jane Doe", email: "jane@example.com") {
    id
    name
    email
    createdAt
  }
}
```

### Mutation with Variables

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}

# Variables
{
  "input": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Multiple Mutations

```graphql
mutation {
  createUser1: createUser(name: "User 1", email: "user1@example.com") {
    id
  }
  createUser2: createUser(name: "User 2", email: "user2@example.com") {
    id
  }
}
```

---

## 4. Subscriptions

Real-time updates using WebSocket.

```graphql
# Subscribe
subscription {
  userCreated {
    id
    name
    email
  }
}

# Server pushes data when event occurs
{
  "data": {
    "userCreated": {
      "id": "789",
      "name": "New User",
      "email": "new@example.com"
    }
  }
}
```

### Subscription with Filter

```graphql
subscription OnCommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    text
    author {
      name
    }
  }
}
```

---

## 5. Directives

Modify query execution.

### Built-in Directives

#### @include
```graphql
query GetUser($withEmail: Boolean!) {
  user(id: "123") {
    name
    email @include(if: $withEmail)
  }
}
```

#### @skip
```graphql
query GetUser($skipEmail: Boolean!) {
  user(id: "123") {
    name
    email @skip(if: $skipEmail)
  }
}
```

#### @deprecated
```graphql
type User {
  id: ID!
  name: String!
  fullName: String! @deprecated(reason: "Use 'name' instead")
}
```

### Custom Directives

```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

type Query {
  users: [User!]! @auth(requires: ADMIN)
  user(id: ID!): User @auth
}
```

---

## 6. Resolvers

Resolvers define how to fetch data for each field.

```javascript
const resolvers = {
  Query: {
    // Get single user
    user: async (parent, args, context, info) => {
      return await context.db.users.findById(args.id);
    },
    
    // Get all users
    users: async (parent, { limit, offset }, context) => {
      return await context.db.users.find().limit(limit).skip(offset);
    },
    
    // Get posts
    posts: async (parent, { authorId }, context) => {
      if (authorId) {
        return await context.db.posts.find({ authorId });
      }
      return await context.db.posts.find();
    }
  },
  
  Mutation: {
    createUser: async (parent, { name, email }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      // Validate
      if (!email.includes('@')) {
        throw new Error('Invalid email');
      }
      
      // Create user
      const newUser = await context.db.users.create({
        name,
        email,
        createdAt: new Date()
      });
      
      return newUser;
    },
    
    updateUser: async (parent, { id, name, email }, context) => {
      const user = await context.db.users.findById(id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check authorization
      if (user.id !== context.user.id && !context.user.isAdmin) {
        throw new Error('Not authorized');
      }
      
      return await context.db.users.update(id, { name, email });
    },
    
    deleteUser: async (parent, { id }, context) => {
      await context.db.users.delete(id);
      return true;
    }
  },
  
  Subscription: {
    userCreated: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(['USER_CREATED']);
      }
    },
    
    commentAdded: {
      subscribe: (parent, { postId }, { pubsub }) => {
        return pubsub.asyncIterator([`COMMENT_ADDED_${postId}`]);
      }
    }
  },
  
  // Field resolvers
  User: {
    posts: async (parent, args, context) => {
      // parent is the User object
      return await context.db.posts.find({ authorId: parent.id });
    },
    
    email: (parent, args, context) => {
      // Hide email from non-owners
      if (context.user?.id !== parent.id) {
        return null;
      }
      return parent.email;
    }
  },
  
  Post: {
    author: async (parent, args, context) => {
      return await context.db.users.findById(parent.authorId);
    },
    
    comments: async (parent, args, context) => {
      return await context.db.comments.find({ postId: parent.id });
    }
  }
};
```

---

## 7. GraphQL Server Setup (Apollo Server)

```javascript
const { ApolloServer, gql } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

// Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }
  
  type Query {
    user(id: ID!): User
    users: [User!]!
    post(id: ID!): Post
    posts: [Post!]!
  }
  
  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }
  
  type Subscription {
    userCreated: User!
    postCreated: Post!
  }
`;

// In-memory database
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' }
];

let posts = [
  { id: '1', title: 'First Post', content: 'Content here', authorId: '1' }
];

// Resolvers
const resolvers = {
  Query: {
    user: (parent, { id }) => users.find(u => u.id === id),
    users: () => users,
    post: (parent, { id }) => posts.find(p => p.id === id),
    posts: () => posts
  },
  
  Mutation: {
    createUser: (parent, { name, email }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email
      };
      users.push(newUser);
      
      // Publish subscription
      pubsub.publish('USER_CREATED', { userCreated: newUser });
      
      return newUser;
    },
    
    createPost: (parent, { title, content, authorId }) => {
      const newPost = {
        id: String(posts.length + 1),
        title,
        content,
        authorId
      };
      posts.push(newPost);
      
      // Publish subscription
      pubsub.publish('POST_CREATED', { postCreated: newPost });
      
      return newPost;
    }
  },
  
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(['USER_CREATED'])
    },
    postCreated: {
      subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
    }
  },
  
  User: {
    posts: (parent) => posts.filter(p => p.authorId === parent.id)
  },
  
  Post: {
    author: (parent) => users.find(u => u.id === parent.authorId)
  }
};

// Create server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Add authentication, database, etc. to context
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user, db };
  }
});

// Start server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

---

## 8. Client Usage (Apollo Client - React)

```javascript
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

// Setup client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${token}`
  }
});

// Wrap app
function App() {
  return (
    <ApolloProvider client={client}>
      <UserList />
    </ApolloProvider>
  );
}

// Query
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
`;

function UserList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      {data.users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>Posts: {user.posts.length}</p>
        </div>
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}

// Mutation
const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    // Update cache after mutation
    update(cache, { data: { createUser } }) {
      const { users } = cache.readQuery({ query: GET_USERS });
      cache.writeQuery({
        query: GET_USERS,
        data: { users: [...users, createUser] }
      });
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    createUser({
      variables: {
        name: formData.get('name'),
        email: formData.get('email')
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}

// Subscription
const USER_CREATED_SUBSCRIPTION = gql`
  subscription OnUserCreated {
    userCreated {
      id
      name
      email
    }
  }
`;

function UserSubscription() {
  const { data, loading } = useSubscription(USER_CREATED_SUBSCRIPTION);
  
  return (
    <div>
      {!loading && data && (
        <p>New user: {data.userCreated.name}</p>
      )}
    </div>
  );
}
```

---

## 9. N+1 Problem & DataLoader

### The Problem

```graphql
query {
  posts {
    title
    author {  # Triggers N queries (one per post)
      name
    }
  }
}
```

If there are 100 posts, this executes 101 queries (1 for posts, 100 for authors).

### Solution: DataLoader

```javascript
const DataLoader = require('dataloader');

// Batch loading function
const batchUsers = async (ids) => {
  const users = await db.users.findByIds(ids);
  // Return users in same order as ids
  return ids.map(id => users.find(u => u.id === id));
};

// Create loader
const userLoader = new DataLoader(batchUsers);

// Use in resolver
const resolvers = {
  Post: {
    author: (parent, args, context) => {
      return context.userLoader.load(parent.authorId);
    }
  }
};

// Add to context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    userLoader: new DataLoader(batchUsers)
  })
});
```

---

## 10. Error Handling

```javascript
const { ApolloError, UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');

const resolvers = {
  Mutation: {
    createUser: async (parent, { name, email }, context) => {
      // Authentication error
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      
      // Authorization error
      if (!context.user.isAdmin) {
        throw new ForbiddenError('Only admins can create users');
      }
      
      // Validation error
      if (!email.includes('@')) {
        throw new UserInputError('Invalid email', {
          invalidArgs: ['email']
        });
      }
      
      // Check for duplicates
      const existing = await db.users.findOne({ email });
      if (existing) {
        throw new UserInputError('Email already exists', {
          invalidArgs: ['email']
        });
      }
      
      try {
        return await db.users.create({ name, email });
      } catch (error) {
        // Generic error
        throw new ApolloError('Failed to create user', 'USER_CREATION_FAILED', {
          originalError: error
        });
      }
    }
  }
};
```

---

# Comparison & Best Practices

## REST vs GraphQL Comparison

| Feature | REST | GraphQL |
|---------|------|---------|
| **Endpoints** | Multiple endpoints | Single endpoint |
| **Data Fetching** | Fixed data structure | Client specifies fields |
| **Over-fetching** | ⚠️ Common | ✅ Eliminated |
| **Under-fetching** | ⚠️ Multiple requests | ✅ Single request |
| **Versioning** | URI/Header versioning | Schema evolution |
| **Caching** | ✅ HTTP caching | ⚠️ More complex |
| **File Upload** | ✅ Native | ⚠️ Requires multipart |
| **Learning Curve** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Moderate |
| **Tooling** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Real-time** | SSE/WebSocket | ✅ Built-in subscriptions |
| **Error Handling** | HTTP status codes | Structured errors |
| **Documentation** | Manual (OpenAPI) | ✅ Self-documenting |

---

## When to Use REST

✅ **Use REST when:**
- Simple CRUD operations
- Public APIs consumed by many clients
- Need HTTP caching
- File uploads/downloads are primary
- Team familiar with REST
- Microservices architecture
- API needs to be crawlable/discoverable
- Bandwidth is not a concern

**Examples:**
- Public data APIs (weather, maps)
- Simple microservices
- File storage services
- Legacy system integration
- Payment gateways

---

## When to Use GraphQL

✅ **Use GraphQL when:**
- Complex, nested data relationships
- Multiple client types (web, mobile, desktop)
- Need to minimize network requests
- Rapid frontend iteration
- Real-time features required
- Strong typing needed
- Client needs flexible data fetching
- Mobile apps with limited bandwidth

**Examples:**
- Social media platforms
- Dashboard applications
- Mobile applications
- Real-time collaboration tools
- Complex admin panels
- E-commerce platforms

---

## REST Best Practices

1. **Use nouns, not verbs in URIs**
   - ✅ `/users/123`
   - ❌ `/getUser?id=123`

2. **Use plural nouns**
   - ✅ `/users`
   - ❌ `/user`

3. **Use HTTP methods correctly**
   - GET for reading
   - POST for creating
   - PUT for updating (full)
   - PATCH for updating (partial)
   - DELETE for deleting

4. **Return appropriate status codes**
   - 2xx for success
   - 4xx for client errors
   - 5xx for server errors

5. **Version your API**
   - `/api/v1/users`

6. **Use pagination**
   - `?page=1&limit=20`

7. **Implement filtering and sorting**
   - `?status=active&sort=-createdAt`

8. **Provide meaningful error messages**
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid input",
       "details": [...]
     }
   }
   ```

9. **Use HATEOAS when appropriate**
   - Include links to related resources

10. **Implement rate limiting**
    - Protect against abuse

11. **Use HTTPS always**
    - Secure data transmission

12. **Document with OpenAPI/Swagger**
    - Make API discoverable

---

## GraphQL Best Practices

1. **Design schema carefully**
   - Think about relationships
   - Use meaningful names
   - Keep it flat when possible

2. **Use nullable fields wisely**
   ```graphql
   type User {
     id: ID!           # Required
     name: String!     # Required
     bio: String       # Optional
   }
   ```

3. **Implement pagination**
   ```graphql
   type Query {
     users(first: Int, after: String): UserConnection!
   }
   ```

4. **Use DataLoader to avoid N+1 queries**
   - Batch and cache database requests

5. **Implement proper error handling**
   - Use custom error types
   - Provide helpful error messages

6. **Use fragments for reusable fields**
   ```graphql
   fragment UserInfo on User {
     id
     name
     email
   }
   ```

7. **Implement authentication & authorization**
   - Check auth in resolvers or directives
   - Use context for user info

8. **Keep mutations simple**
   - One operation per mutation
   - Return modified object

9. **Use subscriptions for real-time**
   - Not for polling
   - Clean up subscriptions

10. **Document your schema**
    ```graphql
    """
    Represents a user in the system
    """
    type User {
      "Unique identifier"
      id: ID!
      "User's full name"
      name: String!
    }
    ```

11. **Implement query depth limiting**
    - Prevent malicious deep queries

12. **Use persisted queries**
    - Security and performance

---

## Combining REST & GraphQL

You can use both in the same application:

```javascript
// REST for simple operations
GET /api/health
POST /api/auth/login
POST /api/upload

// GraphQL for complex data fetching
POST /graphql
```

**Benefits:**
- REST for file uploads, webhooks, health checks
- GraphQL for complex data queries
- Best of both worlds

---

## Security Considerations

### REST Security
- ✅ Use HTTPS
- ✅ Implement authentication (JWT, OAuth)
- ✅ Validate input
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ API keys for public APIs
- ✅ SQL injection prevention

### GraphQL Security
- ✅ Query depth limiting
- ✅ Query complexity analysis
- ✅ Persistent queries (whitelist)
- ✅ Disable introspection in production
- ✅ Rate limiting
- ✅ Authentication & authorization
- ✅ Input validation
- ✅ Timeout protection

---

## Conclusion

Both **REST** and **GraphQL** are powerful approaches to API design:

**REST** excels at:
- Simplicity and familiarity
- HTTP caching
- Simple CRUD operations
- Public APIs
- File operations

**GraphQL** excels at:
- Complex data relationships
- Flexible data fetching
- Reducing network requests
- Strong typing
- Real-time capabilities
- Developer experience

Choose based on:
- Project requirements
- Team expertise
- Client needs
- Performance requirements
- Existing infrastructure

Many modern applications successfully use both, leveraging the strengths of each approach where appropriate.
