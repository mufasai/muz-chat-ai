import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import type { ModelType, Message } from '@/types/ai';

export default function Index() {
    const [currentModel, setCurrentModel] = useState<ModelType>('z-ai/glm-4.5-air:free');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const MAX_MESSAGES = 50; // Limit maksimal pesan dalam satu chat

    // Reset messages ketika model berubah
    const handleModelChange = (newModel: ModelType) => {
        setCurrentModel(newModel);
        setMessages([]); // Clear chat history
    };

    const handleSendMessage = async (text: string, imageBase64?: string) => {
        // Check message limit
        if (messages.length >= MAX_MESSAGES) {
            alert(`Maksimal ${MAX_MESSAGES} pesan per chat. Silakan mulai chat baru.`);
            return;
        }

        const userMsg: Message = {
            id: Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date(),
            imageUrl: imageBase64
        };
        setMessages(prev => [...prev, userMsg]);

        // Creating placeholder for AI response
        const aiMsgId = Date.now() + 1;
        const initialAiMsg: Message = {
            id: aiMsgId,
            role: 'assistant',
            content: '',
            model: currentModel,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, initialAiMsg]);

        // Timeout warning for slow models
        const timeoutWarning = setTimeout(() => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMsgId && msg.content === ''
                        ? { ...msg, content: '⏳ Model sedang memproses... Ini mungkin memakan waktu untuk model vision. Harap tunggu atau coba model lain.' }
                        : msg
                )
            );
        }, 10000); // 10 detik

        try {
            const { streamChatCompletion, parseSSEStream } = await import('@/lib/ai-service');

            console.log('Starting stream with model:', currentModel);

            // Prepare messages for API - limit history untuk vision models
            const isVisionModel = currentModel === 'qwen/qwen-2.5-vl-7b-instruct:free' ||
                currentModel === 'openai/gpt-4o-mini';

            // Untuk vision model, hanya kirim 5 message terakhir untuk mengurangi token
            const messagesToSend = isVisionModel
                ? messages.slice(-4).concat(userMsg)
                : messages.concat(userMsg);

            const apiMessages = messagesToSend.map(m => {
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
                return {
                    role: m.role,
                    content: typeof m.content === 'string' ? m.content : m.content.find(c => c.type === 'text')?.text || ''
                };
            });

            // Kirim request ke backend proxy
            const stream = await streamChatCompletion(
                currentModel,
                apiMessages as any
            );

            // Clear timeout warning jika stream dimulai
            let hasReceivedData = false;

            // Parse dan tampilkan streaming response
            for await (const textChunk of parseSSEStream(stream)) {
                if (!hasReceivedData) {
                    clearTimeout(timeoutWarning);
                    hasReceivedData = true;
                    // Clear warning message
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMsgId
                                ? { ...msg, content: textChunk }
                                : msg
                        )
                    );
                } else {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMsgId
                                ? { ...msg, content: msg.content + textChunk }
                                : msg
                        )
                    );
                }
            }

            console.log('Stream completed');
        } catch (error) {
            clearTimeout(timeoutWarning);
            console.error("AI Error:", error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMsgId
                        ? { ...msg, content: `Maaf, terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}` }
                        : msg
                )
            );
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
                />
            </main>
        </div>
    );
}