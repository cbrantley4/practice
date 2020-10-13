const http = require("http");
const server = http.createServer((request, response) => {
  if (request.url == "/") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify({ message: "Welcome to the main page" }));
    response.end();
  }
});
server.listen(4040);
console.log(`Listening on Port: ${4040}`);
