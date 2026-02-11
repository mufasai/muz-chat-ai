# ⚡ Quick Commands Reference

## Split Repository

### 1. Remove server from frontend repo
```bash
git rm -r --cached server/
git add .gitignore
git commit -m "chore: exclude server folder"
git push origin main
```

### 2. Create backend repo
```bash
cd server
git init
git add .
git commit -m "feat: initial backend setup"
git remote add origin https://github.com/YOUR_USERNAME/muz-ai-backend.git
git branch -M main
git push -u origin main
```

### 3. Deploy backend to Vercel
```bash
cd server
vercel login
vercel
vercel env add OPENROUTER_API_KEY
vercel --prod
```

### 4. Update frontend .env
```bash
# Edit .env
VITE_PROXY_URL=https://your-backend.vercel.app
```

### 5. Test & Deploy frontend
```bash
npm run dev  # Test locally
vercel --prod  # Deploy
```

## Done! 🎉

Frontend: https://your-frontend.vercel.app
Backend: https://your-backend.vercel.app
