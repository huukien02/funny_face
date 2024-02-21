import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./DetailImage.css";
import Header from "../../../components/Header/Header";
import { Link } from "react-router-dom";

const DetailImage = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [image, setImage] = useState("");
  const [srcImg, setSrcImg] = useState("");

  const [idUser, setIdUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://databaseswap.mangasocial.online/lovehistory/sukien/video/${id}`
        );

        setIdUser(response.data.sukien_video[0].id_user);
        setData(response.data.sukien_video[0]);
        setImage(response.data.sukien_video[0].link_vid_swap);
        setSrcImg(response.data.sukien_video[0].link_video_goc);
        console.log("Image Value:", image);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);
  return (
    <>
      <Header
        data={{
          title: "create a image",
          myCollection: "images/my-images",
          download: true,
        }}
      />
      <div className="image-detail">
        <div className="flex items-center justify-between">
          <div className="w-1/3 detail-user">
            <p className="detail-result">Success, this is the result!!</p>

            <div className="detail-info">
              <div className="detail-avatar lg:w-[160px] lg:h-[160px] w-[90px] h-[90px]">
                <Link to={`/profile/${idUser}`}>
                  <img
                    src={data.link_image}
                    alt=""
                    //   className="lg:w-[100%] lg:h-[1000%] w-[80%] h-[80%] object-fill  rounded-full ml-2  mt-6 lg:mt-10 "
                  />
                </Link>
              </div>

              <p className="detail-name">{data.ten_su_kien}</p>
              <p className="detail-time">{data.thoigian_taosk}</p>
            </div>

            <div className="detail-button">
              <button className="detail-btn detail-save" type="button">
                Save to my collection
              </button>
              <div className="detail-btn detail-download">
                <a href="">Download image</a>
              </div>
            </div>
          </div>

          <div className="w-2/3 detail-main">
            <div className="w-1/2 detail-image-item">
              <video className="" controls key={id} src={image}></video>
            </div>

            <div className="w-1/2 detail-image-item">
              <video className="" controls key={id} src={srcImg}></video>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailImage;
