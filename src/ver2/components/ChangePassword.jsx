import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import useAuth from "../hooks/useAuth";

const ChangePassword = () => {
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);

  const { user } = useAuth();

  const token = user.token;

  const navigate = useNavigate();

  const handleClick1 = () => {
    //  toggle isActive state on click
    setIsActive1((prevState) => !prevState);
  };
  const handleClick2 = () => {
    //  toggle isActive state on click
    setIsActive2((prevState) => !prevState);
  };
  const handleClick3 = () => {
    //  toggle isActive state on click
    setIsActive3((prevState) => !prevState);
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const server = "https://databaseswap.mangasocial.online";
  const onSubmit = async (data) => {
    if (data.newpassword === data.oldpassword)
      return toast.error(
        "The new password cannot be the same as the old password"
      );
    try {
      const res = await fetchChangePassword(
        data.oldpassword,
        data.newpassword,
        user.user_name,
        server,
        user.id_user,
        user.token
      );
      console.log(res);
      if (res.data.ketqua) return toast.error(res.data.ketqua);
      await toast.success("Change password was successful");
      // window.location.reload();
      reset();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChangePassword = async (
    oldPassword,
    newPassword,
    email_or_username,
    server,
    userId,
    token
  ) => {
    let data = new FormData();
    data.append("oldPassword", oldPassword);
    data.append("newPassword", newPassword);
    data.append("email_or_username", email_or_username);
    const changePassword = async (server, userId, data, token) => {
      try {
        const res = await axios.post(
          `${server}/changepassword/${userId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res;
      } catch (error) {
        console.error(error);
        return error;
      }
    };
    try {
      const res = await changePassword(server, userId, data, token);
      console.log(res);
      // Xử lý kết quả response ở đây
    } catch (error) {
      console.error(error);
      // Xử lý lỗi ở đây
    }
  };

  return (
    <div className="h-screen   slab lg:flex lg:items-center">
      <div className="w-[60%] h-[100%] lg:block hidden bg-[#D9D9D9]"></div>
      <div className="w-[40%] h-[100%] absolute right-0 top-0">
        <div className="bg-black flex flex-col w-[100%] h-[100%] z-30 opacity-75 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <div
                className="text-8xl text-white text-center items-center mt-56"
                style={{ fontFamily: "Starborn" }}
              >
                Funny Face
              </div>
              <div className="flex flex-col items-center text-left  mx-16">
                <div className="text-white mt-20 lg:w-[400px] lg:h-[35px] w-[300px] h-[35px]">
                  <div className="text-4xl text-left">Reset Password</div>
                </div>
                <div className="mt-24">
                  <div className="border_input">
                    <div className="input_login flex justify-items-center items-center">
                      <FaLock className="text-white text-2xl mr-2" />
                      <Controller
                        name="oldpassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Old password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Old password must be at least 8 characters long",
                          },
                        }}
                        render={({ field }) => (
                          <div>
                            <input
                              type={isActive1 ? "text" : "password"}
                              {...field}
                              placeholder="Old Password"
                              className="lg:w-[400px] lg:h-[35px] w-[300px] h-[35px] text-white text-2xl"
                            />
                            {errors.oldpassword && (
                              <span className="text-red-600 text-2xl">
                                {errors.oldpassword.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                      <span onClick={handleClick1}>
                        {isActive1 ? (
                          <FaEye className="text-white text-3xl" />
                        ) : (
                          <FaEyeSlash className="text-white text-3xl" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="border_input">
                    <div className="input_login flex justify-items-center items-center">
                      <FaLock className="text-white text-2xl mr-2" />
                      <Controller
                        name="newpassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message:
                              "New password must be at least 8 characters long",
                          },
                          pattern: {
                            value: /^(?!\s*$).+/,
                            message: "New password cannot contain whitespace",
                          },
                        }}
                        render={({ field }) => (
                          <div>
                            <input
                              type={isActive2 ? "text" : "password"}
                              {...field}
                              placeholder="New Password"
                              className="lg:w-[400px] lg:h-[35px] w-[300px] h-[35px] text-white text-2xl"
                            />
                            {errors.newpassword && (
                              <span className="text-red-600 text-2xl">
                                {errors.newpassword.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                      <span onClick={handleClick2}>
                        {isActive2 ? (
                          <FaEye className="text-white text-3xl" />
                        ) : (
                          <FaEyeSlash className="text-white text-3xl" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="border_input">
                    <div className="input_login flex justify-items-center items-center">
                      <FaLock className="text-white text-2xl mr-2" />
                      <Controller
                        name="confirmnewpassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Confirm new password is required",
                          minLength: {
                            value: 8,
                            message:
                              "Confirm new password must be at least 8 characters long",
                          },
                          pattern: {
                            value: /^(?!\s*$).+/,
                            message:
                              "Confirm new password cannot contain whitespace",
                          },
                          validate: (value) => {
                            const newpassword = control._formValues.newpassword;
                            return (
                              value === newpassword || "Passwords do not match"
                            );
                          },
                        }}
                        render={({ field }) => (
                          <div>
                            <input
                              type={isActive3 ? "text" : "password"}
                              {...field}
                              placeholder="Confirm New Password"
                              className="lg:w-[400px] lg:h-[35px] w-[300px] h-[35px] text-white text-2xl"
                            />
                            {errors.confirmnewpassword && (
                              <span className="text-red-600 text-2xl">
                                {errors.confirmnewpassword.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                      <span onClick={handleClick3}>
                        {isActive3 ? (
                          <FaEye className="text-white text-3xl" />
                        ) : (
                          <FaEyeSlash className="text-white text-3xl" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-10 ml-4 ">
                  <button
                    type="submit"
                    className=" rounded-lg mr-[16px] w-[450px] h-[35px] text-white text-4xl bg-[#1DB954] text-center"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
