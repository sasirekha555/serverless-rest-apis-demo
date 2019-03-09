'use strict';

const express = require('express');

const services = require('../../api/v1.0/services/routes/services.routes');


let app = express();

app.use(services);


module.exports = app;



