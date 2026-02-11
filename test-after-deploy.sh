#!/bin/bash

echo "🧪 Testing PDF Extraction After Deployment"
echo "=========================================="
echo ""

echo "⏳ Waiting 30 seconds for Vercel deployment to complete..."
sleep 30
echo ""

echo "1️⃣ Testing health endpoint..."
HEALTH=$(curl -s https://ai-be.muzzie.my.id/health)
echo "$HEALTH" | jq '.'

if echo "$HEALTH" | grep -q "ok"; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    exit 1
fi

echo ""
echo "2️⃣ PDF Extraction Endpoint Status"
echo "Note: Testing with invalid data to check if endpoint responds"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST https://ai-be.muzzie.my.id/api/extract-pdf \
  -H "Content-Type: application/json" \
  -d '{"pdfBase64":"invalid"}')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "Status Code: $HTTP_STATUS"
echo "Response: $BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_STATUS" = "500" ] && echo "$BODY" | grep -q "DOMMatrix"; then
    echo "❌ Still getting DOMMatrix error - deployment may not be complete"
    echo "   Wait another minute and try again"
    echo ""
    echo "   Or check Vercel dashboard: https://vercel.com/dashboard"
elif [ "$HTTP_STATUS" = "500" ]; then
    echo "⚠️  Getting 500 error but different message"
    echo "   This might be expected with invalid PDF data"
    echo "   Try uploading a real PDF through the frontend UI"
elif [ "$HTTP_STATUS" = "400" ]; then
    echo "✅ Endpoint is responding! (400 = bad request, expected with invalid data)"
    echo "   Now test with a real PDF through the frontend UI"
else
    echo "ℹ️  Got status $HTTP_STATUS"
    echo "   Try uploading a real PDF through the frontend UI"
fi

echo ""
echo "=========================================="
echo "📝 Next Steps:"
echo "1. Open your frontend app in browser"
echo "2. Click PDF upload button (📄)"
echo "3. Upload a PDF with text content"
echo "4. Ask AI to summarize it"
echo "5. Check Network tab - should see 200 response"
echo ""
echo "If still getting 500 with DOMMatrix error:"
echo "- Wait another 2 minutes for deployment"
echo "- Check Vercel dashboard for deployment status"
echo "- Run this script again: ./test-after-deploy.sh"
