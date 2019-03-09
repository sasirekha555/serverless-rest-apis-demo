'use strict';

const serviceService = require('../services/services.services');
const moment = require("moment");
const mongoose = require('mongoose');


const {
  getPreSignedURL,
  uploadToS3
} = require("../../../../common/utils");

const objectId = mongoose.Types.ObjectId;

const create = (req, res) => {
 
  let data = req.body;
  
if(data.name) {
  
  if(data.image){
    if(data.image != ""){
  
  let fileExt = "";

  if (data.image.indexOf("image/png") != -1)
      fileExt = "png";
  else if (data.image.indexOf("image/jpeg") != -1)
      fileExt = "jpeg";
  else if (data.image.indexOf("image/jpg") != -1)
      fileExt = "jpg";
  else if (data.image.indexOf("video/mp4") != -1)
      fileExt = "mp4";
  else
      fileExt = "png";

  let imageKey = "sub_service_images/img_" + moment().unix();

  if (data.image)
      uploadToS3(imageKey, fileExt, data.image);
      //data.image_url = imageKey + "." + fileExt;
  data.image_url ="sub_service_images/" + data.image;
  delete data.image;
    }
  }
   
serviceService.create(data)
  .then((response) => {
    if(response)
    {
      if(response.image_url != ""){
        response.image_url = getPreSignedURL(response.image_url);
      }
      res.status(200).json({ error: "0", message: "Service created succesfully", data: response});
    }else{
      res.status(400).json({ error: "1", message: "Error in creating"});
    }
  })
  .catch((error) => {
    res.status(500).json({ error: "2", message: "Internal server error"});
  });
  } else {
    res.status(403).json({error:'2',message:"Please enter all details."});
  }

}

const update = (req,res) => {
  let data = req.body;
  if(data.name && data.id ) {
    if(data.id.length == 24) {
    let id = objectId(data.id);
    
    if(data.image){
      if(data.image != ""){
    let fileExt = "";

    if (data.image.indexOf("image/png") != -1)
        fileExt = "png";
    else if (data.image.indexOf("image/jpeg") != -1)
        fileExt = "jpeg";
    else if (data.image.indexOf("image/jpg") != -1)
        fileExt = "jpg";
    else if (data.image.indexOf("video/mp4") != -1)
        fileExt = "mp4";
    else
        fileExt = "png";

    let imageKey = "sub_service_images/img_" + moment().unix();

    if (data.image)
        uploadToS3(imageKey, fileExt, data.image);
    delete data.image;

    data.image_url = imageKey + "." + fileExt;
      }
    }

    serviceService.update({_id: id }, data)
    .then((response) => {
      if(response){
        if(response.image_url != ""){
          response.image_url = getPreSignedURL(response.image_url);
        }
        res.status(200).json({error:'0',message:"Service details updated", data:response});
      
      }
      else{
        res.status(404).json({ error: "1", message: "service data not found"});
      }
    })
    .catch((error) => {
        res.status(500).json({ error: "4", message: "Internal server error"});
    });
  }else{
    res.status(400).json({error:'3',message:"Please enter valid Userid."});
  }}
  else{
    res.status(403).json({error:'2',message:"Required madetory parameters."});
  }
  
}

const getatID = (req,res) => {
    let data = req.body;
    if(data.id) {
    if(data.id.length == 24) {
    
    let id = objectId(data.id);

    let query = {_id:id};
    serviceService.find(query)
    .then((response) => {
      if(response){
        let data = [];
        response.forEach((resp) => {
          resp.image_url = getPreSignedURL(resp.image_url);
          data.push(resp);
        });
        res.status(200).json({ error: "0", message: "Succesfully fetched", data: data});
      }else{
        res.status(404).json({ error: "1", message: "Error in fetching"});
      }
      
    })
    .catch((error) => {
      res.status(500).json({ error: "4", message: "Internal server error"});
    });
    }else{
        res.status(400).json({error:'3',message:"Please enter valid Userid."});
      }}
      else{
        res.status(403).json({error:'2',message:"Id is required."});
      }
  }
  
  const remove = (req,res) => {
    let data = req.body;
    if(data.id) {
    if(data.id.length == 24) {
    
    let id = objectId(data.id);
    let query = {_id:id};
    serviceService.remove(query)
    .then((response) => {
      if(response)
        res.status(200).json({ error: "0", message: "deleted"});
      else
        res.status(404).json({ error: "1", message: "Error in getting data"});
    })
    .catch((error) => {
      res.status(500).json({ error: "4", message: "Internal server error"});
    });
    }else{
    res.status(400).json({error:'3',message:"Please enter valid Userid."});
  }}
  else{
    res.status(403).json({error:'2',message:"Id is required."});
  }
  
  }


const get = (req,res) => {
    let query = {};
    serviceService.find(query)
    .then((response) => {
      if(response)
      {
        let data = [];
        response.forEach((resp) => {
          resp.image_url = getPreSignedURL(resp.image_url);
          data.push(resp);
        });
        res.status(200).json({ error: "0", message: "Succesfully fetched", data: data});
      }else{
        res.status(404).json({ error: "1", message: "Error in getting details"});
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "2", message: "Internal server error"});
    });
  }

  

module.exports = {
  create,
  update,
  remove,
  getatID,
  get
}
