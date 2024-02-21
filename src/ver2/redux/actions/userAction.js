export const FETCH_USER_LOGIN_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const FETCH_USER_LOGOUT_SUCCESS = "FETCH_USER_LOGOUT_SUCCESS";
export const UPDATE_USER_AVATAR = "UPDATE_USER_AVATAR";

export const doLogin = (data) => {
  return {
    type: FETCH_USER_LOGIN_SUCCESS,
    payload: data,
  };
};

export const doLogout = () => {
  return {
    type: FETCH_USER_LOGOUT_SUCCESS,
  };
};

export const doUpdateAvatar = (data) => {
  return {
    type: UPDATE_USER_AVATAR,
    payload: data,
  };
};
