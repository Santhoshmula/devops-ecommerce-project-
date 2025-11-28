// server.js
const http = require('http');
const {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpInProgress
} = require('./metrics');

const PORT = process.env.PORT || 3000;
const version = process.env.VERSION || 'v1';

const server = http.createServer(async (req, res) => {
  // Serve Prometheus metrics
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': register.contentType });
    res.end(await register.metrics());
    return;
  }

  // Instrumentation for normal requests
  httpInProgress.inc();
  const endTimer = httpRequestDurationSeconds.startTimer({ method: req.method, route: req.url });

  res.on('finish', () => {
    httpInProgress.dec();
    httpRequestsTotal.inc({ method: req.method, route: req.url, status: res.statusCode });
    endTimer({ status: res.statusCode });
  });

  // Your existing API response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ msg: "Hello from ecommerce service", version }));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
