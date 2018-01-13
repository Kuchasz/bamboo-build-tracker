var express = require("express");
var proxy = require("http-proxy-middleware");

var proxy = proxy({
    target: "https://bamboo.silvermedia.pl",
    changeOrigin: true,
    logLevel: "debug"
});

var app = express();

app.use(proxy);

app.listen(3000);
