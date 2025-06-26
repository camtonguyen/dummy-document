const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3000;
const DOCS_DIR = path.join(__dirname, 'docs');

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {}
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Get list of markdown files
async function getMarkdownFiles(dir = DOCS_DIR) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const mdFiles = [];

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        const subFiles = await getMarkdownFiles(fullPath);
        mdFiles.push(...subFiles.map((f) => path.join(file.name, f)));
      } else if (file.name.endsWith('.md')) {
        mdFiles.push(file.name);
      }
    }

    return mdFiles.sort();
  } catch (error) {
    return [];
  }
}

// Home page - list all documents
app.get('/', async (req, res) => {
  try {
    const files = await getMarkdownFiles();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Viewer</title>
    <link rel="stylesheet" href="/static/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📚 Document Viewer</h1>
            <p>Markdown document collection</p>
        </header>
        <div class="file-list">
            ${
              files.length === 0
                ? '<div class="no-files">No markdown files found. Add some .md files to the docs/ directory!</div>'
                : files
                    .map(
                      (file) => `
                <div class="file-item">
                  <a href="/doc/${encodeURIComponent(file)}" class="file-link">
                    📄 ${file}
                  </a>
                </div>
              `
                    )
                    .join('')
            }
        </div>
        <footer>
            <p>Add markdown files to the <code>docs/</code> directory to see them here.</p>
        </footer>
    </div>
</body>
</html>`;

    res.send(html);
  } catch (error) {
    res.status(500).send('Error reading documents');
  }
});

// View specific document
app.get('/doc/:filename(*)', async (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(DOCS_DIR, filename);

    // Security check
    if (!filePath.startsWith(DOCS_DIR)) {
      return res.status(403).send('Access denied');
    }

    const content = await fs.readFile(filePath, 'utf8');
    const html = marked(content);

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <link rel="stylesheet" href="/static/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="/" class="back-link">← Back to Documents</a>
            <span class="file-name">${filename}</span>
        </nav>
        <article class="markdown-content">
            ${html}
        </article>
    </div>
</body>
</html>`;

    res.send(fullHtml);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('Document not found');
    } else {
      res.status(500).send('Error reading document');
    }
  }
});

// Create docs directory if it doesn't exist
async function ensureDocsDir() {
  try {
    await fs.mkdir(DOCS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating docs directory:', error);
  }
}

// Start server
async function startServer() {
  await ensureDocsDir();

  app.listen(PORT, () => {
    console.log(`📚 Document viewer running at http://localhost:${PORT}`);
    console.log(`📁 Add markdown files to: ${DOCS_DIR}`);
  });

  // Watch for file changes in development
  if (process.env.NODE_ENV !== 'production') {
    chokidar.watch(DOCS_DIR).on('all', (event, path) => {
      console.log(`📝 File ${event}: ${path}`);
    });
  }
}

startServer();
