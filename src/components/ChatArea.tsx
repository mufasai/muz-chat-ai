import { useState, useRef, useEffect } from 'react';
import type { ModelType, Message } from '@/types/ai';
import { Send, User, Sparkles, Copy, ThumbsUp, RotateCcw, PanelLeft, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatAreaProps {
    messages: Message[];
    onSendMessage: (text: string, imageBase64?: string) => void;
    currentModel: ModelType;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

export function ChatArea({ messages, onSendMessage, currentModel, isSidebarOpen, onToggleSidebar }: ChatAreaProps) {
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper untuk format nama model
    const getModelDisplayName = (model: ModelType): string => {
        const modelMap: Record<ModelType, string> = {
            'z-ai/glm-4.5-air:free': 'GLM 4.5 AIR',
            'deepseek/deepseek-r1-0528:free': 'DEEPSEEK R1',
            'tngtech/tng-r1t-chimera:free': 'TNG R1T CHIMERA',
            'deepseek/deepseek-chat': 'DEEPSEEK CHAT',
            'qwen/qwen-2.5-vl-7b-instruct:free': 'QWEN 2.5 VL (VISION)',
            'openai/gpt-4o-mini': 'GPT-4O MINI (VISION)'
        };
        return modelMap[model] || model.toUpperCase();
    };

    // Check if current model supports vision
    const isVisionModel = currentModel === 'qwen/qwen-2.5-vl-7b-instruct:free' ||
        currentModel === 'openai/gpt-4o-mini';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !selectedImage) return;
        onSendMessage(input, selectedImage || undefined);
        setInput('');
        setSelectedImage(null);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Convert to base64 with compression
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                // Create canvas for compression
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions (max 1024px)
                let width = img.width;
                let height = img.height;
                const maxSize = 1024;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                setSelectedImage(compressedBase64);
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                    {!isSidebarOpen && (
                        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-zinc-400 mr-2">
                            <PanelLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-zinc-300 uppercase tracking-widest">
                        Active Model: <span className="text-white">{getModelDisplayName(currentModel)}</span>
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
                        {/* <img
                            // src="https://mgx-backend-cdn.metadl.com/generate/images/868536/2025-12-27/fb449132-f449-4d3b-8752-a526057b68f9.png"
                            alt="Logo"
                            className="w-20 h-20 grayscale"
                        /> */}
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
                                    {msg.imageUrl && (
                                        <img
                                            src={msg.imageUrl}
                                            alt="Uploaded"
                                            className="max-w-xs rounded-lg mb-2"
                                        />
                                    )}
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700 prose-code:text-emerald-400 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-ul:text-zinc-300 prose-ol:text-zinc-300 prose-li:text-zinc-300">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {typeof msg.content === 'string' ? msg.content :
                                                    msg.content.find(c => c.type === 'text')?.text || ''}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <span>
                                            {typeof msg.content === 'string' ? msg.content :
                                                msg.content.find(c => c.type === 'text')?.text || ''}
                                        </span>
                                    )}
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
                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="mb-3 relative inline-block">
                            <img
                                src={selectedImage}
                                alt="Preview"
                                className="max-w-xs max-h-40 rounded-lg border border-zinc-700"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="relative glass rounded-2xl border-zinc-700 focus-within:border-blue-500/50 transition-all shadow-2xl overflow-hidden">
                        <Textarea
                            placeholder={`Ketik pesan untuk ${getModelDisplayName(currentModel)}...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent border-none focus-visible:ring-0 min-h-[60px] max-h-[200px] py-4 px-6 text-zinc-200 placeholder:text-zinc-600 resize-none"
                        />
                        <div className="flex items-center justify-between px-4 pb-3">
                            <div className="flex items-center gap-2">
                                {isVisionModel && (
                                    <>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-500 hover:text-zinc-300"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImageIcon className="w-5 h-5" />
                                            </Button>
                                        </label>
                                    </>
                                )}
                                <span className="text-[10px] text-zinc-600 font-mono">SHIFT + ENTER UNTUK BARIS BARU</span>
                            </div>
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() && !selectedImage}
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