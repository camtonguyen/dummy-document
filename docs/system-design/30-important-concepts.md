# System Design

_Why system design feels impossible until it suddenly doesn't_.

![30 most important System Design concepts](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*f3e9SUUrEvNMhVZE.png)

## First Principle: Everything is Communication

Strip away the jargon. At its core, every system is just two things talking to each other. One asks. The other answers. That's it.

### 1. Client-Server: The Original Conversation

![Client-Server Architecture](https://www.aalpha.net/wp-content/uploads/2024/01/What-is-Client-Server-Architecture.png)

_First principle: Someone has to ask, someone has to answer._

A client is the asker. A server is the answerer. Your browser asks for a webpage. A server answers with HTML. This pattern repeats a billion times a day, and it's the foundation of everything else.

Why this matters: If you understand this, you understand 80% of system design.

### 2. IP Address: Digital GPS

![IP Address Concept](https://3hcloud.com/upload/iblock/9d6/kfrr68vw758agzejb9n7igucy6b5aajw/dns.jpeg)

_First principle: To talk, you need to know where to find someone._

Every server has an address—a string of numbers like 192.168.1.1. Just like your home address lets delivery drivers find you, IP addresses let clients find servers.

The insight: Communication is impossible without location.

### 3. DNS: The Phone Book

![DNS Resolution Process](https://cdn.prod.website-files.com/5d84c93db32e46eb891ea57c/5dd5104a3da92a877a5c8c5e_gif.gif)

_First principle: Humans are bad at remembering numbers._

We don't type 172.217.164.110 to visit Google. We type google.com. DNS translates human-friendly names into machine-friendly numbers.

The pattern: Every abstraction layer makes systems more human, but adds complexity underneath.

## First Principle: Distance Creates Delay

Geography still matters in the digital world.

### 4. Proxy/Reverse Proxy: The Middleman

![Proxy vs Reverse Proxy](https://media.licdn.com/dms/image/v2/D5612AQFfQnGoKeOjTw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1694522631202?e=2147483647&v=beta&t=OB0g0M7T38-sXi-X7BrDUh6PLRAkp1PkWCHZdOPekxw)

_First principle: Sometimes you need a representative._

A proxy hides your identity. A reverse proxy hides the server's identity. Both solve the same problem: direct exposure creates risk.

Think of it as diplomatic immunity for servers.

### 5. Latency: Physics Wins

![Network Latency Illustration](https://obkio.com/blog/what-is-good-latency/high-vs-good-latency.jpg)

_First principle: Information can't travel faster than light._

Data traveling from New York to Mumbai takes time. Physics sets the speed limit. Smart system design acknowledges this and plans around it.

The only solution: Move data closer to users.

### 6. HTTP/HTTPS: The Language

![HTTP vs HTTPS](https://cdn.prod.website-files.com/64555bfdcb110dbf3e9e04bd/646cf41e9c60c23fcea5be7a_HTTP-vs-HTTPS.png)

_First principle: Conversation needs rules._

HTTP is how browsers and servers speak. HTTPS is the same conversation, but whispered so nobody else can hear.

Security isn't an add-on—it's table stakes.

## First Principle: Structure Enables Scale

### 7. APIs: The Interface

![API Architecture](https://i.ytimg.com/vi/4vLxWqE94l4/maxresdefault.jpg)

_First principle: Good fences make good neighbors._

APIs define what you can ask for and how to ask for it. Without APIs, every client would need to understand every server's internal logic.

APIs are contracts. They promise: "Give me this input, I'll give you that output."

### 8. REST API: The Standard

![REST API Methods](https://beingtechnicalwriter.com/apidocumentation/assets/gif/RESTAPI.gif)

_First principle: Convention beats configuration._

REST isn't magic. It's agreement. Everyone agrees that:

- GET means "show me"
- POST means "create this"
- PUT means "update this"
- DELETE means "remove this"

Consistency reduces cognitive load.

### 9. GraphQL: Ask for Exactly What You Need

![GraphQL vs REST](https://assets.bytebytego.com/diagrams/0036-rest-vs-graphql.png)

_First principle: Waste is inefficient._

REST gives you a fixed meal. GraphQL is à la carte. You specify exactly what data you want, nothing more.

The trade-off: Flexibility for complexity.

## First Principle: Data Must Live Somewhere

### 10. Databases: Memory with Persistence

![Database](https://static.wixstatic.com/media/0b4ebd_301dc2ad83c440e9b52b767e485b1949~mv2.gif)

_First principle: Important things shouldn't disappear when you turn off the machine._

Databases are just organized file cabinets that never forget and can find anything instantly.

### 11. SQL vs NoSQL: Structure vs Speed

![SQL vs NoSQL Comparison](https://pandorafms.com/blog/wp-content/uploads/2024/02/graph-sqlvsnosqul-2.png)

_First principle: You can't optimize for everything._

SQL: Structured, consistent, slower at scale.
NoSQL: Flexible, fast, eventually consistent.

Choose based on what breaks your system first: inconsistent data or slow responses.

## First Principle: Growth Changes Everything

### 12. Vertical Scaling: Bigger Machine

![Vertical Scaling](https://miro.medium.com/v2/resize:fit:1400/1*IM5iULd3q_QoDV7KmQmn9w.png)

_First principle: More power, more problems._

Make your server stronger, faster, better. Simple but expensive. Eventually, physics wins.

### 13. Horizontal Scaling: More Machines

![Horizontal Scaling](https://images.prismic.io/superpupertest/a1a2ffc3-ced9-4a90-83ed-bd98e0593199_Frame+2495.png?auto=compress,format&dpr=3)

_First principle: Many hands make light work._

Instead of one powerful server, use many normal servers. Cheaper, more reliable, infinitely scalable.

The catch: Coordination becomes the new problem.

### 14. Load Balancers: The Traffic Director

![Load Balancer Architecture](https://miro.medium.com/v2/resize:fit:752/1*MJoysI_9J6FpyDjo1uqYtw.gif)

_First principle: Someone has to decide._

With multiple servers, clients need to know which one to use. Load balancers make this decision using simple rules:

- Round-robin (take turns)
- Least busy (go where there's less work)
- Sticky (always go to the same place)

## First Principle: Databases Break First

When your system grows, the database is usually the bottleneck.

### 15. Database Indexing: The Table of Contents

![Database Indexing](https://yt3.ggpht.com/VNYQAqn5sE38xick8oyG0SBYRU35AxhAjXAEr9BrHa2rA5I88ZDgnoZ_CPAf17zrrg6xrW7H3uWawQ=s1600-nd-v1)

_First principle: Organization speeds retrieval._

Indexes let databases find data without reading everything. Like a book's index, they point directly to what you need.

Cost: Indexes speed reads but slow writes.

### 16. Replication: Multiple Copies

![Database Replication](https://substackcdn.com/image/fetch/$s_!xmz_!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc102625c-50df-4d7b-b154-ff4284e5fdaf_2250x2624.png)

_First principle: Redundancy prevents failure._

Make copies of your database. Let one handle writes, others handle reads. When the main one breaks, promote a copy.

### 17. Sharding: Divide and Conquer

![Database Sharding](https://yt3.ggpht.com/zxmZiCLZzRlTDT2Cr1zI1Xc49D3WVJobwHrgVEX3XH7sXp1jDht4ZyrerRYI7lWvSzu-7Bj41Pgwxw=s1600-nd-v1)

_First principle: Splitting problems makes them smaller._

Instead of one giant database, use many smaller ones. Each handles a slice of your data.

User IDs 1-1000? Server A.
User IDs 1001-2000? Server B.

Simple concept, complex implementation.

### 18. Vertical Partitioning: Split by Purpose

![Vertical Partitioning](https://media.geeksforgeeks.org/wp-content/uploads/20240510164721/Vertical-Partitioning.webp)

_First principle: Different access patterns need different solutions._

Don't store everything together. Put frequently accessed data in one table, rarely accessed data in another.

## First Principle: Memory is Faster Than Disk

### 19. Caching: Remember Recent Answers

![Caching Architecture](https://media.licdn.com/dms/image/v2/D5622AQGc7qBe0Tz6HA/feedshare-shrink_1280/B56ZfqLu74HoAk-/0/1751980646779?e=1758153600&v=beta&t=IMfHzD0LLtgOx182LB3pFqmTiss2J1d_y52mBUbaSbA)

_First principle: If someone just asked, someone else will ask soon._

Store popular answers in memory. Check memory first, disk second. Most systems are 90% repeated questions.

### 20. Denormalization: Trade Space for Speed

![Database Normalization vs Denormalization](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcb8b771f-baa7-4504-ae79-4aa69adf0f5a_2250x2624.png)

_First principle: Sometimes duplication is worth it._

Normalized databases eliminate redundancy. Denormalized databases embrace it for speed. Store user names with orders instead of looking them up each time.

## First Principle: Distributed Systems Are Different

### 21. CAP Theorem: Pick Two

![CAP Theorem Triangle](https://assets.bytebytego.com/diagrams/0131-cap-theorem.jpeg)

_First principle: You can't have everything._

In a distributed system, choose two:

- Consistency (everyone sees the same data)
- Availability (system always responds)
- Partition Tolerance (works when networks fail)

Most choose availability + partition tolerance. Consistency can wait.

## First Principle: Not Everything Belongs in Databases

### 22. Blob Storage: Files Need Special Treatment

![Blob Storage](https://www.baeldung.com/wp-content/uploads/sites/4/2023/03/blob_storage_architecture-2.png)

_First principle: Use the right tool for the job._

Databases store structured data. Blob storage (like S3) stores files. Don't put videos in MySQL.

### 23. CDN: Bring Data Closer

![CDN Network](https://howvideo.works/static/images/delivery-section/cdn-selection.png)

_First principle: Distance creates delay._

Instead of serving files from one location, copy them everywhere. Users download from the nearest server.

Geography matters, even in the cloud.

## First Principle: Real-time Changes Everything

### 24. WebSockets: Persistent Conversations

![WebSocket vs HTTP](https://media.licdn.com/dms/image/v2/D5622AQEuBV07NMt7lQ/feedshare-shrink_800/feedshare-shrink_800/0/1691416103140?e=2147483647&v=beta&t=zk2S4yWzbGjPxeTJ-mNOMbqFXBDSZVaS-QgTjaPoZBg)

_First principle: Sometimes you need to stay connected._

HTTP is like mail—send a letter, get a response. WebSockets are like phone calls—ongoing conversation.

Perfect for chat apps, live updates, multiplayer games.

### 25. Webhooks: Don't Ask, I'll Tell You

![Webhook Flow](https://delicate-dawn-ac25646e6d.media.strapiapp.com/webhhooks_45216ea8a3.jpeg)

_First principle: Polling is wasteful._

Instead of constantly asking "anything new?", register a webhook. The server will call you when something happens.

Like giving someone your number instead of calling them every minute.

## First Principle: Complexity Requires Boundaries

### 26. Microservices: Small, Independent Pieces

![Monolith vs Microservices](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F25e32454-81c0-4ccd-a26d-d37280d0c5ba_898x1106.gif)

_First principle: Large systems need clear boundaries._

Instead of one giant application, build many small ones. Each does one thing well. They talk via APIs.

Benefits: Independent scaling, deployment, failure.
Costs: Network complexity, data consistency challenges.

### 27. Message Queues: Asynchronous Communication

![Message Queue Architecture](https://substackcdn.com/image/fetch/$s_!YXgT!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2aa86ca6-b56c-4ec5-a88f-6b6190909b01_1280x1664.gif)

_First principle: Sometimes later is better than never._

Instead of direct calls, leave messages in a queue. Services process them when ready.

Like email vs phone calls. Less urgent, more reliable.

### 28. Rate Limiting: Protect Your Resources

![Rate Limiting Algorithms](https://substackcdn.com/image/fetch/$s_!ODU2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F61f39594-5594-484d-be9e-c2cb4d3973d9_1600x1050.png)

_First principle: Unlimited access creates unlimited problems._

Limit how many requests each user can make. Prevents abuse, ensures fair access.

### 29. API Gateways: Single Point of Entry

![API Gateway Architecture](https://i.pinimg.com/originals/71/b9/da/71b9da2583f65484c8c85b2af84a952c.gif)

_First principle: Centralized control simplifies management._

Instead of exposing every service directly, route everything through a gateway. Handle authentication, rate limiting, logging in one place.

### 30. Idempotency: Same Input, Same Output

![Idempotency Concept](https://miro.medium.com/v2/1*XbnhKoQua_-8G15df3mkKA.gif)

_First principle: Reliability requires predictability._

Ensure that doing the same thing twice has the same effect as doing it once. Critical for payments, where "oops I double-clicked" can't mean double charges.

## The Meta-Principle

All of these concepts solve one fundamental problem: **How do we make computers work together reliably at scale?**

Every pattern, every technique, every architecture decision comes back to this question.

Master the principles, not the implementations. The tools will change. The problems remain the same.

---
