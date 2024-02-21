import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const HistoryCommentList = (props) => {
  // console.log(datas);
  const [datas, setDatas] = useState([]);
  const server = "https://databaseswap.mangasocial.online";
  const [currentPage, setCurrentPage] = useState(1);
  const [actionCMT, setActionCMT] = useState({ status: false, value: 0 });
  const [count, setCount] = useState(1);
  const resultsPerPage = 10;
  // const [nameUser, setNameUser] = useState();

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCount(pageNumber);
  };
  useEffect(() => {
    setDatas(props.datas);
  }, [props.datas]);

  const checkId = useParams().id;
  if (!datas || datas == null)
    return (
      <>
        <h2 className="text-center py-6">
          <div
            role="status"
            className="flex justify-center items-center w-full"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </h2>
      </>
    );
  if (datas.length === 0) {
    return (
      <div className="text-center text-3xl text-white h-[150px] w-full py-3">
        No comments yet
      </div>
    );
  }
  const dataSort = datas;

  const deleteComment = async (idComment) => {
    try {
      const response = await axios.delete(
        `${server}/lovehistory/delete/${idComment}`
      );
      toast.success(response.data.message);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // const dataSort = datas.reverse();
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = dataSort.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(dataSort.length / resultsPerPage);
  const changePageUp = () => {
    if (count < totalPages) {
      setCount(count + 1);
      setCurrentPage(count + 1);
      // fetchData();
    }
  };
  const changePageDown = () => {
    if (count > 1) {
      setCount(count - 1);
      setCurrentPage(count - 1);
      //   fetchData();
    }
  };

  //   console.log(datas);
  //   console.log(totalPages);
  // console.log(currentResults);
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
  // const fetchDataUser = async (id_toan_bo_su_kien) => {
  //   try {
  //     const response = await axios.get(
  //       `https://sakaivn.online/lovehistory/${id_toan_bo_su_kien}`
  //     );

  //     setNameUser(response.data.sukien[0].user_name_tao_sk
  //     );
  //     console.log(response.data)

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  return (
    <>
      <div className="flex justify-center">
        <div className="lg:py-7 pr-9  my-16 lg:w-[1200px] w-[350px] mt-8 lg:mt-0 h-fit text-white lg:rounded-[36px] max-lg:py-4 rounded-[10px] text-center font-[Quicksand] items-center content-center">
          {currentResults.map((item, index) => (
            <aside key={index} className="px-4">
              <div className="flex  justify-between border-b border-[#ff000000] hover:border-gray-300 transition-all">
                <div className="max-lg: lg:max-w-[85%]">
                  <Link
                    to={`/detail/${item.id_toan_bo_su_kien}/${item.so_thu_tu_su_kien}`}
                  >
                    <div className="flex py-2 lg:py-3">
                      <div className="lg:hidden">
                        <div className="w-[40px] h-[40px] bg-white overflow-hidden rounded-full">
                          <img
                            src={item.avatar_user}
                            alt="Avatar user notfound"
                            className="w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="max-lg:hidden max-lg:w-[50px] max-lg:h-[50px] lg:w-[80px] lg:h-[80px] rounded-full overflow-hidden">
                        <img
                          src={item.avatar_user}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="max-lg:pl-2 max-lg:pr-2 lg:w-[85%] lg:ml-4 flex flex-col justify-center lg:gap-3 text-left">
                        <h2 className="line-clamp-1 max-lg:text-xl lg:text-2xl font-medium">
                          {checkId !== undefined ? "His" : "You"} commented on
                          the event of{" "}
                          <span className="underline">{item.user_taosk}</span> :
                        </h2>
                        <h5 className="text-3xl ">{item.noi_dung_cmt}</h5>
                        {item.imageattach ? (
                          <img
                            className="w-[60px] h-[50px]"
                            src={item.imageattach}
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="time_btn max-lg:gap-2 lg:gap-3 lg:max-w-[15%]">
                  <span className="font-medium max-lg:text-base text-2xl text-white">
                    {getTime(item.thoi_gian_release)}
                  </span>
                  <div className="btn_dot">
                    <button
                      className="lg:text-[5px] max-lg:text-[3px]"
                      onClick={() =>
                        setActionCMT({
                          status: !actionCMT.status,
                          value: item.id_comment,
                        })
                      }
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_263_36)">
                          <rect
                            x="10.5"
                            y="4.5"
                            width="3"
                            height="3"
                            rx="1.5"
                            fill="white"
                          />
                          <rect
                            x="10.5"
                            y="10.5"
                            width="3"
                            height="3"
                            rx="1.5"
                            fill="white"
                          />
                          <rect
                            x="10.5"
                            y="16.5"
                            width="3"
                            height="3"
                            rx="1.5"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_263_36">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    {actionCMT.status &&
                      actionCMT.value === item.id_comment && (
                        <div className="flex text-lg">
                          <button className="py-1 mr-1 px-3 rounded-lg bg-blue-400 text-white w-full">
                            Edit
                          </button>
                          <button
                            className="py-1 px-3 rounded-lg text-white bg-red-400 "
                            onClick={() => deleteComment(item.id_comment)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </aside>
          ))}
        </div>
      </div>
      <div className="pagination text-4xl flex justify-center my-6">
        <button
          type="button"
          className="py-2 px-3  rounded-full hover:bg-[#ff9f9f8c]"
          onClick={() => changePageDown()}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9997 3.3335C10.8163 3.3335 3.33301 10.8168 3.33301 20.0002C3.33301 29.1835 10.8163 36.6668 19.9997 36.6668C29.183 36.6668 36.6663 29.1835 36.6663 20.0002C36.6663 10.8168 29.183 3.3335 19.9997 3.3335ZM22.983 25.0002C23.4663 25.4835 23.4663 26.2835 22.983 26.7668C22.733 27.0168 22.4163 27.1335 22.0997 27.1335C21.783 27.1335 21.4663 27.0168 21.2163 26.7668L15.333 20.8835C14.8497 20.4002 14.8497 19.6002 15.333 19.1168L21.2163 13.2335C21.6997 12.7502 22.4997 12.7502 22.983 13.2335C23.4663 13.7168 23.4663 14.5168 22.983 15.0002L17.983 20.0002L22.983 25.0002Z"
              fill="white"
              fill-opacity="0.2"
            />
          </svg>
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            type="button"
            className={`mx-3 text-white font-medium py-2 px-4 rounded-full ${
              count === index + 1 ? "bg-[#1DB954]" : "hover:bg-[#ff9f9f8c]"
            }`}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          type="button"
          className="py-2 px-3 rounded-full hover:bg-[#ff9f9f8c]"
          onClick={() => changePageUp()}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9997 3.3335C10.8163 3.3335 3.33301 10.8168 3.33301 20.0002C3.33301 29.1835 10.8163 36.6668 19.9997 36.6668C29.183 36.6668 36.6663 29.1835 36.6663 20.0002C36.6663 10.8168 29.183 3.3335 19.9997 3.3335ZM24.6497 20.8835L18.7663 26.7668C18.5163 27.0168 18.1997 27.1335 17.883 27.1335C17.5663 27.1335 17.2497 27.0168 16.9997 26.7668C16.5163 26.2835 16.5163 25.4835 16.9997 25.0002L21.9997 20.0002L16.9997 15.0002C16.5163 14.5168 16.5163 13.7168 16.9997 13.2335C17.483 12.7502 18.283 12.7502 18.7663 13.2335L24.6497 19.1168C25.1497 19.6002 25.1497 20.4002 24.6497 20.8835Z"
              fill="white"
              fill-opacity="0.5"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default HistoryCommentList;
