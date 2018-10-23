let http = require("http");
let redis = require("redis");
let util = require("util");
let requestIp = require("request-ip");

let client = redis.createClient({ host: "redis" });
let getAsync = util.promisify(client.lrange).bind(client);
let pushAsync = util.promisify(client.lpush).bind(client);

let id = process.env.ID;

function handleRequest(ip) {
  const item = `ip:${ip}, date: ${new Date().toISOString()}, id: ${id}`;
  return pushAsync("requests", item).then(() => getAsync("requests", 0, -1));
}
http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    handleRequest(requestIp.getClientIp(req)).then(el => {
      res.write(el.map((el, i) => i + 1 + ". " + el).join("<br/>"));
      res.end();
    });
  })
  .listen(process.env.PORT);
