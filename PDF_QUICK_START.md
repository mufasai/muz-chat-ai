# 📄 Quick Start: Upload & Baca PDF

## Setup (Sekali Saja)

1. **Install dependency** (sudah dilakukan):
```bash
cd server
npm install pdf-parse
```

2. **Restart server**:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Cara Pakai

### Step 1: Upload PDF
Klik icon **📄** di chat input → Pilih PDF file

### Step 2: Tulis Instruksi
Contoh:
- "Buatkan rangkuman dari PDF ini"
- "Apa poin-poin penting?"
- "Translate ke bahasa Indonesia"

### Step 3: Kirim
AI akan otomatis baca PDF dan kasih response!

## Contoh Real

```
📄 Upload: "Laporan_Keuangan_Q4.pdf"
💬 Prompt: "Buatkan executive summary dari laporan ini"

🤖 AI Response:
"Berdasarkan laporan keuangan Q4 yang Anda upload:

**Highlights:**
- Revenue meningkat 25% YoY
- Net profit margin 18%
- Cash flow positif $2.5M
...
"
```

## Tips
✅ PDF harus berisi text (bukan scan)
✅ Maksimal 10MB
✅ Bisa pakai model apapun (tidak harus vision)
✅ Bisa combine dengan chat history

## Troubleshooting
❌ **"Failed to extract PDF"** → PDF corrupt atau password-protected
❌ **Lambat** → PDF terlalu panjang, minta rangkuman per section
❌ **Tidak terbaca** → PDF scan, perlu OCR dulu

---

**Dokumentasi lengkap**: Lihat `FITUR_PDF.md`
