// Routes the path 

//dependencies
const {sampleHandler} = require('./handling/sampleHandling');
const {userHandler} = require('./handling/userHandler');
const {tokenHandler} = require('./handling/tokenHandler');


const routes = {
    sample : sampleHandler,
    user : userHandler,
    token : tokenHandler
};

module.exports = routes;