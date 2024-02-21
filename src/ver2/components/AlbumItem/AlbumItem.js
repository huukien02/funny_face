import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./AlbumItem.css";

export const AlbumItem = (props) => {
  const albumRef = useRef();
  const [height, setHeight] = useState("450px");

  const { type } = props;

  useEffect(() => {
    const width = albumRef.current.offsetWidth;
    setHeight(Math.trunc(width * 1.4));
  }, [albumRef.current]);

  return (
    <li className="component-album">
      <div className="component-album-wrap relative">
        <Link
          to={
            type === "swap"
              ? `/images/detail-album/${props.id_saved}`
              : // : `/images/make-album?link=${props.album}&id=${props.id}`
                `/images/make-album?link=${props.image}&id=${1}`
          }
        >
          <div style={{ height }}>
            <img
              src={type === "swap" ? props.link_da_swap : props.image}
              alt={type}
              loading="lazy"
              ref={albumRef}
              className="w-full h-full bg-cover"
            />
          </div>

          <div className="component-image-link absolute bottom-0 right-0 w-full">
            <h3>{type === "swap" ? props.ten_su_kien : props.thongtin}</h3>
            {type === "swap" && <p className="">{props.thoigian_sukien}</p>}
          </div>
        </Link>
      </div>
    </li>
  );
};
