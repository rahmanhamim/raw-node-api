/** 
@title :  workers library
@Description : worker related files
@Author : HAMIM
@Date : 8 Dec 2022
*/

// dependencies
const data = require("./data");

// worker object - module scaffolding
const worker = {};

// lookup all the checks from database
worker.gatherAllChecks = () => {
    // get all the checks
};

// timer to execute the worker process one per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60);
};
// start the workers
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
};

module.exports = worker;
