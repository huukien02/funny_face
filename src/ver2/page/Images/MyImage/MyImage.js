import axios from "axios";
import React, { useEffect, useState } from "react";
import useLoading from "../../../hooks/useLoading";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/AddEvent.css";
import RenderRandomWaitImage from "../../../components/randomImages";
import "./MyImage.css";

import useAuth from "../../../hooks/useAuth";
import { ImageItem } from "../../../components/ImageItem/ImageItem";
import Header from "../../../components/Header/Header";

function MyImage() {
  const [randomImages, setRandomImages] = useState(null);

  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { user } = useAuth();

  const token = user.token;

  const totalPages = 100;

  const handlePageChange = (page) => {
    // Kiểm tra giới hạn trang để đảm bảo rằng trang không vượt quá giới hạn
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCount(newPage);
  };

  const idUser = user.id_user;
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/sonnh7289/python3-download/main/key-ios.json?fbclid=IwAR0CQmAJ4L10gG-po0-LcEja-gNZoNaz01J9CLvGP4shGFnUhcmZvBw-3O0"
    )
      .then((response) => response.json())
      .then((data) => {
        const keys = data.map((item) => item.APIKey);
        setApiKeys(keys);
      })
      .catch((error) => console.error("Lỗi:", error));
  }, []);

  useEffect(() => {
    if (apiKeys.length > 0) {
      const apiKey = chooseAPIKey();
    }
  }, [apiKeys]);

  function chooseAPIKey() {
    const randomIndex = Math.floor(Math.random() * apiKeys.length);
    return apiKeys[randomIndex];
  }

  //
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(1);

  // const getImages = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data, status } = await axios.get(
  //       `https://databaseswap.mangasocial.online/lovehistory/video/${count}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (status === 200) {
  //       setImages(data.list_sukien_video);
  //     }
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  //   setIsLoading(false);
  // };

  //useEffect(() => {
  // getImages();
  // }, [count, token]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get(`https://databaseswap.mangasocial.online/get/list_2_image/id_image_swap_all_future_love?id_user=${user?.id_user}`);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const data = response.data;
        setImages(data.id_su_kien_swap_image);
      } catch (error) {
        console.error('There was a problem fetching the video list:', error);
      }
    }
    fetchImages();
  }, [user]);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  return (
    <>
      <Header
        data={{
          title: "my collection",
          download: true,
        }}
      />

      <div className="my-image">
        {randomImages !== null && (
          <RenderRandomWaitImage images1={randomImages} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {images?.map((image, index) => (
            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg" onClick={() => openModal(image)}>
              <img src={image.link_da_swap} alt={image.alt} className="w-full h-96 object-cover cursor-pointer" />
              <div className="px-6 py-4 bg-black bg-opacity-50 h-16 flex justify-center items-center">
                <div className="font-bold text-xl mb-2 text-white">Date: {image.thoigian_sukien}</div>
              </div>
            </div>
          ))}
          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
              <div className="max-w-screen-lg">
                <img src={selectedImage?.link_da_swap} alt={selectedImage?.alt} className="max-w-full max-h-screen" />
                <button className="absolute top-0 right-0 m-4 text-white" onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </div>


        {/* <div className="my-image-container">
          {images &&
            images.map((image) => (
              <ImageItem
                {...image.sukien_image[0]}
                type="image swap"
                key={image.id_video}
              />
            ))}
        </div> */}

        <div className="overflow-x-auto d-none">
          <div className="pagination text-4xl flex justify-start items-center my-6">
            <button
              onClick={() => handlePageChange(count - 1)}
              disabled={count === 1}
              className="py-2 px-3 bg-[#ff9f9f] rounded hover:bg-[#ff9f9f8c]"
            >
              <svg
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
                <path d="M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 text-white font-medium py-2 px-3 rounded ${count === index + 1 ? "bg-red-700" : "bg-[#ff9f9f]"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(count + 1)}
              disabled={count === totalPages}
              className="py-2 px-3 bg-[#ff9f9f] rounded hover:bg-[#ff9f9f8c]"
            >
              <svg
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
                <path d="M9.293 8.707 12.586 12l-3.293 3.293 1.414 1.414L15.414 12l-4.707-4.707-1.414 1.414z" />
              </svg>
            </button>
          </div>
        </div>
        {/* <div className="pagination text-4xl flex justify-center my-6" >
        <button onClick={() => setCount(count - 1)} disabled={count === 1}
          className="py-2 px-3 bg-[#ff9f9f] rounded hover:bg-[#ff9f9f8c]">
          <svg
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
            <path d="M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z" />
          </svg>
        </button>
        <button
          className="mx-3 text-white font-medium py-2 px-4 rounded bg-red-700"
        >
          {count}
        </button>
        <button onClick={() => setCount(count + 1)}
          className="py-2 px-3 bg-[#ff9f9f] rounded hover:bg-[#ff9f9f8c]">
          <svg
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
            <path d="M9.293 8.707 12.586 12l-3.293 3.293 1.414 1.414L15.414 12l-4.707-4.707-1.414 1.414z" />
          </svg>
        </button>
      </div> */}
      </div>
    </>
  );
}

export default MyImage;
