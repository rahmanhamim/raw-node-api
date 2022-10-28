/** 
@title : Routes
@Description : Application routes
@Author : HAMIM
@Date : 28 Oct 2022
*/

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
