import { createBrowserHistory } from "history";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./EventHistory.css";

import addsquare from "../../components/image/add-square.png";
import commentwhite from "../../components/image/comment-white.png";
import comment from "../../components/image/comment.png";
import firstdate from "../../components/image/first-date.png";
import share from "../../components/image/share.png";
import view from "../../components/image/view.png";

import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useAuth from "../../hooks/useAuth";

function EventHistory(props) {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const history = createBrowserHistory();
  const navigate = useNavigate();
  const [count, setCount] = useState(1);

  // const [user, setUser] = useState([])

  const { user } = useAuth();

  const idUser = user.id_user || 0;

  const handlePageChange = (e) => {
    e.preventDefault();
    const page = Number.parseInt(e.target.innerText);

    // Kiểm tra giới hạn trang để đảm bảo rằng trang không vượt quá giới hạn
    const newPage = Math.min(Math.max(1, page), totalPages);

    setCount(newPage);
    navigate(`/event/${newPage}`);
  };

  const resultsPerPage = 3;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://databaseswap.mangasocial.online/lovehistory/page/${
          id ? id : count
        }?id_user=${idUser}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await response.json();
      const updatedData = jsonData.list_sukien.map((item) => {
        if (item.sukien.length === 0) {
          return { ...item, nodata: true };
        }

        return item;
      });

      setData(updatedData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const changePageUp = () => {
    if (!id) {
      if (count < 200) {
        const newCount = count + 1;
        setCount(newCount);
        navigate(`/event/${newCount}`);
      }
    } else {
      const numericId = parseInt(id, 10); // Chuyển đổi id thành số nguyên
      if (!isNaN(numericId) && numericId < 200) {
        const newId = numericId + 1;
        setCount(newId);
        navigate(`/event/${newId}`);
      }
    }
  };

  const changePageDown = () => {
    if (!id) {
      if (count > 1) {
        const newCount = count - 1;
        setCount(newCount);
        navigate(`/event/${newCount}`);
      }
    } else {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId) && numericId > 1) {
        const newId = numericId - 1;
        setCount(newId);
        navigate(`/event/${newId}`);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [count, id]);

  useEffect(() => {
    const loadingTypes = [
      "bars",
      "bubbles",
      "spinningBubbles",
      "spin",
      "cubes",
      "balls",
      "spokes",
      "cylon",
    ];
    fetchData();

    const randomIndex = Math.floor(Math.random() * loadingTypes.length);
    const randomType = loadingTypes[randomIndex];
    setLoadingType(randomType);
  }, []);

  const handleEventHistory = (idsk) => {
    history.push({
      pathname: `/events/${idsk}/1`,
    });

    window.location.reload();
  };

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.real_time);
    const dateB = new Date(b.real_time);
    return dateB - dateA;
  });

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = sortedData.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(sortedData.length / resultsPerPage);

  const [paginates, setPaginates] = useState([1, 2, 3]);

  return isLoading ? (
    <div className="flex items-center justify-center h-full">
      <div className="loader-container">
        <ReactLoading type={loadingType} color="#000000" />
        <p className="mt-4 text-3xl text-gray-500">Loading...</p>
      </div>
    </div>
  ) : (
    <div className="events-history">
      <div className="events-history-main">
        {currentResults.map((array, index) => (
          <div className="event-history-item" key={index}>
            <div className="event-history-user">
              <div className="event-user__avatar">
                <img src={user.link_avatar} alt="avatar" />
              </div>
              <h4 className="event-user__name">{user.user_name}</h4>
            </div>

            <div
              className="event-history-marry"
              onClick={() =>
                handleEventHistory(
                  array.sukien[array.sukien.length - 1].id_toan_bo_su_kien,
                  array.sukien[array.sukien.length - 1].id_template
                )
              }
            >
              <div className="event-marry__info">
                <h3>{array.sukien[array.sukien.length - 1].ten_su_kien}</h3>
                <p>{array.sukien[array.sukien.length - 1].noi_dung_su_kien}</p>

                <div className="event-marry__view">
                  <div>
                    <img src={comment} alt="" />
                    <span>
                      {array.sukien[array.sukien.length - 1].count_comment}
                    </span>
                  </div>
                  <div>
                    <img src={view} alt="" />
                    <span>
                      {array.sukien[array.sukien.length - 1].count_view}
                    </span>
                  </div>
                </div>
                <time className="event-marry__times">
                  {array.sukien[array.sukien.length - 1].real_time}
                </time>
              </div>

              <div className="event-marry__image">
                <img className="image1" src={firstdate} alt="" />
                <img
                  className="image2"
                  src={array.sukien[array.sukien.length - 1].link_da_swap}
                  alt=""
                />
              </div>
            </div>

            <div className="event-history-interact">
              <div>
                <img src={commentwhite} alt="" />
                <a href="#">Comment</a>
              </div>

              <div>
                <img src={addsquare} alt="" />
                <a href="#">follow</a>
              </div>

              <div>
                <img src={share} alt="" />
                <a href="#">share</a>
              </div>
            </div>

            {currentResults.length - 1 !== index && <hr />}
          </div>
        ))}
      </div>

      <ul className="event-history-pagination">
        <li className="pagination-item arrow-link">
          <a
            className="pagination-link"
            href="#"
            onClick={() => changePageDown()}
          >
            <ArrowBackIosNewIcon />
          </a>
        </li>

        {paginates.map((number) => (
          <li
            className={`pagination-item ${number === count ? "active" : ""}`}
            key={number}
          >
            <a className="pagination-link" href="#" onClick={handlePageChange}>
              {number}
            </a>
          </li>
        ))}

        <li
          className="pagination-item arrow-link"
          onClick={() => changePageUp()}
        >
          <a className="pagination-link" href="#">
            <ArrowForwardIosIcon />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default EventHistory;
