/** 
@title :  Server library
@Description : server related files
@Author : HAMIM
@Date : 8 Dec 2022
*/

// dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environments");

// server object - module scaffolding
const server = {};

// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
server.handleReqRes = handleReqRes;

server.init = () => {
    server.createServer();
};

module.exports = server;
