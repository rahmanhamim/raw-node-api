/** 
@title : Uptime Monitoring Application
@Description : A Restful API for monitoring up or down time of user defined links
@Author : HAMIM
@Date : 27 Oct 2022
*/

// dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const environment = require("./helpers/environments");

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    server.init();

    // start the workers
    workers.init();
};

app.init();

// export the app
module.exports = app;
