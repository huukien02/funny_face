import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./GenBaby.css";

import useLoading from "../../hooks/useLoading";
import { loadModels, uploadImage, validImage } from "../../../library/faceapi";
import { createEvent, getMyDetailUser } from "../../../utils/getDataCommon";
import Header from "../../components/Header/Header";

import add from "../../components/image/add.png";
import boysmall from "../../components/image/boy-small.png";
import girlsmall from "../../components/image/girl-small.png";
import iconGenBaby from "../../components/image/icon-genbaby.png";
import imgBg from "../../components/image/love-bg.png";

const GenBaby = () => {
  const [imageBaby, setImageBaby] = useState(null);
  const [isBaby, setIsBaby] = useState(false);

  const { setIsLoading } = useLoading();

  const [showImg, setShowImg] = useState({ imgNam: null, imgNu: null });
  const [sameFace, setSameFace] = useState({
    sameNam: null,
    sameNu: null,
  });
  const [srcImage, setSrcImage] = useState({
    srcNam: null,
    srcNu: null,
  });

  const [name, setName] = useState({ male: "", female: "" });

  const inputNuRef = useRef();
  const inputNamRef = useRef();

  const [filled, setFilled] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => (prev += 2)), 100);
    }
  }, [filled, isRunning]);

  useEffect(() => {
    loadModels();
  }, []);

  const handleChangeName = (e) => {
    setName({ ...name, [`${e.target.name}`]: e.target.value });
  };

  const handleChangeImage = async (e, typeImg = "Nam") => {
    let file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    if (!file) return;

    setIsLoading(true);

    try {
      const res = await validImage(URL.createObjectURL(file));

      if (res.length === 0) {
        resetInput();
        return Swal.fire(
          "Oops...",
          "No faces can be recognized in the photo!!",
          "warning"
        );
      }
      if (res.length > 1) {
        resetInput();
        return Swal.fire(
          "Oops...",
          "Photos must contain only one face!!",
          "warning"
        );
      }

      if (
        sameFace.sameNam === res[0]?.detection?._score ||
        sameFace.sameNu === res[0]?.detection?._score
      ) {
        resetInput();
        return Swal.fire("Oops...", "Photos cannot be the same!!", "warning");
      } else
        setSameFace((prevState) => ({
          ...prevState,
          [`same${typeImg}`]: res[0]?.detection?._score,
        }));

      setIsLoading(false);

      setShowImg({ ...showImg, [`img${typeImg}`]: imageUrl });

      const imageUpload = await uploadImage(file, typeImg);
      if (!imageUpload) return;

      setSrcImage((prev) => ({ ...prev, [`src${typeImg}`]: imageUpload }));
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const handleDownloadImage = async () => {
    setIsLoading(true);
    try {
      const fileName = imageBaby.split("/").pop();

      await saveAs(imageBaby, fileName);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.log({ err: error.message });
    }
    setIsLoading(false);
  };

  const resetInput = () => {
    setIsLoading(false);
    setSrcImage({ srcNam: null, srcNu: null });

    inputNuRef.current.value = "";
    inputNamRef.current.value = "";
    return;
  };

  //   fetch genbaby

  const fetchData = async () => {
    const { srcNam, srcNu } = srcImage;
    const { male, female } = name;

    if (srcNam == null || srcNu == null)
      return Swal.fire("Oops...", "Please choose the image!!", "warning");

    if (male.trim() === "" || female.trim() === "")
      return Swal.fire("Oops...", "Please choose name completed!!", "warning");

    setIsLoading(true);
    setIsRunning(true);

    try {
      const device = await getMyDetailUser();
      const res3 = await createEvent(srcNam, srcNu, device.browser, device.ip);

      if (res3 && res3.error) {
        setIsLoading(false);
        return Swal.fire("Oops...", res3.error, "warning");
      }

      setIsLoading(false);
      toast.success("Upload and save data completed successfully!!");

      const imageBaby = res3.success.sukien_baby[0].link_da_swap;
      setImageBaby(imageBaby);
      setIsBaby(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    setIsRunning(false);
  };

  return (
    <>
      <Header
        data={{
          title: "baby generator",
        }}
      />
      <div
        style={{ backgroundImage: `url(${imgBg})`, minHeight: "100vh" }}
        className="relative bg-no-repeat bg-cover flex flex-col items-center py-[100px] gap-10"
      >
        {isRunning && !isBaby && (
          <div className="fixed top-0 left-0 w-screen h-screen z-50 flex justify-center pt-[200px]">
            <div className="relative z-50 progressbar">
              <div
                style={{
                  height: "100%",
                  width: `${filled}%`,
                  backgroundColor: "#a66cff",
                  transition: "width 0.5s",
                }}
              ></div>
              <span className="progressPercent">{filled}%</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between w-[80%] gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col justify-center items-center gap-4">
              <div
                className="flex items-center justify-center relative w-[130px] h-[130px] rounded-full bg-gray-400 overflow-hidden border-8 border-[#26a5fc] cursor-pointer"
                onClick={() => inputNamRef.current?.click()}
              >
                <img className="w-1/3 h-1/3 bg-cover" src={add} alt="" />

                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat bg-center"
                  style={
                    showImg.imgNam
                      ? { backgroundImage: `url(${showImg.imgNam})` }
                      : null
                  }
                ></div>

                <input
                  onChange={(e) => {
                    handleChangeImage(e, "Nam");
                  }}
                  type="file"
                  accept="image/*"
                  ref={inputNamRef}
                  className="hidden"
                />
              </div>

              <div className="relative">
                <input
                  name="male"
                  onChange={handleChangeName}
                  type="text"
                  placeholder="His name"
                  className="text-center outline-none border-none px-4 py-3 text-3xl text-white placeholder-white font-bold bg-[#26a5fc] rounded-full w-[150px]"
                />
                <div className="absolute top-2 left-[-40px] w-[36px] h-[36px]">
                  <img
                    src={boysmall}
                    alt="Boy"
                    className="w-full h-full bg-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchData()}
            className="w-[100px] md:w-[150px] transition-transform duration-300 hover:scale-125"
          >
            <img
              src={iconGenBaby}
              alt=""
              className="w-full h-auto bg-cover cursor-pointer"
            />
          </button>

          <div className="flex gap-2">
            <div className="flex flex-col justify-center items-center gap-4">
              <div
                className="flex justify-center items-center relative w-[130px] h-[130px] rounded-full bg-gray-400 overflow-hidden border-8 border-[#ff356e] cursor-pointer"
                onClick={() => inputNuRef.current?.click()}
              >
                <img
                  className="w-1/3 h-1/3 bg-cover cursor-pointer bg-no-repeat bg-center"
                  src={add}
                  alt=""
                />

                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover"
                  style={
                    showImg.imgNu
                      ? { backgroundImage: `url(${showImg.imgNu})` }
                      : null
                  }
                ></div>

                <input
                  onChange={(e) => {
                    handleChangeImage(e, "Nu");
                  }}
                  type="file"
                  accept="image/*"
                  ref={inputNuRef}
                  className="hidden"
                />
              </div>

              <div className="relative">
                <input
                  name="female"
                  onChange={handleChangeName}
                  type="text"
                  placeholder="Her name"
                  className="text-center outline-none border-none px-4 py-3 text-3xl text-white placeholder-white font-bold bg-[#ff356e] rounded-full w-[150px]"
                />
                <div className="absolute top-2 left-[-40px] w-[36px] h-[36px]">
                  <img
                    src={girlsmall}
                    alt="Girl"
                    className="w-full h-full bg-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBaby && (
          <div className={`genbaby-canvas`}>
            <div className="genbaby-square">
              <div className="genbaby-square-left" />
              <div className="genbaby-square-right" />
            </div>

            <div className="genbaby-down">
              <span className="genbaby-down-left" />
              <span className="genbaby-down-right" />
            </div>

            <div className="genbaby-canvas-image">
              <img src={imageBaby} alt="image baby" />
            </div>
          </div>
        )}

        <div className="transition-transform duration-300 genbaby-btn hover:scale-125 ">
          {!isBaby ? (
            <button
              onClick={fetchData}
              className="text-2xl md:text-4xl genbaby-btn-start"
            >
              Start
            </button>
          ) : (
            <button
              className="text-2xl md:text-4xl genbaby-btn-download"
              onClick={handleDownloadImage}
            >
              Download image
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GenBaby;
