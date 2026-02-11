import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import type { ModelType, Message } from '@/types/ai';

export default function Index() {
    const [currentModel, setCurrentModel] = useState<ModelType>('z-ai/glm-4.5-air:free');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const MAX_MESSAGES = 50; // Limit maksimal pesan dalam satu chat

    // Helper: Detect if user wants HTML/CSS generation
    const isHtmlCssRequest = (text: string): boolean => {
        const keywords = [
            'html', 'css', 'landing page', 'webpage', 'website', 'web page',
            'buatkan landing', 'buatkan website', 'buatkan webpage',
            'buat landing', 'buat website', 'buat webpage',
            'hero section', 'blockchain', 'dark theme', 'futuristic',
            'modern landing', 'cyberpunk', 'glassmorphism',
            'halaman web', 'halaman landing', 'tampilan web'
        ];
        const lowerText = text.toLowerCase();
        return keywords.some(keyword => lowerText.includes(keyword)) &&
            !lowerText.includes('react') &&
            !lowerText.includes('component');
    };

    // Helper: Extract HTML/CSS from markdown code blocks
    const extractCodeFromMarkdown = (text: string): { html: string; css: string; js: string } | null => {
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

    // Reset messages ketika model berubah
    const handleModelChange = (newModel: ModelType) => {
        setCurrentModel(newModel);
        setMessages([]); // Clear chat history
    };

    const handleSendMessage = async (text: string, imageBase64?: string, pdfBase64?: string, pdfFileName?: string) => {
        // Check message limit
        if (messages.length >= MAX_MESSAGES) {
            alert(`Maksimal ${MAX_MESSAGES} pesan per chat. Silakan mulai chat baru.`);
            return;
        }

        // Set loading state
        setIsLoading(true);

        // Extract PDF text if PDF is provided
        let pdfData: { text: string; pages: number; fileName: string } | undefined;
        if (pdfBase64 && pdfFileName) {
            try {
                console.log('Extracting PDF text...');
                const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
                const response = await fetch(`${PROXY_URL}/api/extract-pdf`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pdfBase64 })
                });

                if (response.ok) {
                    const data = await response.json();
                    pdfData = {
                        text: data.text,
                        pages: data.pages,
                        fileName: pdfFileName
                    };
                    console.log(`PDF extracted: ${data.pages} pages, ${data.text.length} characters`);

                    // Check if PDF has text
                    if (!data.text || data.text.trim().length === 0) {
                        alert('PDF tidak berisi text yang bisa dibaca. Mungkin PDF ini berupa scan/gambar. Coba PDF lain yang berisi text.');
                        setIsLoading(false);
                        return;
                    }

                    // Log first 200 chars for debugging
                    console.log('PDF text preview:', data.text.substring(0, 200));
                } else {
                    alert('Gagal membaca PDF. Coba lagi.');
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('PDF extraction error:', error);
                alert('Gagal membaca PDF. Coba lagi.');
                setIsLoading(false);
                return;
            }
        }

        const userMsg: Message = {
            id: Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date(),
            imageUrl: imageBase64,
            pdfData
        };
        setMessages(prev => [...prev, userMsg]);

        // Store AI message ID for later updates
        const aiMsgId = Date.now() + 1;

        try {
            // Check if this is HTML/CSS generation request
            if (isHtmlCssRequest(text)) {
                console.log('Detected HTML/CSS request, generating code preview...');

                const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
                // Generate HTML/CSS code
                const codeResponse = await fetch(`${PROXY_URL}/api/generate-html`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: text,
                        model: currentModel
                    })
                });

                if (codeResponse.ok) {
                    const codeData = await codeResponse.json();
                    setIsLoading(false);

                    // Create AI message with code preview
                    const aiMsg: Message = {
                        id: aiMsgId,
                        role: 'assistant',
                        content: 'Saya sudah buatkan HTML/CSS untuk kamu! Lihat preview di bawah:',
                        model: currentModel,
                        timestamp: new Date(),
                        codePreview: {
                            html: codeData.html || '',
                            css: codeData.css || '',
                            js: codeData.js || ''
                        }
                    };
                    setMessages(prev => [...prev, aiMsg]);
                    return; // Skip normal chat flow
                }
            }

            // Normal chat flow
            const { streamChatCompletion, parseSSEStream } = await import('@/lib/ai-service');

            console.log('Starting stream with model:', currentModel);

            // Prepare messages for API - limit history untuk vision models
            const isVisionModel = currentModel === 'qwen/qwen-2.5-vl-7b-instruct:free' ||
                currentModel === 'openai/gpt-4o-mini';

            // Untuk vision model, hanya kirim 5 message terakhir untuk mengurangi token
            const messagesToSend = isVisionModel
                ? messages.slice(-4).concat(userMsg)
                : messages.concat(userMsg);

            // Add system prompt for HTML/CSS requests
            let apiMessages = messagesToSend.map(m => {
                if (m.imageUrl && imageBase64) {
                    // Format for vision models
                    return {
                        role: m.role,
                        content: [
                            { type: 'text', text: m.content as string },
                            { type: 'image_url', image_url: { url: m.imageUrl } }
                        ]
                    };
                }

                // Handle PDF content - append PDF text to user message
                let messageContent = typeof m.content === 'string' ? m.content : m.content.find(c => c.type === 'text')?.text || '';
                if (m.pdfData) {
                    messageContent += `\n\n[PDF Document: ${m.pdfData.fileName}]\n${m.pdfData.text}`;
                }

                return {
                    role: m.role,
                    content: messageContent
                };
            });

            // If this looks like HTML/CSS request, add system instruction
            if (isHtmlCssRequest(text)) {
                apiMessages = [
                    {
                        role: 'system',
                        content: 'You are an expert web developer. When user asks for HTML/CSS code, provide it in markdown code blocks like this:\n\n```html\n<div>HTML code here</div>\n```\n\n```css\n.class { styles here }\n```\n\nMake the code modern, beautiful, and responsive. You can add brief explanation before the code.'
                    } as any,
                    ...apiMessages
                ];
            }

            // If user uploaded PDF, add system instruction
            if (pdfData && pdfData.text) {
                apiMessages = [
                    {
                        role: 'system',
                        content: 'The user has uploaded a PDF document. The text content from the PDF is included in their message after "[PDF Document: filename]". Please read and analyze the PDF content carefully, then respond to their question about the document. Be specific and reference the actual content from the PDF.'
                    } as any,
                    ...apiMessages
                ];
            }

            // Kirim request ke backend proxy
            const stream = await streamChatCompletion(
                currentModel,
                apiMessages as any
            );

            // Parse dan tampilkan streaming response
            let fullResponse = '';
            let aiMessageCreated = false;

            for await (const textChunk of parseSSEStream(stream)) {
                if (!aiMessageCreated) {
                    // Create AI message on first chunk
                    const aiMsg: Message = {
                        id: aiMsgId,
                        role: 'assistant',
                        content: textChunk,
                        model: currentModel,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, aiMsg]);
                    aiMessageCreated = true;
                } else {
                    // Update existing message
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMsgId
                                ? { ...msg, content: msg.content + textChunk }
                                : msg
                        )
                    );
                }
                fullResponse += textChunk;
            }

            console.log('Stream completed');

            // Clear loading state
            setIsLoading(false);

            // After stream completes, check if response contains HTML/CSS code blocks
            if (isHtmlCssRequest(text) || fullResponse.includes('```html')) {
                const extractedCode = extractCodeFromMarkdown(fullResponse);
                if (extractedCode && (extractedCode.html || extractedCode.css)) {
                    console.log('Extracted code from markdown blocks');
                    // Update message with code preview
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMsgId
                                ? {
                                    ...msg,
                                    codePreview: extractedCode
                                }
                                : msg
                        )
                    );
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error("AI Error:", error);

            // Create error message
            const errorMsg: Message = {
                id: aiMsgId,
                role: 'assistant',
                content: `Maaf, terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`,
                model: currentModel,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-zinc-950">
            <Sidebar
                currentModel={currentModel}
                onModelChange={handleModelChange}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="flex-1 flex flex-col min-w-0">
                <ChatArea
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    currentModel={currentModel}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
}