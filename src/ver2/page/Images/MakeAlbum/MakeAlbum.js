import axios from "axios";
import * as faceapi from "face-api.js";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/AddEvent.css";

import add from "../../../components/image/add.png";
import pen from "../../../components/image/edit-2.png";
import "./MakeAlbum.css";
import Swal from "sweetalert2";
import Header from "../../../components/Header/Header";
import useLoading from "../../../hooks/useLoading";
import DetailAlbum from "../DetailAlbum/DetailAlbum";
import useAuth from "../../../hooks/useAuth";

function MakeAlbum() {
  const [image1, setImage1] = useState(null);
  const [showImg, setShowImg] = useState({ img1: null });
  const randomImage = "";
  const [imageUpload, setImageUpload] = useState("");
  const [event, setEvent] = useState(null);

  const { user } = useAuth();

  const token = user.token;

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ID_DEFAULT = 1;

  const loadModels = async () => {
    setIsLoading(true);
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    } catch (error) {
      toast.error("Error while loading models: " + error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const idUser = user.id_user;

  const closeUploadImg = async () => {
    setImage1(null);
    setIsLoading(false);
    setShowImg({ img1: null });
    document.querySelector("#img1").value = "";
    return;
  };

  const validImage = async (image) => {
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
      if (detections2.length === 0) return detections2;
      if (detections2.length === 1) return detections2;
      return detections;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImage = async (event, setImage, atImg) => {
    let file = event.target.files[0];
    if (!file) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await validImage(URL.createObjectURL(file));
      if (res.length === 0) {
        setIsLoading(false);
        closeUploadImg();
        return Swal.fire(
          "Oops...",
          "No faces can be recognized in the photo!",
          "warning"
        );
      }
      if (res.length > 1) {
        setIsLoading(false);
        closeUploadImg();
        return Swal.fire(
          "Oops...",
          "Photos must contain only one face!",
          "warning"
        );
      }
      console.log(1);
      setIsLoading(false);
      if (atImg === "img1") {
        let send = showImg;
        send.img1 = URL.createObjectURL(file);
        setShowImg(send);
        setImage(file);
        const img = await uploadImage(file);
        setImageUpload(img);
      }
    } catch (error) {
      console.log(error);
      closeUploadImg();
    }
    setIsLoading(false);
  };

  const [tenImage, setTenImage] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || ID_DEFAULT;
  const link = queryParams.get("link") || randomImage;

  const uploadImage = async (image1) => {
    if (idUser === null) {
      toast.warning("Login is required");
      navigate("/login");
    }

    const formData = new FormData();
    formData.append("src_img", image1);

    try {
      if (image1) {
        const apiResponse = await axios.post(
          `https://databaseswap.mangasocial.online/upload-gensk/${idUser}?type=src_vid`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return apiResponse.data;
      }

      return null;
    } catch (error) {
      toast.warning(error);
      return null;
    }
  };

  const fetchData = async () => {
    if (!tenImage.trim()) return toast.warning("Enter Name Album!");

    if (!showImg.img1) return toast.warning("Image require!");

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://api.mangasocial.online/getdata/swap/listimage?device_them_su_kien=gdgdgf&ip_them_su_kien=dfbdfbdf&id_user=${idUser}&list_folder=album_${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            link1: imageUpload,
          },
        }
      );

      dispatch({
        type: "SET_RESPONSE_DATA",
        payload: response.data,
      });
      // console.log({ dataSwapped: response.data });
      // const idEvent = response.data.sukien_2_image.id_toan_bo_su_kien;
      // navigate(`/images/detail-album/${idEvent}`);
      setEvent(response.data);

      toast.success("Swapped successful");
    } catch (error) {
      toast.warning(error.message);
    }
    setIsLoading(false);
  };

  return !event ? (
    <>
      <Header
        data={{
          title: "Create an album",
          myCollection: "images/my-images",
          download: true,
        }}
      />

      <div className="make-album">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="p-4 lg:w-1/2">
            <div className="flex items-center justify-center name-album">
              <img src={pen} alt="edit" />
              <input
                type="text"
                placeholder="Album title"
                value={tenImage}
                onChange={(e) => setTenImage(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="relative responsiveImg create-album">
                <img className="create-album-add" src={add} alt="" />

                <div
                  className="responsiveImg absolute cursor-pointer w-full h-full rounded-[50%] bg-center bg-no-repeat bg-cover bottom-0 "
                  style={
                    showImg.img1
                      ? { backgroundImage: `url(${showImg.img1})` }
                      : null
                  }
                ></div>

                <input
                  onChange={(e) => {
                    handleChangeImage(e, setImage1, "img1");
                  }}
                  type="file"
                  accept="image/*"
                  id="img1"
                  className={
                    image1
                      ? " opacity-0 responsiveImg cursor-pointer w-full h-full rounded-[50%]  bg-center bg-no-repeat bg-cover"
                      : " opacity-0 cursor-pointer w-full h-full rounded-[50%] absolute bg-center bg-no-repeat bg-black"
                  }
                />
              </div>
            </div>

            <button
              onClick={() => fetchData()}
              className="flex items-center justify-center transition-transform duration-300 start-album "
            >
              Start
            </button>
          </div>

          <div className="p-4 lg:w-1/2">
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                <div className="make-album__album w-[400px] h-[600px]">
                  <img
                    src={link}
                    alt="Sample"
                    className="w-full h-full bg-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <DetailAlbum event={event} />
  );
}

export default MakeAlbum;
