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

    const phone = typeof requestProperties.body.phone === 'string' 
    && requestProperties.body.phone.trim().length === 11 
    ? requestProperties.body.phone : false;
    
    const password = typeof requestProperties.body.password === 'string' 
    && requestProperties.body.password.trim().length > 0 
    ? requestProperties.body.password : false;

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
        data.read('tokens', id, (err, tdata) =>{
            const tokenData = { ...perseJSON(tdata)};
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
    const id = typeof requestProperties.body.id === 'string' 
    && requestProperties.body.id.trim().length === 20
    ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' 
    && requestProperties.body.extend === true
    ? true : false;


    if (id && extend) {
        data.read('tokens', id, (err, tdata)=>{
            const tokenData = { ...perseJSON(tdata)};
            if(!err && tokenData.expires > Date.now()){
            tokenData.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenData, (err) => {
                    if(!err){
                        callback(200, {
                            messege : "Token id extends anothor one hour"
                        })
                    }
                    else{
                        callback(500, {
                            Error : "There is a server side error!"
                        })
                    }
                });
            }
            else{
                callback(400,{
                    Error : " was an error in your request!"
                });
            }
        })
    }
    else{
        callback(400,{
            Error : "There was an error in your request!"
        });
    }
};

handler.token.delete = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if(id){
        data.read('tokens', id, (err, userData) => {
            if(!err){
                data.delete('tokens', id, (err) => {
                    if(!err){
                        callback(200, {
                            messege : "token deleted succesfully"
                        })
                    }
                    else{
                        callback(500, {
                            error : "Error deleting the token!"
                        })
                    }
                })
            }
            else{
                callback(400, {
                    Error : "tpken does not exist!"
                })
            }
        })
    }
    else{
        callback(400, {
            "Error" : "There was an error in your request!"
        })
    }
};

handler.token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tData) => {
        const tokenData = { ...perseJSON(tData) };
        if (!err && tokenData.phone === phone && tokenData.expires > Date.now()) {
            callback(true);
        }
        else{
            callback(false)
        }
    });
};

module.exports = handler;