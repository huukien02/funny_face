import { useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import useLoading from "./../hooks/useLoading";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import background from "../../ver2/components/image/login/background.png";
import cameraIcon from "../../ver2/components/image/login/cameraIcon.svg";
import imageIcon from "../../ver2/components/image/login/imageIcon.svg";

import goodPhoto1 from "../../ver2/components/image/goodPhotos/goodPhoto1.png";
import goodPhoto2 from "../../ver2/components/image/goodPhotos/goodPhoto2.png";
import goodPhoto3 from "../../ver2/components/image/goodPhotos/goodPhoto3.png";
import goodPhoto4 from "../../ver2/components/image/goodPhotos/goodPhoto4.png";
import goodPhoto5 from "../../ver2/components/image/goodPhotos/goodPhoto5.png";
import goodPhoto6 from "../../ver2/components/image/goodPhotos/goodPhoto5.png";
import badPhoto1 from "../../ver2/components/image/badPhotos/badPhoto1.png";
import badPhoto2 from "../../ver2/components/image/badPhotos/badPhoto2.png";
import badPhoto3 from "../../ver2/components/image/badPhotos/badPhoto3.png";
import badPhoto4 from "../../ver2/components/image/badPhotos/badPhoto4.png";
import badPhoto5 from "../../ver2/components/image/badPhotos/badPhoto5.png";
import badPhoto6 from "../../ver2/components/image/badPhotos/badPhoto6.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [imageName, setImageName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordShow, setPasswordShow] = useState({
    pass: false,
    confirm: false,
  });

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const labelRef = useRef();
  const inputId = useId();

  const goodPhotos = [
    goodPhoto1,
    goodPhoto2,
    goodPhoto3,
    goodPhoto4,
    goodPhoto5,
    goodPhoto6,
  ];
  const badPhotos = [
    badPhoto1,
    badPhoto2,
    badPhoto3,
    badPhoto4,
    badPhoto5,
    badPhoto6,
  ];

  const ListImgs = ({ photos }) => {
    return (
      <div className="overflow-x-scroll grid grid-cols-6 gap-4">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt="example"
            className="w-full h-[50px] sm:h-[120px] bg-cover rounded-lg"
          />
        ))}
      </div>
    );
  };

  const isValidate = () => {
    try {
      if (
        [username, email, password, confirmPassword, imageName].some(
          (item) => !item || !item.trim()
        )
      ) {
        toast.warn("Please fill in all fields!");
        return;
      }

      if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email))
        throw new Error("Invalid email");

      if (password !== confirmPassword)
        throw new Error("Password does not match");

      return true;
    } catch (error) {
      toast.warning(error.message);
      return false;
    }
  };

  const handleSignUp = async (e) => {
    // alert("register")
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData();
    if (isValidate()) {
      await uploadImg();
      formData.append("link_avatar", `https://i.ibb.co/vjVvZL5/${imageName}`);
      formData.append("user_name", username);
      formData.append("password", password);
      formData.append("email", email);

      try {
        const response = await axios.post(
          "https://databaseswap.mangasocial.online/register/user",
          formData
        );

        console.log(response.data);
        if (response.data.account) {
          navigate("/login");
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    setIsLoading(false);
  };

  const handleUploadImgChange = async (e) => {
    setImageSrc(e.target.files[0]);
    setImageName(e.target.files[0]?.name);
    setShowModal(false);
  };

  const handleUploadImg = (e) => {
    e.preventDefault();
    labelRef.current?.click();
  };

  const uploadImg = async (e) => {
    try {
      const apiKey = "dc602cd2409c2f9f06d21dc9f6b26502";
      let body = new FormData();
      body.set("key", apiKey);
      body.append("image", imageSrc);

      await axios({
        method: "post",
        url: "https://api.imgbb.com/1/upload",
        data: body,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe") === "true";
    setRememberMe(storedRememberMe);
  }, []);

  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe.toString());
  }, [rememberMe]);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <div>
      <label htmlFor={inputId} ref={labelRef} className="d-none" />
      <input
        id={inputId}
        className="hidden"
        type="file"
        multiple
        accept="image/*"
        onChange={handleUploadImgChange}
      />
      <div className="min-h-screen flex overflow-srcoll">
        <div className="bg-gradient-to-b from-[#1A542F] to-[#000000] hidden lg:flex w-[55%] justify-center items-center">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            modules={[Pagination]}
            pagination={{ dynamicBullets: true }}
            scrollbar={{ draggable: true }}
            className="w-[80%] h-[80%] mySwiper"
          >
            <SwiperSlide className="w-full h-full">
              <img
                src={background}
                alt="Background"
                className="w-full h-[90%] bg-cover"
              />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full">
              <img
                src={background}
                alt="Background"
                className="w-full h-[90%] bg-cover"
              />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full">
              <img
                src={background}
                alt="Background"
                className="w-full h-[90%] bg-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center gap-5 py-4">
          <div
            className="w-[80%] text-4xl md:text-6xl text-white text-center items-center"
            style={{ fontFamily: "Starborn" }}
          >
            Funny Face
          </div>

          <form
            className="w-[80%] flex flex-col text-white gap-4"
            onSubmit={handleSignUp}
          >
            <span className="text-2xl md:text-3xl font-semibold">Sign up</span>
            <span className="text-xl md:text-2xl">
              Sign up with email address
            </span>

            {imageName ? (
              <div className="border border-gray-400 pl-4 rounded-lg">
                <div className="text-white flex justify-items-center items-center gap-2 pr-3">
                  <img
                    src={imageIcon}
                    alt="Icon"
                    className="w-[24px] h-[24px]"
                  />
                  <input
                    type="text"
                    value={imageName}
                    className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                    disabled
                  />
                  <button
                    type="button"
                    className="text-green-600 text-xl"
                    onClick={handleUploadImg}
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col justify-center items-center self-center bg-gray-700 px-4 py-5 rounded-full cursor-pointer gap-1"
                onClick={() => setShowModal(true)}
              >
                <img
                  src={cameraIcon}
                  alt="Upload"
                  className="w-[20px] h-[20px]"
                />
                <span className="text-base">Upload image</span>
              </div>
            )}
            <div className="border border-gray-400 pl-4 rounded-lg">
              <div className="text-white flex justify-items-center items-center gap-2">
                <FaUser className="text-white text-xl md:text-2xl items-start mr-2" />
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="border border-gray-400 pl-4 rounded-lg">
              <div className="text-white flex justify-items-center items-center gap-2">
                <MdEmail className="text-white text-xl md:text-2xl items-start mr-2" />
                <input
                  type="text"
                  value={email}
                  placeholder="Email"
                  className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between border_pass text-white border border-gray-400 pl-4 rounded-lg">
              <div className="relative flex justify-items-center items-center gap-2 flex-grow-1">
                <FaLock className="text-white text-xl md:text-2xl mr-2" />
                <input
                  type={passwordShow.pass ? "text" : "password"}
                  value={password}
                  placeholder="Password"
                  className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() =>
                    setPasswordShow({
                      ...passwordShow,
                      pass: !passwordShow.pass,
                    })
                  }
                  className="h-full flex justify-center items-center absolute top-0 right-4"
                >
                  {passwordShow.pass ? (
                    <FaEye className="text-white text-3xl" />
                  ) : (
                    <FaEyeSlash className="text-white text-3xl" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between border_pass text-white border border-gray-400 pl-4 rounded-lg">
              <div className="relative flex justify-items-center items-center gap-2 flex-grow-1">
                <FaLock className="text-white text-xl md:text-2xl mr-2" />
                <input
                  type={passwordShow.confirm ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm password"
                  className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={() =>
                    setPasswordShow({
                      ...passwordShow,
                      confirm: !passwordShow.confirm,
                    })
                  }
                  className="h-full flex justify-center items-center absolute top-0 right-4"
                >
                  {passwordShow.confirm ? (
                    <FaEye className="text-white text-xl" />
                  ) : (
                    <FaEyeSlash className="text-white text-xl" />
                  )}
                </span>
              </div>
            </div>

            <button
              className="bg-green-400 text-white rounded-lg py-3 font-semibold text-2xl"
              onClick={(e) => handleSignUp(e)}
            >
              Sign up
            </button>

            <div className="flex items-center w-full mt-4">
              <div className="flex-grow-1 bg-gray-800 h-[1px]" />
              <span className="mx-4 text-white text-xl font-semibold">Or</span>
              <div className="flex-grow-1 bg-gray-800 h-[1px]" />
            </div>

            <div className="flex flex-col justify-center items-center text-white gap-3">
              <div className="flex justify-center items-center gap-3">
                <span className="text-2xl text-gray-400">
                  Already had an account?
                </span>
                <button
                  type="button"
                  className="text-2xl text-green-400"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div
          className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-50 px-12 z-10"
          onClick={() => setShowModal(false)}
        >
          <div
            className="flex flex-col justify-center items-center rounded-lg px-8 py-8 text-white opacity-100 bg-modal-gray text-5xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex">
              <span>Upload image</span>
              <div
                className="flex justify-center items-center text-2xl bg-white rounded-full text-black cursor-pointer absolute top-6 right-6 px-3 py-2"
                onClick={() => setShowModal(false)}
              >
                x
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <FaCircleCheck className="text-green-600 text-4xl" />
                <span>Good photos</span>
              </div>
              <span className="text-3xl text-wrap">
                Close-up selfies, same subject, variety of background,
                expressions and face angles
              </span>
              <ListImgs photos={goodPhotos} />
              <div className="flex gap-2 items-center">
                <IoIosCloseCircle className="text-red-600" />
                <span>Bad photos</span>
              </div>
              <span className="text-3xl text-wrap">
                Group pics, face small or not visible, sunglass, animal
              </span>
              <ListImgs photos={badPhotos} />
            </div>

            <button
              type="button"
              className="text-3xl px-8 py-4 bg-[#1DB954] rounded-lg"
              onClick={handleUploadImg}
            >
              Upload image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
