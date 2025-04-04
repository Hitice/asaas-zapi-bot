const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/whatsapp', async (req, res) => {
  const { phone, name } = req.body;

  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
      {
        phone,
        message: `Olá, ${name}! Clique no link para gerar sua cobrança.`
      }
    );
    res.send(response.data);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.message);
    res.status(500).send({ error: 'Erro ao enviar mensagem' });
  }
});

app.post('/webhook/asaas', async (req, res) => {
  const event = req.body;

  if (event.event === 'PAYMENT_RECEIVED') {
    try {
      const phone = event.payment.customer.phone;

      await axios.post(
        `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
        {
          phone,
          message: `✅ Pagamento confirmado!\nConsulta liberada.`
        }
      );
    } catch (error) {
      console.error('Erro ao processar webhook do Asaas:', error.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
