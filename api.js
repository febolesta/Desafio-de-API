node.js
const http = require('http');
let counter = 0;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/health-check' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, timestamp: new Date().toISOString() }));
  }

  else if (url.startsWith('/is-prime-number') && method === 'GET') {
    const number = parseInt(new URLSearchParams(url.split('?')[1]).get('number'));
    if (isNaN(number) || number < 1) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Invalid input" }));
    } else {
      const isPrime = checkPrime(number);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ isPrime }));
    }
  }

  else if (url === '/count' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { incrementBy } = JSON.parse(body);
      if (typeof incrementBy === 'number' && incrementBy > 0) {
        counter += incrementBy;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ counter }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid input" }));
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const checkPrime = (n) => {
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

