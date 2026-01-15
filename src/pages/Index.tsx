import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import type { ModelType, Message } from '@/types/ai';

export default function Index() {
    const [currentModel, setCurrentModel] = useState<ModelType>('gpt-4');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSendMessage = (text: string) => {
        const userMsg: Message = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: `Ini adalah respon simulasi dari **${currentModel.toUpperCase()}**. Saya siap membantu Anda dengan berbagai tugas menggunakan kemampuan pemrosesan bahasa alami saya yang canggih.`,
                model: currentModel,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-zinc-950">
            <Sidebar
                currentModel={currentModel}
                onModelChange={setCurrentModel}
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