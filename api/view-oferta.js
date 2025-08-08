export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const accessToken = process.env.FB_ACCESS_TOKEN;
  const pixelId = '1237017037714103';

  if (!accessToken) {
    return res.status(500).json({ error: 'Token de acesso não configurado' });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'ViewOferta',
          event_time: Math.floor(Date.now() / 1000),
          event_id: 'view-oferta-001',
          action_source: 'website',
          user_data: {
            client_ip_address: req.headers['x-forwarded-for'] || '0.0.0.0',
            client_user_agent: req.headers['user-agent'] || ''
          }
        }]
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Erro desconhecido');
    }

    res.status(200).json({ status: 'Enviado com sucesso', result });
  } catch (error) {
    console.error('Erro ao enviar evento:', error.message);
    res.status(500).json({ error: error.message });
  }
}
