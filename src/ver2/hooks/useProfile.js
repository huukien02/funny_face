import { useDispatch } from "react-redux";

import { doUpdateAvatar } from "../redux/actions/userAction";

const useProfile = () => {
  const dispatch = useDispatch();

  const updateProfileAvatar = (data) => {
    dispatch(doUpdateAvatar(data));
  };

  return { updateProfileAvatar };
};

export default useProfile;
