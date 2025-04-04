# Asaas + Z-API WhatsApp Bot

Este projeto é um sistema automático de consulta SPC/Serasa via WhatsApp com pagamentos pré-pagos (Pix/Boleto) integrados ao Asaas.

## Funcionalidades

- Envia mensagens via Z-API (WhatsApp)
- Gera cobranças via Asaas (Sandbox)
- Recebe Webhook de confirmação de pagamento
- Libera acesso à consulta após pagamento

## Como usar

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` com base em `.env.example` e preencha seus dados.

3. Inicie o servidor:

```bash
npm start
```

O servidor estará escutando na porta 3000.

## Endpoints

- `POST /whatsapp` – Envia mensagem via WhatsApp
- `POST /webhook/asaas` – Recebe notificações de pagamento