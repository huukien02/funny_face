import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import { useNavigate } from "react-router";

import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./EventAdd.css";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import headerbg from "../../../../ver2/components/image/bg-header.png";

import imgTemplate1 from "../../../components/image/img-template1.png";
import imgTemplate2 from "../../../components/image/img-template2.png";
import imgTemplate3 from "../../../components/image/img-template3.png";
import imgTemplate4 from "../../../components/image/img-template4.png";

import Template1 from "../../app/template/Template1";
import Template2 from "../../app/template/Template2";
import Template3 from "../../app/template/Template3";
import Template4 from "../../app/template/Template4";

import { v4 as uuidV4 } from "uuid";
import useLoading from "../../../hooks/useLoading";
import configs from "../../../../configs/configs.json";
import { loadModels, uploadImage } from "../../../../library/faceapi";
import { getMyDetailUser } from "../../../../utils/getDataCommon";
import Header from "../../../components/Header/Header";

const { SERVER_API_METATECH } = configs;
const INDEX_DEFAULT = 0;

const EventAdd = () => {
  const user = JSON.parse(window.localStorage.getItem("user-info"));
  const token = user?.token;
  const idUser = user?.id_user;

  const [idTbsk, setIdTbsk] = useState(null);

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const settingSlider = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    className: "addEvent-slider",
  };

  useEffect(() => {
    loadModels();
    getImageList(idUser);
    getVideoList();
    randomIdTbsk();
  }, []);

  useEffect(() => {
    idTbsk && getSttEvent(idTbsk);
  }, [idTbsk]);

  // * template

  const randomIdTbsk = () => {
    const idList = ["035890949987", 955674353513, 531755026825, 108282543599];
    const idTBSK = idList[Math.floor(Math.random() * idList.length)];
    setIdTbsk(idTBSK);
  };

  const templateList = [
    {
      image: imgTemplate1,
      id: 1,
    },

    {
      image: imgTemplate2,
      id: 2,
    },

    {
      image: imgTemplate3,
      id: 3,
    },

    {
      image: imgTemplate4,
      id: 4,
    },
  ];

  const templateComponentList = [Template1, Template2, Template3, Template4];
  const [indexTemplate, setIndexTemplate] = useState(0);
  const TemplateComponent = templateComponentList[indexTemplate];

  // * ___________________________

  const [sttEvent, setSttEvent] = useState(0);
  const getSttEvent = async (id_tbsk) => {
    try {
      const response = await axios.get(
        `https://databaseswap.mangasocial.online/lovehistory/${id_tbsk}`
      );
      setSttEvent(response.data.sukien.length);
    } catch (err) {
      console.log(err);
    }
  };

  const addEvent = async () => {
    setIsLoading(true);
    const id_template = templateList[indexTemplate].id;
    const device = await getMyDetailUser();

    const formData = new FormData();

    formData.append("ten_sukien", form.title);
    formData.append("noidung_su_kien", form.content);

    formData.append("ten_nam", device.nameM);
    formData.append("ten_nu", device.nameF);
    formData.append("device_them_su_kien", device.browser);
    formData.append("ip_them_su_kien", device.ip);

    formData.append("link_img", imageList[imageIndex]);
    formData.append("link_video", videoList[videoIndex]);
    formData.append("id_template", id_template);
    formData.append("id_user", idUser);

    try {
      const { data } = await axios.post(
        `${SERVER_API_METATECH}/lovehistory/add/${idTbsk}`,
        formData,
        {
          headers: {
            link1: imageList[imageIndex],
            link2: imageList[imageIndex],
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("new event:", data);
      toast.success("Add success!");
      setIsLoading(false);

      await uploadImage(imageUpload, "vid");
      navigate(`/events/${idTbsk}/${sttEvent + 1}`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // * get data display

  const [imageList, setImageList] = useState([]);
  const getImageList = async (id) => {
    try {
      const response = await axios.get(
        `${SERVER_API_METATECH}/images/${id}?type=video`
      );

      setImageList(response.data.image_links_video);
    } catch (error) {
      console.log(error);
    }
  };

  const [videoList, setVideoList] = useState([]);
  const getVideoList = async () => {
    try {
      const response = await axios.get(
        `${SERVER_API_METATECH}/lovehistory/listvideo/1?category=1`
      );

      setVideoList(response.data.list_sukien_video);
    } catch (error) {
      console.log(error);
    }
  };

  // * handle view all
  const [isViewAll, setIsViewAll] = useState({
    status: false,
    type: "Videos",
  });

  const handleViewAll = (type) => {
    setIsViewAll({ ...isViewAll, status: true, type });
  };

  const renderViewAllContent = (type) => {
    switch (type) {
      case "templates":
        return templateList.map(({ id, image }) => (
          <div key={id} className="w-full p-2">
            <div className="overflow-hidden h-[160px] rounded-lg bg-[#525252]">
              <img
                className="object-cover w-full h-full"
                src={image}
                alt={`template ${id}`}
              />
            </div>
          </div>
        ));

      case "videos":
        return videoList.map((video) => (
          <div key={video.id} className="w-1/2 p-2">
            <div className="bg-[#525252] rounded-lg">
              <video className="mx-auto h-[160px]">
                <source src={video.link_video} type="video/mp4" />
              </video>
            </div>
          </div>
        ));

      case "images":
        return imageList.map((image, index) => (
          <div key={index} className="w-1/2 h-[160px] p-2 ">
            <img
              src={image}
              alt="image boy"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        ));

      default:
        return;
    }
  };

  // * handle change image and video

  const [imageIndex, setImageIndex] = useState(INDEX_DEFAULT);
  const [videoIndex, setVideoIndex] = useState(INDEX_DEFAULT);
  const videoActiveRef = useRef();

  const handleChangeVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const link_video = URL.createObjectURL(file);
    const video = { link_video, id: uuidV4() };

    const newVideos = [...videoList];
    newVideos.splice(videoIndex, 0, video);

    setVideoList(newVideos);
    videoActiveRef.current?.load();
  };

  const [imageUpload, setImageUpload] = useState(null);
  const handleChangeImage = async (e) => {
    let file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    if (!file) return;

    const newImageList = [...imageList];
    newImageList.splice(imageIndex, 0, imageUrl);

    setImageList(newImageList);
    setImageUpload(file);
  };

  const [form, setForm] = useState({ title: "", content: "" });
  const handleChangeValue = (e) => {
    setForm({ ...form, [`${e.target.name}`]: e.target.value });
  };

  const handleCreateEvent = () => {
    const { title, content } = form;
    if (title.trim() === "" || content.trim() === "")
      return Swal.fire(
        "Oops...",
        `Please enter title && content complete!`,
        "warning"
      );

    addEvent();
  };

  return (
    <>
      <Header
        data={{
          background: `center/cover no-repeat url(${headerbg})`,
          title: "add new event",
          download: true,
          myEvent: true,
        }}
      />
      <div className="addEvent">
        <div className="w-1/4">
          {!isViewAll.status ? (
            <div className="addEvent-upload">
              <div className="addEvent-template">
                <div className="addEvent-view">
                  <h4>Templates</h4>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewAll("templates");
                    }}
                    href="#"
                  >
                    View all
                  </a>
                </div>

                <div className="addEvent-template-content">
                  <Slider
                    {...settingSlider}
                    initialSlide={indexTemplate}
                    afterChange={(index) => {
                      setIndexTemplate(index);
                      setForm({ title: "", content: "" });
                    }}
                  >
                    {templateList.map(({ id, image }) => (
                      <div key={id} className="p-2">
                        <div className="overflow-hidden h-[160px] rounded-lg bg-[#525252]">
                          <img
                            className="object-cover w-full h-full"
                            src={image}
                            alt={`template ${id}`}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              <div className="addEvent-video">
                <div className="addEvent-view">
                  <h4>Videos</h4>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewAll("videos");
                    }}
                    href="#"
                  >
                    View all
                  </a>
                </div>

                <Slider
                  {...settingSlider}
                  afterChange={(index) => setVideoIndex(index)}
                  initialSlide={videoIndex}
                >
                  {videoList.length > 0
                    ? videoList.map((video, index) => (
                        <div key={video.id} className="p-2">
                          <div className="bg-[#525252] rounded-lg">
                            <video
                              ref={index === videoIndex ? videoActiveRef : null}
                              className="mx-auto h-[160px]"
                            >
                              <source src={video.link_video} type="video/mp4" />
                            </video>
                          </div>
                        </div>
                      ))
                    : ""}
                </Slider>

                <div className="addEvent-video-upload addEvent-btn">
                  <input
                    onChange={handleChangeVideo}
                    type="file"
                    accept="video/*"
                  />
                  <p>Upload video</p>
                </div>
              </div>

              <div className="addEvent-image">
                <div className="addEvent-view">
                  <h4>Images</h4>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewAll("images");
                    }}
                    href="#"
                  >
                    View all
                  </a>
                </div>

                <Slider
                  {...settingSlider}
                  afterChange={(index) => setImageIndex(index)}
                  initialSlide={imageIndex}
                >
                  {imageList.length > 0
                    ? imageList.map((image, index) => (
                        <div key={index} className="h-[160px] p-2 ">
                          <img
                            src={image}
                            alt="image"
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </div>
                      ))
                    : ""}
                </Slider>

                <div className="addEvent-image-upload addEvent-btn">
                  <input
                    onChange={handleChangeImage}
                    type="file"
                    accept="image/*"
                  />
                  <p>Upload image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="viewAll">
              <div className="viewAll-back">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setIsViewAll({ ...isViewAll, status: false });
                  }}
                  href="#"
                >
                  <KeyboardBackspaceIcon />
                </a>
                <h3>Template</h3>
              </div>

              <div className="flex flex-wrap viewAll-content">
                {renderViewAllContent(isViewAll.type)}
              </div>
            </div>
          )}
        </div>

        <div className="w-3/4 addEvent-show">
          <TemplateComponent
            onChangeValue={handleChangeValue}
            image={imageList[imageIndex]}
          />

          <button className="addEvent-btn-create" onClick={handleCreateEvent}>
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default EventAdd;
