# 🔧 Quick Fix: PDF Error

## Error yang Terjadi
"Gagal membaca PDF. Coba lagi."

## Kemungkinan Penyebab
1. Server belum di-restart setelah install library
2. OCR library conflict
3. PDF format tidak supported

## Solusi Cepat

### Option 1: Restart Server (RECOMMENDED)
```bash
# Kill old process
lsof -ti:3001 | xargs kill -9

# Reinstall dependencies
cd server
rm -rf node_modules
npm install

# Start server
npm run dev
```

### Option 2: Test Tanpa OCR Dulu
Untuk sementara, test dengan PDF yang **berisi text** (bukan scan):
- ✅ PDF dari Word/Google Docs
- ✅ PDF dengan text yang bisa di-select
- ❌ PDF scan/screenshot (butuh OCR)

### Option 3: Check Console Error
1. Buka terminal server
2. Lihat error message lengkap
3. Share error untuk debugging

## Debugging Steps

### 1. Check Server Running
```bash
curl http://localhost:3001/health
```

Expected: `{"status":"ok"}`

### 2. Check Dependencies
```bash
cd server
npm list tesseract.js canvas pdfjs-dist
```

Expected: All installed

### 3. Test PDF Extraction
Upload PDF dan check console server untuk error detail

## Temporary Workaround

Jika OCR masih error, kita bisa **disable OCR** sementara:

1. Server akan tetap bisa baca PDF text
2. PDF scan akan return message "PDF contains images"
3. User bisa manual ketik atau gunakan PDF text

## Next Steps

1. **Restart server** dengan cara di atas
2. **Test dengan PDF text** dulu (bukan scan)
3. Jika berhasil, baru test PDF scan
4. Share error jika masih gagal

---

**Coba restart server dulu!** 🔄
