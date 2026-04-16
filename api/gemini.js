export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { system, userMessage, maxTokens } = req.body;

    const apiKey = "AIzaSyDZKI-z099OWE09AE2xP4IlKVHS9lByJi4";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      generationConfig: {
        maxOutputTokens: maxTokens || 4000
      }
    };

    if (system) {
      body.system_instruction = { parts: [{ text: system }] };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error.message || data.error });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: 'No response from Gemini' });

    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
