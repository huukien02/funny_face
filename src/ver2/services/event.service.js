import { apiMeta } from "./api";

export const getEventsByUserId = (id, page) =>
  apiMeta.get(`/lovehistory/page/${page}?id_user=${id}`);

export const getAllEventsByUserId = (id) =>
  apiMeta.get(`/lovehistory/user/${id}`);
