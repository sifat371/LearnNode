//                             handle Environment related things

// dependencies

// module scafoldings
const environment = {};

environment.staging = {
    port : 3000,
    envName : 'Staging',
    secretkey : "sakjdfkasjdfk"
};

environment.production = {
    port : 4000,
    envName : 'Production',
    secretkey : "ksjdfkjashdfkjhskdf"
};

//Determine which env has been passed
const currEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

//Environment to export
const envToExport = typeof(environment[currEnv]) === 'object' ? environment[currEnv] : environment.staging;

module.exports = envToExport;
