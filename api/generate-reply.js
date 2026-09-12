export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leadMessage } = req.body || {};

  if (!leadMessage || typeof leadMessage !== 'string') {
    return res.status(400).json({ error: 'leadMessage is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' });
  }

  try {
    const prompt = `You are a friendly, direct customer support assistant for a small business called NexaScale. A potential customer (lead) just sent this message:

"${leadMessage}"

Write a short, warm, helpful reply (2-3 sentences max) as if you are the business owner replying directly. Do not use generic corporate language. Keep it natural and specific to what they asked.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply generated.';

    return res.status(200).json({ reply: replyText.trim() });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate reply' });
  }
}
