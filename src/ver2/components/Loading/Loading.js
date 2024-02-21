import React from "react";
import ReactLoading from "react-loading";

const Loading = ({ status }) => {
  return status ? (
    <div className="flex justify-center align-items-center fixed top-0 left-0 w-screen h-screen bg-red-500 opacity-30 z-30">
      <ReactLoading type={"bars"} color={"#C0C0C0"} />
    </div>
  ) : null;
};

export default Loading;
