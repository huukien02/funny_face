import { useState } from "react";
import { useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import SidebarLink from "./components/SideBarLink";
import searchIcon from "../../components/image/sideBar/SearchIcon.svg";
import homeIcon from "../../components/image/sideBar/HomeIcon.svg";
import homeIconActive from "../../components/image/sideBar/HomeIconActive.svg";
import heartIcon from "../../components/image/sideBar/HeartIcon.svg";
import heartIconActive from "../../components/image/sideBar/HeartIconActive.svg";
import eventIcon from "../../components/image/sideBar/EventIcon.svg";
import eventIconActive from "../../components/image/sideBar/EventIconActive.svg";
import videoPlaylistIcon from "../../components/image/sideBar/VideoPlaylistIcon.svg";
import videoPlaylistIconActive from "../../components/image/sideBar/VideoPlaylistIconActive.svg";
import imagePlaylistIcon from "../../components/image/sideBar/ImagePlaylistIcon.svg";
import imagePlaylistIconActive from "../../components/image/sideBar/ImagePlaylistIconActive.svg";
import createVideoIcon from "../../components/image/sideBar/CreateVideoIcon.svg";
import createVideoIconActive from "../../components/image/sideBar/CreateVideoIconActive.svg";
import createImageIcon from "../../components/image/sideBar/CreateImageIcon.svg";
import createImageIconActive from "../../components/image/sideBar/CreateImageIconActive.svg";
import babyIcon from "../../components/image/sideBar/BabyIcon.svg";
import babyIconActive from "../../components/image/sideBar/BabyIconActive.svg";
import helpIcon from "../../components/image/sideBar/HelpIcon.svg";
import helpIconActive from "../../components/image/sideBar/HelpIconActive.svg";
import logoutIcon from "../../components/image/sideBar/LogoutIcon.svg";
import logoutIconActive from "../../components/image/sideBar/LogoutIconActive.svg";
import loginIcon from "../../components/image/sideBar/LoginIcon.svg";
import loginIconActive from "../../components/image/sideBar/LoginIconActive.svg";

const SideBarMobile = ({ openMenu, setOpenMenu }) => {
  const [searchKey, setSearchKey] = useState("");

  const location = useLocation();
  const currentPath = location.pathname;

  const { user } = useAuth();

  const handleSearch = () => {};

  if (!openMenu) return null;

  const topMenus = [
    {
      name: "Home",
      icon: homeIcon,
      iconActive: homeIconActive,
      path: "/home",
    },
    {
      name: "Love",
      icon: heartIcon,
      iconActive: heartIconActive,
      path: "/love",
    },
    {
      name: "Events",
      icon: eventIcon,
      iconActive: eventIconActive,
      path: "/events",
    },
    {
      name: "Videos Playlist",
      icon: videoPlaylistIcon,
      iconActive: videoPlaylistIconActive,
      path: "/videos",
    },
    {
      name: "Images Playlist",
      icon: imagePlaylistIcon,
      iconActive: imagePlaylistIconActive,
      path: "/images",
    },
    {
      name: "Create your video",
      icon: createVideoIcon,
      iconActive: createVideoIconActive,
      path: "/create-video",
    },
    {
      name: "Create your image",
      icon: createImageIcon,
      iconActive: createImageIconActive,
      path: "/create-image",
    },
    {
      name: "Baby generator",
      icon: babyIcon,
      iconActive: babyIconActive,
      path: "/genbaby",
    },
  ];

  const botMenus = [
    {
      name: user.id_user ? "Logout" : "Login/Create Account",
      icon: user.id_user ? logoutIcon : loginIcon,
      iconActive: user.id_user ? logoutIconActive : loginIconActive,
      path: user.id_user ? "logout" : "/login",
    },
  ];

  return (
    <div
      className="fixed lg:hidden flex w-screen min-h-screen top-0 left-0 bg-black bg-opacity-20 z-[100]"
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenu(false);
      }}
    >
      <div className="relative bg-custom-gray h-screen flex flex-col justify-between py-10 px-2">
        <button
          className="absolute top-6 right-8 text-white font-bold text-5xl"
          onClick={() => setOpenMenu(false)}
        >
          x
        </button>
        <div className="flex-col gap-10 flex-grow-1 rounded-xl p-4">
          <div className="flex justify-center items-center">
            <span className="text-3xl xl:text-4xl text-white font-bold starborn">
              Funny face
            </span>
          </div>
          <div
            className="bg-gray-900 rounded-xl flex items-center gap-3 px-3 mt-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={searchIcon}
              alt="Search"
              className="cursor-pointer"
              onClick={() => handleSearch()}
            />
            <input
              type="text"
              placeholder="Search"
              name="search"
              id="search"
              value={searchKey}
              className="h-full py-3 outline-none border-none bg-inherit text-lg sm:text-xl text-white"
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <div className="flex flex-col py-4">
            {topMenus.map((item, index) => (
              <SidebarLink
                key={index}
                {...item}
                isActive={!!currentPath.includes(item.path)}
                sideBarHidden={false}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl flex flex-col py-4 px-8">
          {botMenus.map((item, index) => (
            <SidebarLink
              key={index}
              {...item}
              isActive={!!currentPath.includes(item.path)}
              sideBarHidden={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBarMobile;
