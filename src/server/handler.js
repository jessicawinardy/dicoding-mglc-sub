/* eslint-disable no-unused-vars */
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { result, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: result,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  await storeData(id, data);
  response.code(201);
  return response;
}

async function getHistoriesHandler(req, h) {
  try {
    const firestore = new Firestore();
    const snapshot = await firestore.collection("predictions").get();
    const histories = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: doc.data(),
    }));

    const response = h
      .response({
        status: "success",
        data: histories,
      })
      .code(200);

    return response;
  } catch (error) {
    console.error("Error fetching history data:", error);
    const response = h
      .response({
        status: "fail",
        message: "Gagal mendapatkan riwayat prediksi",
      })
      .code(500);

    return response;
  }
}

module.exports = { postPredictHandler, getHistoriesHandler };
