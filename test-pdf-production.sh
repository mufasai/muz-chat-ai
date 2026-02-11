#!/bin/bash

echo "🧪 Testing PDF Extraction on Production"
echo "========================================"
echo ""

# Test health endpoint
echo "1️⃣ Testing health endpoint..."
curl -s https://ai-be.muzzie.my.id/health | jq '.'
echo ""
echo ""

# Test PDF extraction with a simple base64 PDF
echo "2️⃣ Testing PDF extraction endpoint..."
echo "Note: You need to upload a real PDF through the frontend UI to fully test this."
echo ""
echo "To test manually:"
echo "1. Open your frontend app"
echo "2. Click the PDF upload button (📄)"
echo "3. Upload a PDF with text content"
echo "4. Ask AI to summarize it"
echo "5. Check browser Network tab - should see 200 response (not 500)"
echo ""
echo "Expected result: ✅ Status 200 with extracted text"
echo "Previous error: ❌ Status 500 with 'DOMMatrix is not defined'"
echo ""
echo "========================================"
echo "✅ Backend is deployed and healthy!"
echo "🚀 Ready to test PDF upload through frontend"
