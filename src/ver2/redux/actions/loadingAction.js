export const SET_LOADING = "SET_LOADING";

export const setLoading = (data) => {
  return {
    type: SET_LOADING,
    payload: !!data,
  };
};
