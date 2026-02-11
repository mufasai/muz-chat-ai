# 🔧 Deploy Fix untuk PDF Extraction

## Issue
PDF extraction error 500 di Vercel karena OCR libraries tidak compatible.

## Solution
Remove OCR, keep text extraction only.

## Deploy Commands

### 1. Commit Changes
```bash
cd server
git add .
git commit -m "fix: remove OCR for Vercel serverless compatibility"
git push origin main
```

### 2. Vercel Auto-Deploy
Vercel akan otomatis deploy setelah push ke GitHub.

### 3. Verify Deployment
```bash
# Check health
curl https://ai-be.muzzie.my.id/health

# Test PDF extraction
curl -X POST https://ai-be.muzzie.my.id/api/extract-pdf \
  -H "Content-Type: application/json" \
  -d '{"pdfBase64":"test"}'
```

### 4. Test di Frontend
```bash
# Restart frontend
npm run dev

# Test:
# 1. Upload PDF dengan text → Should work ✅
# 2. Upload PDF scan → Will show helpful message ⚠️
```

## Expected Behavior

### Text PDF
```
✅ Extract text successfully
✅ Show in chat
✅ AI can read and respond
```

### Scan PDF
```
⚠️ Show message:
"This PDF is a scan. Please use vision model with image upload instead."
```

## Alternative for Scanned PDFs

1. Convert PDF page to image
2. Upload as image (icon 🖼️)
3. Use GPT-4o Mini (vision model)
4. Prompt: "Read text from this image"

---

**Push to deploy!** 🚀
