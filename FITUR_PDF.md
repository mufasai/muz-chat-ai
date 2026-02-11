# 📄 Fitur Upload & Baca PDF

## Fitur Baru
Sekarang Anda bisa upload file PDF dan AI akan membaca isi dokumen tersebut!

## Cara Menggunakan

### 1. Upload PDF
- Klik icon **📄 (FileText)** di sebelah input chat
- Pilih file PDF (maksimal 10MB)
- Preview PDF akan muncul di atas input box

### 2. Kirim Pesan
Ketik instruksi Anda, misalnya:
- "Buatkan rangkuman dari PDF ini"
- "Apa poin-poin penting dari dokumen ini?"
- "Translate dokumen ini ke bahasa Inggris"
- "Jelaskan isi PDF dengan bahasa sederhana"

### 3. AI Membaca & Merespon
- AI akan otomatis extract text dari PDF
- Text PDF ditambahkan ke context AI
- AI akan merespon sesuai instruksi Anda

## Contoh Use Case

### 📚 Rangkuman Dokumen
```
Upload: paper_penelitian.pdf
Prompt: "Buatkan rangkuman singkat dari paper ini"
```

### 🔍 Analisis Konten
```
Upload: kontrak.pdf
Prompt: "Apa saja poin-poin penting dalam kontrak ini?"
```

### 🌐 Translate
```
Upload: artikel_english.pdf
Prompt: "Translate dokumen ini ke bahasa Indonesia"
```

### 💡 Explain Like I'm 5
```
Upload: technical_doc.pdf
Prompt: "Jelaskan isi dokumen ini dengan bahasa yang mudah dipahami"
```

## Teknologi

### Backend (server/server.js)
- **pdf-parse**: Library untuk extract text dari PDF
- Endpoint: `POST /api/extract-pdf`
- Input: PDF dalam format base64
- Output: Text, jumlah halaman, metadata

### Frontend
- **ChatArea.tsx**: UI untuk upload PDF
- **Index.tsx**: Logic untuk extract & kirim ke AI
- **types/ai.ts**: Type definition untuk PDF data

## Limitasi
- **Ukuran file**: Maksimal 10MB
- **Format**: Hanya PDF (bukan gambar atau Word)
- **Text-based**: PDF harus berisi text (bukan scan gambar)
- **Model**: Bisa pakai model apapun (tidak harus vision model)

## Tips
1. **Untuk PDF scan/gambar**: Gunakan OCR tool dulu sebelum upload
2. **Untuk PDF besar**: Potong jadi beberapa bagian
3. **Untuk hasil terbaik**: Berikan instruksi yang spesifik
4. **Multi-language**: AI bisa baca PDF dalam berbagai bahasa

## Troubleshooting

### PDF tidak terbaca
- Pastikan PDF berisi text (bukan scan)
- Cek ukuran file < 10MB
- Coba convert PDF ke format yang lebih kompatibel

### Error "Failed to extract PDF"
- PDF mungkin corrupt atau password-protected
- Coba buka di PDF reader dulu untuk validasi
- Pastikan server running dengan `npm run dev` di folder server

### Response terlalu lambat
- PDF terlalu panjang (banyak halaman)
- Coba minta rangkuman per section
- Atau potong PDF jadi beberapa bagian

## Kombinasi dengan Fitur Lain

### PDF + Image (Vision Model)
```
Upload: diagram.png + explanation.pdf
Prompt: "Jelaskan diagram ini berdasarkan PDF"
```

### PDF + Code Generation
```
Upload: requirements.pdf
Prompt: "Buatkan HTML/CSS landing page sesuai requirement di PDF"
```

### PDF + Chat History
AI akan ingat context dari PDF di chat sebelumnya, jadi Anda bisa:
```
Message 1: [Upload PDF] "Baca dokumen ini"
Message 2: "Apa kesimpulannya?"
Message 3: "Buatkan bullet points"
```

## Update yang Dilakukan

### 1. Server (server/server.js)
- Install `pdf-parse` library
- Tambah endpoint `/api/extract-pdf`
- Extract text dari PDF buffer

### 2. Types (src/types/ai.ts)
- Tambah interface `PdfData`
- Update interface `Message` dengan field `pdfData`

### 3. ChatArea (src/components/ChatArea.tsx)
- Tambah state `selectedPdf`
- Tambah handler `handlePdfSelect` & `removePdf`
- Tambah UI untuk upload & preview PDF
- Tambah icon FileText dari lucide-react

### 4. Index (src/pages/Index.tsx)
- Update `handleSendMessage` untuk extract PDF
- Append PDF text ke message content
- Handle error extraction

## Next Steps (Optional Enhancement)

### 1. OCR Support
Tambah library untuk baca PDF scan:
```bash
npm install tesseract.js
```

### 2. Multiple PDF
Support upload beberapa PDF sekaligus

### 3. PDF Preview
Tampilkan preview halaman PDF di chat

### 4. Highlight Text
Highlight bagian PDF yang direferensi AI

### 5. Export Summary
Download rangkuman dalam format PDF/Word
