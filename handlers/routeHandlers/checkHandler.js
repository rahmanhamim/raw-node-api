/** 
@title : Check handler
@Description :Handler to handle user define checkes
@Author : HAMIM
@Date : 27 Nov 2022
*/

// dependencies
const data = require("../../lib/data");
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
        ["GET", "POST", "PUT", "DELETE"].indexOf(
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
                    if (!err2 && userData) {
                        tokenHandler._token.verify(
                            token,
                            userPhone,
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
                                            userPhone: userPhone,
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
                                                    userObject.checks =
                                                        userChecks;
                                                    userObject.checks.push(
                                                        checkId
                                                    );

                                                    // save the new user data
                                                    data.update(
                                                        "users",
                                                        userPhone,
                                                        userObject,
                                                        (err4) => {
                                                            if (!err4) {
                                                                // return the data about the new check
                                                                callback(
                                                                    200,
                                                                    checkObject
                                                                );
                                                            } else {
                                                                callback(500, {
                                                                    error: "server error while save checks",
                                                                });
                                                            }
                                                        }
                                                    );
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

handler._check.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === "string" &&
        requestProperties.queryStringObject.id.trim().length == 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        // lookup the check
        data.read("checks", id, (err, checkData) => {
            if (!err && checkData) {
                let token =
                    typeof requestProperties.headersObject.token === "string"
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(
                    token,
                    parseJSON(checkData).userPhone,
                    (tokenValid) => {
                        if (tokenValid) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                error: "Authentication failure",
                            });
                        }
                    }
                );
            } else {
                callback(500, {
                    error: "There was an error",
                });
            }
        });
    } else {
        callback(400, {
            error: "check id not valid",
        });
    }
};

handler._check.put = (requestProperties, callback) => {
    let id =
        typeof requestProperties.body.id === "string" &&
        requestProperties.body.id.trim().length == 20
            ? requestProperties.body.id
            : false;

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
        ["GET", "POST", "PUT", "DELETE"].indexOf(
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

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read("checks", id, (err1, checkData) => {
                if (!err1 && checkData) {
                    let checkObject = parseJSON(checkData);
                    let token =
                        typeof requestProperties.headersObject.token ===
                        "string"
                            ? requestProperties.headersObject.token
                            : false;
                    tokenHandler._token.verify(
                        token,
                        checkObject.userPhone,
                        (tokenValid) => {
                            if (tokenValid) {
                                if (protocol) {
                                    checkObject.protocol = protocol;
                                }
                                if (url) {
                                    checkObject.url = url;
                                }
                                if (method) {
                                    checkObject.method = method;
                                }
                                if (successCodes) {
                                    checkObject.successCodes = successCodes;
                                }
                                if (timeoutSeconds) {
                                    checkObject.timeoutSeconds = timeoutSeconds;
                                }
                                //  store the check object
                                data.update(
                                    "checks",
                                    id,
                                    checkObject,
                                    (err2) => {
                                        if (!err2) {
                                            callback(200, {
                                                message: "updated successfully",
                                            });
                                        } else {
                                            callback(500, {
                                                error: "There was a server side error!",
                                            });
                                        }
                                    }
                                );
                            } else {
                                callback(403, {
                                    error: "Authorization error!",
                                });
                            }
                        }
                    );
                } else {
                    callback(500, {
                        error: "There was a problem in server!",
                    });
                }
            });
        } else {
            callback(400, {
                error: "You must provide at least one field to update",
            });
        }
    } else {
        callback(400, {
            error: "check id not valid, failure occur!",
        });
    }
};

handler._check.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === "string" &&
        requestProperties.queryStringObject.id.trim().length == 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        // lookup the check
        data.read("checks", id, (err1, checkData) => {
            if (!err1 && checkData) {
                let token =
                    typeof requestProperties.headersObject.token === "string"
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(
                    token,
                    parseJSON(checkData).userPhone,
                    (tokenValid) => {
                        if (tokenValid) {
                            //  delete the check data
                            data.delete("checks", id, (err2) => {
                                if (!err2) {
                                    data.read(
                                        "users",
                                        parseJSON(checkData).userPhone,
                                        (err3, userData) => {
                                            let userObject =
                                                parseJSON(userData);
                                            if (!err3 && userData) {
                                                let userChecks =
                                                    typeof userObject.checks ===
                                                        "object" &&
                                                    userObject.checks instanceof
                                                        Array
                                                        ? userObject.checks
                                                        : [];

                                                // remove the deleted check id from user's list of checks
                                                let checkPosition =
                                                    userChecks.indexOf(id);
                                                if (checkPosition > -1) {
                                                    userChecks.splice(
                                                        checkPosition,
                                                        1
                                                    );
                                                    // resave the user data
                                                    userObject.checks =
                                                        userChecks;
                                                    data.update(
                                                        "users",
                                                        userObject.phone,
                                                        userObject,
                                                        (err4) => {
                                                            if (!err4) {
                                                                callback(200, {
                                                                    message:
                                                                        "successfully deleted ",
                                                                });
                                                            } else {
                                                                callback(500, {
                                                                    error: "Error! server problem",
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    callback(500, {
                                                        error: "The check id that you are trying to remove is not found in user",
                                                    });
                                                }
                                            } else {
                                                callback(500, {
                                                    error: "Error! server problem",
                                                });
                                            }
                                        }
                                    );
                                } else {
                                    callback(500, {
                                        error: "Error deleting check",
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: "Authentication failure",
                            });
                        }
                    }
                );
            } else {
                callback(500, {
                    error: "There was an error",
                });
            }
        });
    } else {
        callback(400, {
            error: "check id not valid",
        });
    }
};

module.exports = handler;
