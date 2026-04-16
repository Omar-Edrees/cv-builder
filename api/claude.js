export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { system, userMessage, maxTokens } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': "AIzaSyDZKI-z099OWE09AE2xP4IlKVHS9lByJi4",
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens || 4000,
        system: system,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error });
    return res.status(200).json({ text: data.content[0].text });

  } catch (error) {
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
