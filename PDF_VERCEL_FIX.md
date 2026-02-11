# PDF Extraction Fix for Vercel Deployment

## Problem
PDF extraction was returning 500 error on Vercel with error: `DOMMatrix is not defined`

## Root Cause
`pdfjs-dist` library was trying to use browser APIs (DOMMatrix, Canvas) that don't exist in Node.js serverless environment.

## Solution
Configure `pdfjs-dist` to use Node.js canvas implementation with proper factory class.

## Changes Made

### 1. Updated `server/server.js`
Added Node.js canvas factory configuration for pdfjs-dist:

```javascript
// Import canvas for Node.js environment
const NodeCanvasFactory = (await import('canvas')).default;

// Create custom canvas factory for serverless
class NodeCanvasFactoryImpl {
    create(width, height) {
        const { createCanvas } = NodeCanvasFactory;
        const canvas = createCanvas(width, height);
        return {
            canvas,
            context: canvas.getContext('2d')
        };
    }
    
    reset(canvasAndContext, width, height) {
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }
    
    destroy(canvasAndContext) {
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    }
}

// Use it when loading PDF
const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
    standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.624/standard_fonts/',
    canvasFactory: new NodeCanvasFactoryImpl(),
    isEvalSupported: false,
});
```

## Deployment Steps

### 1. Test Locally First
```bash
cd server
npm run dev
```

Then test PDF upload through the frontend.

### 2. Commit and Push to Backend Repo
```bash
cd server
git add server.js
git commit -m "fix: Configure pdfjs-dist for Vercel serverless environment"
git push origin main
```

### 3. Vercel Will Auto-Deploy
Vercel will automatically detect the push and redeploy.

### 4. Test Production
After deployment completes, test the PDF extraction:
```bash
# Test with a real PDF file
curl -X POST https://ai-be.muzzie.my.id/api/extract-pdf \
  -H "Content-Type: application/json" \
  -d '{"pdfBase64":"data:application/pdf;base64,YOUR_BASE64_HERE"}'
```

Or use the frontend UI to upload a PDF.

## Dependencies Required
Make sure these are in `server/package.json`:
```json
{
  "dependencies": {
    "canvas": "^3.2.1",
    "pdfjs-dist": "^5.4.624"
  }
}
```

## Limitations
- **Text-only PDFs**: Can only extract selectable text from PDFs
- **Scanned PDFs**: Cannot read handwritten or scanned text (no OCR on serverless)
- **For scanned PDFs**: Use vision model (GPT-4o Mini or Qwen 2.5 VL) with image upload instead

## Testing Checklist
- [ ] Local server starts without errors
- [ ] PDF with text can be uploaded and extracted
- [ ] Scanned PDF shows helpful error message
- [ ] Backend deployed to Vercel successfully
- [ ] Production endpoint returns 200 (not 500)
- [ ] Frontend can upload PDF and AI can read the content

## Troubleshooting

### If still getting 500 error:
1. Check Vercel logs: `vercel logs`
2. Verify canvas is installed: Check package.json
3. Test locally first to isolate issue
4. Check if PDF has selectable text (not a scan)

### If canvas installation fails on Vercel:
Canvas requires native dependencies. Vercel should handle this automatically, but if it fails:
- Canvas v3.2.1 is compatible with Vercel
- Make sure `package.json` has correct version
- Try redeploying: `vercel --prod`

## Alternative: Use Vision Model for Scanned PDFs
For PDFs that are scans or contain handwritten text:
1. Convert PDF pages to images
2. Upload images to frontend
3. Use GPT-4o Mini or Qwen 2.5 VL model
4. AI can read text from images using vision capabilities
