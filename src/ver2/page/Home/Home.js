import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import "./Home.css";
import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/useAuth";
import { getVideos } from "../../services/video.service";
import { getEventsByUserId } from "../../services/event.service";
import { getCommentsByUserId } from "../../services/comment.service";
import Header from "../../components/Header/Header";
import { VideoItem } from "../../components/VideoItem/VideoItem";
import EventItem from "../../components/Event/EventItem";
import CommentItem from "../../components/Comment/CommentItem";
import PaginationsButton from "../../components/Paginations/PaginationsButton";

import bannerHome from "../../components/image/home-banner.png";

function Home() {
  const [data, setData] = useState({ videos: [], events: [], comments: [] });
  const [currentPage, setCurrentPage] = useState({
    event: 1,
    comment: 1,
  });
  const [seeMore, setSeeMore] = useState({
    event: false,
    comment: false,
  });

  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { user } = useAuth();
  const userId = user.id_user || 0;

  const pages = {
    event: 100,
    comment: 100,
  };

  const breakpoints = {
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    760: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  };

  const setEventPage = (item) => {
    setCurrentPage({ ...currentPage, event: item });
  };

  const setCommentPage = (item) => {
    setCurrentPage({ ...currentPage, comment: item });
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      try {
        const videoResponse = await getVideos();
        const eventResponse = await getEventsByUserId(
          userId,
          currentPage.event
        );
        const commentResponse = await getCommentsByUserId(
          userId,
          currentPage.comment
        );

        if (
          [videoResponse, eventResponse, commentResponse].some(
            (item) => item.status !== 200
          )
        )
          throw new Error("Error while getting data");

        setData({
          ...data,
          videos: videoResponse?.data.list_sukien_video,
          events: eventResponse?.data.list_sukien,
          comments: commentResponse?.data.comment,
        });
      } catch (err) {
        toast.error(err.message);
      }
      setIsLoading(false);
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const getDataEvents = async () => {
    setIsLoading(true);
    try {
      const eventResponse = await getEventsByUserId(userId, currentPage.event);

      if (eventResponse?.status !== 200)
        throw new Error("Error while getting events data");

      if (eventResponse.data === "exceed the number of pages!!!") {
        setCurrentPage({ ...currentPage, event: 1 });
        throw new Error("Exceed the number of pages!");
      }

      setData({
        ...data,
        events: eventResponse?.data.list_sukien,
      });
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const getDataComments = async () => {
    setIsLoading(true);
    try {
      const commentResponse = await getCommentsByUserId(
        userId,
        currentPage.comment
      );

      if (commentResponse?.status !== 200)
        throw new Error("Error while getting comments data");

      if (commentResponse.data?.message?.includes("exceed")) {
        setCurrentPage({ ...currentPage, comment: 1 });
        throw new Error("Exceed the number of pages!");
      }

      setData({
        ...data,
        comments: commentResponse?.data.comment,
      });
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getDataEvents();
  }, [currentPage.event]);

  useEffect(() => {
    getDataComments();
  }, [currentPage.comment]);

  return (
    <div>
      <Header
        data={{
          background: "#32323280",
          download: true,
        }}
      />

      <div>
        <div className="bg-custom-gray px-6 pb-10 rounded-b-xl">
          <div>
            <div className="flex flex-col-reverse lg:flex-row justify-evenly items-center text-white font-[Quicksand] bg-gradient-to-r from-green-800 via-green-700 to-green-900 rounded-xl py-4 px-20 gap-10">
              <div className="flex flex-col gap-10">
                <div className="hidden lg:flex flex-col gap-5">
                  <span className="text-5xl font-bold uppercase">
                    salient features
                  </span>
                  <span className="text-6xl font-extrabold">
                    AI technology swap faces from your photos and videos.
                  </span>
                </div>
                <button
                  className="bg-white text-black p-4 w-[fit-content] rounded-xl"
                  onClick={() => navigate("/create-video")}
                >
                  <span className="capitalize text-4xl font-semibold">
                    start face swapping
                  </span>
                </button>
              </div>

              <div className="">
                <img src={bannerHome} alt="Banner" className="w-full h-auto" />
              </div>
            </div>

            <div className="flex justify-between items-center text-white py-8">
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold uppercase">
                episodes for you
              </h3>
              <Link to="/videos" className="text-xl md:text-3xl">
                Show all
              </Link>
            </div>

            <Swiper
              slidesPerView={1}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination]}
              breakpoints={breakpoints}
            >
              {data.videos?.map((video, index) => (
                <SwiperSlide key={index} className="cursor-pointer pb-4">
                  <VideoItem {...video.sukien_video[0]} type="video swap" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-11 max-w-full gap-20 lg:gap-10 text-white">
            <div className="grid grid-cols-subgrid grid-cols-1 lg:col-span-7 gap-4">
              <h3 className="uppercase text-2xl md:text-4xl font-semibold">
                Events
              </h3>
              <div className="">
                {data.events
                  ?.slice(0, seeMore.event ? data.events?.length : 5)
                  .map((item) =>
                    item.sukien
                      ?.slice(0, seeMore.event ? item?.length : 1)
                      .map((event, index) => (
                        <EventItem key={index} {...event} />
                      ))
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
              <div className="">
                {data.comments
                  ?.slice(0, seeMore.comment ? data.comments?.length : 5)
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
              <PaginationsButton
                page={currentPage.comment}
                totalPages={pages.comment}
                setPage={setCommentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
