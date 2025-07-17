# Deploying Wellness Dashboard to GitHub Pages

## Prerequisites
- A GitHub account
- Git installed on your computer

## Step-by-Step Deployment Guide

### 1. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository `wellness-dashboard`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Update the Homepage URL
Before pushing to GitHub, update the homepage URL in `package.json`:
- Replace `YOUR_USERNAME` with your actual GitHub username
- For example: `"homepage": "https://jordanstark.github.io/wellness-dashboard"`

### 3. Push Your Code to GitHub
Run these commands in your terminal from the "Wellness Dashboard" directory:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit the changes
git commit -m "Initial commit for wellness dashboard"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/wellness-dashboard.git

# Push to GitHub
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The deployment will start automatically when you push to the main branch

### 5. Access Your Deployed Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/wellness-dashboard`
- It may take a few minutes for the first deployment to complete
- You can check the deployment status in the "Actions" tab of your repository

### 6. Share with Friends
Once deployed, you can share the URL with your friends:
`https://YOUR_USERNAME.github.io/wellness-dashboard`

## Important Notes

### API Configuration
Since this is a frontend-only deployment, you'll need to:
1. Deploy your backend server (server.js) to a hosting service like:
   - Heroku
   - Railway
   - Render
   - Vercel
2. Update the API endpoint in your frontend code to point to your deployed backend
3. Set up environment variables for your API keys on the backend

### Environment Variables
For security, make sure your API keys are stored as environment variables on your backend server, not in the frontend code.

## Troubleshooting

### Build Issues
- Check the "Actions" tab in your GitHub repository for build logs
- Make sure all dependencies are properly listed in package.json

### 404 Errors
- Ensure the homepage URL in package.json matches your repository name exactly
- Check that the repository is public

### API Connection Issues
- Verify your backend server is running and accessible
- Check CORS settings on your backend
- Ensure API endpoints are correctly configured 