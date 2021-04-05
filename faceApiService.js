const path = require("path");
const fs = require('fs').promises
const tf = require("@tensorflow/tfjs-node");
const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const modelPathRoot = "./models";
// const REFERENCE_IMAGE = '/images/rbt1.jpg'
// const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
// console.log(referenceImage);
let optionsSSDMobileNet;
async function image(file) {
  const decoded = tf.node.decodeImage(file);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}

// async function detect(tensor) {
//     try {
//         const result = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet)
//         return result;
//     } catch (err) {
//         log.error('Caught error', err.message);
//         return [];
//     }
// }

async function main(file) {
  try {
    console.log("FaceAPI single-process test");
    await faceapi.tf.setBackend("tensorflow");
    await faceapi.tf.enableProdMode();
    await faceapi.tf.ENV.set("DEBUG", false);
    await faceapi.tf.ready();
  
    const modelPath = path.join(__dirname, modelPathRoot);
  
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5,
    });
  
  
    let refImageDir = path.join(__dirname, `./public/images/rbt1.jpg`)
    const data = await fs.readFile(refImageDir, { encoding: 'base64' })
    const refTensor = await image(Buffer.from(data, 'base64'))
    const queryTensor = await image(file)
    const refResult = await faceapi
      .detectAllFaces(refTensor)
      .withFaceLandmarks()
      .withFaceDescriptors()
   
    if (!refResult.length) {
      return
    }
    // create FaceMatcher with automatically assigned labels
    // from the detection results for the reference image
    const faceMatcher = new faceapi.FaceMatcher(refResult)
    const queryResult = await faceapi
      .detectSingleFace(queryTensor)
      .withFaceLandmarks()
      .withFaceDescriptor()
    if (queryResult) {
      const bestMatch = faceMatcher.findBestMatch(queryResult.descriptor)
      console.log(bestMatch);
      console.log(bestMatch.toString())
    }
  } catch (error) {
    console.log(error);
  }
 



  // const result = await detect(tensor);
  // tensor.dispose();
  // return result;
}
module.exports = {
  detect: main,
};
