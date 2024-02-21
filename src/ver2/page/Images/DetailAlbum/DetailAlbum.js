import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import "./DetailAlbum.css";
import useLoading from "../../../hooks/useLoading";
import Header from "../../../components/Header/Header";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const DetailAlbum = ({ event }) => {
  const { setIsLoading } = useLoading();
  // const { id } = useParams();
  // const [data, setData] = useState("");
  // const [image, setImage] = useState("");
  // const [srcImg, setSrcImg] = useState("");

  // const [idUser, setIdUser] = useState(null);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://databaseswap.mangasocial.online/lovehistory/sukien/video/${id}`
  //       );

  //       setIdUser(response.data.sukien_video[0].id_user);
  //       setData(response.data.sukien_video[0]);
  //       setImage(response.data.sukien_video[0].link_vid_swap);
  //       setSrcImg(response.data.sukien_video[0].link_video_goc);
  //       console.log("Image Value:", image);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  const zip = new JSZip();

  const handleDownloadItem = async (img) => {
    setIsLoading(true);
    try {
      const fileName = img.split("/").pop();

      await saveAs(img, fileName);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.log({ err: error.message });
    }
    setIsLoading(false);
  };

  const handleDownloadAllImages = async () => {
    setIsLoading(true);
    try {
      const listSrcTransfered = event["link anh da swap"];
      if (listSrcTransfered.length < 1)
        throw new Error("No swapped image found");

      let count = 0;
      let zipFileName = "images.zip";
      for (const img of listSrcTransfered) {
        const fileName = img.split("/").pop();

        const file = await JSZipUtils.getBinaryContent(img);
        zip.file(fileName, file, { binary: true });
        count++;
        if (count === listSrcTransfered.length) {
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, zipFileName);
          });
        }
      }
    } catch (error) {
      toast.error("Error: " + error.message);
      console.log({ err: error.message });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header
        data={{
          title: "Create an album",
          myCollection: "images/my-images",
          download: true,
        }}
      />
      <div className="image-detail">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-5">
          <div className="flex flex-col gap-4 xl:w-1/3">
            <p className="w-full text-green-400 text-3xl font-semibold">
              Success, this is the result!! Click on image to download...
            </p>

            <div className="detail-info">
              <div className="detail-avatar lg:w-[160px] lg:h-[160px] w-[90px] h-[90px]">
                <Link to={`/profile/${event.sukien_2_image.id_user}`}>
                  <img
                    src={event.sukien_2_image.link_src_goc.replace(
                      "/var/www/build_futurelove/",
                      "https://futurelove.online/"
                    )}
                    alt=""
                    //   className="lg:w-[100%] lg:h-[1000%] w-[80%] h-[80%] object-fill  rounded-full ml-2  mt-6 lg:mt-10 "
                  />
                </Link>
              </div>

              <p className="detail-time mt-4">
                {event.sukien_2_image.thoigian_sukien}
              </p>
            </div>

            <div className="detail-button">
              <button className="detail-btn detail-save" type="button">
                Save to my collection
              </button>
              <div
                className="detail-btn detail-download cursor-pointer"
                onClick={handleDownloadAllImages}
              >
                Download all
              </div>
            </div>
          </div>

          <div className="max-h-[80vh] overflow-y-scroll w-2/3 flex flex-wrap gap-[10px] box-border">
            {event["link anh da swap"].map((item, index) => {
              return (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden relative cursor-pointer w-[calc(100%/2-10px)] sm:w-[calc(100%/3-(20px*2/3))]  md:w-[calc(100%/4-(20px*3/4))] xl:w-[calc(100%/5-(20px*4/5))]"
                  onClick={() => handleDownloadItem(item)}
                >
                  <img
                    src={item}
                    alt="template"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailAlbum;
