var express = require('express');
var router = express.Router();
const canvas = require('canvas');
const faceapi = require('@vladmandic/face-api');
const fs = require('fs');
const process = require('process');
const path = require('path');
const faceApiService = require("../faceApiService");

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const REFERENCE_IMAGE = './images/rbt1.jpg'
    // const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
    // console.log(referenceImage);
    // console.log('face', faceapi);
    // console.log("test");
    return res.json({ message: "ok" })
  } catch (error) {
    console.log(error);
  }

});

router.post("/upload", async (req, res) => {
  const { file } = req.files;
  const result = await faceApiService.detect(file.data);
  faceApiService.detect(file.data)
  res.json({
   message:"ok"
  });
});

module.exports = router;
