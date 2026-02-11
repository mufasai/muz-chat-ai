# 🔐 Environment Variables Configuration

## Overview

Aplikasi ini menggunakan environment variables untuk menyimpan konfigurasi sensitif seperti API keys dan URLs.

## Files

### `.env` (Local Development)
File ini berisi konfigurasi untuk development lokal. **JANGAN commit ke Git!**

### `.env.example` (Template)
Template untuk `.env` file. File ini **aman untuk di-commit** ke Git.

### `.gitignore`
Pastikan `.env` ada di `.gitignore` untuk keamanan.

## Environment Variables

### Frontend (Vite)

#### `VITE_AGENT_ROUTER_API_KEY`
- **Description**: OpenRouter API key untuk akses AI models
- **Required**: Yes
- **Example**: `sk-dDMq6FRw6Kank7d90W5mNLKpqzoDp0IPJ4mnTeplImQHOMbh`
- **Get Key**: https://openrouter.ai/keys

#### `VITE_PROXY_URL`
- **Description**: Backend proxy server URL
- **Required**: Yes
- **Development**: `http://localhost:3001`
- **Production**: `https://your-backend-domain.com`
- **Default**: `http://localhost:3001` (fallback jika tidak diset)

### Backend (Server)

#### `OPENROUTER_API_KEY`
- **Description**: OpenRouter API key (sama dengan frontend)
- **Required**: Yes
- **Location**: `server/.env`

#### `PORT`
- **Description**: Server port
- **Required**: No
- **Default**: `3001`

## Setup Instructions

### 1. Frontend Setup

```bash
# Copy template
cp .env.example .env

# Edit .env
nano .env

# Add your values:
VITE_AGENT_ROUTER_API_KEY=your_actual_api_key
VITE_PROXY_URL=http://localhost:3001
```

### 2. Backend Setup

```bash
# Go to server folder
cd server

# Create .env
nano .env

# Add your values:
OPENROUTER_API_KEY=your_actual_api_key
PORT=3001
```

### 3. Verify Setup

```bash
# Check frontend env
cat .env

# Check backend env
cat server/.env
```

## Usage in Code

### Frontend (Vite)

```typescript
// Access env variables with import.meta.env
const apiKey = import.meta.env.VITE_AGENT_ROUTER_API_KEY;
const proxyUrl = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';

// Example usage
const response = await fetch(`${proxyUrl}/api/chat`, {
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
});
```

**Important**: 
- Vite env variables MUST start with `VITE_`
- Access via `import.meta.env.VITE_*`
- Available in browser (client-side)

### Backend (Node.js)

```javascript
// Access env variables with process.env
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;
const port = process.env.PORT || 3001;

// Example usage
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

## Files Updated

### ✅ Files that now use env variables:

1. **src/lib/ai-service.ts**
   ```typescript
   const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
   ```

2. **src/pages/Index.tsx**
   ```typescript
   const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
   const response = await fetch(`${PROXY_URL}/api/extract-pdf`, {...});
   const codeResponse = await fetch(`${PROXY_URL}/api/generate-html`, {...});
   ```

3. **src/pages/Builder.tsx**
   ```typescript
   const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
   const response = await fetch(`${PROXY_URL}/api/generate-app`, {...});
   ```

### ❌ No more hardcoded URLs!

Before:
```typescript
fetch('http://localhost:3001/api/chat') // ❌ Hardcoded
```

After:
```typescript
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
fetch(`${PROXY_URL}/api/chat`) // ✅ From env
```

## Production Deployment

### Frontend (Vercel/Netlify)

1. **Add environment variables** in dashboard:
   ```
   VITE_AGENT_ROUTER_API_KEY=your_key
   VITE_PROXY_URL=https://your-backend.com
   ```

2. **Rebuild** aplikasi untuk apply env variables

### Backend (Railway/Heroku)

1. **Add environment variables**:
   ```
   OPENROUTER_API_KEY=your_key
   PORT=3001
   ```

2. **Deploy** backend

### Update Frontend to Point to Production Backend

```bash
# In .env (production)
VITE_PROXY_URL=https://your-backend-domain.com
```

## Security Best Practices

### ✅ DO:
- Use `.env` for sensitive data
- Add `.env` to `.gitignore`
- Use different keys for dev/prod
- Rotate keys regularly
- Use `VITE_` prefix for frontend vars

### ❌ DON'T:
- Commit `.env` to Git
- Share API keys publicly
- Hardcode sensitive data
- Use production keys in development
- Expose backend keys in frontend

## Troubleshooting

### Env variables not working?

1. **Restart dev server**:
   ```bash
   # Frontend
   npm run dev
   
   # Backend
   cd server && npm run dev
   ```

2. **Check .env file exists**:
   ```bash
   ls -la .env
   ls -la server/.env
   ```

3. **Verify variable names**:
   - Frontend: Must start with `VITE_`
   - Backend: No prefix needed

4. **Check for typos**:
   ```bash
   cat .env | grep VITE_PROXY_URL
   ```

### Still using localhost in production?

Check if `VITE_PROXY_URL` is set correctly:
```bash
echo $VITE_PROXY_URL
```

If empty, set it in your deployment platform.

## Example Configurations

### Development
```env
# .env
VITE_AGENT_ROUTER_API_KEY=sk-dev-key-here
VITE_PROXY_URL=http://localhost:3001
```

### Production
```env
# .env (production)
VITE_AGENT_ROUTER_API_KEY=sk-prod-key-here
VITE_PROXY_URL=https://api.yourdomain.com
```

### Testing
```env
# .env.test
VITE_AGENT_ROUTER_API_KEY=sk-test-key-here
VITE_PROXY_URL=http://localhost:3001
```

## Status

✅ **COMPLETED** - All hardcoded URLs moved to env variables
✅ **SECURE** - Sensitive data in .env (not committed)
✅ **FLEXIBLE** - Easy to change for different environments
✅ **DOCUMENTED** - Clear instructions for setup

---

**Setup your .env file and you're ready to go!** 🚀
