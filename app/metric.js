const http = require("http");
const client = require("prom-client");

client.collectDefaultMetrics();

const requestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "path"]
});

const server = http.createServer(async (req, res) => {
  if (req.url === "/metrics") {
    res.writeHead(200, { "Content-Type": client.register.contentType });
    res.end(await client.register.metrics());
    return;
  }

  requestCount.inc({ method: req.method, path: req.url });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ msg: "Hello", version: "v1" }));
});

server.listen(3000);
