'use strict';

/**
 * Module dependencies.
 */

import config from '../config' ;
import mysql from 'mysql';

var connection= module.exports = mysql.createPool(config.default.db);

module.exports=connection;