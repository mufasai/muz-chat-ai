import { useState } from 'react';
import { Code2, Eye, Copy, Download, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';

interface CodePreviewProps {
    html: string;
    css?: string;
    js?: string;
}

export function CodePreview({ html, css = '', js = '' }: CodePreviewProps) {
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html');

    // Combine HTML, CSS, and JS into a single document
    const getPreviewContent = () => {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    ${js ? `<script>${js}</script>` : ''}
</body>
</html>
        `.trim();
    };

    const copyCode = () => {
        const code = codeTab === 'html' ? html : codeTab === 'css' ? css : js;
        navigator.clipboard.writeText(code);
    };

    const downloadCode = () => {
        const content = getPreviewContent();
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'preview.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    const openInNewTab = () => {
        const content = getPreviewContent();
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <div className="my-4 border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-zinc-300">Live Preview</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('preview')}
                        className={activeTab === 'preview' ? 'bg-zinc-700' : ''}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('code')}
                        className={activeTab === 'code' ? 'bg-zinc-700' : ''}
                    >
                        <Code2 className="w-4 h-4 mr-1" />
                        Code
                    </Button>
                    <div className="w-px h-6 bg-zinc-700 mx-1" />
                    <Button variant="ghost" size="sm" onClick={copyCode}>
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={downloadCode}>
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={openInNewTab}>
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'preview' ? (
                <div className="bg-white">
                    <iframe
                        srcDoc={getPreviewContent()}
                        className="w-full h-[500px] border-none"
                        title="Preview"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>
            ) : (
                <div>
                    {/* Code Tabs */}
                    <div className="flex items-center gap-1 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                        <button
                            onClick={() => setCodeTab('html')}
                            className={`px-3 py-1 text-sm rounded ${codeTab === 'html'
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                        >
                            HTML
                        </button>
                        {css && (
                            <button
                                onClick={() => setCodeTab('css')}
                                className={`px-3 py-1 text-sm rounded ${codeTab === 'css'
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:text-zinc-300'
                                    }`}
                            >
                                CSS
                            </button>
                        )}
                        {js && (
                            <button
                                onClick={() => setCodeTab('js')}
                                className={`px-3 py-1 text-sm rounded ${codeTab === 'js'
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:text-zinc-300'
                                    }`}
                            >
                                JavaScript
                            </button>
                        )}
                    </div>

                    {/* Code Display */}
                    <pre className="p-4 overflow-x-auto text-sm">
                        <code className="text-zinc-300">
                            {codeTab === 'html' ? html : codeTab === 'css' ? css : js}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
}
