import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useEventStore from "../../../utils/store";
import no_avatar from "../../components/image/no-avatar.png";

import "./CommentsHistory.css";
import useAuth from "../../hooks/useAuth";

function CommentsHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const setEvent = useEventStore((state) => state.setEvent);
  const [countCM, setCountCM] = useState(1);
  const navigate = useNavigate();

  const { user } = useAuth();

  let idUser = user.id_user || 0;

  function getTime(time_core) {
    const providedTime = new Date(time_core); // Lưu ý: Tháng bắt đầu từ 0 (0 - 11)
    const currentTime = new Date();
    // Tính khoảng thời gian (tính bằng mili giây)
    const timeDifference = currentTime - providedTime;
    // Chuyển đổi khoảng thời gian từ mili giây sang phút
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    // Tính số ngày, giờ và phút
    const days = Math.floor(minutesDifference / (60 * 24));
    const hours = Math.floor((minutesDifference % (60 * 24)) / 60);
    const minutes = minutesDifference % 60;
    // Tạo kết quả dựa trên số ngày, giờ và phút
    let result = "";
    if (days > 0) {
      result = `${days} days`;
    } else if (hours > 0) {
      result = `${hours} hours`;
    } else {
      result = `${minutes} minutes`;
    }
    return result;
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://databaseswap.mangasocial.online/lovehistory/pageComment/${countCM}?id_user=${idUser}`
      );
      const comments = res.data.comment;

      if (res.data.message) {
        // In ra thông báo từ response.message nếu có
        toast.error(`${res.data.message}`);
      } else {
        // Nếu không có thông báo, tiếp tục xử lý dữ liệu như bình thường
        setData(comments);
        setEvent(res.data);
        const ipAddress = comments.dia_chi_ip; // Lấy địa chỉ IP từ dữ liệu response
        console.log(`Địa chỉ IP của bạn là: ${ipAddress}`);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Có lỗi khi lấy dữ liệu:", error.message);
      // Thêm mã xử lý lỗi nếu cần thiết
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [countCM]);

  const handlePageChange = (page) => {
    // Kiểm tra giới hạn trang để đảm bảo rằng trang không vượt quá giới hạn
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCountCM(newPage);
  };

  const dataSort = data.sort((a, b) => {
    const dateA = new Date(a.thoi_gian_release);
    const dateB = new Date(b.thoi_gian_release);

    return dateB - dateA;
  });

  const visitEventComment = (id, stt) => {
    navigate(`/events/${id}/${stt}`);
  };

  const totalPages = 100;
  // Show cmt
  const [showMoreStates, setShowMoreStates] = useState({});
  const showCmt = (id) => {
    setShowMoreStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return !isLoading ? (
    <div className="comments">
      <div className="comments-main">
        <h3 className="comment-title">comments</h3>
        <ul className="comment-list">
          {dataSort.map((data, i) => {
            const isShowingFullText = showMoreStates[data.id_comment];
            return (
              <li className="comment-item" key={i}>
                <div className="comment-avatar">
                  {data.avatar_user && data.avatar_user.startsWith("http") ? (
                    <Link
                      to={data.id_user === 0 ? "" : `/profile/${data.id_user}`}
                    >
                      <img src={data.avatar_user} alt="This is a avatar!" />
                    </Link>
                  ) : (
                    <Link
                      to={data.id_user === 0 ? "" : `/profile/${data.id_user}`}
                    >
                      <img src={no_avatar} alt="" className="" />
                    </Link>
                  )}
                </div>

                <div
                  className="comment-content"
                  onClick={() =>
                    visitEventComment(
                      data.id_toan_bo_su_kien,
                      data.so_thu_tu_su_kien
                    )
                  }
                >
                  <h3 className="comment-avatar__name">{data.user_name}</h3>

                  <p className="comment-content__p">
                    {isShowingFullText
                      ? data.noi_dung_cmt
                      : `${data.noi_dung_cmt.substring(0, 260)}`}

                    {data.noi_dung_cmt.length > 256 && (
                      <span
                        className="text-lg hover:underline"
                        onClick={() => showCmt(data.id_comment)}
                        style={{ color: "blue" }}
                      >
                        {isShowingFullText ? "UnLess" : "Show more"}
                      </span>
                    )}
                  </p>

                  <time className="comment-content__time">
                    {getTime(data.thoi_gian_release)}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="comment-pagination overflow-auto d-none">
        <div className="pagination text-4xl flex justify-start items-center my-6">
          <button
            onClick={() => handlePageChange(countCM - 1)}
            disabled={countCM === 1}
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
              className={`mx-1 text-white font-medium py-2 px-3 rounded ${
                countCM === index + 1 ? "bg-red-700" : "bg-[#ff9f9f]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(countCM + 1)}
            disabled={countCM === totalPages}
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
    </div>
  ) : (
    <div className=" text-center flex rounded-[36px] mx-3 slab h-max">
      Loading...
    </div>
  );
}

export default CommentsHistory;
