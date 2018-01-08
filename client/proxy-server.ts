import * as httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({ target: "http://pyszstudio.pl" });

proxy.listen(8080);