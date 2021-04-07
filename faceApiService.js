const path = require("path");
const fs = require('fs').promises
const tf = require("@tensorflow/tfjs-node");
const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const modelPathRoot = "./models";

async function bufferToTensor(file) {
  const decoded = tf.node.decodeImage(file);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}
exports.detect = async (file)=> {
  try {
    await faceapi.tf.setBackend("tensorflow");
    await faceapi.tf.enableProdMode();
    await faceapi.tf.ENV.set("DEBUG", false);
    await faceapi.tf.ready();

    const modelPath = path.join(__dirname, modelPathRoot);

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

    //take data image from public directory
    let refImageDir = path.join(__dirname, `./public/images/rbt1.jpg`)
    const data = await fs.readFile(refImageDir, { encoding: 'base64' })

    //convert base64 to buffer
    const bufferData = Buffer.from(data, 'base64')
    //variable file is already buffer, convert both buffer data into tensor 
    const refTensor = await bufferToTensor(bufferData)
    const queryTensor = await bufferToTensor(file)

    const refResult = await faceapi
      .detectAllFaces(refTensor)
      .withFaceLandmarks()
      .withFaceDescriptors()
    if (!refResult.length) return

    // create FaceMatcher with automatically assigned labels
    // from the detection results for the reference image
    const faceMatcher = new faceapi.FaceMatcher(refResult)

    const queryResult = await faceapi
      .detectSingleFace(queryTensor)
      .withFaceLandmarks()
      .withFaceDescriptor()

    //compare similarity between refResult and faceMatcher
    if (queryResult) return faceMatcher.findBestMatch(queryResult.descriptor).toString()

  } catch (error) {
    console.log(error);
  }
}
  