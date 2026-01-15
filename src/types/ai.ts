export type ModelType = 'gpt-4' | 'claude-3' | 'gemini-pro' | 'deepseek-v3';

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    model?: ModelType;
    timestamp: Date;
}