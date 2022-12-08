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
const data = require("./lib/data");
const { sendTwilioSms } = require("./helpers/notifications");

// app object - module scaffolding
const app = {};

// @TODO remove later
sendTwilioSms("01712089306", "Hello world", (err) => {
    console.log(`this is the error`, err);
});

// testing file system
// @TODO : will delete in future
/* data.delete("test", "newFile", (err) => {
    console.log(err);
});
 */

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
