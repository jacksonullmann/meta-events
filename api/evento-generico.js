export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-modo-evento');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const accessToken = process.env.ACCESS_TOKEN;
  const pixelId = process.env.PIXEL_ID;

  const { event_name, event_id, test_event_code, fbp, fbc } = req.body;

  if (!event_name) {
    return res.status(400).json({ error: 'event_name é obrigatório' });
  }

  const payload = {
    ...(test_event_code && { test_event_code }),
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        action_source: 'website',
        event_source_url: 'https://celularpro.kpages.online/retratos',
        user_data: {
          client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          client_user_agent: req.headers['user-agent'] || '',
          ...(fbp && { fbp }),
          ...(fbc && { fbc })
        }
      }
    ]
  };

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}` +
    (test_event_code ? `&test_event_code=${test_event_code}` : '');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    res.status(200).json({ status: 'Evento enviado com sucesso', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
