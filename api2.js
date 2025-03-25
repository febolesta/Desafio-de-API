node.js

const http = require('http');
const fetch = require('node-fetch');

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/stock-insight' && method === 'GET') {
    const currency = new URLSearchParams(url.split('?')[1]).get('currency') || 'usd';

    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl,usd');
      const data = await response.json();
      const price = data.bitcoin[currency];

      let suggestion = '';
      if (currency === 'brl') {
        if (price < 300000) suggestion = "Bom momento para compra!";
        else if (price <= 450000) suggestion = "Preço razoável. Avalie antes de comprar.";
        else suggestion = "Bitcoin está caro. Pode ser melhor esperar.";
      } else {
        if (price < 60000) suggestion = "Bom momento para compra!";
        else if (price <= 80000) suggestion = "Preço razoável. Avalie antes de comprar.";
        else suggestion = "Bitcoin está caro. Pode ser melhor esperar.";
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ btc_price: price, currency, suggestion }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao consultar API do CoinGecko' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

