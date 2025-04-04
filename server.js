const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Envia mensagem via Z-API manualmente
app.post('/whatsapp', async (req, res) => {
  const { phone, name } = req.body;

  if (!phone || !name) {
    return res.status(400).json({ error: 'Parâmetros "phone" e "name" são obrigatórios.' });
  }

  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
      {
        phone,
        message: `Olá, ${name}! Clique no link para gerar sua cobrança.`
      }
    );

    console.log(`Mensagem enviada com sucesso para: ${phone}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.message);
    res.status(500).json({ error: 'Erro ao enviar mensagem via Z-API' });
  }
});

// Webhook do Asaas
app.post('/webhook/asaas', async (req, res) => {
  const event = req.body;

  if (event.event === 'PAYMENT_RECEIVED') {
    try {
      const phone = event.payment?.customer?.phone;
      if (!phone) return res.sendStatus(200);

      await axios.post(
        `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
        {
          phone,
          message: `✅ Pagamento confirmado!\nConsulta liberada.`
        }
      );

      console.log(`Pagamento confirmado e mensagem enviada para: ${phone}`);
    } catch (error) {
      console.error('Erro ao processar webhook:', error.message);
    }
  }

  res.sendStatus(200);
});

// Teste direto da API
app.get('/teste', async (req, res) => {
  const phone = '+5534991176599'; // Substitua pelo número de teste
  const message = '✅ Teste automático via rota /teste';

  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
      { phone, message }
    );

    console.log('Mensagem de teste enviada!');
    res.json({ status: 'ok', data: response.data });
  } catch (error) {
    console.error('Erro no teste:', error.message);
    res.status(500).json({ error: 'Erro ao enviar mensagem de teste' });
  }
});

// Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
});
