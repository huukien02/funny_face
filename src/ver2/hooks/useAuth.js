import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { doLogin, doLogout } from "../redux/actions/userAction";

const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.account);

  const login = (data) => {
    dispatch(doLogin(data));
  };

  const logout = () => {
    dispatch(doLogout());
  };

  return { user, login, logout };
};

export default useAuth;
