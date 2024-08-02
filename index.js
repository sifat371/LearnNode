// dependencies
const http = require("http");
const {handleReqRes} = require('./Refactor/handleReqRes');
const env = require('./Refactor/environment');
const data = require('./lib/data');

// scafforlding
const app = {};



// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(env.port, () => {
    console.log(`Listening to port ${env.port}`);
  });
};

//handleReqRes
app.handleReqRes = handleReqRes;

//Run Server
app.createServer();
