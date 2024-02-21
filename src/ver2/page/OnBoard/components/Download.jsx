import { Link } from "react-router-dom";

function Download() {
  return (
    <>
      <div className="flex justify-center items-center rounded-3xl p-[12px] border-2 border-solid border-gray-600">
        <Link
          className="flex justify-center items-center gap-3 text-white"
          to={
            "https://play.google.com/store/apps/details?id=com.thinkdiffai.futurelove"
          }
        >
          <img
            src="https://i.rada.vn/data/image/2022/08/02/Google-Play-Store-200.png"
            alt=""
            className="max-lg:w-[35px] max-lg:h-[35px] w-[40px] h-[40px] hover:scale-105 transition-all cursor-pointer"
          />
          <div>
            <p className="text-[12px]">Get it on</p>
            <p className="text-[16px]">Google play</p>
          </div>
        </Link>
      </div>
      <div className="flex justify-center items-center p-[12px] rounded-3xl  border-2 border-solid border-gray-600 ">
        <Link
          className="flex justify-center items-center gap-3 text-white"
          to={
            "https://apps.apple.com/us/app/futurelove-ai-love-future/id6463770787"
          }
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg"
            alt=""
            className="max-lg:w-[35px] max-lg:h-[35px] w-[40px] h-[40px] hover:scale-105 transition-all cursor-pointer"
          />
          <div>
            <p className="text-[12px]">Get it on</p>
            <p className="text-[16px]">App store</p>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Download;
