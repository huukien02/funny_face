import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./DetailVideo.css";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import useLoading from "../../../hooks/useLoading";
import Header from "../../../components/Header/Header";
import { getUserById } from "../../../services/user.service";

const DetailVideo = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [video, setVideo] = useState("");
  const [videoGoc, SetVideoGoc] = useState("");
  const [user, setUser] = useState(null);

  const { setIsLoading } = useLoading();

  const zip = new JSZip();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseEvent = await axios.get(
          `https://databaseswap.mangasocial.online/lovehistory/sukien/video/${id}`
        );

        const userId = responseEvent.data.sukien_video[0].id_user;

        const responseUser = await getUserById(userId);

        setUser(responseUser.data);
        setData(responseEvent.data.sukien_video[0]);
        setVideo(responseEvent.data.sukien_video[0].link_vid_swap);
        SetVideoGoc(responseEvent.data.sukien_video[0].link_video_goc);
        console.log(responseEvent.data);
      } catch (error) {
        toast.error(error.message);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleShare = async () => {
    toast.success("Copied to your clipboard!");
  };

  const handleDownloadVideo = async () => {
    setIsLoading(true);
    try {
      const fileName = video.split("/").pop();

      await saveAs(video, fileName);
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
          title: "create a video",
          myCollection: "videos/my-videos",
          download: true,
        }}
      />
      <div className="video-detail">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-5">
          <div className="flex flex-col gap-4 xl:w-1/3">
            <p className="w-full text-green-400 text-3xl font-semibold">
              Success, this is the result!!
            </p>

            <div className="flex flex-col items-center gap-4 text-white">
              <div className="lg:w-[200px] lg:h-[200px] w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white">
                <Link to={`/profile/${user?.id_user}`}>
                  <img
                    src={data.link_image}
                    alt=""
                    className="w-full h-full bg-cover"
                  />
                </Link>
              </div>

              <Link
                to={`/profile/${user?.id_user}`}
                className="text-4xl hover:opacity-40"
              >
                {user?.user_name}
              </Link>
              <p className="text-3xl">{data.ten_su_kien}</p>
              <p className="text-2xl text-gray-400">{data.thoigian_taosk}</p>
            </div>

            <div className="flex flex-col gap-3">
              <CopyToClipboard
                text={`https://funface.online/videos/detail-video/${id}`}
              >
                <button
                  type="button"
                  className="hidden md:block p-4 rounded-xl bg-white text-black text-2xl md:text-4xl"
                  onClick={handleShare}
                >
                  Share
                </button>
              </CopyToClipboard>
              <button
                className="hidden md:block p-4 rounded-xl bg-green-400 text-white text-2xl md:text-4xl"
                type="button"
                onClick={handleDownloadVideo}
              >
                Download video
              </button>
            </div>
          </div>

          <div className="xl:w-2/3 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 detail-video-item">
              <video className="" controls key={id} src={video}></video>
            </div>

            <div className="w-full md:w-1/2 detail-video-item">
              <video className="" controls key={id} src={videoGoc}></video>
            </div>

            <CopyToClipboard
              text={`https://funface.online/videos/detail-video/${id}`}
            >
              <button
                type="button"
                className="block md:hidden p-4 rounded-xl bg-white text-black text-2xl md:text-4xl"
                onClick={handleShare}
              >
                Share
              </button>
            </CopyToClipboard>
            <button
              className="block md:hidden p-4 rounded-xl bg-green-400 text-white text-2xl md:text-4xl"
              type="button"
              onClick={handleDownloadVideo}
            >
              Download video
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailVideo;
