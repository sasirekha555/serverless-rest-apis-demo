'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const schema = new Schema({
    name: String,
    description : String,
    image_url: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('services', schema);
