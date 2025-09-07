export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { query, variables, operationName } = req.body;

    const response = await fetch('https://graphql.anilist.co/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(req.headers.authorization && {
          'Authorization': req.headers.authorization
        })
      },
      body: JSON.stringify({
        query,
        variables,
        operationName
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    });
  }
}
