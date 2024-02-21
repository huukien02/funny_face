const initialState = {
  responseData: null,
  isLoading: false,
  user: {
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
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RESPONSE_DATA":
      return {
        ...state,
        responseData: action.payload,
      };

    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "UPDATE_PROFILE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default rootReducer;
