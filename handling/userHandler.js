// User handling 

//Dependencies
// const { error } = require('console');
const data = require('../lib/data');
const {perseJSON} = require('../Refactor/utilities');
const {hash} = require('../Refactor/utilities')

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
    callback(200);
};

handler._user.put = (requestProperties, callback) => {

};

handler._user.delete = (requestProperties, callback) => {

};
module.exports = handler;