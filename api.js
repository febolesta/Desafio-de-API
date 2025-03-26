
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
        if (price < 300000) suggestion = "Agora é uma boa oportunidade para comprar!";
        else if (price <= 450000) suggestion = "Preço razoável, vale pensar antes de comprar.";
        else suggestion = "Bitcoin está caro. Pode ser melhor esperar.";
      } else {
        if (price < 60000) suggestion = "Boa oportunidade para comprar!";
        else if (price <= 80000) suggestion = "Preço razoável, vale considerar.";
        else suggestion = "Bitcoin está caro. Talvez seja melhor esperar.";
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ btc_price: price, currency, suggestion }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Não conseguimos obter o preço do Bitcoin. Tente mais tarde.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Rota não encontrada. Tente acessar /stock-insight?currency=brl ou /stock-insight?currency=usd" }));
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/');
});
