import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ModelType } from '@/types/ai';
import {
    Bot,
    Cpu,
    Sparkles,
    Zap,
    Plus,
    Settings,
    PanelLeftClose,
    ChevronDown,
    ChevronUp,
    Code2
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
    currentModel: ModelType;
    onModelChange: (model: ModelType) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const models = [
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', icon: Sparkles, color: 'text-purple-500', desc: 'Free - Lightweight' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', icon: Cpu, color: 'text-blue-500', desc: 'Free - Reasoning' },
    { id: 'tngtech/tng-r1t-chimera:free', name: 'TNG R1T Chimera', icon: Zap, color: 'text-yellow-500', desc: 'Free - Creative' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', icon: Bot, color: 'text-cyan-500', desc: 'Fast & Stable' },
    { id: 'qwen/qwen-2.5-vl-7b-instruct:free', name: 'Qwen 2.5 VL', icon: Sparkles, color: 'text-emerald-500', desc: 'Free - Vision 👁️ (Slow)' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', icon: Sparkles, color: 'text-indigo-500', desc: 'Paid - Vision 👁️ (Fast)' },
] as const;

export function Sidebar({ currentModel, onModelChange, isOpen, onToggle }: SidebarProps) {
    const [showAllModels, setShowAllModels] = useState(false);

    // Show only first 3 models by default
    const visibleModels = showAllModels ? models : models.slice(0, 3);

    return (
        <aside className={cn(
            "h-full border-r border-zinc-800 bg-zinc-900 flex flex-col transition-all duration-300",
            isOpen ? "w-full sm:w-72 fixed sm:relative z-50 sm:z-auto" : "w-0 overflow-hidden border-none"
        )}>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 sm:hidden z-40"
                    onClick={onToggle}
                />
            )}

            <div className="relative z-50 h-full flex flex-col bg-zinc-900">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg">
                            <span className="text-blue-400 font-bold text-lg">M</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">MUZ</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="text-zinc-400">
                        <PanelLeftClose className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-4">
                    <Button className="w-full justify-start gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700">
                        <Plus className="w-4 h-4" />
                        Chat Baru
                    </Button>
                    <Link to="/builder">
                        <Button className="w-full justify-start gap-2 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-none">
                            <Code2 className="w-4 h-4" />
                            App Builder
                        </Button>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-6">
                    <div>
                        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Pilih Model AI</p>
                        <div className="space-y-1">
                            {visibleModels.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => onModelChange(model.id as ModelType)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left",
                                        currentModel === model.id
                                            ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                    )}
                                >
                                    <model.icon className={cn("w-5 h-5", currentModel === model.id ? model.color : "text-zinc-500 group-hover:text-zinc-400")} />
                                    <div>
                                        <p className="text-sm font-medium">{model.name}</p>
                                        <p className="text-[10px] text-zinc-500">{model.desc}</p>
                                    </div>
                                </button>
                            ))}

                            {/* Show More / Show Less Button */}
                            {models.length > 3 && (
                                <button
                                    onClick={() => setShowAllModels(!showAllModels)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-all mt-2"
                                >
                                    {showAllModels ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            Tampilkan Lebih Sedikit
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            Tampilkan {models.length - 3} Model Lainnya
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Riwayat Chat</p>
                        {/* <div className="space-y-1">
                        {[1, 2, 3].map((i) => (
                            <button key={i} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 rounded-lg group text-left">
                                <MessageSquare className="w-4 h-4 shrink-0" />
                                <span className="truncate">Diskusi tentang React Architecture #{i}</span>
                            </button>
                        ))}
                    </div> */}
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-3">
                        <Settings className="w-5 h-5" />
                        Pengaturan
                    </Button>
                    <div className="mt-4 flex items-center gap-3 px-2 py-1">
                        <img
                            src="https://mgx-backend-cdn.metadl.com/generate/images/868536/2025-12-27/eb6d3f9c-012b-4372-a9fb-a657c7e97dbe.png"
                            alt="User"
                            className="w-8 h-8 rounded-full border border-zinc-700"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">User muz</p>
                            <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}