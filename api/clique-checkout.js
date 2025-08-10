export default async function handler(req, res) {
  // ✅ Libera CORS para chamadas externas (como Klickpages)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Valida método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // ✅ Carrega variáveis de ambiente
  const accessToken = process.env.ACCESS_TOKEN;
  const pixelId = process.env.PIXEL_ID;
  const testEventCode = process.env.NODE_ENV === 'production' ? null : process.env.TEST_EVENT_CODE;

  // ✅ Valida se variáveis estão presentes
  if (!accessToken || !pixelId) {
    return res.status(500).json({ error: 'Variáveis de ambiente não configuradas' });
  }

  // ✅ Monta URL da Meta API
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}` +
              (testEventCode ? `&test_event_code=${testEventCode}` : '');

  // ✅ Captura IP real do usuário
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'CliqueCheckout',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: 'https://celularpro.kpages.online/retratos',
          user_data: {
            client_ip_address: ip,
            client_user_agent: req.headers['user-agent'] || ''
          }
        }]
      })
    });

    const result = await response.json();
    res.status(200).json({ status: 'Enviado com sucesso', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
