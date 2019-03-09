const sls = require('serverless-http')
const app = require('./config/lib/app')

module.exports.run = sls(app)
