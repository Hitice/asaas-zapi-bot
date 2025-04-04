const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enviar mensagem manual via WhatsApp
app.post('/whatsapp', async (req, res) => {
  const { phone, name } = req.body;

  if (!phone || !name) {
    return res.status(400).json({ error: 'Parâmetros "phone" e "name" são obrigatórios.' });
  }

  try {
    const zapiUrl = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

    const payload = {
      phone,
      message: `Olá, ${name}! Clique no link para gerar sua cobrança.`
    };

    const { data } = await axios.post(zapiUrl, payload);
    console.log(`[Z-API] Mensagem enviada para: ${phone}`);
    res.json(data);
  } catch (error) {
    console.error('[Z-API] Erro:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao enviar mensagem via Z-API' });
  }
});

// Webhook de notificação do Asaas
app.post('/webhook/asaas', async (req, res) => {
  const { event, payment } = req.body;

  if (event !== 'PAYMENT_RECEIVED') {
    return res.sendStatus(200);
  }

  const phone = payment?.customer?.phone;

  if (!phone) {
    console.warn('[Webhook] Telefone não encontrado no payload.');
    return res.sendStatus(200);
  }

  try {
    const zapiUrl = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

    const payload = {
      phone,
      message: `✅ Pagamento confirmado!\nConsulta liberada.`
    };

    await axios.post(zapiUrl, payload);
    console.log(`[Webhook] Notificação enviada para: ${phone}`);
  } catch (error) {
    console.error('[Webhook] Erro ao notificar:', error.response?.data || error.message);
  }

  res.sendStatus(200);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
