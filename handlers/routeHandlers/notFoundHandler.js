/** 
@title : Not Found handler
@Description : Not Found handler
@Author : HAMIM
@Date : 28 Oct 2022
*/

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(404, {
        message: "Your request was not found",
    });
};

module.exports = handler;
