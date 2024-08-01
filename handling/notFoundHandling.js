// notFoundHandler 

//Module scafolding
const handler = {};

handler.notFoundHander = (requestProperties, callback) => {
    callback(404,{
        message : 'URL not found'
    });
};

module.exports = handler;