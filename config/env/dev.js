'use strict';

module.exports =  {
  app: {
      title: 'Demo rest APIs',
      description: 'Demo rest APIs'
  },
  db: {
      mongodb: {
          uri:'mongodb://hah-dev:hahdev5@ds151523.mlab.com:51523/hah-dev', 
          options: {
              user: '',
              pass: ''
          },
          debug: process.env.MONGODB_DEBUG || false
      }
  },
  jwt: {
      normal: {
          secret: 'qCZe6np3uSELbnQDP4JBvFkRmbbFw4aA',
          expiresIn: '365d' //365 days
      },
      password: {
        secret: 'gJdFGPq22rVZDJWP9XnhUwRjy3U5whDy',
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

