export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const accessToken = process.env.ACCESS_TOKEN;
  const pixelId = process.env.PIXEL_ID;
  const testEventCode = process.env.NODE_ENV === 'production' ? null : process.env.TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}` +
              (testEventCode ? `&test_event_code=${testEventCode}` : '');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'ScrollInicioServer',
          event_id: 'srv_ScrollInicio_' + Date.now(),
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: req.headers.referer || 'https://seusite.com',
          user_data: {
            em: 'HASHED_EMAIL'
          },
          client_ip_address: req.headers['x-forwarded-for'] || '0.0.0.0',
          client_user_agent: req.headers['user-agent'] || ''
        }]
      })
    });

    const result = await response.json();
    res.status(200).json({ status: 'Enviado com sucesso', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
