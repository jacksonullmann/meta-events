import crypto from 'crypto';

function hash(value) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-modo-evento');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const accessToken = process.env.ACCESS_TOKEN;
  const pixelId = process.env.PIXEL_ID;

  const {
    event_name,
    event_id,
    test_event_code,
    fbp,
    fbc,
    email,
    phone,
    firstName,
    lastName
  } = req.body;

  console.log('Dados recebidos do frontend:', {
  email: typeof email,
  phone: typeof phone,
  firstName: typeof firstName,
  lastName: typeof lastName,
  valores: { email, phone, firstName, lastName }
});


  if (!event_name) {
    return res.status(400).json({ error: 'event_name é obrigatório' });
  }

  const ipRaw = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
  const isIPv6 = ipRaw?.includes(':');

  const userData = {
    ...(isIPv6 && { client_ip_address: ipRaw }),
    client_user_agent: req.headers['user-agent'] || '',
    ...(fbp && { fbp }),
    ...(fbc && { fbc }),
  ...(typeof email === 'string' && email && { em: hash(email) }),
  ...(typeof phone === 'string' && phone && { ph: hash(phone) }),
  ...(typeof firstName === 'string' && firstName && { fn: hash(firstName) }),
  ...(typeof lastName === 'string' && lastName && { ln: hash(lastName) })

  };

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        action_source: 'website',
        event_source_url: 'https://celularpro.kpages.online/tecnicas',
        user_data: userData
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

    // Logs para validação
    console.log('Dados recebidos:', { email, phone, firstName, lastName });
    console.warn('🔍 Dados enviados para Meta:\n', JSON.stringify(userData, null, 2));
    console.log('Meta API response:', result);
    console.log('IP enviado:', ipRaw);

    res.status(200).json({ status: 'Evento enviado com sucesso', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
