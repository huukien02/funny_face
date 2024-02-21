import { useEffect, useId, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import {
  uploadImg,
  changeAvatar,
  getUserById,
} from "../../services/user.service";
import { getAllEventsByUserId } from "../../services/event.service";
import { getAllCommentsByUserId } from "../../services/comment.service";

import SideBarMobile from "../../components/SideBar/SideBarMobile";
import EditModal from "./components/EditModal";
import EventItem from "../../components/Event/EventItem";
import CommentItem from "../../components/Comment/CommentItem";
import sideBarIcon from "../../components/image/sideBar/SideBarIcon.svg";
import sideBarIconActive from "../../components/image/sideBar/SideBarIconActive.svg";
import settingIcon from "../../components/image/profile/SettingIcon.svg";
import settingIconActive from "../../components/image/profile/SettingIconActive.svg";
import PaginationsButton from "../../components/Paginations/PaginationsButton";

const MAX_FILE_SIZE = 10485760;

function Profile() {
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalViewEvent, setIsModalViewEvent] = useState(false);
  const [openSideBarMobile, setOpenSideBarMobile] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [hover, setHover] = useState({
    sideBar: false,
    edit: false,
    setting: false,
  });
  const [userView, setUserView] = useState(null);
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    event: 1,
    comment: 1,
  });
  const [seeMore, setSeeMore] = useState({
    event: false,
    comment: false,
  });

  const pages = {
    event: 100,
    comment: 100,
  };

  const setEventPage = (item) => {
    setCurrentPage({ ...currentPage, event: item });
  };

  const setCommentPage = (item) => {
    setCurrentPage({ ...currentPage, comment: item });
  };

  const navigate = useNavigate();
  const labelRef = useRef();
  const inputId = useId();

  const { setIsLoading } = useLoading();
  const { id } = useParams();
  const { user } = useAuth();
  const { updateProfileAvatar } = useProfile();

  const userId = id || user.id_user || 0;

  const setHoverChange = (item) => {
    setHover({ ...hover, ...item });
  };

  const handleAvatarChange = async (e) => {
    setIsLoading(true);
    try {
      const file = e.target.files[0];

      if (!file) throw new Error("Avatar not found");

      if (file.size > MAX_FILE_SIZE) throw new Error("Max file size is 10MB");

      const formData = new FormData();
      formData.append("src_img", file);

      const uploadResponse = await uploadImg(formData);
      const imgUploadSrc = uploadResponse.data;

      if (imgUploadSrc?.message) throw new Error(imgUploadSrc.message);

      formData.append("link_img", imgUploadSrc);
      formData.append("check_img", "upload");

      const response = await changeAvatar(user.id_user, formData);

      if (!response) throw new Error("Change avatar fail");

      const avatarUrl = response.data.link_img;
      updateProfileAvatar(avatarUrl);
      toast.success("Update avatar success");
    } catch (error) {
      toast.error("Error: " + error.message);
    }
    setIsLoading(false);
  };

  const checkUser = async () => {
    if (!!!userId) {
      toast.warn("Login to view your profile");
      navigate("/");
    }

    try {
      const responseUser = await getUserById(id || userId);

      const userInfor = responseUser?.data;

      if (!userInfor?.id_user) throw new Error();

      setUserView({
        ...userInfor,
        link_avatar: userInfor.link_avatar.replace(
          "/var/www/build_futurelove/",
          "https://futurelove.online/"
        ),
      });

      await getEventsAndComments(id || userId);
    } catch (err) {
      toast.warn("Not found user with id " + id);
      navigate("/");
    }
  };

  const getEventsAndComments = async (id) => {
    setIsLoading(true);
    try {
      const responseEvent = await getAllEventsByUserId(id, currentPage.event);
      const responseCmt = await getAllCommentsByUserId(id, currentPage.comment);

      const userEvents = responseEvent?.data;
      const userComments = responseCmt?.data;


      setEvents(userEvents.list_sukien);
      setComments(userComments.comment_user);
    } catch (err) {
      toast.warn("Error while trying to get events & comments: " + err.message);
    }
    setIsLoading(false);
  };

  const getEvents = async (id) => {
    setIsLoading(true);
    try {
      const responseEvent = await getAllEventsByUserId(id, currentPage.event);

      if (responseEvent?.status !== 200)
        throw new Error("Error while getting events data");

      if (responseEvent.data === "exceed the number of pages!!!") {
        setCurrentPage({ ...currentPage, event: 1 });
        throw new Error("Exceed the number of pages!");
      }

      setEvents(responseEvent.data.list_sukien);
    } catch (err) {
      toast.warn(err.message);
    }
    setIsLoading(false);
  };

  const getComments = async (id) => {
    setIsLoading(true);
    try {
      const responseCmt = await getAllCommentsByUserId(id, currentPage.comment);

      if (responseCmt?.status !== 200)
        throw new Error("Error while getting comments data");

      if (responseCmt.data?.message?.includes("exceed")) {
        setCurrentPage({ ...currentPage, comment: 1 });
        throw new Error("Exceed the number of pages!");
      }

      setComments(responseCmt.data.comment_user);
    } catch (err) {
      toast.warn("Error while trying to get comments: " + err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkUser();
  }, [id, user]);

  useEffect(() => {
    getEvents(userId);
  }, [currentPage.event]);

  useEffect(() => {
    getComments(userId);
  }, [currentPage.comment]);

  const closeModalDetail = () => {
    setIsModalDetailOpen(false);
  };

  const openModalDetail = () => {
    setIsModalDetailOpen(true);
  };

  const closeModalViewEvent = () => {
    setIsModalViewEvent(false);
  };

  const openModalViewEvent = () => {
    setIsModalViewEvent(true);
  };




  return (
    <div className="relative bg-custom-gray flex flex-col items-center rounded-lg overflow-hidden font-[Quicksand] gap-3 pb-6">
      <label htmlFor={inputId} ref={labelRef} className="hidden" />
      <input
        id={inputId}
        className="hidden"
        type="file"
        multiple
        accept="image/*"
        onChange={handleAvatarChange}
      />
      <SideBarMobile
        openMenu={openSideBarMobile}
        setOpenMenu={setOpenSideBarMobile}
      />

      <div
        className="block lg:hidden absolute top-6 left-6 cursor-pointer"
        onClick={() => setOpenSideBarMobile(true)}
        onMouseEnter={() => setHoverChange({ sideBar: true })}
        onMouseLeave={() => setHoverChange({ sideBar: false })}
      >

        <img
          src={hover.sideBar ? sideBarIconActive : sideBarIcon}
          alt="Menu"
          className="w-[32px] h-[32px]"
        />
      </div>

      <div className="w-full flex items-start">
        <div className="flex-1 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-xl overflow-hidden h-[230px] flex p-4 rounded-md">
          {/* div 1 */}
          <div className="w-[40%] mx-auto overflow-hidden">
            <div  >
              <div className="flex items-center justify-center h-full">
                <div
                  className="relative w-[100px] h-[100px] rounded-full overflow-hidden hover:bg-neutral-800 cursor-pointer"
                  onClick={() =>
                    user?.id_user !== Number(id) && !!id
                      ? null
                      : labelRef.current?.click()
                  }
                >
                  <img
                    src={userView?.link_avatar || user.link_avatar}
                    alt="Avatar"
                    className="w-full h-full hover:opacity-50"
                  />
                  <div
                    className={`${user?.id_user !== Number(id) && !!id ? "hidden" : null
                      } absolute opacity-50 bottom-0 left-0 flex justify-center items-center w-full bg-neutral-600 text-white`}
                  >
                    Edit
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="text-2xl uppercase tracking-wide text-white font-pacifico-cursive border-b border-white mb-2">
                @{userView?.user_name || user.user_name}
              </div>
              <button onClick={openModalDetail} className="text-xl bg-transparent text-white px-4 py-2 rounded-full border border-white mt-1">
                Detail
              </button>
            </div>
          </div>

          {/* div 2 */}
          <div class="w-[60%] mx-auto flex flex-col justify-center">
            <div class="flex justify-center space-x-4">
              <div class="flex-1 flex flex-col items-center text-white">
                <p class="text-5xl font-tratifico-cursive mb-1">
                  {userView?.count_sukien || user.count_sukien}
                </p>
                <p class="text-xl font-tratifico-cursive">
                  Events
                </p>
              </div>
              <div class="flex-1 flex flex-col items-center text-white">
                <p class="text-5xl font-tratifico-cursive mb-1">
                  {userView?.count_view || user.count_view}
                </p>
                <p class="text-xl font-tratifico-cursive">
                  View
                </p>
              </div>
              <div class="flex-1 flex flex-col items-center text-white">
                <p class="text-5xl font-tratifico-cursive mb-1"> {userView?.count_comment || user.count_comment}</p>
                <p class="text-xl font-tratifico-cursive">Comments</p>
              </div>
            </div>
            <div class="mx-auto mt-4">
              <button onClick={openModalViewEvent} class="bg-white text-black font-bold text-2xl px-4 py-2 rounded-full mb-2">
                View Event
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full flex items-center justify-center gap-4">
          <button className={`py-3 px-6 text-2xl font-semibold rounded-xl ${hover.edit ? "bg-green-400 text-white" : "bg-white text-black"}`} onClick={() => setOpenEditModal(true)} onMouseEnter={() => setHoverChange({ edit: true })} onMouseLeave={() => setHoverChange({ edit: false })} >
            Edit profile
          </button>
          <div className="w-12 h-12 cursor-pointer flex items-center justify-center" onMouseEnter={() => setHoverChange({ setting: true })} onMouseLeave={() => setHoverChange({ setting: false })} >
            <img src={hover.setting ? settingIconActive : settingIcon} alt="Setting" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col px-4 gap-3">
        <div className="flex flex-col gap-3 py-4">
          <div className="w-full h-[2px] bg-gray-400 opacity-20" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-11 max-w-full gap-20 lg:gap-10 text-white">
            <div className="grid grid-cols-subgrid grid-cols-1 lg:col-span-7 gap-10">
              <h3 className="uppercase text-2xl md:text-4xl font-semibold">
                Events
              </h3>
              {!!!events?.length ? (
                <span className="text-xl">You don't have any events yet.</span>
              ) : (
                <div className="">
                  {events?.slice(0, seeMore.event ? events?.length : 5).map(
                    (item, index) => (
                      <EventItem key={index} {...item.sukien[0]} />
                    )
                  )}

                  <div className="flex items-center justify-center py-4">
                    <span
                      className="text-xl text-white hover:opacity-40 cursor-pointer"
                      onClick={() =>
                        seeMore.event
                          ? setSeeMore({ ...seeMore, event: false })
                          : setSeeMore({ ...seeMore, event: true })
                      }
                    >
                      {seeMore.event ? "See less" : "See more"}
                    </span>
                  </div>
                </div>
              )}
              <PaginationsButton
                page={currentPage.event}
                totalPages={pages.event}
                setPage={setEventPage}
              />
            </div>

            <div className="flex flex-col lg:col-span-4 gap-4">
              <h3 className="text-white uppercase text-2xl md:text-4xl font-semibold">
                Comments
              </h3>
              {!!!comments?.length ? (
                <span className="text-xl">
                  You don't have any comments yet.
                </span>
              ) : (
                <div className="">
                  {comments
                    ?.slice(0, seeMore.comment ? comments?.length : 5)
                    .map((comment, index) => (
                      <CommentItem key={index} {...comment} />
                    ))}
                  <div className="flex items-center justify-center py-4">
                    <span
                      className="text-xl text-white hover:opacity-40 cursor-pointer"
                      onClick={() =>
                        seeMore.comment
                          ? setSeeMore({ ...seeMore, comment: false })
                          : setSeeMore({ ...seeMore, comment: true })
                      }
                    >
                      {seeMore.comment ? "See less" : "See more"}
                    </span>
                  </div>
                </div>
              )}
              <PaginationsButton
                page={currentPage.comment}
                totalPages={pages.comment}
                setPage={setCommentPage}
              />
            </div>
          </div>
        </div>
      </div>

      <EditModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        user={user}
        labelRef={labelRef}
      />

      {isModalViewEvent && (
        <div className=" fixed z-50 inset-0 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className=" bg-gradient-to-r from-violet-500 to-fuchsia-400 relative p-10 bg-white w-2/3 rounded-md shadow-lg max-h-screen overflow-y-auto">
            <div className="flex justify-end">
              <button
                onClick={closeModalViewEvent}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {events?.map(
              (item, index) => (
                <div key={index} className="flex p-4 border border-black mt-4 bg-white rounded-2xl">
                  <div className="flex">
                    <img
                      src={item.sukien[0].link_nam_goc}
                      alt="Avatar User1"
                      className="w-32 h-32 rounded-full mx-auto  mt-5"
                    />
                  </div>

                  <div style={{ flex: '70%', padding: '10px' }}>
                    <h2 className="text-4xl text-center font-bold mb-4">
                      {item.sukien[0].ten_su_kien}
                    </h2>

                    <div className="text-3xl mb-4 text-center">
                      <p>{item.sukien[0].noi_dung_su_kien}</p>
                    </div>

                    <div className="mb-4 text-right">
                      <p>{item.sukien[0].real_time}</p>
                    </div>
                  </div>

                  <div className="flex">
                    <img
                      src={item.sukien[0].link_nu_goc}
                      alt="Avatar User2"
                      className="w-32 h-32 rounded-full mx-auto mt-5"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {isModalDetailOpen && (
        <div className="fixed z-50 inset-0 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative p-10 bg-white w-1/3 rounded-md shadow-lg">
            <div className="flex justify-end">
              <button
                onClick={closeModalDetail}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6">
              <h2 className="text-3xl font-bold mb-4">Details User</h2>
              <div>
                <p className="text-2xl text-gray-700">
                  <strong>User : </strong>
                  {user?.user_name}
                </p>
                <p className="text-2xl text-gray-700">
                  <strong>Email : </strong>
                  {user?.email}
                </p>
                <p className="text-2xl text-gray-700">
                  <strong>IP : </strong>
                  {user?.ip_register}
                </p>
                <p className="text-2xl text-gray-700">
                  <strong>Device : </strong> {user?.device_register}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModalDetail}
                className="text-2xl bg-blue-500 text-white px-4 py-2 rounded text-xl"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
