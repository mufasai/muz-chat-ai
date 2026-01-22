import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import type { ModelType, Message } from '@/types/ai';

export default function Index() {
    const [currentModel, setCurrentModel] = useState<ModelType>('z-ai/glm-4.5-air:free');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Reset messages ketika model berubah
    const handleModelChange = (newModel: ModelType) => {
        setCurrentModel(newModel);
        setMessages([]); // Clear chat history
    };

    const handleSendMessage = async (text: string) => {
        const userMsg: Message = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
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

        try {
            const { streamChatCompletion, parseSSEStream } = await import('@/lib/ai-service');

            console.log('Starting stream with model:', currentModel);

            // Kirim request ke backend proxy
            const stream = await streamChatCompletion(
                currentModel,
                messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }))
            );

            // Parse dan tampilkan streaming response
            for await (const textChunk of parseSSEStream(stream)) {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === aiMsgId
                            ? { ...msg, content: msg.content + textChunk }
                            : msg
                    )
                );
            }

            console.log('Stream completed');
        } catch (error) {
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