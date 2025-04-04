const axios = require('axios');
require('dotenv').config();

async function criarCobranca() {
  try {
    const response = await axios.post(
      'https://sandbox.asaas.com/api/v3/payments',
      {
        customer: 'cus_000006616997', // ID do cliente já existente
        billingType: 'PIX',
        value: 30.00,
        dueDate: '2025-04-05',
        description: 'Consulta SPC/Serasa'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'access_token': process.env.ASAAS_API_KEY // Sua chave do sandbox
        }
      }
    );

    console.log('Cobrança criada com sucesso:');
    console.log(response.data);
  } catch (error) {
    console.error('Erro ao criar cobrança:');
    console.error(error.response ? error.response.data : error.message);
  }
}

criarCobranca();
