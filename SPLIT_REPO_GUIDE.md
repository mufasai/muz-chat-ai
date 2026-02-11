# 📦 Panduan Split Repository: Frontend & Backend

## Overview

Memisahkan frontend dan backend menjadi 2 repository terpisah untuk:
- ✅ Deployment yang lebih fleksibel
- ✅ Version control yang lebih clean
- ✅ Team collaboration yang lebih baik
- ✅ CI/CD yang independent

## Current Structure

```
muz-ai/
├── src/              # Frontend (React + Vite)
├── server/           # Backend (Express.js)
├── public/
├── package.json      # Frontend dependencies
└── ...
```

## Target Structure

### Repository 1: Frontend
```
muz-ai-frontend/
├── src/
├── public/
├── package.json
├── .env
└── ...
```

### Repository 2: Backend
```
muz-ai-backend/
├── server.js
├── package.json
├── .env
├── vercel.json
└── ...
```

## Step-by-Step Guide

### Part 1: Prepare Current Repo (Frontend)

#### 1. Update .gitignore
```bash
# Already done! .gitignore now excludes server/
```

#### 2. Remove server from Git tracking
```bash
# Remove server from Git (but keep files locally)
git rm -r --cached server/

# Commit changes
git add .gitignore
git commit -m "chore: exclude server folder for separate repo"
git push origin main
```

#### 3. Verify
```bash
# Check Git status
git status

# Server folder should not appear in tracked files
```

### Part 2: Create New Backend Repo

#### 1. Create new GitHub repository
```
Name: muz-ai-backend
Description: Backend API server for MUZ AI Chat
Private/Public: Your choice
```

#### 2. Initialize Git in server folder
```bash
# Go to server folder
cd server

# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial backend setup"
```

#### 3. Connect to GitHub
```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/muz-ai-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 4. Verify
```bash
# Check remote
git remote -v

# Check branches
git branch -a
```

### Part 3: Deploy Backend to Vercel

#### 1. Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy from server folder
```bash
# Make sure you're in server folder
cd server

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? muz-ai-backend
# - Directory? ./
# - Override settings? No
```

#### 4. Set Environment Variables
```bash
# Add OpenRouter API key
vercel env add OPENROUTER_API_KEY

# Choose:
# - Environment: Production
# - Value: your_openrouter_api_key
```

#### 5. Deploy to Production
```bash
vercel --prod
```

#### 6. Get Deployment URL
```
✅ Production: https://muz-ai-backend.vercel.app
```

### Part 4: Update Frontend Configuration

#### 1. Update .env
```bash
# Edit .env in frontend root
nano .env
```

```env
VITE_AGENT_ROUTER_API_KEY=your_key_here
VITE_PROXY_URL=https://muz-ai-backend.vercel.app
```

#### 2. Test Connection
```bash
# Start frontend
npm run dev

# Test in browser
# Upload PDF, generate code, etc.
```

#### 3. Commit Changes
```bash
git add .env
git commit -m "chore: update backend URL to Vercel deployment"
git push origin main
```

### Part 5: Deploy Frontend (Optional)

#### Deploy to Vercel
```bash
# From frontend root
vercel

# Follow prompts
vercel --prod
```

#### Or Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Repository Structure After Split

### Frontend Repo (muz-ai-frontend)
```
https://github.com/YOUR_USERNAME/muz-ai-frontend

Deployment: https://muz-ai-frontend.vercel.app
```

### Backend Repo (muz-ai-backend)
```
https://github.com/YOUR_USERNAME/muz-ai-backend

Deployment: https://muz-ai-backend.vercel.app
```

## Environment Variables

### Frontend (.env)
```env
VITE_AGENT_ROUTER_API_KEY=your_key
VITE_PROXY_URL=https://muz-ai-backend.vercel.app
```

### Backend (.env)
```env
OPENROUTER_API_KEY=your_key
PORT=3001
```

## Workflow After Split

### Update Frontend
```bash
cd muz-ai-frontend
git pull
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main
vercel --prod  # Deploy
```

### Update Backend
```bash
cd muz-ai-backend
git pull
# Make changes
git add .
git commit -m "feat: add new endpoint"
git push origin main
vercel --prod  # Deploy
```

## Troubleshooting

### Issue: Server folder still tracked by Git

**Solution**:
```bash
git rm -r --cached server/
git commit -m "chore: remove server from tracking"
git push origin main
```

### Issue: CORS error after deployment

**Solution**: Update CORS in server.js
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.vercel.app',
  credentials: true
}));
```

### Issue: Environment variables not working

**Solution**:
```bash
# Vercel
vercel env ls  # List env vars
vercel env add VARIABLE_NAME  # Add new var

# Redeploy
vercel --prod
```

### Issue: Vercel build fails

**Solution**:
1. Check Node.js version in package.json:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

2. Verify all dependencies installed:
```bash
npm install
```

3. Test build locally:
```bash
npm run build
```

## Benefits of Split Repos

### ✅ Deployment
- Independent deployments
- Faster CI/CD
- Different hosting providers

### ✅ Development
- Cleaner Git history
- Easier code reviews
- Better team collaboration

### ✅ Scaling
- Scale frontend/backend independently
- Different update frequencies
- Separate monitoring

### ✅ Security
- Separate access controls
- Backend secrets isolated
- Frontend public, backend private

## Maintenance

### Keep Dependencies Updated

**Frontend**:
```bash
cd muz-ai-frontend
npm update
npm audit fix
```

**Backend**:
```bash
cd muz-ai-backend
npm update
npm audit fix
```

### Monitor Deployments

**Vercel Dashboard**:
- Check deployment status
- View logs
- Monitor performance
- Track errors

## Next Steps

1. ✅ Split repositories
2. ✅ Deploy backend to Vercel
3. ✅ Update frontend .env
4. ✅ Test connection
5. ✅ Deploy frontend (optional)
6. ✅ Monitor and maintain

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Git Documentation](https://git-scm.com/doc)

---

**Ready to split!** Follow the steps above carefully. 🚀
