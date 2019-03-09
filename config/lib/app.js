'use strict';
/**
 * Module dependencies.
 */
const chalk = require('chalk');
const config = require('../config');
const express = require('./express');
const { connect, loadModels } = require('./mongoose');
const events = require("events");
events.EventEmitter.prototype._maxListeners = 100;
var app = express();
var http = require('http').Server(app);

var mongoose = require('mongoose');  

mongoose
  .connect(config.db.mongodb.uri)
  .then(() => console.log("Connected to m labs"))
  .catch(err => console.log(err));
 
http.listen(config.port, function() {
            console.log(chalk.green(config.app.title + ' is running on port ' + config.port));
        });

module.exports = app