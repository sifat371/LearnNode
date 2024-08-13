// User handling 

//Dependencies

const data = require('../lib/data');
const {perseJSON} = require('../Refactor/utilities');
const {hash} = require('../Refactor/utilities');
const tokenHandler = require('./tokenHandler');

//Module scafolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptableReq = ['get', 'post', 'put', 'delete'];
    if(acceptableReq.indexOf(requestProperties.method) > -1){
        handler._user[requestProperties.method](requestProperties, callback);
    }
    else{
        callback(405)
    }

};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const ToC = typeof requestProperties.body.ToC === 'boolean' ? requestProperties.body.ToC : false;

    if (firstName && lastName && phone && password && ToC) {
        data.read('users', phone, (err, user) => {
            if(err){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : hash(password),
                    ToC
                }
                data.create('users', phone, userObject, (err) => {
                    if(!err){
                        callback(200, {
                            messege : 'User created succesfully'
                        })
                    }
                    else{
                        callback(500, {error : 'Could not create user!'});
                    }
                });
            }
            else{
                callback(500, {
                    "error" : `User already exist!`
                });
            }
        });
    }
    else{
        callback(400, {
            "error" : 'problem in your request'
        });
    }

};

handler._user.get = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string' 
    && requestProperties.queryStringObject.phone.trim().length === 11 
    ? requestProperties.queryStringObject.phone : false;

    if(phone){
        //verify user
        const token = typeof requestProperties.headersObject.token === 'string'
        && requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token : false;

        tokenHandler.token.verify(token, phone, (tokenId) => {
            if(tokenId){
                data.read('users', phone, (err, users) =>{
                    const user = { ...perseJSON(users)};
                    if (!err && user) {
                        delete user.password;
                        delete user.ToC;
                        callback(200, user);
                    }
                    else{
                        callback(404, {
                            'error' : 'Request user not found!'
                        })
                    }
                });
            }
            else{
                callback(403,{
                    Messege : "Authentication failure!"
                })
            }
        })
    }
    else{
        callback(404,{
            'error' : 'Request user not found!'
        })
    }
    
};
// Put --> Update the user data 
handler._user.put = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone){
        //verify authentication
        const token = typeof requestProperties.headersObject.token === 'string'
        && requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token : false;

        tokenHandler.token.verify(token, phone, (tokenId) => {
            if(tokenId){
                if(firstName || lastName || password){

                    data.read('users', phone, (err, userData) =>{
                        const user = { ...perseJSON(userData)};
                        if (!err) {
                            if(firstName) user.firstName = firstName;
                            if(lastName )user.lastName = lastName;
                            if(password) user.password = hash(password);
        
                            data.update('users', phone, user, (err) => {
                                if (!err) {
                                    callback(200,{
                                        'messege' : 'User data updated succesfully'
                                    });
                                }
                                else{
                                    callback(500,{
                                        'error' : 'Error updating the data!'
                                    });
                                }
                            });
                        }
                        else{
                            callback(404, {
                                'error' : 'Request user not found!'
                            });
                        }
                    });
                }
                else{
                    callback(400,{
                        'error' : 'You have error in your data entry, please try again!'
                    });
                }
            }
            else{
                callback(403,{
                    Messege : "Authentication failure!"
                });
            }
        });
    
    }
    else{
        callback(400,{
            'error' : 'You have error in your entry, please try again!'
        })
    }

};

handler._user.delete = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if(phone){
        //verify authentication
        const token = typeof requestProperties.headersObject.token === 'string'
        && requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token : false;

        tokenHandler.token.verify(token, phone, (tokenId) => {
            if(tokenId){
                
                data.read('users', phone, (err, userData) => {
                    if(!err){
                        data.delete('users', phone, (err) => {
                            if(!err){
                                callback(200, {
                                    messege : "User deleted succesfully"
                                });
                            }
                            else{
                                callback(500, {
                                    error : "Error deleting the user!"
                                });
                            }
                        });
                    }
                    else{
                        callback(400, {
                            Error : "User does not exist!"
                        })
                    }
                });
            }
            else{
                callback(403,{
                    Messege : "Authentication failure!"
                });
            }
        });

        
    }
    else{
        callback(400, {
            "Error" : "There was an error in your request!"
        });
    }
};
module.exports = handler;