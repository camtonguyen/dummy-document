# Sample Document

This is a sample document to demonstrate the markdown document viewer capabilities.

## Introduction

You can write your documents in markdown and they'll be beautifully rendered in the web interface. This document shows some of the formatting options available.

## Code Examples

Here's a Python example:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

And here's some JavaScript:

```javascript
const fruits = ['apple', 'banana', 'orange'];
const uppercased = fruits.map((fruit) => fruit.toUpperCase());
console.log(uppercased);
```

## Lists and Organization

### Project Tasks

- [x] Set up document viewer
- [x] Add syntax highlighting
- [ ] Add search functionality
- [ ] Add document tagging

### Important Notes

1. All documents go in the `docs/` folder
2. Subdirectories are supported for organization
3. The server watches for file changes automatically

## Mathematical Expressions

You can write inline math and formulas. While this viewer doesn't render LaTeX by default, you can always add that functionality later.

## Conclusion

This document viewer makes it easy to organize and read your markdown documents. Add more `.md` files to see them in the document list!
