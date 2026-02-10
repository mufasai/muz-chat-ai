export type ModelType =
    | 'z-ai/glm-4.5-air:free'
    | 'deepseek/deepseek-r1-0528:free'
    | 'tngtech/tng-r1t-chimera:free'
    | 'deepseek/deepseek-chat'
    | 'qwen/qwen-2.5-vl-7b-instruct:free' // Vision - Lambat tapi stabil
    | 'openai/gpt-4o-mini'; // Vision - Berbayar murah & cepat

export interface MessageContent {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
        url: string;
    };
}

export interface CodePreviewData {
    html: string;
    css?: string;
    js?: string;
}

export interface PdfData {
    text: string;
    pages: number;
    fileName: string;
}

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string | MessageContent[];
    model?: ModelType;
    timestamp: Date;
    imageUrl?: string; // For display purposes
    pdfData?: PdfData; // For PDF attachments
    codePreview?: CodePreviewData; // For inline code preview
}