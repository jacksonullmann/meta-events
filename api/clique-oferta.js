export default async function handler(req, res) {
  const accessToken = 'SEU_TOKEN';
  const pixelId = 'SEU_PIXEL_ID';
  const testEventCode = 'TEST99526';

  try {
    const response = await globalThis.fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}&test_event_code=${testEventCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'CliqueOferta',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: 'https://celularpro.kpages.online/retratos',
            user_data: {
              client_ip_address: req.headers['x-forwarded-for'] || '0.0.0.0',
              client_user_agent: req.headers['user-agent'] || ''
            }
          }
        ]
      })
    });

    const result = await response.json();
    res.status(200).json({ status: 'Enviado com sucesso', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
