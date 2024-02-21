// action types
import {
  FETCH_USER_LOGIN_SUCCESS,
  FETCH_USER_LOGOUT_SUCCESS,
  UPDATE_USER_AVATAR,
} from "../actions/userAction";

// trạng thái ban đầu
const INITIAL_STATE = {
  account: {
    id_user: "",
    link_avatar: "",
    user_name: "",
    ip_register: "",
    device_register: "",
    email: "",
    count_sukien: 0,
    count_comment: 0,
    count_view: 0,
    token: "",
  },
  isAuthenticated: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN_SUCCESS:
      return {
        ...state,
        account: {
          ...state.account,
          ...action?.payload,
        },
        isAuthenticated: true,
      };

    case FETCH_USER_LOGOUT_SUCCESS:
      return {
        ...state,
        account: {
          ...state.account,
          id_user: "",
          link_avatar: "",
          user_name: "",
          ip_register: "",
          device_register: "",
          email: "",
          count_sukien: 0,
          count_comment: 0,
          count_view: 0,
          token: "",
        },
        isAuthenticated: false,
      };

    case UPDATE_USER_AVATAR:
      return {
        ...state,
        account: {
          ...state.account,
          link_avatar: action?.payload.replace(
            "/var/www/build_futurelove/",
            "https://futurelove.online/"
          ),
        },
      };

    default:
      return state; // Trả về trạng thái hiện tại nếu không có action nào khớp
  }
};

export default userReducer;
