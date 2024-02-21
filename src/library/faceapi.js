import axios from "axios";
import * as faceapi from "face-api.js";

import configs from "../configs/configs.json";
const { SERVER_API_METATECH } = configs;

/**
 * loads all the models required for face detection and recognition
 */
export function loadModels() {
  Promise.all([
    // loads the ssd mobilenet v1 model
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    // loads the tiny face detector model
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    // loads the 68 point face landmark model
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    // loads the face recognition model
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    // loads the face expression model
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  ]).then(() => {
    // called when all the models are loaded
  });
}

export const validImage = async (image) => {
  try {
    const imageElement = document.createElement("img");
    imageElement.src = image;
    const netInput = imageElement;

    let detections = await faceapi
      .detectAllFaces(netInput, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const detections2 = await faceapi
      .detectAllFaces(netInput, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length > 1) return detections;
    if (detections2.length == 0) return detections2;
    if (detections2.length == 1) return detections2;
    return detections;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadImage = async (image, type) => {
  if (!image || !type) return null;

  const user = JSON.parse(window.localStorage.getItem("user-info"));
  const token = user?.token;
  const idUser = user?.id_user;

  const formData = new FormData();
  formData.append("src_img", image);

  try {
    const apiResponse = await axios.post(
      `${SERVER_API_METATECH}/upload-gensk/${idUser}?type=src_${type.toLowerCase()}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return apiResponse.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
