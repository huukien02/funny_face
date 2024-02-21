import { apiMeta } from "./api";

export const getVideos = () => apiMeta.get("/lovehistory/video/4");

export const getListVideos = (page, category) =>
  apiMeta.get(`/lovehistory/listvideo/${page}?category=${category}`);
