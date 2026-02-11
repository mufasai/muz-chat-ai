# ✅ Backend Deployment Checklist

## Status: Backend Deployed! 🎉

Dari screenshot Vercel dashboard:
- ✅ Deployment: **Ready**
- ✅ Domain: **ai-be.muzzle.my.id**
- ✅ Status: **Production**

## Next Steps

### 1. Verify Backend URL

Coba akses di browser:
```
https://ai-be.muzzle.my.id/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "message": "Agent Router Proxy is running"
}
```

### 2. Test API Endpoints

#### Health Check
```bash
curl https://ai-be.muzzle.my.id/health
```

#### Chat Endpoint (Test)
```bash
curl -X POST https://ai-be.muzzle.my.id/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 3. Update Frontend .env

**Already Updated!** ✅

```env
VITE_PROXY_URL=https://ai-be.muzzle.my.id
```

### 4. Restart Frontend Dev Server

```bash
# Stop current server (Ctrl+C)

# Start again to load new env
npm run dev
```

### 5. Test All Features

Open http://localhost:5173 and test:

- ✅ **Chat**: Send message to AI
- ✅ **PDF Upload**: Upload and read PDF
- ✅ **Code Generation**: Generate HTML/CSS
- ✅ **App Builder**: Generate React app

### 6. Check Browser Console

Press F12 and check:
- No CORS errors
- API calls go to `https://ai-be.muzzle.my.id`
- Responses successful

## Troubleshooting

### Issue: Domain not resolving

**Check**:
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Domains" tab
4. Verify `ai-be.muzzle.my.id` is listed

**If not listed**:
- Use Vercel's default URL instead
- Format: `https://your-project-name.vercel.app`

### Issue: CORS Error

**Solution**: Update server.js CORS config:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}));
```

Then redeploy:
```bash
cd server
git add .
git commit -m "fix: update CORS config"
git push origin main
```

### Issue: 404 Not Found

**Check**:
1. Verify `vercel.json` exists in server folder
2. Check routes configuration
3. Redeploy: `vercel --prod`

### Issue: Environment Variables Not Working

**Solution**:
```bash
# Check env vars
vercel env ls

# Add if missing
vercel env add OPENROUTER_API_KEY

# Redeploy
vercel --prod
```

## Vercel Dashboard Checks

### 1. Deployment Status
- ✅ Should show "Ready" (green)
- ❌ If "Error" (red), check build logs

### 2. Build Logs
Click "Build Logs" to see:
- Dependencies installed
- Build successful
- No errors

### 3. Runtime Logs
Click "Runtime Logs" to see:
- Server started
- API requests
- Any errors

### 4. Environment Variables
Go to Settings → Environment Variables:
- ✅ `OPENROUTER_API_KEY` should be set
- ✅ Value should be hidden (secure)

## Frontend .env Configuration

### Development (Local Backend)
```env
VITE_PROXY_URL=http://localhost:3001
```

### Production (Vercel Backend)
```env
VITE_PROXY_URL=https://ai-be.muzzle.my.id
```

### Switch Between Environments
```bash
# Use local backend
VITE_PROXY_URL=http://localhost:3001 npm run dev

# Use production backend
VITE_PROXY_URL=https://ai-be.muzzle.my.id npm run dev
```

## Monitoring

### Check Logs
```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### Check Analytics
Vercel Dashboard → Analytics:
- Request count
- Response times
- Error rates
- Bandwidth usage

## Performance

### Vercel Limits (Free Tier)
- ✅ Bandwidth: 100GB/month
- ✅ Invocations: 100GB-hours
- ⚠️ Function timeout: 10 seconds
- ⚠️ Function size: 50MB

### If Timeout Issues
1. Upgrade to Pro ($20/month) for 60s timeout
2. Or optimize long operations (OCR, etc)

## Security

### API Key Protection
- ✅ API key stored in Vercel env vars
- ✅ Not exposed in code
- ✅ Not in Git

### CORS Configuration
Update for production:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## Deployment URL

Your backend is now live at:
```
https://ai-be.muzzle.my.id
```

Or Vercel default URL:
```
https://your-project-name.vercel.app
```

## Next: Deploy Frontend

### Option 1: Vercel
```bash
vercel
vercel --prod
```

### Option 2: Netlify
```bash
netlify deploy --prod
```

### Option 3: GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

## Final Checklist

Before going live:

- [ ] Backend deployed and accessible
- [ ] Frontend .env updated
- [ ] All features tested
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Logs checked
- [ ] No errors in console
- [ ] Performance acceptable
- [ ] Security reviewed

## Support

If issues persist:
1. Check Vercel logs: `vercel logs`
2. Check browser console (F12)
3. Verify environment variables
4. Test endpoints with curl/Postman
5. Review Vercel documentation

---

**Backend is deployed!** Now test and deploy frontend. 🚀
