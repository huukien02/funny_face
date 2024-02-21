import { apiMeta } from "./api";

export const getCommentsByUserId = (id, page) =>
  apiMeta.get(`/lovehistory/pageComment/${page}?id_user=${id}`);

export const getAllCommentsByUserId = (id) =>
  apiMeta.get(`/lovehistory/comment/user/${id}`);
