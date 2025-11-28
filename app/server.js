const http = require("http");
const client = require("./metrics");

const register = client.register;

const PORT = process.env.PORT || 3000;
const version = process.env.VERSION || "v1";

const server = http.createServer(async (req, res) => {
  
  if (req.url === "/metrics") {
    res.writeHead(200, { "Content-Type": register.contentType });
    res.end(await register.metrics());
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ msg: "Hello from ecommerce service", version }));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
