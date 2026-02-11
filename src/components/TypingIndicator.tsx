import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
    return (
        <div className="flex gap-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700/50 shadow-lg bg-zinc-800">
                <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-2 max-w-[85%]">
                <div className="p-4 rounded-2xl border bg-zinc-900/50 border-zinc-800 text-zinc-300">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
