# 📘 JavaScript Methods Cheatsheet

_Most common used methods in Javascript and simple code snippets_.

## 1. Array Methods

**`map()` – transform each item, return new array**

```js
[1, 2, 3].map((n) => n * 2); // [2, 4, 6]
```

**`filter()` – pick only items that match condition**

```js
[1, 2, 3, 4].filter((n) => n % 2 === 0); // [2, 4]
```

**`reduce()` – combine all items into one value**

```js
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
```

**`forEach()` – run a function on each item (no return)**

```js
['a', 'b'].forEach((v) => console.log(v)); // logs "a" then "b"
```

**`find()` – return the first match**

```js
[10, 20, 30].find((n) => n > 15); // 20
```

**`slice()` – copy part of an array (no mutation)**

```js
['a', 'b', 'c'].slice(1, 3); // ["b","c"]
```

**`splice()` – remove/replace items (mutates array)**

```js
const arr = ['a', 'b', 'c'];
arr.splice(1, 1); // removes "b" → arr = ["a","c"]
```

**`concat()` – merge arrays**

```js
[1, 2].concat([3, 4]); // [1,2,3,4]
```

**`includes()` – check if value exists**

```js
[1, 2, 3].includes(2); // true
```

**`some()` – does _any_ item match?**

```js
[1, 3, 5].some((n) => n % 2 === 0); // false
```

**`every()` – do _all_ items match?**

```js
[2, 4, 6].every((n) => n % 2 === 0); // true
```

---

## 2. String Methods

**`split()` – break into array**

```js
'one,two'.split(','); // ["one", "two"]
```

**`replace()` – swap first match**

```js
'hello world'.replace('world', 'JS'); // "hello JS"
```

**`replaceAll()` – swap all matches**

```js
'aba'.replaceAll('a', 'x'); // "xbx"
```

**`substring()` – extract part by indexes**

```js
'JavaScript'.substring(0, 4); // "Java"
```

**`trim()` – remove spaces both ends**

```js
'  hi  '.trim(); // "hi"
```

**`trimStart()` / `trimEnd()` – remove spaces one side**

```js
'  hi  '.trimStart(); // "hi  "
'  hi  '.trimEnd(); // "  hi"
```

**`charAt()` – get character at position**

```js
'JS'.charAt(1); // "S"
```

**`includes()` – check substring**

```js
'hello'.includes('he'); // true
```

---

## 3. Object Methods

**`Object.keys()` – get property names**

```js
Object.keys({ a: 1, b: 2 }); // ["a","b"]
```

**`Object.values()` – get property values**

```js
Object.values({ a: 1, b: 2 }); // [1,2]
```

**`Object.entries()` – get key-value pairs**

```js
Object.entries({ a: 1, b: 2 }); // [["a",1],["b",2]]
```

**`Object.assign()` – shallow copy/merge**

```js
Object.assign({}, { a: 1 }, { b: 2 }); // {a:1, b:2}
```

**`Object.hasOwnProperty()` – check if property exists directly**

```js
({ x: 1 }).hasOwnProperty('x'); // true
```

**`Object.freeze()` – make object immutable**

```js
const obj = Object.freeze({ a: 1 });
// obj.a = 2 → no effect
```

**`Object.create()` – create new object with prototype**

```js
const proto = {
  greet() {
    return 'hi';
  },
};
const o = Object.create(proto);
o.greet(); // "hi"
```

---

## 4. Number Methods

**`parseInt()` – convert string to integer**

```js
parseInt('42', 10); // 42
```

**`parseFloat()` – convert string to decimal**

```js
parseFloat('3.14'); // 3.14
```

**`toFixed()` – format decimals (string result)**

```js
(12.345).toFixed(2); // "12.35"
```

**`toString()` – convert number to string/base**

```js
(255).toString(16); // "ff"
```

---

## 5. Date Methods

**`getDate()` – day of month**

```js
new Date('2025-09-13').getDate(); // 13
```

**`getDay()` – weekday (0=Sun, 6=Sat)**

```js
new Date('2025-09-13').getDay(); // 6 (Saturday)
```

**`getFullYear()` – year**

```js
new Date().getFullYear(); // 2025
```

**`toISOString()` – standard ISO format**

```js
new Date('2025-09-13').toISOString(); // "2025-09-13T00:00:00.000Z"
```

---

## 6. Function Methods

**`call()` – run with custom `this`**

```js
function hi(msg) {
  return `${msg}, ${this.name}`;
}
hi.call({ name: 'Ana' }, 'Hello'); // "Hello, Ana"
```

**`apply()` – like `call` but args array**

```js
hi.apply({ name: 'Bo' }, ['Hey']); // "Hey, Bo"
```

**`bind()` – create new function with fixed `this`**

```js
const bound = hi.bind({ name: 'Cam' });
bound('Hi'); // "Hi, Cam"
```

---

## 7. Async & Fetch

**`Promise.resolve()` / `Promise.reject()` – instantly create promise**

```js
Promise.resolve(123).then(console.log); // 123
Promise.reject('err').catch(console.log); // "err"
```

**`Promise.all()` – wait all succeed (fail fast)**

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then(console.log); // [1,2]
```

**`Promise.allSettled()` – wait all, even failures**

```js
Promise.allSettled([Promise.resolve('ok'), Promise.reject('fail')]).then(
  console.log
);
// [{status:"fulfilled", value:"ok"}, {status:"rejected", reason:"fail"}]
```

**`Promise.race()` – first settled wins**

```js
Promise.race([
  new Promise((r) => setTimeout(() => r('fast'), 100)),
  new Promise((r) => setTimeout(() => r('slow'), 500)),
]).then(console.log); // "fast"
```

**`async/await` – cleaner async code**

```js
async function getData() {
  return await Promise.resolve('done');
}
getData().then(console.log); // "done"
```

**`fetch()` – GET request**

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then((res) => res.json())
  .then(console.log);
```

**`fetch()` – POST request with JSON**

```js
fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ msg: 'Hello' }),
})
  .then((res) => res.json())
  .then(console.log);
```
