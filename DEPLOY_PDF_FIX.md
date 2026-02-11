# Quick Deploy Guide - PDF Fix

## What Was Fixed
1. **PDF Extraction on Vercel**: Configured pdfjs-dist to work with Node.js canvas in serverless environment
2. **CodePreview Sandbox**: Updated iframe sandbox attribute for better compatibility

## Deploy Backend (Server)

### Step 1: Navigate to server folder
```bash
cd server
```

### Step 2: Commit changes
```bash
git add server.js
git commit -m "fix: Configure pdfjs-dist for Vercel serverless with Node.js canvas"
git push origin main
```

### Step 3: Wait for Vercel auto-deploy
Vercel will automatically detect the push and redeploy. Check:
- https://vercel.com/dashboard
- Or run: `vercel logs`

### Step 4: Test the fix
```bash
# Test health endpoint
curl https://ai-be.muzzie.my.id/health

# Test PDF extraction (use frontend UI to upload a PDF)
```

## Deploy Frontend

### Step 1: Navigate to root folder
```bash
cd ..  # if you're in server folder
```

### Step 2: Commit changes
```bash
git add src/components/CodePreview.tsx
git commit -m "fix: Update iframe sandbox for better compatibility"
git push origin main
```

## Testing Checklist

### Local Testing
- [ ] Start backend: `cd server && npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Upload a PDF with text content
- [ ] Verify AI can read and summarize the PDF
- [ ] Check browser console for errors

### Production Testing
- [ ] Backend health check: https://ai-be.muzzie.my.id/health
- [ ] Upload PDF through frontend
- [ ] Verify PDF extraction returns 200 (not 500)
- [ ] Verify AI receives and processes PDF content
- [ ] Test HTML/CSS code preview still works

## Expected Results

### ✅ Success Indicators
- PDF extraction endpoint returns 200 status
- AI can read and respond to PDF content
- No "DOMMatrix is not defined" errors
- No sandbox attribute warnings in console

### ⚠️ Known Limitations
- **Text PDFs only**: Can extract text from PDFs with selectable text
- **No OCR**: Cannot read scanned PDFs or handwritten text
- **For scanned PDFs**: Use vision model (GPT-4o Mini) with image upload instead

## Troubleshooting

### If PDF extraction still fails:
1. Check Vercel logs: `vercel logs --follow`
2. Verify dependencies in package.json:
   - `canvas: ^3.2.1`
   - `pdfjs-dist: ^5.4.624`
3. Test locally first to isolate the issue
4. Check if PDF has selectable text (not a scan)

### If canvas installation fails:
```bash
cd server
npm install canvas@3.2.1 --save
git add package.json package-lock.json
git commit -m "fix: Ensure canvas dependency is installed"
git push origin main
```

### If still getting errors:
- Check Vercel build logs for native dependency errors
- Verify Node.js version in Vercel settings (should be 18.x or 20.x)
- Try manual redeploy: `vercel --prod`

## Alternative Solution for Scanned PDFs

If you need to read scanned PDFs or handwritten text:

1. **Convert PDF to images** (can be done client-side)
2. **Upload images** using the image upload button (🖼️)
3. **Use vision model**: Select GPT-4o Mini or Qwen 2.5 VL
4. **AI reads the image** using vision capabilities

This approach works better for:
- Scanned documents
- Handwritten text (kwitansi, receipts)
- PDFs with complex layouts
- Images embedded in PDFs
