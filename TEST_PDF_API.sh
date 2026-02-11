#!/bin/bash

# Test script untuk PDF extraction API
# Cara pakai: bash TEST_PDF_API.sh

echo "🧪 Testing PDF Extraction API..."
echo ""

# Create a simple test PDF content (base64 encoded)
# This is a minimal PDF with text "Hello World"
PDF_BASE64="JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+Pj4vTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCA3MDAgVGQKKEhlbGxvIFdvcmxkKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvVGltZXMtUm9tYW4+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKNiAwIG9iago8PC9Qcm9kdWNlcihQREYgVGVzdCk+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMzY0IDAwMDAwIG4gCjAwMDAwMDAzMTMgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTI0IDAwMDAwIG4gCjAwMDAwMDAyMTcgMDAwMDAgbiAKMDAwMDAwMDQxMyAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNy9Sb290IDEgMCBSL0luZm8gNiAwIFI+PgpzdGFydHhyZWYKNDU3CiUlRU9G"

echo "📤 Sending PDF to extraction API..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3001/api/extract-pdf \
  -H "Content-Type: application/json" \
  -d "{\"pdfBase64\": \"data:application/pdf;base64,$PDF_BASE64\"}")

echo "📥 Response:"
echo "$RESPONSE" | jq '.'

echo ""
echo "✅ Test completed!"
echo ""
echo "Expected output:"
echo "- text: Should contain 'Hello World'"
echo "- pages: Should be 1"
echo "- info: PDF metadata"
