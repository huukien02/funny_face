import { Link, useNavigate } from "react-router-dom";

import Download from "./components/Download";
import logo from "../../components/image/onboard/logo.png";
import template1 from "../../components/image/onboard/template1.png";
import template2 from "../../components/image/onboard/template2.png";
import template3 from "../../components/image/onboard/template3.png";
import template4 from "../../components/image/onboard/template4.png";
import template5 from "../../components/image/onboard/template5.png";
import template6 from "../../components/image/onboard/template6.png";
import heartIcon from "../../components/image/onboard/heartIcon.svg";

function OnBoard() {
  const navigate = useNavigate();

  const redirectHome = () => navigate("/home");

  const redirectLogin = () => navigate("/login");

  const redirectSignUp = () => navigate("/register");

  return (
    <div className="w-[100vw] min-h-100vh flex flex-col justify-center items-center py-[30px] gap-[100px]">
      <div className="w-[90%] sm:w-[80%] flex justify-between items-center cursor-pointer">
        <div
          className="max-w-[40%] flex items-center gap-4"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" />
          <span className="text-3xl lg:text-6xl text-white font-bold starborn">
            Funny Face
          </span>
        </div>
        <div className="bg-black flex border border-gray-400 rounded-3xl p-3 text-white font-semibold">
          <button
            className="sm:min-w-[100px] p-3 sm:p-4 text-xl sm:text-4xl"
            onClick={redirectSignUp}
          >
            Sign up
          </button>
          <button
            className="sm:min-w-[100px] p-3 sm:p-4 bg-green-400 rounded-xl text-xl sm:text-4xl"
            onClick={redirectLogin}
          >
            Login
          </button>
        </div>
      </div>

      <div className="w-[80%] flex flex-col justify-between items-center text-white gap-5">
        <div className="w-full flex flex-col md:flex-row justify-between items-center  gap-4">
          <span className="xl:max-w-[40%] text-5xl xl:text-7xl font-semibold">
            Bring any image to video.
          </span>
          <div className="flex flex-col items-center md:items-start gap-4 xl:max-w-[30%]">
            <span className="text-4xl font-semibold">A.I Video</span>
            <span className="text-3xl text-gray-400">
              Predict the future of your journey and love.
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="text-2xl rounded-xl bg-white text-black p-3 font-medium"
                onClick={redirectHome}
              >
                View Demos
              </button>
              <button
                className="text-2xl rounded-xl bg-green-400 p-3 font-semibold"
                onClick={redirectSignUp}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
          <img
            src={template1}
            alt="Template"
            className="w-full sm:w-1/2 bg-cover"
          />
          <img
            src={template2}
            alt="Template"
            className="w-full sm:w-1/2 bg-cover"
          />
        </div>
      </div>

      <div className="max-w-[80%] flex flex-col justify-center items-center font-[Quicksand] text-white gap-5">
        <span className="text-5xl md:text-7xl font-semibold text-gray-400">
          face-swap app
        </span>
        <span className="text-4xl md:text-6xl font-semibold text-center">
          AI technology for fast and easy face swapping
        </span>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="flex flex-col justify-center md:max-w-[40%] gap-5">
            <img
              src={template3}
              alt="Template"
              className="max-w-[80%] h-auto"
            />
            <p className="text-4xl">
              Get ready to be spellbound by the AI technology at FunnyFace. Our
              cutting-edge tech guarantees flawless, natural face swaps,
              seamlessly concealing any traces of editing. Whether aiming for
              humour or a creative spark, our user-friendly AI face swapping
              tool offers unparalleled realism.
            </p>
          </div>
          <div>
            <img src={template4} alt="Template" />
          </div>
        </div>
      </div>

      <div className="max-w-[80%] flex flex-col justify-center items-center font-[Quicksand] text-white gap-5">
        <span className="text-5xl md:text-8xl font-semibold text-gray-400">
          Not just videos.
        </span>
        <span className="text-4xl md:text-7xl font-semibold text-center">
          Create your own photos.
        </span>

        <div className="flex gap-3 pt-10 md:pt-20">
          <Download />
        </div>
      </div>

      <div className="w-[80%] rounded-xl overflow-hidden">
        <img src={template5} alt="Template" className="w-full h-auto" />
      </div>

      <div className="bg-gradient-to-t from-[#32323280] to-[#000000] w-full px-10 flex flex-col lg:flex-row justify-center items-center gap-5 pt-10 md:pt-20">
        <div className="flex flex-col items-center lg:items-start gap-5 font-[Quicksand] text-white">
          <span className="text-4xl xl:text-6xl font-semibold">
            Predict your future events in love
          </span>
          <button
            className="bg-green-400 rounded-xl text-2xl xl:text-3xl py-3 w-[200px] xl:w-[400px] font-semibold"
            onClick={redirectLogin}
          >
            Try now!
          </button>
        </div>
        <img src={template6} alt="Template" />
      </div>

      <div className="flex justify-center items-center font-[Quicksand]">
        <div className="border-2 border-white rounded-full p-[20px] font-semibold flex justify-center items-center gap-3">
          <img src={heartIcon} alt="Heart" />
          <span className="text-white text-4xl md:text-6xl">
            Made with Funny Face
          </span>
        </div>
      </div>

      <div className="w-[80%] border-t-2 border-gray-400 flex flex-col justify-center items-center">
        <div className="min-w-[60%] flex justify-between text-white font-semibold text-3xl md:text-5xl py-14 gap-3">
          <Link className="text-center">Contact Us</Link>
          <Link className="text-center">Term Of Use</Link>
          <Link className="text-center" to="policy">
            Privacy policy
          </Link>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Download />
        </div>
        <div className="flex justify-center items-center mt-10">
          <span className="text-center text-white text-3xl">
            Copyright by Funny face © 2024
          </span>
        </div>
      </div>
    </div>
  );
}

export default OnBoard;
