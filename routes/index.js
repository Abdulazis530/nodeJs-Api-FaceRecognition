const express = require('express');
const router = express.Router();
const { detect } = require("../faceApiService");

router.post("/upload", async (req, res) => {
  try {
    const { file } = req.files;
    const similiarity = await detect(file.data)
    res.json({
      similiarity
    });
  } catch (error) {
    console.log(error);
    res.json({ error:error })
  }

});

module.exports = router;
