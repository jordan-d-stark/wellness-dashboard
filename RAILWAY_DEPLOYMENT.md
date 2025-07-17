# Deploying Backend to Railway

This guide will help you deploy your Wellness Dashboard backend to Railway.

## Prerequisites
- A Railway account (free at [railway.app](https://railway.app))
- Your Exist.io API credentials
- Git installed on your computer

## Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email address

## Step 2: Install Railway CLI (Optional but Recommended)
```bash
npm install -g @railway/cli
```

## Step 3: Deploy to Railway

### Option A: Using Railway Dashboard (Easiest)
1. Go to your Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your `wellness-dashboard` repository
6. Railway will automatically detect it's a Node.js app and start building

### Option B: Using Railway CLI
```bash
# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy your app
railway up
```

## Step 4: Configure Environment Variables

In your Railway dashboard, go to your project and add these environment variables:

### Required Variables:
```
EXIST_CLIENT_ID=your_exist_client_id
EXIST_CLIENT_SECRET=your_exist_client_secret
REACT_APP_EXIST_API_KEY=your_exist_api_key
NODE_ENV=production
```

### Optional Variables:
```
BASE_URL=https://your-app-name.railway.app
```

## Step 5: Get Your Exist.io OAuth Credentials

If you don't have OAuth credentials yet:

1. Go to [Exist.io Developer Portal](https://exist.io/account/apps/)
2. Click "Create New App"
3. Fill in the details:
   - **Name**: Wellness Dashboard
   - **Description**: Personal wellness dashboard
   - **Redirect URI**: `https://your-app-name.railway.app/auth/callback`
   - **Scopes**: Select all the scopes you need (activity_read, productivity_read, mood_read, sleep_read)
4. Save and copy the Client ID and Client Secret

## Step 6: Update OAuth Redirect URI

After deployment, Railway will give you a URL like `https://your-app-name.railway.app`. Update your Exist.io app's redirect URI to:
```
https://your-app-name.railway.app/auth/callback
```

## Step 7: Test Your Deployment

1. Visit your Railway app URL
2. Test the API endpoint: `https://your-app-name.railway.app/api/wellness-data`
3. Check the logs in Railway dashboard for any errors

## Step 8: Update Frontend Configuration

Once your backend is deployed, update your frontend to use the new API URL:

1. In your React app, update the API calls to use your Railway URL
2. Or set up environment variables in your GitHub Pages deployment

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure `server.js` is in the root directory
   - Check Railway build logs

2. **Environment Variables Not Working**
   - Make sure variables are set in Railway dashboard
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding variables

3. **CORS Errors**
   - The server is configured to allow requests from GitHub Pages
   - Check that your Railway URL is in the allowed origins

4. **OAuth Redirect Issues**
   - Ensure redirect URI in Exist.io matches your Railway URL exactly
   - Check that the URL uses HTTPS

### Checking Logs:
- Go to your Railway project dashboard
- Click on "Deployments"
- Click on the latest deployment
- Check the logs for any errors

## Railway Free Tier Limits

- **Builds**: 500 builds per month
- **Deployments**: Unlimited
- **Bandwidth**: 100GB per month
- **Storage**: 1GB
- **Sleep**: Apps sleep after 5 minutes of inactivity

## Next Steps

After successful deployment:
1. Test your API endpoints
2. Update your frontend to use the new backend URL
3. Share your wellness dashboard with friends!

Your backend will be available at: `https://your-app-name.railway.app` 