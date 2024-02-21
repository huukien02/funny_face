import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Images.css";

import useLoading from "../../hooks/useLoading";
import Paginations from "../../components/Paginations";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import filterApp from "../../components/image/filter-app.png";
import Header from "../../components/Header/Header";
import { ImageItem } from "../../components/ImageItem/ImageItem";
import { AlbumItem } from "../../components/AlbumItem/AlbumItem";

const Images = () => {
  const [category, setCategory] = useState("Albums");
  const [listItems, setListItems] = useState([]);
  const [page, setPage] = useState(1);

  const { setIsLoading } = useLoading();

  const totalPages =
    category === "Albums" ? Math.ceil(listItems.length / 20) : 23;

  const categoryList = ["Albums", "Images"];

  const getData = async () => {
    setIsLoading(true);
    try {
      const albumsApi = `https://api.mangasocial.online/get/list_image/1?album=${1}`;
      const imagesApi = `https://api.mangasocial.online/get/list_image/1?album=${page}`;
      const response = await axios.get(
        category === "Images" ? imagesApi : albumsApi
      );

      if (response.status === 200) {
        setListItems(response.data.list_sukien_video);
        // console.log("list items", response.data);
      }
    } catch (error) {
      toast.error(error.message);
      console.log({ error: error.message });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page, category]);

  const handleChangeCategory = (e) => {
    setPage(1);
    setCategory(e.target.value);
  };

  return (
    <>
      <Header
        data={{
          title: "images",
          myCollection: "images/my-images",
          download: true,
        }}
      />
      <div className="max-h-[100vh] overflow-y-scroll rounded-lg py-4">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center rounded-lg">
            <div className="flex items-center rounded-lg bg-green-500 overflow-hidden text-white text-4xl px-3">
              <div>
                <img src={filterApp} alt="Filter" />
              </div>

              <Select
                sx={{
                  width: "100%",
                  fontSize: { xs: 16, md: 18 },
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": { borderStyle: "none" },
                  ".MuiSelect-icon": {
                    color: "white",
                    fontSize: { xs: 16, md: 18 },
                  },
                }}
                value={category}
                onChange={handleChangeCategory}
              >
                {categoryList.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-white text-2xl sm:text-4xl font-semibold">
                Page:
              </span>
              <Paginations
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </div>

          {category === "Images" ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px]">
              {listItems &&
                listItems.map((image, index) => (
                  <ImageItem {...image} type="source" key={index} />
                ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px]">
              {listItems &&
                listItems
                  .slice(20 * (page - 1), 20 * page)
                  .map((album, index) => (
                    <AlbumItem {...album} type="source" key={index} />
                  ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Images;
