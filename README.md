# Meta Events

Este projeto envia eventos personalizados para o Pixel do Facebook via API, utilizando um **endpoint genérico** (`/api/evento-generico`). O nome e os dados do evento são definidos dinamicamente via **Google Tag Manager (GTM)**.

## Objetivo

Facilitar o envio de eventos como `PageView`, `ViewOferta`, `Lead`, entre outros, diretamente do GTM para o Gerenciador de Eventos do Facebook, usando a API de Conversões.

## Como usar

1. Faça o deploy com Vercel
2. Configure o GTM para enviar requisições POST para:  
   `https://meta-events.vercel.app/api/evento-generico`
3. No GTM, defina o nome do evento e o `event_id` no corpo da requisição

### Exemplo de payload enviado pelo GTM:

```json
{
  "event_name": "ViewOferta",
  "event_id": "view_" + Date.now()
}
