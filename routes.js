/** 
@title : Routes
@Description : Application routes
@Author : HAMIM
@Date : 28 Oct 2022
*/

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
