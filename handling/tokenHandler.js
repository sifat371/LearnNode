//                                token handling 

//Dependencies
const { error } = require('console');
const data = require('../lib/data');
const {perseJSON} = require('../Refactor/utilities');
const {hash} = require('../Refactor/utilities')
const {createTokenId} = require('../Refactor/utilities')


//Module scafolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptableReq = ['get', 'post', 'put', 'delete'];
    if(acceptableReq.indexOf(requestProperties.method) > -1){
        handler.token[requestProperties.method](requestProperties, callback);
    }
    else{
        callback(405)
    }

};

handler.token = {};

handler.token.post = (requestProperties, callback) => {

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            if(!err){
                let uData = { ...perseJSON(userData) };
                let uPass = hash(password);
                if(uData.password === uPass){
                    const tokenId = createTokenId(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        id : tokenId,
                        expires
                    }
                    data.create('tokens', tokenId, tokenObject, (err)=> {
                        if(!err){
                            callback(200, {
                                messege : "Your temporary id is created succesfully",
                                tokenObject
                            })
                        }
                        else{
                            callback(500,{
                                error : "There is a server side error!"
                            })
                        }
                    });
                }
                else{
                    callback(400,{
                        error : "Password is not correct!"
                    })
                }
            }
            else{
                callback(404,{
                    Error : "User not found!"
                })
            }
        })
    }
    else{
        callback(400,{
            Error : "There was an error in your request!"
        })
    }

};

handler.token.get = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' 
    && requestProperties.queryStringObject.id.trim().length === 20
    ? requestProperties.queryStringObject.id : false;

    if(id){
        data.read('tokens', id, (err, data) =>{
            const tokenData = { ...perseJSON(data)};
            if (!err && tokenData) {
                callback(200, { 
                    tokenData
                });
            }
            else{
                callback(500, {
                    Error : 'Request ID not found!'
                })
            }
        });
    }
    else{
        callback(404,{
            Error : 'Request ID not found!'
        })
    }
};
// Put --> Update the user data 
handler.token.put = (requestProperties, callback) => {

};

handler.token.delete = (requestProperties, callback) => {
    
};
module.exports = handler;