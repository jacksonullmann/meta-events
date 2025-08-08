export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const response = await globalThis.fetch(
      'https://graph.facebook.com/v18.0/1237017037714103/events?access_token=EAAEZCxlkR04ABPFP9Xv0yCkQpNrSy52QmM9IWLS3vQkyghWasgisOYScXFJCMKjff2xZAUoo34YNwUEZBOCKuKE6V4JJbgSg5w0xt5HoYz7VAKU9BZAdE0oTbcp9l6XOHiB2DqMYp1TfA9jr9bZChj7CvJqOk8PFbBlTqOXw2hJuZBpMKSa0m2EXy0ZCdATMgZDZD',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: 'ViewOferta',
              event_time: Math.floor(Date.now() / 1000),
              event_id: 'view-oferta-001',
              action_source: 'website',
              user_data: {
                client_ip_address: req.headers['x-forwarded-for'] || '0.0.0.0',
                client_user_agent: req.headers['user-agent'] || ''
              }
            }
          ]
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Erro desconhecido');
    }

    res.status(200).json({ status: 'Enviado com sucesso', result });
  } catch (error) {
    console.error('Erro ao enviar evento:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
