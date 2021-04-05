const express = require('express');
const router = express.Router();
const { detect } = require("../faceApiService");

router.post("/upload", async (req, res) => {
  try {
    const { file:{data} } = req.files;
    const similarity = await detect(data)
    res.json({similarity});
  } catch (error) {
    console.log(error);
    res.json({ "error":error })
  }

});

module.exports = router;
