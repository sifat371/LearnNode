//                                  Extra utilities/tools

// dependencies
const crypto = require('crypto');
const envToExport = require('./environment');

// Module scafolding
const utilities = {};

// Parse JSON data to String
utilities.perseJSON = (jsonStr) => {
    let output;

    try {
        output = JSON.parse(jsonStr);
    } catch {
        output = {};
    }

    return output;
};

//Hashing
utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0){
        const hash = crypto.createHmac('sha256', envToExport.secretkey).update(str).digest('hex');
        return hash;
    }
    else{
        return false;
    }
};

utilities.createTokenId = (strLength) => {
    const tokenItems = '1234567890abcdefghijklmnopqrstuvwxyz';
    let tokenID = '';

    for (let i = 1; i <= strLength; i++) {
        tokenID += tokenItems.charAt(Math.floor(Math.random() * tokenItems.length) );
    }

    return tokenID;
};

module.exports = utilities;