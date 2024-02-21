import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.scss";
import "./container/tailwincss.css";
import "./ver2/css/index.css";

import Loading from "./ver2/components/Loading/Loading";
import LayoutMiddleware from "./middleware/LayoutMiddleware";
import { privateRoutes } from "./routes/privateRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { getMyDetailUser } from "./utils/getDataCommon";

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading);

  useEffect(() => {
    const getIPAddress = async () => {
      try {
        const response = await getMyDetailUser();
        localStorage.setItem("ip", response.ip);
      } catch (error) {
        console.error("Error getting IP address:", error);
        return null;
      }
    };
    getIPAddress();
  }, []);

  return (
    <>
      <Routes>
        {/* <Route path=""> */}
        {publicRoutes}
        {privateRoutes}
        {/* </Route> */}
      </Routes>
      <Loading status={isLoading} />
    </>
  );
}

export default App;
