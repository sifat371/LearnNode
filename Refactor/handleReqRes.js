//                        Handle Request and response for the index

//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { notFoundHander } = require("../handling/notFoundHandling");
const environment = require("./environment");

//scafoldings
const handler = {};

//handleReqRes
handler.handleReqRes = (req, res) => {
  //request handle
  // parsed url
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  var chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHander;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      payloadString = JSON.stringify(payload);

      res.writeHead(statusCode);
      res.end(payloadString);
    });

    //response handle
    res.end("Hello World 123");
  });
};

module.exports = handler;
