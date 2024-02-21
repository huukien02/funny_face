import React, { useEffect, useState } from "react";
import "./ClockEvent.css";

function Clock({ data }) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (data) {
      const countdownDate = new Date(data);
      startCountdown(countdownDate);
    }
  }, [data]);

  const startCountdown = (startDate) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - startDate.getTime();

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col items-center relative">
        <div className="lg:w-[100px] lg:h-[86px] w-[67.95px] h-[76px] relative mx-2">
          <div className="w-full h-1/2 bg-white absolute top-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 bottom-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 bottom-1"></div>
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 h-full flex justify-center items-center">
            <span className="text-[#ff8080] font-bold text-[36px] lg:text-[50px] my-3">
              {countdown.days}
            </span>
          </div>
          <div className="w-full bg-[#24475B] absolute h-[2px] top-[calc(50%-1px)] z-10">
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -left-1 -top-[2px]"></div>
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -right-1 -top-[2px]"></div>
          </div>
          <div className="w-full h-1/2 bg-white absolute bottom-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 top-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 top-1"></div>
          </div>
        </div>
        <span className="text-[12px] font-semibold text-[#ff8080] absolute bottom-1 uppercase">
          Days
        </span>
      </div>

      <div className="flex flex-col items-center relative gap-3">
        <div className="lg:w-[100px] lg:h-[86px] w-[67.95px] h-[76px] relative mx-2">
          <div className="w-full h-1/2 bg-white absolute top-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 bottom-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 bottom-1"></div>
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 h-full flex justify-center items-center">
            <span className="text-[#ff8080] font-bold text-[36px] lg:text-[50px]  my-3">
              {countdown.hours}
            </span>
          </div>
          <div className="w-full bg-[#24475B] absolute h-[2px] top-[calc(50%-1px)] z-10">
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -left-1 -top-[2px]"></div>
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -right-1 -top-[2px]"></div>
          </div>
          <div className="w-full h-1/2 bg-white absolute bottom-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 top-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 top-1"></div>
          </div>
        </div>
        <span className="text-[12px] font-semibold text-[#ff8080] absolute bottom-1 uppercase">
          Hours
        </span>
      </div>

      <div className="flex flex-col items-center relative gap-3">
        <div className="lg:w-[100px] lg:h-[86px] w-[67.95px] h-[76px] relative mx-2">
          <div className="w-full h-1/2 bg-white absolute top-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 bottom-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 bottom-1"></div>
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 h-full flex justify-center items-center">
            <span className="text-[#ff8080] font-bold text-[36px] lg:text-[50px]  my-3">
              {countdown.minutes}
            </span>
          </div>
          <div className="w-full bg-[#24475B] absolute h-[2px] top-[calc(50%-1px)] z-10">
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -left-1 -top-[2px]"></div>
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -right-1 -top-[2px]"></div>
          </div>
          <div className="w-full h-1/2 bg-white absolute bottom-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 top-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 top-1"></div>
          </div>
        </div>
        <span className="text-[12px] font-semibold text-[#ff8080] absolute bottom-1 uppercase">
          Minutes
        </span>
      </div>

      <div className="flex flex-col items-center relative gap-3">
        <div className="lg:w-[100px] lg:h-[86px] w-[67.95px] h-[76px] relative mx-2">
          <div className="w-full h-1/2 bg-white absolute top-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 bottom-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[rgb(255,128,128)] absolute right-2 bottom-1"></div>
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 h-full flex justify-center items-center">
            <span className="text-[#ff8080] font-bold text-[36px] lg:text-[50px]  my-3">
              {countdown.seconds}
            </span>
          </div>
          <div className="w-full bg-[#24475B] absolute h-[2px] top-[calc(50%-1px)] z-10">
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -left-1 -top-[2px]"></div>
            <div className="absolute bg-[#24475b] h-2 w-2 rounded-full -right-1 -top-[2px]"></div>
          </div>
          <div className="w-full h-1/2 bg-white absolute bottom-0 rounded-[8px] flex items-end justify-between">
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute left-2 top-1"></div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#ff8080] absolute right-2 top-1"></div>
          </div>
        </div>
        <span className="text-[12px] font-semibold text-[#ff8080] absolute bottom-1 uppercase">
          Secs
        </span>
      </div>
    </div>

    // <div className="clock">
    //   <div className="clock-item">
    //     <div className="clock-number">{countdown.days}</div>
    //     <div className="clock-name">days</div>
    //     <span className="dash"></span>
    //   </div>
    // </div>
  );
}

export default Clock;
