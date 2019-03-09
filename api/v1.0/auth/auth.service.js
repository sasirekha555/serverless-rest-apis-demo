'use strict';

const _ = require('lodash');
const mongoose = require("mongoose");

const { decodeJwtToken } = require('../../../common/utils.js');

const objectId = mongoose.Types.ObjectId;

let isUser = {};

isUser.authenticated = (req, res, next) => {
    const token = req.headers['x-access-code'];
    if (token) {
        decodeJwtToken(token)
            .then(decoded => {
                req.decoded = decoded.data;
                next();
            })
            .catch((error) => {
              res.status(401).json({ success: false, error:"2", message: "Your Login Token Expired. Please Login." });
            });
    } else {
        res.status(401).json({ success: false, error:"1", message: "You are not authorised." });
    }
};

isUser.hasUserID = (req, res, next) => {
    const token = req.headers['x-access-code'];
    if (token) {
        decodeJwtToken(token)
          .then(decoded => {
              req.userID = decoded.data.userID;
              next();
          })
          .catch((error) => {
              next();
          });
    } else {
        next();
    }
};

isUser.hasToken = (req, res, next) => {
  const token = req.headers['x-url-token'];
  if (token) {
    decodeUrl(token)
      .then(decoded => {
        req.userID = decoded.data.userID;
        next();
      })
      .catch((error) => {
          next();
      });
  } else {
      next();
  }
}

let requires = {};

requires.body = (req, res, next) => {
  if (!_.isEmpty(req.body)) next();
  else res.json({ success: false, message: 'Request Body is Empty. Please Provide Data.' });
};

module.exports = {
    isUser,
    requires
};
