import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import useAuth from "../ver2/hooks/useAuth";

const AuthMiddleware = () => {
  const { user } = useAuth();

  const isLogin = !!user?.id_user;

  return isLogin ? <Navigate to="/" /> : <Outlet />;
};

export default AuthMiddleware;
