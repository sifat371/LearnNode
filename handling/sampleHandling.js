// sample handling 

//Module scafolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(200, {
        message : 'This is sampleHandler'
    });
};

module.exports = handler;