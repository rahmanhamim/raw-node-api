/** 
@title : Uptime Monitoring Application
@Description : A Restful API for monitoring up or down time of user defined links
@Author : HAMIM
@Date : 27 Oct 2022
*/

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

app.createServer();
