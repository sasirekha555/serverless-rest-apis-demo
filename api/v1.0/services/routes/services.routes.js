'use strict';

const express = require('express');
const ServiceController = require('../controllers/services.controller');
const {
    isUser,
    requires
} = require('../../auth/auth.service');

let router = express.Router();


router.post('/v1.0/services/create', requires.body, ServiceController.create);

router.get('/v1.0/services/get', ServiceController.get);

router.post('/v1.0/services/get_by_id',requires.body, ServiceController.getatID);

router.post('/v1.0/services/update', requires.body, ServiceController.update);

router.post('/v1.0/services/remove', requires.body, ServiceController.remove);


module.exports = router;
