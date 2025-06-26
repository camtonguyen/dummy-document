# Deployment Guide 🚀

This guide shows you how to deploy your markdown document viewer to various hosting platforms and create a public GitHub repository.

## Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click "New repository"** (green button on your dashboard)
3. **Repository settings:**
   - Name: `markdown-document-viewer` (or your preferred name)
   - Description: `A beautiful web interface for viewing markdown documents`
   - Make it **Public** ✅
   - Do NOT initialize with README (we already have one)
4. **Click "Create repository"**

## Step 2: Push Your Code to GitHub

Run these commands in your terminal:

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 3: Deploy to a Hosting Platform

Since this is a Node.js application, you need a platform that supports server-side applications. Here are the best free options:

### Option A: Vercel (Recommended) ⭐

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`
6. **Click "Deploy"**

✅ **Vercel will automatically:**

- Install dependencies
- Deploy your app
- Give you a public URL (like `https://your-app.vercel.app`)
- Auto-deploy when you push changes to GitHub

### Option B: Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway will auto-detect and deploy**

### Option C: Render

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Click "Create Web Service"**

## Step 4: Access Your Live Site

After deployment, you'll get a public URL where anyone can access your document viewer:

- `https://your-app.vercel.app` (Vercel)
- `https://your-app.up.railway.app` (Railway)
- `https://your-app.onrender.com` (Render)

## Step 5: Add Documents

You can add new markdown files to your `docs/` folder and they'll automatically appear on your live site:

1. Add `.md` files to the `docs/` directory
2. Commit and push to GitHub:
   ```bash
   git add docs/your-new-file.md
   git commit -m "Add new document"
   git push
   ```
3. Your hosting platform will auto-deploy the changes

## Customization Tips

- **Custom Domain**: Most platforms allow you to connect a custom domain
- **Environment Variables**: Set `PORT` if needed (most platforms handle this automatically)
- **Styling**: Modify `public/styles.css` to customize the appearance
- **Features**: Add search, tags, or other features to `server.js`

## Repository Structure for GitHub

Your public repository will show:

```
📁 docs/           # Your markdown documents
📁 public/         # CSS and static files
📄 server.js       # Main application
📄 package.json    # Dependencies
📄 README.md       # Project documentation
📄 vercel.json     # Vercel deployment config
📄 railway.json    # Railway deployment config
```

## Sharing Your Project

Once deployed, you can share:

- **Live Site**: Your hosting platform URL
- **Source Code**: Your GitHub repository URL
- **Documentation**: Link to your README.md

Happy documenting! 📚✨
