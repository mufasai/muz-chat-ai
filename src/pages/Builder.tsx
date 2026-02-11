import { useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Download, Code2 } from 'lucide-react';
import './builder.css';

// Lazy load Sandpack (heavy library)
const Sandpack = lazy(() =>
    import('@codesandbox/sandpack-react').then(module => ({
        default: module.Sandpack
    }))
);

// Loading component for Sandpack
const SandpackLoader = () => (
    <div className="flex items-center justify-center h-[600px] bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading code editor...</p>
        </div>
    </div>
);

export default function Builder() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
    const [selectedModel, setSelectedModel] = useState<'deepseek/deepseek-chat' | 'openai/gpt-4o-mini'>('deepseek/deepseek-chat');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const PROXY_URL = import.meta.env.VITE_PROXY_URL;
            const response = await fetch(`${PROXY_URL}/api/generate-app`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    model: selectedModel
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Show user-friendly error from backend
                alert(data.error || 'Gagal generate app. Coba lagi atau gunakan model lain.');
                return;
            }

            // Ensure we have the files object
            if (data.files) {
                setGeneratedFiles(data.files);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert('Gagal generate app. Coba lagi atau gunakan model lain.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-zinc-950">
            {/* Header */}
            <header className="h-14 sm:h-16 border-b border-zinc-800 flex items-center px-3 sm:px-6 justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                        <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-xl font-bold truncate">AI App Builder</h1>
                        <p className="text-[10px] sm:text-xs text-zinc-500 truncate">Generate React apps</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value as any)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-300"
                    >
                        <option value="deepseek/deepseek-chat">DeepSeek</option>
                        <option value="openai/gpt-4o-mini">GPT-4o</option>
                    </select>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Prompt Input */}
                {!generatedFiles ? (
                    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                        <div className="max-w-2xl w-full space-y-4 sm:space-y-6">
                            <div className="text-center space-y-2">
                                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-500" />
                                <h2 className="text-xl sm:text-3xl font-bold">Apa yang ingin kamu buat?</h2>
                                <p className="text-zinc-400">Deskripsikan app yang kamu inginkan, AI akan generate full code untuk kamu</p>
                            </div>

                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Deskripsikan apa yang anda ingin buat"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[200px] bg-zinc-900 border-zinc-800 text-zinc-100 resize-none"
                                />

                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-medium"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Generate App
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Example Prompts */}
                            <div className="space-y-2">
                                <p className="text-sm text-zinc-500">Contoh prompts (natural & fleksibel):</p>
                                <div className="grid gap-2">
                                    {[
                                        'Buatkan dashboard admin yang modern dan clean untuk manage users',
                                        'Buatkan landing page untuk startup SaaS dengan hero section yang menarik, features, dan pricing',
                                        'Buatkan todo app yang simple tapi elegant dengan dark mode'
                                    ].map((example) => (
                                        <button
                                            key={example}
                                            onClick={() => setPrompt(example)}
                                            className="text-left text-sm p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-300 transition-colors"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Split View: Code + Preview - Full Height */
                    <div className="flex-1 overflow-hidden sandpack-container">
                        <Suspense fallback={<SandpackLoader />}>
                            <Sandpack
                                template="react"
                                theme="dark"
                                files={generatedFiles}
                                options={{
                                    showNavigator: true,
                                    showTabs: true,
                                    showLineNumbers: true,
                                    editorHeight: '100%',
                                    editorWidthPercentage: 50,
                                    showConsole: false,
                                    showConsoleButton: true,
                                    closableTabs: false,
                                }}
                                customSetup={{
                                    dependencies: {
                                        'react': '^18.0.0',
                                        'react-dom': '^18.0.0',
                                    }
                                }}
                            />
                        </Suspense>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {generatedFiles && (
                <div className="h-16 border-t border-zinc-800 flex items-center px-6 justify-between">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setGeneratedFiles(null);
                            setPrompt('');
                        }}
                        className="border-zinc-700 text-zinc-300"
                    >
                        Generate New App
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <Download className="w-4 h-4 mr-2" />
                        Download ZIP
                    </Button>
                </div>
            )}
        </div>
    );
}
