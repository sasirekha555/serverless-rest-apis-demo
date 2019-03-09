'use strict';

module.exports = {
  app: {
    title: 'Demo rest APIs',
    description: 'Demo rest APIs'
  },
    db: {
        mongodb: {
            uri: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/demo-local',
            options: {
                user: '',
                pass: ''
            },
            debug: process.env.MONGODB_DEBUG || false
        }
    },
    jwt: {
        normal: {
            secret: 'v5GbUebcTqb4h7ZNSwD2HBUqsujCJpwt',
            expiresIn: '365d' //365 days
        },
        password: {
          secret: 'dcWqwEy4HAg4nuTe48Cx5hRSRHT9HYMy',
          expiresIn: '1h'
        }
    },
    
    winston: {
        console: {
            colorize: true,
            timestamp: true,
            prettyPrint: true
        },
        file: {
            filename: 'logs/error.log',
            timestamp: true,
            maxsize: 2048,
            json: true,
            colorize: true,
            level: 'error'
        }
    },
    awsS3: {
        bucketName: 'hah-dev-files',
    },
    payU:{
      marchentKey : "QBX72qyf",
      salt : "S4ng0C55cF"
    },
    version: 'v1.0',
    api: 'http://localhost:3000',
    website: 'http://healthathomes.org',
    port: process.env.PORT || 3000
};