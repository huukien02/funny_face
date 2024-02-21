import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import DownloadIcon from "@mui/icons-material/Download";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import SideBarMobile from "../SideBar/SideBarMobile";
import "./Header.css";

import sideBarIcon from "../../components/image/sideBar/SideBarIcon.svg";
import sideBarIconActive from "../../components/image/sideBar/SideBarIconActive.svg";
import boysmall from "../image/boy-small.png";
import girlsmall from "../image/girl-small.png";
import Clock from "../ClockEvent/CLockEvent";

const Header = ({ data }) => {
  console.log(data?.myCollection)
  const [isSticky, setSticky] = useState(false);
  const [openSideBarMobile, setOpenSideBarMobile] = useState(false);
  const [sideBarHover, setSideBarHover] = useState(false);

  const { id } = useParams();
  const [dataUser, setDataUser] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  const fetchDataUser = async (id) => {
    try {
      const response = await axios.get(
        `https://databaseswap.mangasocial.online/lovehistory/${id}`
      );
      setDataUser(response.data.sukien[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  const modalShow = (imgUrl = null) => {
    setIsOpenModal(true);
    setImgUrl(imgUrl);
  };
  const modalHide = () => setIsOpenModal(false);

  useEffect(() => {
    id && fetchDataUser(id);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <SideBarMobile
        openMenu={openSideBarMobile}
        setOpenMenu={setOpenSideBarMobile}
      />
      <div
        className="py-[28px] px-[16px] text-white flex flex-col gap-4"
        style={{
          background:
            data?.background ||
            "linear-gradient(91.12deg, #1a542f 21.71%, #355b42 78.53%)",
        }}
      >
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex gap-2 w-full lg:w-[fit-content] mb-4 lg:mb-0">
            <ArrowCircleLeftIcon sx={{ fontSize: 40, color: "#FFFFFF33" }} />
            <ArrowCircleRightIcon sx={{ fontSize: 40, color: "#FFFFFF33" }} />
          </div>

          <div
            className="block lg:hidden cursor-pointer"
            onClick={() => setOpenSideBarMobile(true)}
            onMouseEnter={() => {
              setSideBarHover(true);
            }}
            onMouseLeave={() => {
              setSideBarHover(false);
            }}
          >
            <img
              src={sideBarHover ? sideBarIconActive : sideBarIcon}
              alt="Menu"
              className="w-[32px] h-[32px]"
            />
          </div>

          <div className="flex gap-4 text-xl font-normal">
            {data?.download && (
              <Link to="/download-app" className="cursor-pointer">
                <DownloadIcon
                  sx={{ fontSize: { xs: 24, md: 36 }, color: "#fff" }}
                />
                Download app
              </Link>
            )}
            <NotificationsIcon
              sx={{
                fontSize: { xs: 24, md: 36 },
                color: "#fff",
                cursor: "pointer",
              }}
            />
            <Link to="/profile">
              <AccountCircleIcon
                sx={{ fontSize: { xs: 24, md: 36 }, color: "#fff" }}
              />
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center">
          {data?.title && (
            <h2 className="text-2xl md:text-3xl font-bold uppercase">
              {data.title}
            </h2>
          )}
          {data?.myCollection && (
            <Link
              to={`/${data.myCollection}`}
              className="text-3xl md:text-4xl font-bold"
            >
              My collections
            </Link>
          )}
          {data?.myEvent && (
            <Link to="/events" className="text-3xl md:text-4xl font-bold">
              My events
            </Link>
          )}
        </div>

        {data?.events && (
          <div className="flex flex-col gap-10 pt-[20px] items-center lg:items-start">
            <div className="w-full flex flex-col-reverse lg:flex-row justify-between items-center gap-4">
              <div className="flex mr-[80px]">
                <div className="relative">
                  <div className="relative w-[120px] h-[120px] rounded-full border-4 border-blue-400 bg-gray-400 cursor-pointer">
                    {dataUser?.link_nam_goc && (
                      <img
                        src={dataUser.link_nam_goc}
                        alt="boy root"
                        onClick={() => modalShow(dataUser.link_nam_goc)}
                        className="w-full h-full bg-cover rounded-full"
                      />
                    )}
                    <div className="w-[40px] h-[40px] absolute top-[80%] left-0">
                      <img
                        src={boysmall}
                        alt="Boy"
                        className="w-full h-full bg-cover"
                      />
                    </div>

                    <div className="absolute top-0 left-[80px] w-[120px] h-[120px] rounded-full border-4 border-pink-500 bg-gray-400 cursor-pointer">
                      {dataUser?.link_nu_goc && (
                        <img
                          src={dataUser.link_nu_goc}
                          alt="boy root"
                          onClick={() => modalShow(dataUser.link_nu_goc)}
                          className="w-full h-full bg-cover rounded-full"
                        />
                      )}
                      <div className="w-[40px] h-[40px] absolute top-[80%] right-0 ">
                        <img
                          src={girlsmall}
                          alt="Boy"
                          className="w-full h-full bg-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="events-time">
                <Clock data={dataUser?.real_time} />
              </div>
            </div>
            {data?.id_user && (
              <Link
                to={`/profile/${data?.id_user}`}
                className="text-3xl ml-0 lg:ml-20"
              >
                {data?.user_name}
              </Link>
            )}
          </div>
        )}

        <Modal
          isOpen={isOpenModal}
          onRequestClose={modalHide}
          className="text-black"
          contentLabel="Example Modal"
        >
          <div className="border-[15px] border-white rounded-xl relative h-max w-[500px]">
            <button
              onClick={modalHide}
              className="absolute top-0 right-0 bg-red px-3 py-2 rounded-lg text-white font-semibold capitalize"
            >
              Close
            </button>
            <img
              src={imgUrl}
              alt="Close"
              className="w-full max-h-[80vh] object-cover"
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Header;
