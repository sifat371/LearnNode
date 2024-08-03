// Routes the path 

//dependencies
const {sampleHandler} = require('./handling/sampleHandling');
const {userHandler} = require('./handling/userHandler');


const routes = {
    sample : sampleHandler,
    user : userHandler,
};

module.exports = routes;