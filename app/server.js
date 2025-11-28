// // server.js
const http = require('http');
const client = require('prom-client');   // <-- IMPORT PROM-CLIENT

// Collect Node.js default metrics (CPU, memory, event loop lag, heap, etc)
client.collectDefaultMetrics();

// Custom metric example: count total HTTP requests
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'url']
});

const PORT = process.env.PORT || 3000;
const version = process.env.VERSION || 'v1';

const server = http.createServer(async (req, res) => {

  // 1️⃣ If request is /metrics → return Prometheus metrics
  if (req.url === "/metrics") {
    res.setHeader("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
    return;
  }

  // 2️⃣ Count request for custom metric
  httpRequestsTotal.inc({ method: req.method, url: req.url });

  // 3️⃣ Your original response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ msg: "Hello from ecommerce service", version }));
});

server.listen(PORT, () => console.log(`Listening ${PORT}`));
