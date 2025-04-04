const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota para envio manual via POST
app.post('/whatsapp', async (req, res) => {
  const { phone, name } = req.body;

  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
      {
        phone: phone,
        message: `Olá, ${name}! Clique no link para gerar sua cobrança.`
      }
    );
    res.send(response.data);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    res.status(500).send({ error: 'Erro ao enviar mensagem' });
  }
});

// Webhook do Asaas
app.post('/webhook/asaas', async (req, res) => {
  const event = req.body;

  if (event.event === 'PAYMENT_RECEIVED') {
    try {
      const phone = event.payment?.customer?.phone || null;

      if (!phone) {
        console.error('Telefone não encontrado no evento do webhook.');
        return res.sendStatus(400);
      }

      await axios.post(
        `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
        {
          phone: phone,
          message: `✅ Pagamento confirmado!\nConsulta liberada.`
        }
      );
    } catch (error) {
      console.error('Erro ao processar webhook do Asaas:', error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
