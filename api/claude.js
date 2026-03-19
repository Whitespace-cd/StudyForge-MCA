export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-plan, x-user-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const userPlan   = req.headers['x-plan']     || 'free';
    const userOwnKey = req.headers['x-user-key'] || '';

    let apiKey;

    if (userPlan === 'admin' && userOwnKey) {
      // Admin studying with their own personal key
      apiKey = userOwnKey;
    } else if (userPlan === 'pro') {
      // Pro users use server key
      apiKey = process.env.ANTHROPIC_API_KEY;
    } else {
      // Free users use server key (limited to 3 lifetime calls)
      apiKey = process.env.ANTHROPIC_API_KEY;
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'No API key available. Please add your personal key in Settings.'
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
