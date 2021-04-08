const express = require('express');
const router = express.Router();
const { detect } = require("../faceApiService");
const path = require("path");
const fs = require('fs');

router.post("/register-photo", async (req, res) => {
  try {
    let imagesDir = path.join(__dirname, '../public/images')
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir)
    //userid is fetched from database
    const userid='user'
    const extension = path.parse(req.files.file.name).ext
    const fileName=`${userid}${extension}`
    await req.files.file.mv(path.join(__dirname, `../public/images/${fileName}`))
    res.json({message:'Foto Berhasil ditambahkan'})
  } catch (error) {
    console.log(error);
    res.json({ "error": "Terjadi kesalahan coba lagi nanti!" })
  }
})

router.post("/upload", async (req, res) => {
  try {
    const { file: { data } } = req.files;
    const similarity = await detect(data)
    if (!similarity || similarity.includes('unknown')) {
      return res.json({ isDetected: false })
    }
    res.json({ isDetected: true });
  } catch (error) {
    console.log(error);
    res.json({ "error": "Terjadi kesalahan coba lagi nanti!" })
  }

});

module.exports = router;
