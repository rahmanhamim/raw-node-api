/** 
@title :Environment
@Description : Handle al environment
@Author : HAMIM
@Date : 30 Oct 2022
*/

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 5000,
    envName: "staging",
    secretKey: "hashpassstaging",
    maxChecks: 5,
};

environments.production = {
    port: 9000,
    envName: "production",
    secretKey: "hashpassproduction",
    maxChecks: 5,
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === "object"
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
