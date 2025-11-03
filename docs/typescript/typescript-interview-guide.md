# 50 Most Popular TypeScript Interview Questions

*A comprehensive guide with answers, core concepts, and practical tips*

---

## Table of Contents
1. [Basics & Fundamentals (Q1-Q10)](#basics--fundamentals)
2. [Types & Type System (Q11-Q20)](#types--type-system)
3. [Advanced Types (Q21-Q30)](#advanced-types)
4. [Generics & Utility Types (Q31-Q35)](#generics--utility-types)
5. [Classes & OOP (Q36-Q40)](#classes--oop)
6. [Advanced Concepts (Q41-Q45)](#advanced-concepts)
7. [Best Practices & Patterns (Q46-Q50)](#best-practices--patterns)

---

## Basics & Fundamentals

### 1. What is TypeScript and why should we use it?

**Answer:** TypeScript is a statically typed superset of JavaScript developed by Microsoft that compiles to plain JavaScript.

**Key Benefits:**
- **Early error detection** - Catch errors at compile-time
- **Better IDE support** - Enhanced autocomplete and IntelliSense
- **Self-documenting** code through type annotations
- **Easier refactoring** with type safety
- **Gradual adoption** - Can be introduced incrementally

```typescript
// JavaScript - errors caught at runtime
function add(a, b) {
  return a + b;
}
add(5, "10"); // "510" - unexpected!

// TypeScript - errors caught at compile-time
function add(a: number, b: number): number {
  return a + b;
}
// add(5, "10"); // Error: Argument of type 'string' not assignable to 'number'
```

**💡 Tip:** TypeScript doesn't add runtime overhead; it compiles to clean JavaScript.

---

### 2. What are the basic types in TypeScript?

**Answer:**

```typescript
// Primitive types
let isDone: boolean = false;
let count: number = 42;
let name: string = "John";
let notSure: any = 4; // Avoid when possible
let nothing: void = undefined;
let n: null = null;
let u: undefined = undefined;

// Arrays
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// Tuple - fixed length array with specific types
let tuple: [string, number] = ["hello", 10];

// Enum
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;

// Object
let obj: object = { name: "John" };

// Never - represents values that never occur
function error(message: string): never {
  throw new Error(message);
}
```

**💡 Tip:** Use `unknown` instead of `any` when the type is truly unknown - it's type-safe.

---

### 3. What's the difference between `interface` and `type`?

**Answer:**

```typescript
// Interface - best for object shapes, can be extended
interface User {
  name: string;
  age: number;
}

interface Admin extends User {
  role: string;
}

// Declaration merging - interfaces with same name merge
interface User {
  email: string; // Merged with above
}

// Type - more flexible, can't be merged
type ID = string | number; // Unions
type Point = [number, number]; // Tuples
type Callback = (data: string) => void; // Functions

// Intersection
type Employee = User & {
  employeeId: number;
};
```

**Key Differences:**
| Feature | Interface | Type |
|---------|-----------|------|
| Extend | ✅ Yes | ❌ No (use `&`) |
| Merge | ✅ Yes | ❌ No |
| Unions | ❌ No | ✅ Yes |
| Tuples | ❌ No | ✅ Yes |
| Mapped types | ❌ No | ✅ Yes |

**💡 Tip:** Use `interface` for object shapes and public APIs; use `type` for unions, intersections, and complex types.

---

### 4. What is type inference?

**Answer:** TypeScript automatically determines types without explicit annotations.

```typescript
// Type inferred as number
let count = 10;

// Return type inferred as number
function add(a: number, b: number) {
  return a + b;
}

// Array type inferred
const numbers = [1, 2, 3]; // number[]

// Context-based inference
["Alice", "Bob"].forEach(name => {
  console.log(name.toUpperCase()); // 'name' is string
});
```

**💡 Tip:** Let TypeScript infer when obvious; add explicit types for function parameters and public APIs.

---

### 5. What are type assertions?

**Answer:** Type assertions tell TypeScript what type a value should be treated as.

```typescript
// Two syntaxes
let someValue: any = "this is a string";
let strLength1 = (<string>someValue).length; // Angle-bracket
let strLength2 = (someValue as string).length; // 'as' syntax (preferred in JSX)

// Practical example
const input = document.getElementById("myInput") as HTMLInputElement;
input.value = "Hello"; // Works because we asserted HTMLInputElement

// Non-null assertion
function processValue(value: string | null) {
  console.log(value!.length); // ! tells TS it's not null
}
```

**⚠️ Warning:** Assertions bypass type checking - use sparingly and only when you're certain!

---

### 6. Explain Union and Intersection types

**Answer:**

**Union Types (OR)** - Value can be one of several types:
```typescript
type Status = "pending" | "success" | "error";
type ID = string | number;

function handleStatus(status: Status) {
  if (status === "success") {
    console.log("Success!");
  }
}
```

**Intersection Types (AND)** - Combine multiple types:
```typescript
interface Person {
  name: string;
}

interface Employee {
  employeeId: number;
}

type Staff = Person & Employee;

const worker: Staff = {
  name: "John",
  employeeId: 12345 // Must have both properties
};
```

**💡 Tip:** Use unions for "either/or" scenarios; intersections to combine types.

---

### 7. What are Type Guards?

**Answer:** Type guards narrow down types within conditional blocks.

```typescript
// typeof guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TS knows it's string
  }
  return value.toFixed(2); // TS knows it's number
}

// instanceof guard
class Dog {
  bark() {}
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // Type narrowed to Dog
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// in operator guard
if ("swim" in pet) {
  pet.swim();
}
```

**💡 Tip:** Use discriminated unions with type guards for complex type narrowing.

---

### 8. What is `unknown` and how does it differ from `any`?

**Answer:**

```typescript
// 'any' - disables type checking
let valueAny: any = 10;
valueAny.toUpperCase(); // No error, but crashes at runtime!

// 'unknown' - type-safe
let valueUnknown: unknown = 10;
// valueUnknown.toUpperCase(); // Error!

// Must narrow type first
if (typeof valueUnknown === "string") {
  console.log(valueUnknown.toUpperCase()); // Safe!
}
```

**💡 Tip:** Always prefer `unknown` over `any` - it forces you to check types before use.

---

### 9. What is the `never` type?

**Answer:** `never` represents values that never occur.

```typescript
// Function that never returns
function throwError(message: string): never {
  throw new Error(message);
}

// Exhaustive checking
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 10 * 10;
    case "square":
      return 10 * 10;
    default:
      const _exhaustive: never = shape; // Ensures all cases handled
      return _exhaustive;
  }
}
```

**💡 Tip:** Use `never` for exhaustive checking to catch missing cases at compile time.

---

### 10. What are Literal Types?

**Answer:** Literal types are exact values a variable can hold.

```typescript
// String literals
type Direction = "north" | "south" | "east" | "west";
let heading: Direction = "north"; // Valid
// let invalid: Direction = "up"; // Error!

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Boolean literals
type Success = true;

// Practical example
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

function request(url: string, method: HTTPMethod) {
  // method can only be one of specified values
}
```

**💡 Tip:** Literal types provide excellent autocomplete and prevent typos.

---

## Types & Type System

### 11. What is the `keyof` operator?

**Answer:** `keyof` creates a union of all property names.

```typescript
interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "email"

// Type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = {
  name: "John",
  age: 30,
  email: "john@example.com"
};

const name = getProperty(person, "name"); // Type: string
// getProperty(person, "invalid"); // Error!
```

**💡 Tip:** Combine `keyof` with generics for type-safe object manipulation.

---

### 12. What are Mapped Types?

**Answer:** Mapped types transform existing types by iterating over properties.

```typescript
// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

// Custom mapped type - make all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; }
```

**💡 Tip:** Mapped types eliminate code duplication when creating type variations.

---

### 13. What are Conditional Types?

**Answer:** Conditional types select types based on conditions.

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical example
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null>; // string

// Inferring types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "hello";
}

type R = ReturnType<typeof getString>; // string

// Flatten arrays
type Flatten<T> = T extends Array<infer U> ? U : T;

type Num = Flatten<number[]>; // number
```

**💡 Tip:** Use `infer` to extract types from complex structures.

---

### 14. What are Index Signatures?

**Answer:** Index signatures define types for dynamic property names.

```typescript
// String index signature
interface StringMap {
  [key: string]: string;
}

const colors: StringMap = {
  red: "#FF0000",
  blue: "#0000FF"
};

// Number index signature
interface NumberArray {
  [index: number]: string;
}

// Mixed - known and dynamic properties
interface Dictionary {
  [key: string]: any;
  length: number; // Known property
}

// Using Record utility type
type Pages = Record<string, { title: string }>;

const pages: Pages = {
  home: { title: "Home" },
  about: { title: "About" }
};
```

**💡 Tip:** Use `Record<K, V>` for cleaner index signature types.

---

### 15. What are Template Literal Types?

**Answer:** Template literal types create new string literal types.

```typescript
// Basic usage
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// With unions
type Color = "red" | "blue" | "green";
type Quantity = "one" | "two";
type ColoredBall = `${Quantity} ${Color} ball`;
// "one red ball" | "one blue ball" | "two red ball" | ...

// Event handler names
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// Intrinsic string manipulation
type UppercaseGreeting = Uppercase<"hello">; // "HELLO"
type LowercaseGreeting = Lowercase<"HELLO">; // "hello"
type CapitalizedGreeting = Capitalize<"hello">; // "Hello"
```

**💡 Tip:** Great for creating strongly-typed string patterns like CSS classes or event names.

---

## Advanced Types

### 16. Explain Covariance and Contravariance

**Answer:**

**Covariance** - preserves subtype relationship (arrays, return types):
```typescript
class Animal {}
class Dog extends Animal {}

let animals: Animal[] = [];
let dogs: Dog[] = [];

animals = dogs; // OK - covariant
```

**Contravariance** - reverses subtype relationship (function parameters):
```typescript
type AnimalHandler = (animal: Animal) => void;
type DogHandler = (dog: Dog) => void;

let handleDog: DogHandler = (dog) => {};
let handleAnimal: AnimalHandler = (animal) => {};

handleDog = handleAnimal; // OK - contravariant (broader accepts narrower)
// handleAnimal = handleDog; // Error!
```

**💡 Tip:** Enable `--strictFunctionTypes` for proper contravariance checking.

---

### 17. What are Discriminated Unions?

**Answer:** Discriminated unions use a common property to narrow types.

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // TS knows it's Circle
    case "rectangle":
      return shape.width * shape.height; // TS knows it's Rectangle
  }
}
```

**💡 Tip:** Discriminated unions are the most powerful type narrowing technique.

---

### 18. What are Tuple Types?

**Answer:** Tuples are arrays with fixed length and specific types per position.

```typescript
// Basic tuple
let tuple: [string, number] = ["hello", 42];

// Optional elements
let optionalTuple: [string, number?];

// Rest elements
type StringNumberBooleans = [string, number, ...boolean[]];

// Named tuple elements (TypeScript 4.0+)
type Range = [start: number, end: number];
type Point = [x: number, y: number, z?: number];

// React useState pattern
function useState<T>(initial: T): [T, (value: T) => void] {
  let state = initial;
  const setState = (value: T) => {
    state = value;
  };
  return [state, setState];
}

const [count, setCount] = useState(0);
```

**💡 Tip:** Use tuples for functions returning multiple values of different types.

---

### 19. What is Type Narrowing?

**Answer:** Type narrowing refines types to more specific types.

```typescript
// typeof narrowing
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // string
  }
  return value.toFixed(2); // number
}

// instanceof narrowing
if (animal instanceof Dog) {
  animal.bark();
}

// in operator narrowing
if ("swim" in pet) {
  pet.swim();
}

// Custom type guard
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Assertion functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Not a string");
  }
}
```

**💡 Tip:** TypeScript's control flow analysis tracks type changes through your code.

---

### 20. What are Recursive Types?

**Answer:** Recursive types reference themselves.

```typescript
// JSON type
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

// Tree structure
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

// Nested array
type NestedArray<T> = T | NestedArray<T>[];

const nested: NestedArray<number> = [1, [2, [3, [4]]]];
```

**⚠️ Warning:** TypeScript has a recursion depth limit (~45-50 levels).

**💡 Tip:** Use `unknown` or specific depth limits for deeply nested structures.

---

## Generics & Utility Types

### 21. What are Generics?

**Answer:** Generics create reusable components that work with multiple types.

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity("hello"); // Type inferred

// Generic with constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // string has length
logLength([1, 2, 3]); // array has length
// logLength(42); // Error!

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}
```

**💡 Tip:** Use generics when a function needs to work with multiple types while maintaining type safety.

---

### 22. What are Generic Constraints?

**Answer:** Generic constraints limit acceptable types.

```typescript
// Constraint with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30 };
getProperty(person, "name"); // Valid
// getProperty(person, "invalid"); // Error!

// Multiple constraints
interface Nameable {
  name: string;
}

interface Ageable {
  age: number;
}

function introduce<T extends Nameable & Ageable>(person: T): string {
  return `${person.name} is ${person.age} years old`;
}
```

**💡 Tip:** Use constraints to ensure generics have required properties.

---

### 23. What are TypeScript Utility Types?

**Answer:** Built-in types for common transformations.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - all properties optional
type PartialUser = Partial<User>;

// Required - all properties required
type RequiredUser = Required<PartialUser>;

// Readonly - all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick - select specific properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, "email">;

// Record - create object type
type Roles = "admin" | "user" | "guest";
type RolePermissions = Record<Roles, string[]>;

// ReturnType - extract return type
function getUser() {
  return { name: "John", age: 30 };
}
type UserReturn = ReturnType<typeof getUser>;

// Parameters - extract parameters
type Params = Parameters<typeof getUser>; // []
```

**💡 Tip:** Master utility types - they're essential for advanced TypeScript.

---

### 24. What are Generic Classes?

**Answer:** Classes that work with multiple types.

```typescript
class Box<T> {
  private content: T;

  constructor(content: T) {
    this.content = content;
  }

  getContent(): T {
    return this.content;
  }

  setContent(content: T): void {
    this.content = content;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box("hello");

// Generic repository pattern
interface Entity {
  id: number;
}

class Repository<T extends Entity> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }
}
```

**💡 Tip:** Generic classes are perfect for reusable data structures.

---

### 25. What are Default Generic Parameters?

**Answer:** Default types provide fallback values.

```typescript
interface Container<T = string> {
  value: T;
}

const stringContainer: Container = { value: "hello" }; // Uses default
const numberContainer: Container<number> = { value: 42 };

// Function with default
function createArray<T = number>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const numbers = createArray(3, 5); // number[]
const strings = createArray<string>(3, "hello"); // string[]
```

**💡 Tip:** Use defaults for commonly used type parameters to reduce verbosity.

---

## Classes & OOP

### 26. What are Access Modifiers?

**Answer:** Control visibility of class members.

```typescript
class Person {
  public name: string; // Accessible everywhere (default)
  private age: number; // Only within class
  protected email: string; // Within class and subclasses

  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }
}

// Shorthand
class User {
  constructor(
    public username: string,
    private password: string,
    protected role: string
  ) {
    // Properties automatically created
  }
}
```

**💡 Tip:** Use `private` for internal implementation, `protected` for extensible classes.

---

### 27. What are Abstract Classes?

**Answer:** Base classes that cannot be instantiated directly.

```typescript
abstract class Shape {
  constructor(protected color: string) {}

  // Abstract method - must be implemented
  abstract getArea(): number;

  // Concrete method - shared by all
  displayInfo(): void {
    console.log(`Color: ${this.color}, Area: ${this.getArea()}`);
  }
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color);
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

// const shape = new Shape("red"); // Error!
const circle = new Circle("red", 5); // OK
```

**💡 Tip:** Use abstract classes when you want shared functionality with enforced method implementations.

---

### 28. Abstract Class vs Interface?

**Answer:**

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Implementation | No | Yes |
| Multiple inheritance | Yes | No |
| Constructor | No | Yes |
| Access modifiers | No | Yes |
| When to use | Pure contracts | Shared functionality + contracts |

```typescript
// Interface - pure contract
interface IAnimal {
  name: string;
  makeSound(): void;
}

// Abstract class - partial implementation
abstract class Animal {
  constructor(public name: string) {}

  move(): void {
    console.log("Moving...");
  }

  abstract makeSound(): void;
}

// Can implement multiple interfaces
class Duck implements IAnimal, Flyable, Swimmable {
  // Must implement all methods
}

// Can only extend one abstract class
class Cat extends Animal {
  makeSound() {
    console.log("Meow");
  }
}
```

**💡 Tip:** Use interfaces for contracts; abstract classes for shared implementation.

---

### 29. What are Static Members?

**Answer:** Static members belong to the class itself, not instances.

```typescript
class MathUtils {
  static PI: number = 3.14159;

  static add(a: number, b: number): number {
    return a + b;
  }
}

// Access without instance
console.log(MathUtils.PI);
console.log(MathUtils.add(5, 3));

// Singleton pattern
class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
```

**💡 Tip:** Use static members for utility functions and singleton patterns.

---

### 30. What is Method Overloading?

**Answer:** Multiple signatures for the same function.

```typescript
// Function overloading
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

console.log(add(1, 2)); // 3
console.log(add("Hello", " World")); // "Hello World"

// Class method overloading
class StringUtils {
  reverse(str: string): string;
  reverse(arr: string[]): string[];
  reverse(value: string | string[]): string | string[] {
    if (typeof value === "string") {
      return value.split("").reverse().join("");
    }
    return value.slice().reverse();
  }
}
```

**💡 Tip:** Use overloading sparingly; often generics or union types are clearer.

---

## Advanced Concepts

### 31. What are Decorators?

**Answer:** Special declarations that modify classes, methods, or properties.

```typescript
// Enable in tsconfig: "experimentalDecorators": true

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  title: string;
}

// Method decorator
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

**💡 Tip:** Decorators are experimental but widely used in Angular and NestJS.

---

### 32. What is Declaration Merging?

**Answer:** Combining multiple declarations with the same name.

```typescript
// Interface merging
interface User {
  name: string;
}

interface User {
  age: number;
}

// Result: merged interface
const user: User = {
  name: "John",
  age: 30
};

// Extending Express Request
declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

// Now Request has user property
app.use((req: Request, res, next) => {
  req.user = { id: "123", role: "admin" };
});
```

**💡 Tip:** Use declaration merging to extend third-party libraries.

---

### 33. What are Mixins?

**Answer:** Pattern for composing classes from reusable components.

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate() {
      this.isActive = true;
    }
  };
}

class User {
  constructor(public name: string) {}
}

const ActivatableUser = Activatable(Timestamped(User));
const user = new ActivatableUser("John");
user.activate();
```

**💡 Tip:** Mixins enable composition without deep inheritance hierarchies.

---

### 34. What is the `infer` keyword?

**Answer:** Extracts types within conditional types.

```typescript
// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "John", age: 30 };
}

type UserType = ReturnType<typeof getUser>; // { name: string; age: number }

// Extract array element type
type Flatten<T> = T extends Array<infer U> ? U : T;

type NumArray = Flatten<number[]>; // number

// Extract promise resolved type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type PromiseNumber = Awaited<Promise<number>>; // number
```

**💡 Tip:** `infer` is powerful for creating advanced utility types.

---

### 35. What is the `satisfies` operator?

**Answer:** Validates a value matches a type without widening it (TypeScript 4.9+).

```typescript
type Color = "red" | "green" | "blue" | { r: number; g: number; b: number };

// With type annotation - loses specific type
const palette1: Record<string, Color> = {
  red: "red",
  green: { r: 0, g: 255, b: 0 }
};

// palette1.red is Color (wide), not "red"

// With satisfies - preserves specific type
const palette2 = {
  red: "red",
  green: { r: 0, g: 255, b: 0 }
} satisfies Record<string, Color>;

palette2.red.toUpperCase(); // Works! (red is "red", not Color)
```

**💡 Tip:** Use `satisfies` for type validation without losing precise type information.

---

## Best Practices & Patterns

### 36. How to handle null and undefined safely?

**Answer:**

```typescript
// Enable strict null checks in tsconfig
// "strictNullChecks": true

// Optional chaining
function getLength(str: string | null): number | undefined {
  return str?.length;
}

// Nullish coalescing
function greet(name: string | null | undefined): string {
  return `Hello ${name ?? "Guest"}`;
}

// Type guards
function processValue(value: string | null) {
  if (value !== null) {
    console.log(value.toUpperCase());
  }
}

// NonNullable utility type
type T = NonNullable<string | number | null | undefined>; // string | number
```

**💡 Tip:** Always enable `strictNullChecks` for safer code.

---

### 37. What are best practices for error handling?

**Answer:**

```typescript
// Custom error classes
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

// Result type pattern
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: new Error("Division by zero")
    };
  }
  return {
    success: true,
    data: a / b
  };
}

// Usage
const result = divide(10, 2);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

**💡 Tip:** Use Result types for expected errors, exceptions for unexpected ones.

---

### 38. How to optimize TypeScript compilation?

**Answer:**

```json
// tsconfig.json optimizations
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo",
    "skipLibCheck": true,
    "skipDefaultLibCheck": true
  },
  "exclude": [
    "node_modules",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

**Performance Tips:**
- Enable incremental compilation
- Use `skipLibCheck` for node_modules
- Exclude test files from main compilation
- Use project references for monorepos
- Keep union types reasonable in size

**💡 Tip:** Profile with `tsc --extendedDiagnostics` to find bottlenecks.

---

### 39. What are Project References?

**Answer:** Structure TypeScript projects into smaller pieces for faster builds.

```json
// Root tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true, // Required!
    "declaration": true,
    "outDir": "./dist"
  }
}

// packages/ui/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true
  },
  "references": [
    { "path": "../core" }
  ]
}
```

**Build Commands:**
```bash
tsc --build # Build all projects
tsc --build --watch # Watch mode
tsc --build --clean # Clean
```

**💡 Tip:** Always set `composite: true` in referenced projects.

---

### 40. How to organize large TypeScript projects?

**Answer:**

**Layer-Based Structure:**
```
src/
├── types/           # Shared types
├── models/          # Domain models
├── services/        # Business logic
├── repositories/    # Data access
├── controllers/     # HTTP handlers
├── middlewares/     # Express middlewares
├── utils/           # Utilities
├── config/          # Configuration
└── index.ts
```

**Feature-Based Structure:**
```
src/
├── features/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── users/
│       ├── user.model.ts
│       ├── user.service.ts
│       └── index.ts
├── shared/
│   ├── types/
│   └── utils/
└── index.ts
```

**Path Aliases:**
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/types/*": ["types/*"],
      "@/services/*": ["services/*"],
      "@features/*": ["features/*"]
    }
  }
}
```

**💡 Tip:** Start simple, refactor as the project grows.

---

### 41. How to test TypeScript code?

**Answer:**

```typescript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"]
};

// Unit test example
// user.service.test.ts
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test("should create user", async () => {
    const user = await service.createUser({
      name: "John",
      email: "john@example.com"
    });

    expect(user).toMatchObject({
      name: "John",
      email: "john@example.com"
    });
  });
});

// Mock types
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  save: jest.fn()
};
```

**💡 Tip:** Use `ts-jest` for seamless TypeScript testing with Jest.

---

### 42. How to handle environment variables type-safely?

**Answer:**

```typescript
// Define environment interface
interface Environment {
  NODE_ENV: "development" | "production" | "test";
  API_URL: string;
  API_KEY: string;
  PORT: number;
}

// Parse and validate
function parseEnv(): Environment {
  return {
    NODE_ENV: process.env.NODE_ENV as Environment["NODE_ENV"],
    API_URL: requireEnv("API_URL"),
    API_KEY: requireEnv("API_KEY"),
    PORT: parseInt(process.env.PORT || "3000", 10)
  };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export const env = parseEnv();

// Extend ProcessEnv
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
```

**💡 Tip:** Use libraries like `envalid` or `dotenv-safe` for production apps.

---

### 43. How to implement type-safe event emitters?

**Answer:**

```typescript
type EventMap = Record<string, any>;

class TypedEventEmitter<Events extends EventMap> {
  private listeners = new Map<keyof Events, Set<Function>>();

  on<K extends keyof Events>(
    event: K,
    listener: (data: Events[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners.get(event)?.forEach(listener => {
      listener(data);
    });
  }
}

// Usage
interface AppEvents {
  userLogin: { userId: string };
  dataUpdated: { items: string[] };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("userLogin", (data) => {
  console.log(data.userId); // Type-safe!
});

emitter.emit("userLogin", { userId: "123" });
```

**💡 Tip:** Type-safe event emitters prevent runtime errors from wrong event data.

---

### 44. How to create type-safe builders?

**Answer:**

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

class UserBuilder {
  private user: Partial<User> = {};

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  setAge(age: number): this {
    this.user.age = age;
    return this;
  }

  build(): User {
    const { name, email, age } = this.user;
    if (!name || !email || !age) {
      throw new Error("Missing required fields");
    }
    return { name, email, age };
  }
}

// Usage
const user = new UserBuilder()
  .setName("John")
  .setEmail("john@example.com")
  .setAge(30)
  .build();
```

**💡 Tip:** Builders provide a fluent API for complex object construction.

---

### 45. What are the most common TypeScript patterns?

**Answer:**

**1. Singleton Pattern:**
```typescript
class Database {
  private static instance: Database;
  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
```

**2. Factory Pattern:**
```typescript
interface Animal {
  makeSound(): void;
}

class AnimalFactory {
  static create(type: "dog" | "cat"): Animal {
    switch (type) {
      case "dog":
        return new Dog();
      case "cat":
        return new Cat();
    }
  }
}
```

**3. Repository Pattern:**
```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

class UserRepository implements IRepository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
}
```

**4. Observer Pattern (with events):**
```typescript
class Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(): void {
    this.observers.forEach(o => o.update());
  }
}
```

**💡 Tip:** Design patterns in TypeScript leverage strong typing for safer implementations.

---

### 46. How to use TypeScript with React?

**Answer:**

```typescript
// Functional component with props
interface UserCardProps {
  name: string;
  age: number;
  onDelete?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ name, age, onDelete }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  );
};

// useState with types
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useRef with types
const inputRef = useRef<HTMLInputElement>(null);

// Custom hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log(event.currentTarget);
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};
```

**💡 Tip:** Use `@types/react` for complete React type definitions.

---

### 47. How to use TypeScript with Node.js/Express?

**Answer:**

```typescript
import express, { Request, Response, NextFunction } from "express";

const app = express();

// Typed route handler
app.get("/users/:id", (req: Request, res: Response) => {
  const userId: string = req.params.id;
  res.json({ id: userId, name: "John" });
});

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware with types
const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.user = { id: "123", role: "admin" };
  next();
};

// Error handler
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ error: err.message });
};

app.use(errorHandler);
```

**💡 Tip:** Install `@types/express` for Express type definitions.

---

### 48. How to migrate JavaScript to TypeScript?

**Answer:**

**Step 1: Setup**
```bash
npm install --save-dev typescript @types/node
npx tsc --init
```

**Step 2: Start with `allowJs`**
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist"
  }
}
```

**Step 3: Rename files gradually**
- `.js` → `.ts`
- `.jsx` → `.tsx`

**Step 4: Add types incrementally**
```typescript
// Before (JS)
function add(a, b) {
  return a + b;
}

// After (TS)
function add(a: number, b: number): number {
  return a + b;
}
```

**Step 5: Enable strict mode gradually**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**💡 Tip:** Migrate incrementally; don't try to convert everything at once.

---

### 49. What are common TypeScript gotchas?

**Answer:**

**1. Array readonly vs const:**
```typescript
const arr = [1, 2, 3];
arr.push(4); // OK! const doesn't make array immutable

const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4); // Error!
```

**2. Enum reverse mapping:**
```typescript
enum Color {
  Red,
  Green
}

console.log(Color[0]); // "Red" - reverse mapping!
```

**3. Function overload order:**
```typescript
// Wrong - specific after general
function process(x: any): void;
function process(x: string): void; // Never called!

// Right - specific before general
function process(x: string): void;
function process(x: any): void;
```

**4. Type assertions can be unsafe:**
```typescript
const value = "hello" as any as number; // Compiles but wrong!
```

**5. Optional chaining doesn't check for empty string:**
```typescript
const user = { name: "" };
console.log(user.name ?? "Default"); // Prints "" not "Default"
```

**💡 Tip:** Use ESLint with TypeScript plugins to catch common mistakes.

---

### 50. What are the key differences between TypeScript versions?

**Answer:**

**TypeScript 4.0:**
- Variadic tuple types
- Labeled tuple elements
- `unknown` on catch clauses

**TypeScript 4.1:**
- Template literal types
- Key remapping in mapped types
- Recursive conditional types

**TypeScript 4.4:**
- Control flow analysis improvements
- Index signatures for symbols
- Faster incremental builds

**TypeScript 4.7:**
- ECMAScript module support in Node.js
- `moduleSuffixes` option
- Improved function inference

**TypeScript 4.9:**
- `satisfies` operator
- `in` operator narrowing
- Auto-accessors in classes

**TypeScript 5.0:**
- Decorators (stable)
- `const` type parameters
- Enum improvements

**TypeScript 5.2:**
- `using` declarations
- Decorator metadata

**💡 Tip:** Stay updated with TypeScript releases for new features and performance improvements.

---

## Summary: Key Tips to Remember

🎯 **Type Safety First**
- Enable `strict` mode in tsconfig.json
- Avoid `any`, prefer `unknown`
- Use type guards and narrowing

📚 **Best Practices**
- Let TypeScript infer when obvious
- Use interfaces for objects, types for complex types
- Leverage utility types (Partial, Pick, Omit, etc.)

⚡ **Performance**
- Enable incremental compilation
- Use project references for large projects
- Skip lib checks for node_modules

🏗️ **Architecture**
- Organize by features or layers
- Use path aliases for cleaner imports
- Implement proper error handling

🧪 **Testing**
- Use ts-jest for unit tests
- Mock with proper types
- Test type definitions

🚀 **Advanced Concepts**
- Master generics and constraints
- Understand conditional types
- Use mapped types for transformations

---

## Conclusion

TypeScript is a powerful tool that enhances JavaScript development with static typing, better tooling, and improved maintainability. Mastering these concepts will help you write more robust and scalable applications.

**Remember:**
- Start with basics, gradually adopt advanced features
- Enable strict mode for maximum type safety
- Use TypeScript's inference capabilities
- Keep types simple and maintainable
- Leverage the extensive TypeScript ecosystem

Happy coding! 🎉

---

*This guide covers the most frequently asked TypeScript interview questions. Practice these concepts and you'll be well-prepared for any TypeScript interview!*
