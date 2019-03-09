'use strict';

const config = require('../config/config');
const jwt = require('jsonwebtoken');
const GoogleUrl = require('google-url');

const Promise = require('bluebird');
const AWS = require("aws-sdk");

AWS.config.loadFromPath('./config/s3_credentials.json');

const BucketName = config.awsS3.bucketName;
const s3Bucket = new AWS.S3({ params: { Bucket: BucketName } });


const uploadToS3 = (fileName, fileExt, fileData, isCampaign, callback) => {
    let data = new Buffer(fileData.replace("data:image\/" + fileExt + ";base64,", ""), "base64")
    var uploadabledata = {
        ACL: 'public-read',
        Key: fileName + '.' + fileExt,
        Body: data,
        ContentType: 'image/' + fileExt
    };
    s3Bucket.putObject(uploadabledata, function(err, response) {
        if (err) {
            console.log('Error in uploading', err);
        } else {
            console.log("uploaded: ", fileName+"."+fileExt);
            if(isCampaign)
                callback(response);

        }
    });
};



let googleUrl = new GoogleUrl({key: 'AIzaSyAsL2ZfRsAZ8eBehjubklsOLIGPQ3e-O5k'});

const generateJwtToken = (data, requestFrom) => {

  let secretCode = config.jwt.normal.secret;
  let expiresIn = config.jwt.normal.expiresIn;
  if(requestFrom == 'website')
    expiresIn = '1000d';

  return jwt.sign({ data }, secretCode, { expiresIn: expiresIn });

};

const decodeJwtToken = (jwtToken) => {
  let secretCode = config.jwt.normal.secret;

  return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, secretCode, (error, decodedData) => {
          if (!error) resolve(decodedData);
          else reject({ status: 'unauthorised', message: 'jwt expired' });
      });
  });
};


const getPreSignedURL = (awsFileKey) => {
  let s3 = new AWS.S3();
  let params = {
      Bucket: config.awsS3.bucketName,
      Key: awsFileKey
  };
  try {
      let url = s3.getSignedUrl('getObject', params);
      return url;
      
  } catch (err) {

      return "";
      
  }
}

const getShortURL = (url) =>{
  return new Promise((resolve, reject) => {
    return googleUrl.shorten( url, function( err, shortUrl) {
      if(err) {
        console.log(err);
        resolve("");
      } else
        resolve(shortUrl)
    });
  });
}

const getYears = (yearOfEstablishment) =>{
  let years = [];
  let currentYear = new Date().getFullYear();
  if(yearOfEstablishment) {
    for (var i = yearOfEstablishment; i <= currentYear; i++)
      years.push(i);
  } else {
    for (var i = (currentYear - 20); i <= currentYear; i++)
      years.push(i);
  }
  return years;
}


module.exports = {
    generateJwtToken,
    decodeJwtToken,
    getPreSignedURL,
    getShortURL,
    getYears,
    uploadToS3
};
