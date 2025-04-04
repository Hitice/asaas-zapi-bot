app.post('/webhook/asaas', async (req, res) => {
  const event = req.body;

  if (event.event === 'PAYMENT_RECEIVED') {
    try {
      const customerId = event.payment.customer;

      // Buscar dados do cliente pelo ID
      const customerResponse = await axios.get(
        `https://sandbox.asaas.com/api/v3/customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${process.env.ASAAS_API_KEY}` }
        }
      );

      const phone = customerResponse.data.phone;

      await axios.post(
        `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
        {
          phone: phone,
          message: `✅ Pagamento confirmado! Consulta liberada.`
        }
      );
    } catch (error) {
      console.error('Erro ao buscar cliente:', error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});
app.post('/webhook/asaas', async (req, res) => {
  const event = req.body;

  if (event.event === 'PAYMENT_RECEIVED') {
    try {
      const customerId = event.payment.customer;

      // Buscar dados do cliente pelo ID
      const customerResponse = await axios.get(
        `https://sandbox.asaas.com/api/v3/customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${process.env.ASAAS_API_KEY}` }
        }
      );

      const phone = customerResponse.data.phone;

      await axios.post(
        `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
        {
          phone: phone,
          message: `✅ Pagamento confirmado! Consulta liberada.`
        }
      );
    } catch (error) {
      console.error('Erro ao buscar cliente:', error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});
