import { Route } from "react-router-dom";

import Home from "../ver2/page/Home/Home";
import ChangePassword from "../ver2/components/ChangePassword";
import ForgotPassword from "../ver2/page/ForgotPassword";
import Login from "../ver2/page/Login";
import Register from "../ver2/page/Register";
import Policy from "../ver2/components/Policy";

import LayoutUser from "../ver2/layouts/LayoutUser";
import LayoutGuest from "../ver2/layouts/LayoutGuest";
import HomeMiddleware from "../middleware/HomeMiddleware";
import AuthMiddleware from "../middleware/AuthMiddleware";
import OnBoard from "../ver2/page/OnBoard/OnBoard";

export const publicRoutes = (
  <>
    <Route path="" element={<HomeMiddleware />}>
      <Route path="" element={<LayoutGuest />}>
        <Route index element={<OnBoard />} />
      </Route>
    </Route>

    <Route path="" element={<LayoutUser />}>
      <Route path="/home" element={<Home />} />
    </Route>

    <Route path="" element={<AuthMiddleware />}>
      <Route path="" element={<LayoutGuest />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<ForgotPassword />} />
        <Route path="reset" element={<ChangePassword />} />
        <Route path="policy" element={<Policy />} />
      </Route>
    </Route>
  </>
);
