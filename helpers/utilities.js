/** 
@title : Utilities
@Description : Important utility functions
@Author : HAMIM
@Date : 3 Nov 2022
*/

// dependencies

// module scaffolding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }

    return output;
};

// export module
module.exports = utilities;
