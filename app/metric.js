// metrics.js
const client = require("prom-client");

client.collectDefaultMetrics(); // CPU, memory, eventloop, GC, etc.

module.exports = client;
