import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import useLoading from "./../hooks/useLoading";
import useAuth from "../hooks/useAuth";
import background from "../../ver2/components/image/login/background.png";
import checkIcon from "../../ver2/components/image/login/checkIcon.svg";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Login() {
  const [email, setEmail] = useState(
    localStorage.getItem("funnyface-username") || ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("funnyface-password") || ""
  );
  const [rememberMe, setRememberMe] = useState(
    JSON.parse(localStorage.getItem("rememberMe")) || false
  );
  const [passwordShow, setPasswordShow] = useState(false);

  const navigate = useNavigate();

  const { setIsLoading } = useLoading();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if ([email, password].some((item) => !item || !item.trim())) {
      toast.warn("Email and password must not be blank!");
      return;
    }

    const formData = new FormData();
    formData.append("email_or_username", email);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "https://databaseswap.mangasocial.online/login",
        formData
      );

      if (response.data.message === "Invalid Password!!")
        throw new Error(response.data.message);

      if (response.status === 200) {
        const data = response.data;
        login({
          ...data,
          link_avatar: data.link_avatar.replace(
            "/var/www/build_futurelove/",
            "https://futurelove.online/"
          ),
        });
        localStorage.setItem("user-info", JSON.stringify(data));
        localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
        localStorage.setItem("accessToken", data.token);

        if (rememberMe) {
          localStorage.setItem("funnyface-username", email);
          localStorage.setItem("funnyface-password", password);
        } else {
          localStorage.removeItem("funnyface-username");
          localStorage.removeItem("funnyface-password");
        }

        toast.success("Login success");
        navigate("/");
      }
    } catch (error) {
      toast.error("Account or password is incorrect !!!");
    }
    setIsLoading(false);
  };

  return (
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

      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center gap-5 py-4">
        <div
          className="w-[80%] text-4xl md:text-6xl text-white text-center items-center"
          style={{ fontFamily: "Starborn" }}
        >
          Funny Face
        </div>

        <form
          className="w-[80%] flex flex-col text-white gap-5"
          onSubmit={handleLogin}
        >
          <span className="text-2xl md:text-3xl font-semibold">Login</span>
          <span className="text-xl md:text-2xl">Log in with email address</span>

          <div className="border_input border border-gray-400 pl-4 rounded-lg">
            <div className="text-white flex justify-items-center items-center gap-2">
              <MdEmail className="text-white text-lg md:text-2xl items-start mr-2" />
              <input
                type="text"
                value={email}
                placeholder="Email or username"
                className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between border_pass text-white border border-gray-400 pl-4 rounded-lg">
            <div className="relative flex items-center gap-2 flex-grow-1">
              <FaLock className="text-white text-lg md:text-2xl mr-2" />
              <input
                type={passwordShow ? "text" : "password"}
                value={password}
                placeholder="Password"
                className="py-3 h-full flex-grow-1 border-none outline-none bg-inherit text-2xl"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setPasswordShow(!passwordShow)}
                className="h-full flex justify-center items-center absolute top-0 right-4"
              >
                {passwordShow ? (
                  <FaEye className="text-white text-xl" />
                ) : (
                  <FaEyeSlash className="text-white text-xl" />
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div
              className="flex gap-3 cursor-pointer items-center"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="hidden rounded-lg p-3 text-white bg-inherit border boder-gray-400 mr-4 cursor-pointer"
              />
              <div className="w-[20px] h-[20px] md:w-[28px] md:h-[28px] border boder-gray-400 rounded-lg bg-inherit">
                {rememberMe && (
                  <img
                    src={checkIcon}
                    alt="Check"
                    className="w-full h-full bg-cover"
                  />
                )}
              </div>
              <span className="text-lg md:text-2xl text-white">
                Remember me
              </span>
            </div>

            <button
              type="button"
              className="text-lg md:text-2xl text-green-400"
              onClick={() => navigate("/forgot")}
            >
              Forgot password?
            </button>
          </div>

          <button
            className="bg-green-400 text-white rounded-lg py-3 font-semibold text-2xl"
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>

          <div className="flex items-center w-full mt-4">
            <div className="flex-grow-1 bg-gray-800 h-[1px]" />
            <span className="mx-4 text-white text-xl font-semibold">Or</span>
            <div className="flex-grow-1 bg-gray-800 h-[1px]" />
          </div>

          <div className="flex flex-col justify-center items-center text-white gap-3">
            <div className="flex justify-center items-center gap-3">
              <span className="text-2xl text-gray-400">
                Don't have account?
              </span>
              <button
                type="button"
                className="text-2xl text-green-400"
                onClick={() => navigate("/register")}
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
