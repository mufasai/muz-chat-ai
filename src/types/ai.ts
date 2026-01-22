export type ModelType = 'z-ai/glm-4.5-air:free' | 'deepseek/deepseek-r1-0528:free' | 'tngtech/tng-r1t-chimera:free' | 'deepseek/deepseek-chat';

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    model?: ModelType;
    timestamp: Date;
}