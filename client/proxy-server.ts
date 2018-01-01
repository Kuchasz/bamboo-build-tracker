// import * as httpProxy from "http-proxy";
import * as http from "http";
import * as url from "url";

// const proxy = httpProxy.createServer();

const _server = http.createServer((req, res) => {
    // const urr = url.parse(req.url);
    //urr.
    // const { target } = url.parse(req.url, true).query;
    // console.log(target, req.url);
    // if (target) proxy.web(req, res, { target: `http://${target}` });
});

_server.listen(80);
