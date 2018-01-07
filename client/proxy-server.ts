import * as httpProxy from "http-proxy";
import * as http from "http";

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: "https://bamboo.silvermedia.pl" });
});

server.listen(8080);

process.on("SIGINT", () => {
    server.close();
    process.exit();
});
