import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

import { getUserById } from "../../services/user.service";
import firstDateBgr from "../../components/image/first-date.png";
import commentIcon from "../../components/image/comment.png";
import viewIcon from "../../components/image/view.png";
import commentWhiteIcon from "../../components/image/comment-white.png";
import shareIcon from "../../components/image/share.png";

function Eventitem({
  id_user,
  id,
  count_comment,
  count_view,
  ten_su_kien,
  noi_dung_su_kien,
  link_da_swap,
}) {
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await getUserById(id_user);

      if (response.status !== 200)
        throw new Error("Error while getting user infor of event");

      const userInfor = response.data;

      setUser({
        ...userInfor,
        link_avatar: userInfor.link_avatar.replace(
          "/var/www/build_futurelove/",
          "https://futurelove.online/"
        ),
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex gap-2 items-center cursor-pointer">
        <img
          loading="lazy"
          src={user.link_avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <span className="text-2xl text-white font-medium">
          {user.user_name}
        </span>
      </div>

      <div
        className="flex flex-col-reverse xl:flex-row justify-center items-center rounded-xl bg-gradient-to-tl from-red-50 to-pink-300 px-4 sm:px-10 py-5 text-black gap-4 cursor-pointer"
        onClick={() => navigate(`/events/${id}/1`)}
      >
        <div className="max-w-full xl:max-w-[40%] flex flex-col gap-4 items-center xl:items-start">
          <span className="text-xl sm:text-3xl font-bold starborn">
            {ten_su_kien}
          </span>
          <p className="max-w-[80%] text-lg sm:text-xl font-medium">
            {noi_dung_su_kien}
          </p>
          <div className="flex gap-5">
            <div className="flex gap-3">
              <img
                loading="lazy"
                src={commentIcon}
                alt="Comment"
                className="w-8 h-8"
              />
              {count_comment}
            </div>

            <div className="flex gap-3">
              <img
                loading="lazy"
                src={viewIcon}
                alt="View"
                className="w-8 h-8"
              />
              {count_view}
            </div>
          </div>
        </div>

        <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]">
          <img
            loading="lazy"
            src={firstDateBgr}
            alt="Date"
            className="absolute top-0 left-0 z-20"
          />
          <img
            loading="lazy"
            src={link_da_swap}
            alt="Result"
            className="absolute top-[25px] left-[25px] sm:top-[35px] sm:left-[35px] w-[110px] h-[110px] sm:w-[140px] sm:h-[140px]"
          />
        </div>
      </div>

      <div className="flex gap-3 py-3">
        <div
          className="flex gap-2 items-center cursor-pointer hover:opacity-60"
          onClick={() => navigate(`/events/${id}/1`)}
        >
          <img loading="lazy" src={commentWhiteIcon} alt="Comment" />
          <span className="text-xl">Comment</span>
        </div>
        <CopyToClipboard text={`https://funface.online/events/${id}/1`}>
          <div
            className="flex gap-2 items-center cursor-pointer hover:opacity-60"
            onClick={() => toast.success("Copied link to clipboard!")}
          >
            <img loading="lazy" src={shareIcon} alt="Comment" />
            <span className="text-xl">Share</span>
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export default Eventitem;
