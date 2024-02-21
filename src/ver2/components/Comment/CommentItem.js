import { useNavigate } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { toast } from "react-toastify";

import anonymousAvatar from "../../components/image/no-avatar.png";

function CommentItem({
  id_user,
  avatar_user,
  user_name,
  id_toan_bo_su_kien,
  so_thu_tu_su_kien,
  noi_dung_cmt,
  thoi_gian_release,
}) {
  const navigate = useNavigate();

  const handleClickUser = () => {
    if (!avatar_user) toast.warn("Anonymous guest!");
    else navigate(`/profile/${id_user}`);
  };

  const handleClickCmt = () => {
    if (!avatar_user) toast.warn("Anonymous guest!");
    else navigate(`/events/${id_toan_bo_su_kien}/${so_thu_tu_su_kien}`);
  };

  return (
    <div className="flex pb-3 gap-3">
      <div
        className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
        onClick={handleClickUser}
      >
        <img
          loading="lazy"
          src={
            avatar_user?.replace(
              "/var/www/build_futurelove/",
              "https://futurelove.online/"
            ) || anonymousAvatar
          }
          alt="Avatar"
          className="w-full h-full bg-cover"
        />
      </div>

      <div className="flex flex-col gap-2 text-white cursor-pointer">
        <span className="text-2xl font-semibold" onClick={handleClickUser}>
          {user_name}
        </span>
        <span className="text-xl font-medium" onClick={handleClickCmt}>
          {noi_dung_cmt}
        </span>
        <span className="text-lg font-light" onClick={handleClickCmt}>
          <ReactTimeAgo date={new Date(thoi_gian_release)} locale="en-US" />
        </span>
      </div>
    </div>
  );
}

export default CommentItem;
