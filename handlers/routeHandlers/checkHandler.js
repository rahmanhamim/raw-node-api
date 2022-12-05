/** 
@title : Check handler
@Description :Handler to handle user define checkes
@Author : HAMIM
@Date : 27 Nov 2022
*/

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON, createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ["get", "post", "put", "delete"];

    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // validate inputs
    let protocol =
        typeof requestProperties.body.protocol === "string" &&
        ["http", "https"].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    let url =
        typeof requestProperties.body.url === "string" &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    let method =
        typeof requestProperties.body.method === "string" &&
        ["get", "post", "put", "delete"].indexOf(
            requestProperties.body.method
        ) > -1
            ? requestProperties.body.method
            : false;

    let successCodes =
        typeof requestProperties.body.successCodes === "object" &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    let timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === "number" &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        let token =
            typeof requestProperties.headersObject.token === "string"
                ? requestProperties.headersObject.token
                : false;

        // lookup the user phone by reading the token
        data.read("tokens", token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                // lookup the user data
                data.read("users", userPhone, (err2, userData) => {
                    if (err2 && userData) {
                        tokenHandler._token.verify(
                            token,
                            phone,
                            (tokenValid) => {
                                if (tokenValid) {
                                    let userObject = parseJSON(userData);
                                    let userChecks =
                                        typeof userObject.checks === "object" &&
                                        userObject.checks instanceof Array
                                            ? userObject.checks
                                            : [];

                                    if (userChecks.length < maxChecks) {
                                        let checkId = createRandomString(20);
                                        let checkObject = {
                                            id: checkId,
                                            userPhone: phone,
                                            protocol: protocol,
                                            url: url,
                                            method: method,
                                            successCodes: successCodes,
                                            timeoutSeconds: timeoutSeconds,
                                        };
                                        // save the object
                                        data.create(
                                            "checks",
                                            checkId,
                                            checkObject,
                                            (err3) => {
                                                if (!err3) {
                                                    // add check id to the users object
                                                } else {
                                                    callback(500, {
                                                        error: "server error while save checks",
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        callback(401, {
                                            error: "user has already reached maximum checks",
                                        });
                                    }
                                } else {
                                    callback(403, {
                                        error: "Authentication failed!",
                                    });
                                }
                            }
                        );
                    } else {
                        callback(403, {
                            error: "user not found!",
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication problem",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your inputs",
        });
    }
};

handler._check.get = (requestProperties, callback) => {};

handler._check.put = (requestProperties, callback) => {};

handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
