# ⚡ Quick Deploy Commands

## Deploy Backend (Fix PDF 500 Error)
```bash
cd server
git add server.js
git commit -m "fix: Configure pdfjs-dist for Vercel serverless"
git push origin main
```

## Deploy Frontend (Fix Sandbox Warning)
```bash
cd ..
git add src/components/CodePreview.tsx
git commit -m "fix: Update iframe sandbox attribute"
git push origin main
```

## Test After Deploy
```bash
# 1. Health check
curl https://ai-be.muzzie.my.id/health

# 2. Upload PDF through frontend UI
# 3. Ask AI to summarize it
# 4. Should return 200 ✅ (not 500 ❌)
```

## Check Logs
```bash
vercel logs --follow
```

## What Was Fixed
- ✅ PDF extraction 500 error → Now works on Vercel
- ✅ "DOMMatrix is not defined" → Fixed with Node.js canvas
- ✅ Iframe sandbox warning → Updated attribute

## Files Changed
- `server/server.js` - PDF extraction with canvas factory
- `src/components/CodePreview.tsx` - Iframe sandbox

## Read More
- `PDF_FIX_COMPLETE.md` - Full overview
- `DEPLOY_PDF_FIX.md` - Detailed steps
- `PDF_VERCEL_FIX.md` - Technical details

---
**Ready to deploy!** 🚀
