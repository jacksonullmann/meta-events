export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const accessToken = process.env.ACCESS_TOKEN;
  const pixelId = process.env.PIXEL_ID;

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;

 const payload = {
  test_event_code: 'TEST56515', // <- Adicione isso
  data: [{
    event_name: 'ScrollInicioServer',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: 'https://celularpro.kpages.online/retratos',
    user_data: {
      client_ip_address: '127.0.0.1',
      client_user_agent: 'server-script'
    }
  }]
};

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
