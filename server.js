import 'dotenv/config';
import express from 'express';
const app = express();

app.get('/api/github-oauth', async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing GitHub credentials' });
  }
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const json = await r.json();
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: 'Failed to exchange code' });
  }
});

app.listen(4001, () => {
  console.log('Backend server running on port 4001');
});