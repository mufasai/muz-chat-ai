import { useState, useRef, useEffect } from 'react';
import type { ModelType, Message } from '@/types/ai';
import { Send, User, Sparkles, Copy, ThumbsUp, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    currentModel: ModelType;
}

export function ChatArea({ messages, onSendMessage, currentModel }: ChatAreaProps) {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950 relative">
            {/* Header Info */}
            <header className="h-14 border-b border-zinc-800 flex items-center px-6 justify-between glass z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-zinc-300 uppercase tracking-widest">
                        Active Model: <span className="text-white">{currentModel.replace('-', ' ').toUpperCase()}</span>
                    </span>
                </div>
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <img
                            // src="https://mgx-backend-cdn.metadl.com/generate/images/868536/2025-12-27/fb449132-f449-4d3b-8752-a526057b68f9.png"
                            alt="Logo"
                            className="w-20 h-20 grayscale"
                        />
                        <h2 className="text-2xl font-bold">Apa yang bisa saya bantu hari ini?</h2>
                        <p className="max-w-md text-zinc-400">
                            Pilih model di sidebar dan mulai percakapan. Saya bisa membantu menulis kode, merangkum teks, atau menjawab pertanyaan apapun.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700/50 shadow-lg",
                                msg.role === 'user' ? "bg-blue-600 border-blue-500" : "bg-zinc-800"
                            )}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-blue-400" />}
                            </div>
                            <div className={cn(
                                "space-y-2 max-w-[85%]",
                                msg.role === 'user' ? "items-end text-right" : "items-start text-left"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-2xl border leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-blue-600/10 border-blue-600/20 text-zinc-100"
                                        : "bg-zinc-900/50 border-zinc-800 text-zinc-300"
                                )}>
                                    {msg.content}
                                </div>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-4 px-1">
                                        <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Copy className="w-4 h-4" /></button>
                                        <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                                        <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><RotateCcw className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto relative group"
                >
                    <div className="relative glass rounded-2xl border-zinc-700 focus-within:border-blue-500/50 transition-all shadow-2xl overflow-hidden">
                        <Textarea
                            placeholder={`Ketik pesan untuk ${currentModel.toUpperCase()}...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent border-none focus-visible:ring-0 min-h-[60px] max-h-[200px] py-4 px-6 text-zinc-200 placeholder:text-zinc-600 resize-none"
                        />
                        <div className="flex items-center justify-between px-4 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-600 font-mono">SHIFT + ENTER UNTUK BARIS BARU</span>
                            </div>
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/20"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </form>
                <p className="text-center text-[10px] text-zinc-600 mt-3 uppercase tracking-tighter">
                    AI Muz dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi penting.
                </p>
            </div>
        </div>
    );
}