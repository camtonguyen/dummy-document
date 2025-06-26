# Markdown Document Viewer 📚

A beautiful, responsive web interface for viewing and organizing your markdown documents. Perfect for personal documentation, notes, and knowledge management.

## Features

- 🎨 **Beautiful Interface** - Clean, modern design optimized for reading
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🚀 **Syntax Highlighting** - Automatic code highlighting for all major languages
- 📁 **Organized Structure** - Support for subdirectories and nested organization
- 🔄 **Live File Watching** - Automatically detects new files and changes
- ⚡ **Fast Performance** - Quick loading and smooth navigation

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Add your documents:**
   Place `.md` files in the `docs/` folder

## Development

For development with auto-restart:

```bash
npm run dev
```

## File Organization

```
project/
├── docs/                    # Your markdown documents go here
│   ├── README.md           # Welcome document
│   ├── examples/           # Sample documents
│   └── notes/             # Example subdirectory
├── public/                 # Static assets
│   └── styles.css         # Styling
├── server.js              # Main application
└── package.json           # Dependencies
```

## Adding Documents

Simply add `.md` files to the `docs/` directory:

- Files are automatically detected
- Subdirectories are supported for organization
- Use standard markdown syntax
- Code blocks are automatically highlighted

## Customization

- **Styling**: Edit `public/styles.css` to customize the appearance
- **Port**: Set the `PORT` environment variable to change the default port (3000)
- **Document Directory**: Modify `DOCS_DIR` in `server.js` to change the documents folder

## Supported Markdown Features

- Headers, paragraphs, and text formatting
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Tables
- Links and images
- Blockquotes
- Horizontal rules

## Technology Stack

- **Backend**: Node.js with Express
- **Markdown Parser**: Marked.js
- **Syntax Highlighting**: Highlight.js
- **File Watching**: Chokidar
- **Styling**: Vanilla CSS with modern design

## License

MIT License - feel free to use and modify as needed!

---

Start adding your markdown files to the `docs/` folder and enjoy your new document viewer! ✍️
