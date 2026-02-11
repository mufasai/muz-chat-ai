# Solusi: Code Preview Tidak Muncul di Chat

## Masalah
Ketika menggunakan DeepSeek Chat untuk generate HTML/CSS dengan prompt panjang, code preview tidak muncul. AI hanya menampilkan kode sebagai teks biasa.

## Penyebab
1. **Deteksi keyword terlalu terbatas** - sistem hanya mendeteksi beberapa kata kunci dalam bahasa Inggris/Indonesia
2. **Prompt panjang tidak terdeteksi** - prompt blockchain yang kompleks tidak memicu deteksi HTML/CSS
3. **Tidak ada ekstraksi fallback** - jika AI tidak mengikuti format JSON, kode tidak diekstrak dari markdown

## Solusi yang Diterapkan

### 1. Perluas Deteksi Keyword
Menambahkan lebih banyak keyword yang relevan:
```typescript
const keywords = [
    'html', 'css', 'landing page', 'webpage', 'website', 'web page',
    'buatkan landing', 'buatkan website', 'buatkan webpage',
    'buat landing', 'buat website', 'buat webpage',
    'hero section', 'blockchain', 'dark theme', 'futuristic',
    'modern landing', 'cyberpunk', 'glassmorphism',
    'halaman web', 'halaman landing', 'tampilan web'
];
```

### 2. Tambahkan Ekstraksi dari Markdown
Fungsi baru untuk mengekstrak kode dari markdown code blocks:
```typescript
const extractCodeFromMarkdown = (text: string) => {
    const htmlMatch = text.match(/```html\n([\s\S]*?)```/);
    const cssMatch = text.match(/```css\n([\s\S]*?)```/);
    const jsMatch = text.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    
    if (htmlMatch || cssMatch) {
        return {
            html: htmlMatch ? htmlMatch[1].trim() : '',
            css: cssMatch ? cssMatch[1].trim() : '',
            js: jsMatch ? jsMatch[1].trim() : ''
        };
    }
    return null;
};
```

### 3. Tambahkan System Prompt
Instruksi khusus untuk AI agar mengembalikan kode dalam format markdown:
```typescript
if (isHtmlCssRequest(text)) {
    apiMessages = [
        {
            role: 'system',
            content: 'You are an expert web developer. When user asks for HTML/CSS code, provide it in markdown code blocks...'
        } as any,
        ...apiMessages
    ];
}
```

### 4. Post-Processing Setelah Stream
Setelah streaming selesai, cek apakah ada kode yang bisa diekstrak:
```typescript
// After stream completes, check if response contains HTML/CSS code blocks
if (isHtmlCssRequest(text) || fullResponse.includes('```html')) {
    const extractedCode = extractCodeFromMarkdown(fullResponse);
    if (extractedCode && (extractedCode.html || extractedCode.css)) {
        // Update message with code preview
        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMsgId
                    ? { ...msg, codePreview: extractedCode }
                    : msg
            )
        );
    }
}
```

## Cara Menggunakan

1. **Restart development server** jika sedang berjalan
2. **Buka chat** dan pilih model DeepSeek Chat
3. **Kirim prompt** yang mengandung keyword seperti:
   - "buatkan landing page blockchain"
   - "create modern website with dark theme"
   - "buat hero section futuristic"
4. **Code preview akan muncul** secara otomatis setelah AI selesai generate

## Catatan
- Sistem sekarang mendukung **2 mode**:
  1. **JSON mode** - mencoba generate via `/api/generate-html` (lebih cepat)
  2. **Fallback mode** - ekstrak dari markdown jika JSON gagal (lebih reliable)
- Deteksi keyword **case-insensitive** dan mendukung bahasa Indonesia & Inggris
- Code preview akan muncul **setelah streaming selesai** jika menggunakan fallback mode
