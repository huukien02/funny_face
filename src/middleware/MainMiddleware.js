import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../ver2/hooks/useAuth";

const MainMiddleware = () => {
  const { user } = useAuth();

  const isLogin = !!user?.id_user;

  useEffect(() => {
    if (!isLogin) toast.warn("You need to login to do this action!");
  });

  return !isLogin ? <Navigate to="/home" /> : <Outlet />;
};

export default MainMiddleware;
