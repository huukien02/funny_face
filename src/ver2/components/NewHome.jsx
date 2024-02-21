import React from "react";
import imageInput from "../../ver2/components/image/imageInput.png";
import badPhoto from "../components/image/badPhoto/vuesax/bold/close-circle.png";
import goodPhoto from "../components/image/GoodPhoto/vuesax/bold/tick-circle.png";
const NewHome = () => {
  return (
    <div className="bg-[#32323280] min-h-screen text-white font-sans p-6 flex flex-col items-center ">
      <div className="w-[548px] flex flex-col gap-[50px]">
        <div
          className="w-[231px] h-[231px] bg-contain bg-center bg-no-repeat mx-auto"
          style={{ backgroundImage: `url(${imageInput})` }}
        >
          <input
            type="file"
            accept="image/*"
            className=" z-10 opacity-0 cursor-pointer w-[231px] h-[231px] rounded-[50%] "
          ></input>
        </div>
        <div className="self-start w-full gap-6">
          <h2 className="font-sans font-bold text-3xl flex items-center">
            <img src={goodPhoto} alt="" /> Good Photo
          </h2>
          <p className="font-sans text-lg font-medium">
            Close-up selfies, same subject, variety of background, expressions
            and face angles
          </p>
          <div className="flex h-[100px] mt-6 gap-2 w-full items-stretch">
            <div className="flex-1 bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
          </div>
        </div>
        <div className="self-start w-full gap-6">
          <h2 className="font-sans font-bold  text-3xl flex items-center">
            <img src={badPhoto} alt="" /> Bad Photo
          </h2>
          <p className="font-sans text-lg font-medium">
            Group pics, face small or not visible, sunglass, animal
          </p>
          <div className="flex h-[100px] gap-2 w-full mt-6 items-stretch">
            <div className="flex-1 bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
            <div className="flex-1  bg-white rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHome;
