# 🧪 Test PDF Feature

## Cara Test Fitur PDF

### 1. Buat Test PDF
Buat file PDF sederhana dengan content:

```
LAPORAN PROYEK AI CHAT
=======================

Ringkasan Eksekutif:
Proyek AI Chat telah berhasil mengimplementasikan fitur-fitur berikut:
- Multi-model AI support (DeepSeek, GPT-4o, GLM, dll)
- Vision support untuk analisis gambar
- Code preview untuk HTML/CSS generation
- PDF reading untuk analisis dokumen

Teknologi:
- Frontend: React + TypeScript + Vite
- Backend: Express.js + OpenRouter API
- UI: Tailwind CSS + shadcn/ui
- PDF: pdf-parse library

Kesimpulan:
Sistem berjalan dengan baik dan siap untuk production.
```

### 2. Test Scenarios

#### Test 1: Rangkuman
```
Upload: test.pdf
Prompt: "Buatkan rangkuman singkat"
Expected: AI memberikan bullet points dari isi PDF
```

#### Test 2: Ekstraksi Info
```
Upload: test.pdf
Prompt: "Apa saja teknologi yang digunakan?"
Expected: AI list teknologi (React, Express, dll)
```

#### Test 3: Translate
```
Upload: test.pdf
Prompt: "Translate ke bahasa Inggris"
Expected: AI translate content PDF
```

#### Test 4: Q&A
```
Upload: test.pdf
Prompt: "Apa kesimpulan dari laporan ini?"
Expected: AI jawab berdasarkan section Kesimpulan
```

### 3. Verifikasi

✅ **PDF Upload**: Icon PDF muncul, file bisa dipilih
✅ **Preview**: Nama file & jumlah halaman tampil
✅ **Extraction**: Console log "PDF extracted: X pages"
✅ **AI Response**: AI bisa jawab pertanyaan tentang PDF
✅ **Remove**: Tombol X bisa hapus PDF

### 4. Edge Cases

#### Large PDF (>10MB)
```
Expected: Alert "PDF size should be less than 10MB"
```

#### Non-PDF File
```
Expected: Alert "Please select a PDF file"
```

#### Corrupt PDF
```
Expected: Alert "Gagal membaca PDF"
```

#### Empty Prompt with PDF
```
Expected: Bisa kirim (PDF saja tanpa text)
```

### 5. Console Logs

Saat upload & kirim PDF, Anda harus lihat:
```
Extracting PDF text...
PDF extracted: 1 pages, 523 characters
Starting stream with model: deepseek/deepseek-chat
[PDF Document: test.pdf]
LAPORAN PROYEK AI CHAT
...
```

### 6. Network Tab

Check di DevTools → Network:
```
POST /api/extract-pdf
Status: 200
Response: { text: "...", pages: 1, info: {...} }

POST /api/chat
Status: 200
Response: SSE stream dengan AI response
```

## Troubleshooting Test

### PDF tidak ke-extract
1. Check server running: `http://localhost:3001/health`
2. Check console error
3. Verify pdf-parse installed: `npm list pdf-parse`

### AI tidak baca PDF
1. Check console log ada "[PDF Document: ...]"
2. Verify PDF text di-append ke message
3. Check API request payload

### UI tidak update
1. Hard refresh browser (Cmd+Shift+R)
2. Check React DevTools untuk state changes
3. Verify TypeScript compile tanpa error

## Success Criteria

✅ Upload PDF berhasil
✅ Extract text berhasil (lihat console)
✅ AI bisa jawab pertanyaan tentang PDF
✅ Preview PDF tampil di chat history
✅ Bisa remove PDF sebelum kirim
✅ Error handling works (file size, type, dll)

---

**Ready to test!** 🚀
