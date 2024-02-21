import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../ver2/hooks/useAuth";

const HomeMiddleware = () => {
  const { user } = useAuth();

  const isLogin = !!user?.id_user;

  return isLogin ? <Navigate to="/home" /> : <Outlet />;
};

export default HomeMiddleware;
