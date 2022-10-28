/** 
@title : Sample handler
@Description : Sample handler
@Author : HAMIM
@Date : 28 Oct 2022
*/

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        message: "This is a sample handler",
    });
};

module.exports = handler;
