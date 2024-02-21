import axios from "axios";

const apiImg = axios.create({
  baseURL: "https://api.imgbb.com",
});

const apiMeta = axios.create({
  baseURL: "https://databaseswap.mangasocial.online",
});

const apiManga = axios.create({
  baseURL: "https://api.mangasocial.online",
});

[apiImg, apiMeta, apiManga].map((item) =>
  item.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  )
);

export { apiImg, apiMeta, apiManga };
