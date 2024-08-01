// sample handling 

//Module scafolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(300, {
        message : 'This is sampleHandler'
    });
};

module.exports = handler;