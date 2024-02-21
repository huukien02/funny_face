import { apiMeta } from "./api";

export const changeAvatar = (id, formData) =>
  apiMeta.post(`/changeavatar/${id}`, formData);

export const uploadImg = (data) =>
  apiMeta.post("/upload-gensk/200?type=src_vid", data);

export const getUserById = (id) => apiMeta.get(`/profile/${id}`);
