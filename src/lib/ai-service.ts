// Service untuk berkomunikasi dengan backend proxy
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';

export async function streamChatCompletion(
    model: string,
    messages: Array<{ role: string; content: string }>
): Promise<ReadableStream> {
    const response = await fetch(`${PROXY_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (!response.body) {
        throw new Error('No response body');
    }

    return response.body;
}

// Helper untuk parse SSE stream
export async function* parseSSEStream(stream: ReadableStream): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');

            // Simpan line terakhir yang mungkin incomplete
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();

                    if (data === '[DONE]') {
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;

                        if (content) {
                            yield content;
                        }
                    } catch (e) {
                        // Skip invalid JSON
                        console.warn('Failed to parse SSE data:', data);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
