const http = require('http');
const PORT = process.env.PORT || 3000;
const version = process.env.VERSION || 'v1';

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify({ msg: "Hello from ecommerce service", version }));
});

server.listen(PORT, () => console.log(`Listening ${PORT}`));
