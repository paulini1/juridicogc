// Vercel Serverless Function — Proxy para API da Anthropic
// A API key fica segura nas variáveis de ambiente do Vercel

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor' });
  }

  try {
    const body = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => '{}');
      res.status(response.status);
      res.setHeader('Content-Type', 'application/json');
      return res.end(err);
    }

    // Stream the response back to the client using Node.js streams
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Convert Web ReadableStream to Node stream and pipe
    const { Readable } = require('stream');
    const nodeStream = Readable.fromWeb(response.body);
    nodeStream.pipe(res);

  } catch (err) {
    console.error('Proxy error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Erro interno do proxy: ' + err.message });
    }
    res.end();
  }
};
