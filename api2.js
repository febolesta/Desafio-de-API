const http = require('http');

const server = http.createServer(async (req, res) => {
  const [, route, currency = 'usd'] = req.url.split('/');

  if (route !== 'stock-insight' || req.method !== 'GET') {
    res.writeHead(404).end(JSON.stringify({ error: "Rota inválida. Use /stock-insight/brl ou /stock-insight/usd" }));
    return;
  }

  if (!['brl', 'usd'].includes(currency)) {
    res.writeHead(400).end(JSON.stringify({ error: "Moeda inválida! Use 'brl' ou 'usd'." }));
    return;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl,usd');
    if (!response.ok) throw new Error();

    const price = (await response.json()).bitcoin[currency];
    const suggestion = price < (currency === 'brl' ? 300000 : 60000) ? "Ótima hora para comprar!" :
                       price <= (currency === 'brl' ? 450000 : 80000) ? "Preço razoável, vale pensar." :
                       "Bitcoin está caro, talvez seja melhor esperar.";

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ btc_price: price, currency, suggestion }));
  } catch {
    res.writeHead(500).end(JSON.stringify({ error: "Erro ao obter o preço do Bitcoin." }));
  }
});

server.listen(3000, () => console.log('Servidor rodando em: http://localhost:3000/stock-insight/usd'));
