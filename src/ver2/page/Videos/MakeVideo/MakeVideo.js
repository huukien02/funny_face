import axios from "axios";
import * as faceapi from "face-api.js";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/AddEvent.css";
import RenderRandomWaitImage from "../../../components/randomImages";

import add from "../../../components/image/add.png";
import pen from "../../../components/image/edit-2.png";
import "./MakeVideo.css";
import Swal from "sweetalert2";
import Header from "../../../components/Header/Header";
import useLoading from "../../../hooks/useLoading";
import useAuth from "../../../hooks/useAuth";

function MakeVideo() {
  const [image1, setImage1] = useState(null);
  const [showImg, setShowImg] = useState({ img1: null });
  const [randomImages, setRandomImages] = useState(null);

  const [isUpnewImage, setIsUpNewImage] = useState(true);
  const [selectedOldImage, setSelectedOldImage] = useState(false);
  const [linkOldImage, setLinkOldImage] = useState(null);

  const [listOldImage, setListOldImage] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();
  const { setIsLoading } = useLoading();

  const token = user.token;

  const ID_DEFAULT = 2;
  const VIDEO_DEFAULT =
    "https://github.com/sonnh7289/funnyvideo_faceFunny/raw/main/catbanh2.mp4";

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

  const getMyDetailUser = async () => {
    try {
      const { data } = await axios.get("https://api.ipify.org/?format=json");
      if (data.ip) {
        const browser = window.navigator.userAgent;
        return {
          browser: browser,
          ip: data.ip,
        };
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

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
      if (detections2.length == 0) return detections2;
      if (detections2.length == 1) return detections2;
      return detections;
    } catch (error) {
      console.log(error);
    }
  };

  const [imageVid, setImageVid] = useState("");

  const handleChangeImage = async (event, setImage, atImg) => {
    let file = event.target.files[0];
    if (!file) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await validImage(URL.createObjectURL(file));
      if (res.length == 0) {
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

      setIsLoading(false);
      if (atImg == "img1") {
        let send = showImg;
        send.img1 = URL.createObjectURL(file);
        setShowImg(send);
        setImage(file);
        const imagevid = await uploadImage(file);
        setImageVid(imagevid);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      closeUploadImg();
    }
  };

  const [tenVideo, setTenVideo] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || ID_DEFAULT;
  const link = queryParams.get("link") || VIDEO_DEFAULT;

  const uploadImage = async (image1) => {
    console.log(image1);
    if (idUser === null) {
      toast.warning("Login is required");
      navigate("/login");
    }

    const formData = new FormData();
    formData.append("src_img", image1);

    try {
      if (image1) {
        // Gửi cả hai hình ảnh lên server
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
        return apiResponse.data; // Trả về dữ liệu từ API
      }

      return null;
    } catch (error) {
      toast.warning(error);
      return null;
    }
  };

  const fetchData = async () => {
    if (!tenVideo.trim()) return toast.warning("Enter Name Video!");
    if (!showImg.img1) return toast.warning("Image require!");

    setIsLoading(true);
    try {
      const device = await getMyDetailUser();
      const response = await axios.get(
        `https://videoswap.mangasocial.online/getdata/genvideo?id_video=${id}&device_them_su_kien=${device.browser}&ip_them_su_kien=${device.ip}&id_user=${idUser}&image=${imageVid}&ten_video=${tenVideo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({
        type: "SET_RESPONSE_DATA",
        payload: response.data,
      });

      const idEvent = response.data.sukien_video.id_sukien_video;
      navigate(`/videos/detail-video/${idEvent}`);

      // toast.success("Successful");
    } catch (error) {
      toast.warning(error.message);
      setIsLoading(false);
    }
  };

  const handleUploadOldImage = async (src) => {
    setSelectedOldImage(true);
    setLinkOldImage(src);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://databaseswap.mangasocial.online/lovehistory/user/video/240?trang=1"
        );

        setListOldImage(response.data.list_sukien_video);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <Header
        data={{
          title: "create a video",
          myCollection: "videos/my-videos",
          download: true,
        }}
      />

      <div className="make-video">
        {randomImages !== null && (
          <RenderRandomWaitImage images1={randomImages} />
        )}
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="p-4 lg:w-1/2">
            <div className="flex items-center justify-center name-video">
              <img src={pen} alt="edit" />
              <input
                type="text"
                placeholder="Video title"
                value={tenVideo}
                onChange={(e) => setTenVideo(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center">
              {!selectedOldImage ? (
                <div className="relative responsiveImg create-video">
                  <img className="create-video-add" src={add} alt="" />
                  <div
                    className="responsiveImg absolute cursor-pointer w-full h-full rounded-[50%] bg-center bg-no-repeat bg-cover bottom-0 "
                    style={
                      showImg.img1
                        ? { backgroundImage: `url(${showImg.img1})` }
                        : null
                    }
                  ></div>
                  <input
                    disabled={!isUpnewImage}
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
              ) : (
                <div className="relative responsiveImg create-video">
                  <img className="create-video-add" src={add} alt="" />
                  <div
                    className="responsiveImg absolute cursor-pointer w-full h-full rounded-[50%] bg-center bg-no-repeat bg-cover bottom-0 "
                    style={
                      linkOldImage
                        ? { backgroundImage: `url(${linkOldImage})` }
                        : null
                    }
                  ></div>
                </div>
              )}
            </div>

            <div>
              {!isUpnewImage && (
                <div className="bg-white flex flex-wrap">
                  {listOldImage?.slice(0, 3).map((item, index) => {
                    return (
                      <div key={index} className="w-1/3 p-4">
                        <img
                          onClick={() =>
                            handleUploadOldImage(
                              item.sukien_video[0].link_image
                            )
                          }
                          className="w-full h-full object-cover border border-gray-500 cursor-pointer"
                          src={item.sukien_video[0].link_image}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex justify-center space-x-4">
                {!isUpnewImage ? (
                  <button
                    onClick={() => {
                      setSelectedOldImage(false);
                      setIsUpNewImage(true);
                    }}
                    className="bg-green-500 text-white text-3xl px-4 py-2 rounded-md"
                  >
                    New Image
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowImg({ image1: null });
                      setSelectedOldImage(false);
                      setIsUpNewImage(false);
                    }}
                    className="bg-green-500 text-white text-3xl px-4 py-2 rounded-md"
                  >
                    Old Image
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => fetchData()}
              className="mt-5 flex items-center justify-center transition-transform duration-300 start-video "
            >
              Start
            </button>
          </div>

          <div className="p-4 lg:w-1/2">
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                <div className="make-video__video">
                  <video controls>
                    <source src={link} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MakeVideo;
