import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useLoading from "../../hooks/useLoading";

import goodPhoto1 from "../../components/image/goodPhotos/goodPhoto1.png";
import goodPhoto2 from "../../components/image/goodPhotos/goodPhoto2.png";
import goodPhoto3 from "../../components/image/goodPhotos/goodPhoto3.png";
import goodPhoto4 from "../../components/image/goodPhotos/goodPhoto4.png";
import goodPhoto5 from "../../components/image/goodPhotos/goodPhoto5.png";
import goodPhoto6 from "../../components/image/goodPhotos/goodPhoto6.png";
import badPhoto1 from "../../components/image/badPhotos/badPhoto1.png";
import badPhoto2 from "../../components/image/badPhotos/badPhoto2.png";
import badPhoto3 from "../../components/image/badPhotos/badPhoto3.png";
import badPhoto4 from "../../components/image/badPhotos/badPhoto4.png";
import badPhoto5 from "../../components/image/badPhotos/badPhoto5.png";
import badPhoto6 from "../../components/image/badPhotos/badPhoto6.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";
import Header from "../../components/Header/Header";
import addCircle from "../../components/image/add-circle.png";

import "@tensorflow/tfjs";
import * as faceapi from "face-api.js";

function CreateImage() {
  const serverGenarateSK = "https://thinkdiff.us";

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [showImg, setShowImg] = useState({ img1: null, img2: null });
  const [sameFace, setSameFace] = useState({
    img1: null,
    img2: null,
  });

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const { user } = useAuth();

  const token = user.token;
  let faceMatcher = null;

  // todo ------------------------------------
  const img1Ref = useRef();
  const img2Ref = useRef();
  const inputTitleRef = useRef();
  const titleRef = useRef();

  const TITLE_DEFAULT = "Image title";
  const [title, setTitle] = useState(TITLE_DEFAULT);

  const [isCreated, setIsCreated] = useState(false);
  const [timeCreate, setTimeCreate] = useState(null);
  const [imageSwap, setImageSwap] = useState("");

  const imgSucess = [
    goodPhoto1,
    goodPhoto2,
    goodPhoto3,
    goodPhoto4,
    goodPhoto5,
    goodPhoto6,
  ];
  const imageError = [
    badPhoto1,
    badPhoto2,
    badPhoto3,
    badPhoto4,
    badPhoto5,
    badPhoto6,
  ];

  const [showModals22, setShowModals22] = React.useState(true);

  const loadTranningData = async () => {
    const labels = ["Đeo kính", "Không đeo kính"];
    const faceDescriptors = [];

    try {
      for (const label of labels) {
        const descriptors = [];

        for (let i = 1; i <= 20; i++) {
          const image = await faceapi.fetchImage(
            `/trainingData/${label}/${i}.jpg`
          );
          const detection = await faceapi
            .detectSingleFace(image)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptors.push(detection.descriptor);
        }

        faceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(label, descriptors)
        );

        toast.success("Loaded training model successfully");
      }

      return faceDescriptors;
    } catch (err) {
      toast.error("Loaded training model fail: " + err.message);
    }
  };

  const loadModels = async () => {
    setIsLoading(true);
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");

      // const trainingData = await loadTranningData();
      // faceMatcher = new faceapi.FaceMatcher(trainingData, 1);

      // toast.success("Tải xong mô hình");
    } catch (error) {
      toast.error("Error while loading models: " + error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const closeUploadImg = async () => {
    setImage1(null);
    setImage2(null);
    setIsLoading(false);
    setSameFace({ img1: null, img2: null });
    img1Ref.current.value = "";
    img2Ref.current.value = "";
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

  const checkGlass = async (file, alt, content) => {
    const image = await faceapi.bufferToImage(file);
    const canvas = faceapi.createCanvasFromMedia(image);

    content.innerHTML = "";
    content.appendChild(image);
    content.appendChild(canvas);
    const size = {
      width: image.width,
      height: image.height,
    };
    faceapi.matchDimensions(canvas, size);
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, size);
    for (const detection of resizedDetections) {
      const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
        label: faceMatcher?.findBestMatch(detection.descriptor).toString(),
      });
      drawBox.draw(canvas);
    }
  };

  const [srcNam, setSrcNam] = useState("");
  const [srcNu, setSrcNu] = useState("");

  const handleChangeImage = async (event, setImage, atImg, contentId) => {
    // const content = document.querySelector(`#${contentId}`);

    let file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);

    try {
      // await checkGlass(file, atImg, content);
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

      atImg === "img1"
        ? setSameFace({
            img1: res[0]?.detection?._score,
            img2: sameFace.img2,
          })
        : setSameFace({
            img1: sameFace.img1,
            img2: res[0]?.detection?._score,
          });
      if (
        sameFace.img1 === res[0]?.detection?._score ||
        sameFace.img2 === res[0]?.detection?._score
      ) {
        setIsLoading(false);
        closeUploadImg();

        return Swal.fire("Oops...", "Photos cannot be the same!", "warning");
      }
      setIsLoading(false);

      if (atImg === "img1") {
        let send = showImg;
        send.img1 = URL.createObjectURL(file);
        setShowImg(send);
        setImage(file);
        const res1 = await uploadImageNam(file);
        if (!res1) {
          closeUploadImg();
        }

        setSrcNam(res1);
      } else {
        let send = showImg;
        send.img2 = URL.createObjectURL(file);
        setShowImg(send);
        setImage(file);
        const res2 = await uploadImageNu(file);

        if (!res2) {
          closeUploadImg();
        }

        setSrcNu(res2);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      closeUploadImg();
    }
  };

  const getMyDetailUser = async () => {
    try {
      const { data } = await axios.get("https://api.ipify.org/?format=json");

      if (data.ip) {
        const browser = window.navigator.userAgent;
        return {
          browser: browser,
          ip: data.ip,
          nameM: data.ip + " Boy",
          nameF: data.ip + " Girl",
        };
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const idUser = user.id_user;
  const uploadImageNam = async (image) => {
    if (idUser === null) {
      toast.warning("Login is required");
      navigate("/login");
    }
    const formData = new FormData();
    formData.append("src_img", image);
    try {
      if (image) {
        const apiResponse = await axios.post(
          `https://databaseswap.mangasocial.online/upload-gensk/${idUser}?type=src_nam`,
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
      toast.error(error.response.data.message);
      return null;
    }
  };

  const uploadImageNu = async (image) => {
    if (idUser === null) {
      toast.warning("Login is required");
      navigate("/login");
    }
    const formData = new FormData();
    formData.append("src_img", image);
    try {
      if (image) {
        const apiResponse = await axios.post(
          `https://databaseswap.mangasocial.online/upload-gensk/${idUser}?type=src_nu`,
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
      console.log(error);
      return null;
    }
  };

  const handleDownloadImage = async () => {
    setIsLoading(true);
    try {
      const fileName = imageSwap.split("/").pop();

      await saveAs(imageSwap, fileName);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.log({ err: error.message });
    }
    setIsLoading(false);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value || TITLE_DEFAULT);
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
        setShowImg({ img1: null, img2: null });
        setSameFace({ img1: null, img2: null });

        setTitle(TITLE_DEFAULT);
        inputTitleRef.current.value = "";
        img1Ref.current.value = "";
        img2Ref.current.value = "";
      }
    });
  };

  const handleSubmitFrom = (e) => {
    e.preventDefault();
    if (isCreated) return;
    if (!showImg.img1 || !showImg.img2 || title === TITLE_DEFAULT)
      return Swal.fire(
        "Oops...",
        "Please enter complete information!!!",
        "info"
      );

    fetchData();
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const device = await getMyDetailUser();

      const res3 = await createEvent(
        srcNam,
        srcNu,
        device.browser,
        device.ip,
        device.nameM,
        device.nameF
      );

      if (res3 && res3.error) {
        toast.error(res3.error);
        return;
      }
      setIsLoading(false);
      toast.success("Upload and save data completed successfully");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const createEvent = async (srcnam, srcnu, browser, ip) => {
    try {
      const user = JSON.parse(window.localStorage.getItem("user-info"));
      if (!user) throw new Error("User info not found");

      const response = await axios.get(
        `${serverGenarateSK}/getdata/swap/2/image`,
        {
          params: {
            device_them_su_kien: browser,
            ip_them_su_kien: ip,
            id_user: user.id_user,
          },

          headers: {
            link1: srcnu,
            link2: srcnam,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImageSwap(response.data.sukien_2_image.link_da_swap);
      setTimeCreate(response.data.sukien_2_image.thoigian_sukien);
      setIsCreated(true);

      console.log(response.data);
      return { success: response.data };
    } catch (error) {
      setIsLoading(false);
      // console.error(error.message);
      return { error: error.message };
    }
  };

  useEffect(() => {}, [image1], [image2]);

  return (
    <>
      <Header
        data={{
          title: "create a video",
          myCollection: "images/my-images",
          download: true,
        }}
      />

      <div className="createVideo">
        <div className="w-1/4 createVideo-upload">
          <form onSubmit={handleSubmitFrom} action="">
            <div className="createVideo-title">
              <label htmlFor="">Image title</label>
              <input
                type="text"
                placeholder="Image title"
                onChange={handleChangeTitle}
                ref={inputTitleRef}
              />
            </div>

            <div className="createVideo-upload-image">
              <label htmlFor="">Upload the replaced image</label>
              <div
                className="createVideo-wrap relative"
                style={{
                  border: showImg?.img1 ? "none" : "1px dashed #fff",
                  backgroundColor: "#00000033",
                  backgroundImage: `url(${showImg?.img1})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {!showImg.img1 && (
                  <img
                    src={addCircle}
                    alt=""
                    className="createVideo-wrap__icon"
                  />
                )}

                <input
                  id="img1"
                  type="file"
                  onChange={(e) =>
                    handleChangeImage(e, setImage1, "img1", "content1")
                  }
                  accept="image/*"
                  ref={img1Ref}
                />

                <div id="content1" class="w-[300px]"></div>
              </div>
            </div>

            <div className="createVideo-upload-image">
              <label htmlFor="">Upload your alternative image</label>
              <div
                className="createVideo-wrap"
                style={{
                  border: showImg?.img2 ? "none" : "1px dashed #fff",
                  backgroundColor: "#00000033",
                  backgroundImage: `url(${showImg?.img2})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {!showImg.img2 && (
                  <img
                    src={addCircle}
                    alt=""
                    className="createVideo-wrap__icon"
                  />
                )}

                <input
                  id="img2"
                  type="file"
                  onChange={(e) =>
                    handleChangeImage(e, setImage2, "img2", "content2")
                  }
                  accept="image/*"
                  ref={img2Ref}
                />

                <div id="content2" class="w-[300px]"></div>
              </div>
            </div>

            {!isCreated && (
              <button className="createVideo-btn" type="submit">
                Create
              </button>
            )}

            {(showImg.img1 || showImg.img2 || title !== TITLE_DEFAULT) &&
            !isCreated ? (
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
                  onClick={handleDownloadImage}
                >
                  Download image
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
              showImg.img1 ? (
                <img src={showImg.img1} alt="image root" />
              ) : null
            ) : (
              <img src={imageSwap} alt="image swap" />
            )}
          </div>
        </div>
      </div>

      {showModals22 ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto outline-none focus:outline-none">
            <div className="relative w-[1000px]  max-w-3xl">
              <div className="lg:-ml-16 ml-6 lg:w-[680px] lg:py-4 lg:px-8 w-[400px] border-0 rounded-lg shadow-lg relative flex flex-col bg-black outline-none focus:outline-none">
                <div className="relative px-10 flex-auto  lg:h-[700px] h-[600px] text-white">
                  <h1 className="mt-40 text-center text-black-500 slab max-lg:pt-8 text-4xl md:text-[32px] leading-relaxed text-white">
                    Complete upload
                  </h1>
                  <div className="text-3xl text-white md:mt-10">
                    <div className="my-8">
                      <h1 className="flex text-4xl text-green-600 md:py-1">
                        <img
                          className="h-[30px]"
                          src="https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png"
                          alt=""
                        />{" "}
                        Good photos
                      </h1>
                      <p className="w-[350px] max-lg:text-2xl">
                        close-up selfies, same subject, variety of background,
                        expressions and face angles
                      </p>
                    </div>

                    <div className="flex gap-3 overflow-x-scroll">
                      {imgSucess?.map((item, index) => (
                        <div
                          key={index}
                          className="relative lg:w-[90px] lg:h-[90px] w-[60px] h-[60px] rounded-lg overflow-hidden"
                        >
                          <img
                            src={item}
                            alt=""
                            className="lg:w-[90px] lg:h-[90px] w-[60px] h-[60px] object-cover"
                          />
                          <img
                            src="https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png"
                            className="absolute h-[25px] bottom-0 right-3"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-3xl text-white md:mt-10">
                    <div className="my-8">
                      <h1 className="flex text-4xl text-red-600 md:py-1">
                        <img
                          className="h-[30px]"
                          src="https://i.ibb.co/bJ517B1/close-removebg-preview.png"
                          alt=""
                        />
                        Bad photos
                      </h1>
                      <p className="w-[350px] max-lg:text-2xl">
                        Group pics, face small or not visible, sunglass, animal
                      </p>
                    </div>
                    <div className="flex gap-3 overflow-x-scroll">
                      {imageError?.map((item, index) => (
                        <div
                          key={index}
                          className="relative lg:w-[90px] lg:h-[90px] w-[60px] h-[60px] rounded-lg overflow-hidden"
                        >
                          <img
                            src={item}
                            alt=""
                            className="lg:w-[90px] lg:h-[90px] w-[60px] h-[60px] object-cover"
                          />
                          <img
                            src="https://i.ibb.co/bJ517B1/close-removebg-preview.png"
                            className="absolute h-[25px] bottom-0 right-3"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="text-3xl text-white">
                      <div>
                        <h1 className="lg:w-[550px] w-[300px] max-lg:text-2xl">
                          Your photos will be deleted permanetly from our
                          servers within 24h, and won’t be used for any other
                          purpose
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-40 relative lg:left-[540px] lg:-top-[700px] left-[340px] -top-[610px] w-[50px] flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-[#FF2C61] slab hover:bg-[#ED709D] hover:text-white font-bold uppercase px-6 py-3 rounded-xl text-2xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModals22(false)}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
}

export default CreateImage;
