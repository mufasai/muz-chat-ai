import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Increase timeout for long streaming responses
app.use((req, res, next) => {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000); // 5 minutes
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Agent Router Proxy is running' });
});

// Proxy endpoint untuk chat completions
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages } = req.body;

        console.log('Received request:', { model, messageCount: messages?.length });

        // Validasi input
        if (!model || !messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: 'Invalid request. Required: model (string) and messages (array)'
            });
        }

        // Kirim request ke OpenRouter (alternatif yang lebih cocok untuk web apps)
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'MUZ AI'
            },
            body: JSON.stringify({
                model,
                messages,
                stream: true
            }),
            signal: AbortSignal.timeout(300000) // 5 minutes timeout
        });

        console.log('Agent Router response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Agent Router error:', errorText);
            return res.status(response.status).json({
                error: `Agent Router API error: ${response.status}`,
                details: errorText
            });
        }

        // Set headers untuk streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Stream response dari Agent Router ke client
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Handle client disconnect
        req.on('close', () => {
            console.log('Client disconnected, closing stream');
            reader.cancel();
        });

        let chunkCount = 0;
        let totalBytes = 0;
        const startTime = Date.now();

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    const duration = Date.now() - startTime;
                    console.log(`Stream completed - Chunks: ${chunkCount}, Bytes: ${totalBytes}, Duration: ${duration}ms`);
                    res.end();
                    break;
                }

                chunkCount++;
                totalBytes += value.length;

                const chunk = decoder.decode(value, { stream: true });

                // Log first chunk to see what we're getting
                if (chunkCount === 1) {
                    console.log('First chunk received:', chunk.substring(0, 100));
                }

                // Check if client is still connected
                if (res.writableEnded) {
                    console.log('Response already ended');
                    break;
                }

                res.write(chunk);
            }
        } catch (streamError) {
            console.error('Stream error:', streamError);
            if (!res.writableEnded) {
                res.end();
            }
        }

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Internal proxy error',
            message: error.message
        });
    }
});

// Start server with extended timeouts
const server = app.listen(PORT, () => {
    console.log(`🚀 Agent Router Proxy running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});

// Set server timeout for long streaming responses
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 300000; // 5 minutes
server.headersTimeout = 310000; // Slightly more than keepAliveTimeout
