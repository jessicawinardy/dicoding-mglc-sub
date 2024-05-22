/* eslint-disable no-unused-vars */
const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    let result, suggestion;

    if (confidenceScore > 50) {
      result = "Cancer";
      suggestion =
        "Anda terindikasi terkena Kanker, segera periksakan ke dokter!";
    } else {
      result = "Non-cancer";
      suggestion =
        "Tidak terindikasi kanker, namun tetap periksa secara berkala.";
    }

    return { result, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

module.exports = predictClassification;
