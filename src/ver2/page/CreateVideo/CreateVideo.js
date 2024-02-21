import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { saveAs } from "file-saver";
import axios from "axios";
import "./CreateVideo.css";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";
import useLoading from "../../hooks/useLoading";
import Header from "../../components/Header/Header";
import addCircle from "../../components/image/add-circle.png";

export const CreateVideo = () => {
  const TITLE_DEFAULT = "Video title";

  const userInfo = JSON.parse(window.localStorage.getItem("user-info"));
  const token = userInfo?.token || null;
  const idUser = userInfo?.id_user || null;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLoading } = useLoading();

  const [imageFile, setImageFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState(TITLE_DEFAULT);

  const videoRef = useRef();
  const videoUploadRef = useRef();
  const titleRef = useRef();
  const inputTitleRef = useRef();
  const imgRef = useRef();

  const [isCreated, setIsCreated] = useState(false);
  const [videoSwap, setVideoSwap] = useState(null);
  const [timeCreate, setTimeCreate] = useState(null);

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    ]).then(() => {
      console.log("load models success!");
    });
  };

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

  const handleSubmitFrom = (e) => {
    e.preventDefault();
    if (isCreated) return;

    if (!imgUrl || !videoUrl || title === TITLE_DEFAULT) {
      Swal.fire("Oops...", "Please enter complete information!", "warning");
      return;
    }
    fetchData();
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value || TITLE_DEFAULT);
  };

  const handleChangeImage = async (e) => {
    let file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    if (!file) return;

    setIsLoading(true);

    try {
      const res = await validImage(imageUrl);
      if (res.length === 0) {
        setIsLoading(false);
        return Swal.fire(
          "Oops...",
          "No faces can be recognized in the photo!",
          "warning"
        );
      }
      if (res.length > 1) {
        setIsLoading(false);
        return Swal.fire(
          "Oops...",
          "Photos must contain only one face!",
          "warning"
        );
      }

      setIsLoading(false);

      setImgUrl(imageUrl);
      const imageFile = await uploadImage(file);
      setImageFile(imageFile);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleChangeVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const videoObjectURL = URL.createObjectURL(file);
    setVideoUrl(videoObjectURL);
    setVideoFile(file);
  };

  const handleClear = () => {
    Swal.fire({
      title: "Bạn có chắc chắn ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        setVideoUrl(null);
        setImgUrl(null);
        setTitle(TITLE_DEFAULT);

        videoRef.current.load();
        videoUploadRef.current.load();
        inputTitleRef.current.value = "";
        imgRef.current.value = "";
      }
    });
  };

  const uploadImage = async (image1) => {
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

  const handleDownloadVideo = async () => {
    setIsLoading(true);
    try {
      const fileName = videoSwap.split("/").pop();

      await saveAs(videoSwap, fileName);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.log({ err: error.message });
    }
    setIsLoading(false);
  };

  // * check image valid
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const device = await getMyDetailUser();

      const params = new URLSearchParams({
        device_them_su_kien: device.browser,
        ip_them_su_kien: device.ip,
        id_user: idUser,
        src_img: imageFile,
      }).toString();

      const formData = new FormData();
      formData.append("src_vid", videoFile);

      const response = await axios.post(
        `https://videoswap.mangasocial.online/getdata/genvideo/swap/imagevid?${params}`,
        formData,
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

      console.log(response.data);

      toast.success("Successful");

      setIsLoading(false);
      setIsCreated(true);
      setVideoSwap(response.data.sukien_swap_video.link_vid_da_swap);
      setTimeCreate(response.data.sukien_swap_video.thoigian_sukien);
    } catch (error) {
      toast.warning(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (videoUrl) {
      videoRef.current.load();
      videoUploadRef.current.load();
    }
  }, [videoUrl, videoSwap]);

  return (
    <>
      <Header
        data={{
          title: "create a video",
          myCollection: "videos/my-videos",
          download: true,
        }}
      />

      <div className="createVideo">
        <div className="w-1/4 createVideo-upload">
          <form onSubmit={handleSubmitFrom} action="">
            <div className="createVideo-title">
              <label htmlFor="">Video title</label>
              <input
                type="text"
                placeholder="Video title"
                onChange={handleChangeTitle}
                ref={inputTitleRef}
              />
            </div>

            <div className="createVideo-upload-video">
              <label htmlFor="">Upload the replaced video</label>
              <div
                className="createVideo-wrap"
                style={{
                  border: videoUrl ? "none" : "1px dashed #fff",
                  background: "#00000033",
                }}
              >
                <img
                  src={addCircle}
                  alt=""
                  className="createVideo-wrap__icon"
                />
                <input
                  type="file"
                  onChange={handleChangeVideo}
                  accept="video/*"
                />

                {videoUrl && (
                  <video ref={videoUploadRef}>
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>

            <div className="createVideo-upload-image">
              <label htmlFor="">Upload your alternative image</label>
              <div
                className="createVideo-wrap"
                style={{
                  border: imgUrl ? "none" : "1px dashed #fff",
                  backgroundColor: "#00000033",
                  backgroundImage: `url(${imgUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {!imgUrl && (
                  <img
                    src={addCircle}
                    alt=""
                    className="createVideo-wrap__icon"
                  />
                )}

                <input
                  type="file"
                  onChange={handleChangeImage}
                  accept="image/*"
                  ref={imgRef}
                />
              </div>
            </div>

            {!isCreated && (
              <button className="createVideo-btn" type="submit">
                Create
              </button>
            )}

            {(imgUrl || videoUrl || title !== TITLE_DEFAULT) && !isCreated ? (
              <button
                onClick={handleClear}
                className="createVideo-btn createVideo-clear"
                type="button"
              >
                Clear ALL
              </button>
            ) : null}

            {isCreated ? (
              <>
                <button
                  type="button"
                  className="createVideo-btn createVideo-download"
                  onClick={handleDownloadVideo}
                >
                  Download video
                </button>
                <button
                  type="button"
                  className="createVideo-btn createVideo-save"
                >
                  Save to my collection
                </button>
              </>
            ) : null}
          </form>
        </div>

        <div className="w-3/4 createVideo-show">
          <div className="createVideo-show-title">
            <h3 ref={titleRef}>{title}</h3>
            {isCreated && <time>{timeCreate}</time>}
          </div>
          <div className="createVideo-content">
            {!isCreated ? (
              videoUrl ? (
                <video controls ref={videoRef}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : null
            ) : (
              <video controls ref={videoRef}>
                <source src={videoSwap} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateVideo;
