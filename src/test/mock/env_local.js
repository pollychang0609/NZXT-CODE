/* tslint:disable */
/* eslint-disable */
/* istanbul ignore file */

console.info(`===> project env_local.js ${process.env.NODE_ENV}`);
const os = require('os');
const RUNNING_ENV = 'localhost' // 'localhost' | 'dev' | 'test'

module.exports = {
    PROFILE_KEY : RUNNING_ENV,
    getEnv : os.type(),
    localhost : {
        // MONGODB
        MONGODB_URL : 'mongodb://localhost:27017',
        MONGODB_OPTIONS: { useNewUrlParser: true, useUnifiedTopology: true, tls: false, dbName : 'test' },
    },
    dev : {
         // MONGODB
         MONGODB_URL : 'mongodb://localhost:27017',
         MONGODB_OPTIONS: { useNewUrlParser: true, useUnifiedTopology: true, tls: false, dbName : 'test' },
    },
    test : {
         // MONGODB
         MONGODB_URL : 'mongodb://localhost:27017',
         MONGODB_OPTIONS: { useNewUrlParser: true, useUnifiedTopology: true, tls: false, dbName : 'test' },
    }
};