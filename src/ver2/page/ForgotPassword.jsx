import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import useLoading from "./../hooks/useLoading";
import background from "../../ver2/components/image/login/background.png";
import backIcon from "../../ver2/components/image/login/backIcon.svg";
import { MdEmail } from "react-icons/md";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const handleSendReset = async (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      toast.warn("Please fill your email...");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await axios.post(
        "https://databaseswap.mangasocial.online/reset",
        formData
      );

      if (response.data.message) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      if (error.message === "Request failed with status code 404")
        toast.error("No user found with email you filled");
      else toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="h-screen flex">
        <div className="bg-gradient-to-b from-[#1A542F] to-[#000000] hidden lg:flex w-[55%] h-full justify-center items-center">
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

        <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center gap-10">
          <div
            className="text-4xl md:text-6xl text-white text-center items-center"
            style={{ fontFamily: "Starborn" }}
          >
            Funny Face
          </div>

          <form
            className="w-[80%] flex flex-col text-white gap-5 mt-20"
            onSubmit={handleSendReset}
          >
            <span className="text-2xl md:text-3xl font-semibold">
              Forgot Password
            </span>
            <span className="text-xl md:text-2xl">
              Don't worry, we'll send you the password reset via email.
            </span>

            <div className="border_input border border-gray-400 px-4 py-3 rounded-lg">
              <div className="text-white flex justify-items-center items-center gap-2">
                <MdEmail className="text-white text-xl md:text-2xl items-start mr-2" />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  className="flex-grow-1 border-none outline-none bg-inherit text-2xl"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              className="bg-green-400 text-white rounded-lg py-3 font-semibold text-2xl"
              onClick={(e) => handleSendReset(e)}
            >
              Reset password
            </button>

            <button
              type="button"
              className="flex items-center text-3xl font-semibold text-white self-center gap-2"
              onClick={() => navigate("/login")}
            >
              <img
                src={backIcon}
                alt="Back"
                className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]"
              />
              <span>Back to login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
