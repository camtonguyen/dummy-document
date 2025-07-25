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

// Organize files by directory
function organizeFilesByDirectory(files) {
  const organized = {
    All: files,
    Root: [],
  };

  files.forEach((file) => {
    const parts = file.split('/');
    if (parts.length === 1) {
      // File is in root directory
      organized['Root'].push(file);
    } else {
      // File is in a subdirectory
      const dir = parts[0];
      if (!organized[dir]) {
        organized[dir] = [];
      }
      organized[dir].push(file);
    }
  });

  // Remove empty directories
  Object.keys(organized).forEach((key) => {
    if (organized[key].length === 0 && key !== 'All') {
      delete organized[key];
    }
  });

  return organized;
}

// Home page - list all documents with tabs and search
app.get('/', async (req, res) => {
  try {
    const files = await getMarkdownFiles();
    const organizedFiles = organizeFilesByDirectory(files);
    const directories = Object.keys(organizedFiles);

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
        
        <div class="search-container">
            <input 
                type="text" 
                id="searchInput" 
                class="search-input" 
                placeholder="🔍 Search documents..." 
                autocomplete="off"
            >
        </div>
        
        <div class="tabs-container">
            <div class="tabs">
                ${directories
                  .map(
                    (dir, index) => `
                    <button class="tab ${
                      index === 0 ? 'active' : ''
                    }" data-directory="${dir}">
                        ${
                          dir === 'Root'
                            ? '📁 Root'
                            : dir === 'All'
                            ? '📚 All'
                            : `📂 ${dir}`
                        }
                        <span class="tab-count">${
                          organizedFiles[dir].length
                        }</span>
                    </button>
                `
                  )
                  .join('')}
            </div>
        </div>
        
        <div class="file-list" id="fileList">
            ${
              files.length === 0
                ? '<div class="no-files">No markdown files found. Add some .md files to the docs/ directory!</div>'
                : files
                    .map((file) => {
                      const directory = file.includes('/')
                        ? file.split('/')[0]
                        : 'Root';
                      return `
                        <div class="file-item" data-filename="${file.toLowerCase()}" data-directory="${directory}" data-fullpath="${file}">
                            <a href="/doc/${encodeURIComponent(
                              file
                            )}" class="file-link">
                                📄 ${file.split('/').pop()}
                                ${
                                  file.includes('/')
                                    ? `<div class="file-path">${file}</div>`
                                    : ''
                                }
                            </a>
                        </div>
                    `;
                    })
                    .join('')
            }
            <div class="no-results" id="noResults">
                No documents found matching your search criteria.
            </div>
        </div>
        
        <footer>
            <p>Add markdown files to the <code>docs/</code> directory to see them here.</p>
        </footer>
    </div>

    <script>
        // Tab switching functionality
        const tabs = document.querySelectorAll('.tab');
        const fileItems = document.querySelectorAll('.file-item');
        const searchInput = document.getElementById('searchInput');
        const noResults = document.getElementById('noResults');
        
        let currentDirectory = 'All';
        let currentSearchTerm = '';
        
        // Tab click handlers
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                currentDirectory = tab.dataset.directory;
                filterFiles();
            });
        });
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            filterFiles();
        });
        
        // Filter files based on current directory and search term
        function filterFiles() {
            let visibleCount = 0;
            
            fileItems.forEach(item => {
                const filename = item.dataset.filename;
                const directory = item.dataset.directory;
                const fullPath = item.dataset.fullpath;
                
                // Check directory filter
                const directoryMatch = currentDirectory === 'All' || 
                                     (currentDirectory === 'Root' && directory === 'Root') ||
                                     (directory === currentDirectory);
                
                // Check search filter
                const searchMatch = currentSearchTerm === '' || 
                                  filename.includes(currentSearchTerm) ||
                                  fullPath.toLowerCase().includes(currentSearchTerm);
                
                if (directoryMatch && searchMatch) {
                    item.classList.remove('hidden');
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Show/hide no results message
            if (visibleCount === 0 && fileItems.length > 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Focus search on Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Clear search on Escape
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.value = '';
                currentSearchTerm = '';
                filterFiles();
            }
        });
        
        // Initial filter
        filterFiles();
    </script>
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
