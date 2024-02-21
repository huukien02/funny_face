import React from "react";

import useAuth from "../ver2/hooks/useAuth";
import LayoutGuest from "../ver2/layouts/LayoutGuest";
import LayoutUser from "../ver2/layouts/LayoutUser";

const LayoutMiddleware = () => {
  const { user } = useAuth();

  const isLogin = !!user?.id_user;

  return isLogin ? <LayoutUser /> : <LayoutGuest />;
};

export default LayoutMiddleware;
