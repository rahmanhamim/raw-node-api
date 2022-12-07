/** 
@title : Notifications
@Description : Important functions to notify users
@Author : HAMIM
@Date : 7 Dec 2022
*/

// dependencies
const https = require("https");
const { twilio } = require("./environments");

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone =
        typeof phone === "string" && phone.trim().length === 11
            ? phone.trim()
            : false;

    const userMsg =
        typeof phone === "string" &&
        msg.trim().length > 0 &&
        msg.trim().length <= 1600
            ? msg.trim()
            : false;

    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };
    } else {
        callback(406, { message: "Given parameter were missing or invalid" });
    }
};

// export the module
module.exports = notifications;
