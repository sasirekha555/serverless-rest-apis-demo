'use strict';

module.exports =  {
  app: {
    title: 'Demo rest APIs',
    description: 'Demo rest APIs'
  },
    db: {
        mongodb: {
            uri: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/demo-production',
            options: {
                user: '',
                pass: ''
            },
            debug: process.env.MONGODB_DEBUG || false
        }
    },
    jwt: {
        normal: {
            secret: '3phAELaLVy3xg4K7amUzgC9qbnRRQrB5',
            expiresIn: '365d' //365 days
        },
        password: {
          secret: 'aGPbB6LPXbugPjPQEQM9pj486fYQNRFc',
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
        bucketName: '',
    },
    version: 'v1.0',
    api: '',
    website: '',
    port: process.env.PORT || 3000
  };
  
