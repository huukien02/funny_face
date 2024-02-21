import { useState } from "react";

const PaginationsButton = ({ page, setPage, totalPages }) => {
  const [hover, setHover] = useState(null);

  let getPages = [];
  for (let i = 1; i <= totalPages; i++) {
    getPages[i - 1] = i;
  }

  return (
    <div className="flex items-center gap-4 text-3xl font-semibold">
      <button
        className={`${
          page === 1 ? "bg-custom-gray text-black" : "bg-white text-black"
        } flex justify-center items-center rounded-full w-12 h-12 font-black`}
        onClick={() => setPage(page > 1 ? page - 1 : page)}
      >
        <span>{"<"}</span>
      </button>
      {getPages
        .slice(page < 3 ? 0 : page - 3, page < 3 ? page + 5 - page : page + 2)
        .map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`${
              page === item || hover === item ? "bg-green-400" : null
            } flex justify-center items-center text-white w-16 h-16 rounded-full`}
            onMouseEnter={() => setHover(item)}
            onMouseLeave={() => setHover(null)}
          >
            <span>{item}</span>
          </button>
        ))}
      <button
        className={`${
          page === totalPages
            ? "bg-custom-gray text-black"
            : "bg-white text-black"
        } flex justify-center items-center w-12 h-12 rounded-full font-black`}
        onClick={() => setPage(page < totalPages ? page + 1 : page)}
      >
        <span>{">"}</span>
      </button>
    </div>
  );
};

export default PaginationsButton;
