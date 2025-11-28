// metrics.js
const client = require('prom-client');

// collect Node.js default metrics (CPU, memory, event loop, gc, etc)
client.collectDefaultMetrics({ timeout: 5000 });

// Create a counter and a histogram example
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005,0.01,0.025,0.05,0.1,0.3,0.5,1,2,5] // tune for your app
});

module.exports = {
  client,
  httpRequestsTotal,
  httpRequestDurationSeconds
};
