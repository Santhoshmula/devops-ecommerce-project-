// metrics.js
const client = require('prom-client');

// Collect default Node/Process metrics (heap, cpu, eventloop, gc, etc)
client.collectDefaultMetrics({ timeout: 5000 });

// Counter for total HTTP requests
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Histogram for request durations (seconds)
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005,0.01,0.025,0.05,0.1,0.3,0.5,1,2,5]
});

// Gauge for in-progress requests
const httpInProgress = new client.Gauge({
  name: 'http_inprogress_requests',
  help: 'Number of HTTP requests in progress'
});

module.exports = {
  client,
  register: client.register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpInProgress
};
