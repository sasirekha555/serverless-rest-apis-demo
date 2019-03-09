'use strict';

const Service = require('../models/services.model');
const md5 = require('md5');

const findOne = (query) => {
  return Service.findOne(query).exec();
}

const find = (query) => {
  return Service.find(query).sort({ "_id": 1 }).exec();
}


const findSpecific = (query) => {
  return Service.find(query).select('price name client_price').exec();
}

const create = (data) => {
  return Service.create(data);
}

const update = (query, data) => {
  return Service.findOneAndUpdate(query, data, { new: true }).exec();
}


const remove = (query) => {
  return Service.remove(query).exec();
}


module.exports = {
  findOne,
  create,
  find,
  findSpecific,
  update,
  remove
};
