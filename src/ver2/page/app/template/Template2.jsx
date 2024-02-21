import { useState, useEffect } from "react";
import { useParams } from "react-router";
import CmtPopup from "../CmtPopup";
import Moment from "react-moment";

import bgTemplate2 from "../../../components/image/bg-template2.png";
import frameTemplate2 from "../../../components/image/frame-template2.png";

import comment from "../../../components/image/comment.png";
import view from "../../../components/image/view.png";

import "./Template.css";

function Template2(props) {
  const handleChangeValue = props?.onChangeValue;

  const { stt, id } = useParams();
  const data = props.data;

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  // const user = JSON.parse(window.localStorage.getItem('user-info'))
  // const token = user?.token

  // useEffect(() => {
  //   isOpenPopup && updateView()
  // }, [isOpenPopup])

  // const updateView = async () => {
  //   const formData = new FormData()
  //   formData.append('id_toan_bo_su_kien', id)
  //   formData.append('so_thu_tu_su_kien', stt)

  //   try {
  //     const res = await axios.post(`${SERVER_SAKAIVN}/countview`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })

  //     console.log('update view success!!')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      const ogImageMeta = document.querySelector('meta[property="og:image"]');
      ogImageMeta.setAttribute("content", data?.link_da_swap);
    });
  }, []);

  return (
    <>
      <div
        className={`text-black w-full flex flex-col-reverse gap-4 xl:flex-row justify-between items-center p-[30px] md:p-[50px] rounded-2xl ${
          data ? "cursor-pointer" : "template-empty"
        }`}
        style={{ background: `center/cover no-repeat url(${bgTemplate2})` }}
        onClick={() => {
          setIsOpenPopup(true);
        }}
      >
        <div className="template-main">
          {data ? (
            <>
              <h3 className="template-title">{data.ten_su_kien}</h3>

              <p className="template-text">{data.noi_dung_su_kien}</p>
            </>
          ) : (
            <>
              <input
                className="template-title template-input"
                placeholder="Title here"
                type="text"
                name="title"
                onChange={handleChangeValue}
              />

              <input
                className="template-input template-text"
                placeholder="Content here."
                type="text"
                onChange={handleChangeValue}
                name="content"
              />
            </>
          )}

          <div className="template-icon">
            <div className="template-icon__child">
              <img src={comment} alt="comment" />
              <span>{data?.count_comment || 0}</span>
            </div>

            <div className="template-icon__child">
              <img src={view} alt="view" />
              <span>{data?.count_view || 0}</span>
            </div>
          </div>

          <time>
            {data?.real_time || (
              <Moment format="DD/MM/YYYY">{new Date()}</Moment>
            )}
          </time>
        </div>

        <div className="relative w-[200px] h-[150px] sm:w-[160px] sm:h-[160px]">
          <img
            loading="lazy"
            src={frameTemplate2}
            alt="Date"
            className="w-full h-full bg-cover absolute top-0 left-0 z-20"
          />
          <img
            loading="lazy"
            src={data?.link_da_swap || props.image}
            alt="Result"
            className="absolute top-[15px] left-[55px] sm:top-[15px] sm:left-[40px] w-[110px] h-[110px] sm:w-[56%] sm:h-[120px] rotate-[7deg]"
          />
        </div>
      </div>

      {isOpenPopup && data && (
        <CmtPopup
          setIsOpenPopup={setIsOpenPopup}
          data={data}
          stt={stt}
          TemplateCmt="TemplateCmt2"
        />
      )}
    </>
  );
}

export default Template2;
