const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(express.json());

app.post('/whatsapp', async (req, res) => {
  const { phone, name } = req.body;
  const response = await axios.post(
    `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
    {
      phone: phone,
      message: `Olá, ${name}! Clique no link para gerar sua cobrança.`
    }
  );
  res.send(response.data);
});

app.post('/webhook/asaas', async (req, res) => {
  const event = req.body;
  if (event.event === 'PAYMENT_RECEIVED') {
    const phone = event.payment.customer.phone;
    await axios.post(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
      {
        phone: phone,
        message: `✅ Pagamento confirmado!
Consulta liberada.`
      }
    );
  }
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));