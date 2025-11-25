const fs = require('fs');

const content = `
# Example

This is an example markdown file.
`;

const fileName = 'example.md';

fs.writeFileSync(fileName, content);
console.log(`Success: ${fileName} has been created.`);
