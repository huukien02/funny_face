import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./VideoItem.css";

export const VideoItem = (props) => {
  const { type } = props;
  const videoRef = useRef();
  const [height, setHeight] = useState("450px");

  useEffect(() => {
    const width = videoRef.current?.offsetWidth;
    setHeight(Math.trunc(width * 1.4));
  }, [videoRef.current]);

  return (
    <li className="component-video">
      <div className="component-video-wrap">
        <Link
          to={
            type === "video swap"
              ? `/videos/detail-video/${props?.id_video}`
              : `/videos/make-video?link=${props?.link_video}&id=${props?.id}`
          }
        >
          <video style={{ height }} preload="metadata" controls ref={videoRef}>
            <source
              src={
                type === "video swap" ? props?.link_vid_swap : props?.link_video
              }
              type="video/mp4"
            />
          </video>

          <div className="component-video-link">
            <h3>
              {type === "video swap" ? props?.ten_su_kien : props?.noi_dung}
            </h3>
            {type === "video swap" && (
              <p className="">{props?.thoigian_taosk}</p>
            )}
          </div>
        </Link>
      </div>
    </li>
  );
};
