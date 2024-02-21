import React from "react";
import { Link } from "react-router-dom";
import { DeviceFrameset } from "react-device-frameset";

import Header from "../../components/Header/Header";
import "./Download.css";

import appBackground from "../../components/image/app.png";

function Download() {
  const props = { device: "iPhone X", color: "gold" };

  return (
    <>
      <Header
        data={{
          title: "download",
          download: true,
        }}
      />

      <div className="flex flex-col py-8 gap-10">
        <div className="flex justify-center items-center">
          <DeviceFrameset {...props}>
            <img
              src={appBackground}
              alt="App"
              className="w-full h-full bg-cover"
            />
          </DeviceFrameset>
        </div>
        <div className="flex justify-center gap-4 text-white">
          <Link
            to={
              "https://play.google.com/store/apps/details?id=com.thinkdiffai.futurelove"
            }
            className="flex gap-3 border border-white p-3 rounded-xl"
          >
            <div className="w-10">
              <img
                src="https://i.rada.vn/data/image/2022/08/02/Google-Play-Store-200.png"
                alt="CH Play"
                className="w-full h-full bg-cover"
              />
            </div>

            <div className="">
              <h5 className="text-xl font-semibold">Get it on</h5>
              <h3 className="text-3xl font-bold">Google Play</h3>
            </div>
          </Link>

          <Link
            to={
              "https://apps.apple.com/us/app/futurelove-ai-love-future/id6463770787"
            }
            className="flex gap-3 border border-white p-3 rounded-xl"
          >
            <div className="w-10">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg"
                alt="Appstore"
                className="w-full h-full bg-cover"
              />
            </div>

            <div className="">
              <h5 className="text-xl font-semibold">Get it on</h5>
              <h3 className="text-3xl font-bold">App Store</h3>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Download;
