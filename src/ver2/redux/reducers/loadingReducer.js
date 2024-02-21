// action types
import { SET_LOADING } from "../actions/loadingAction";

// trạng thái ban đầu
const INITIAL_STATE = {
  isLoading: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state; // Trả về trạng thái hiện tại nếu không có action nào khớp
  }
};

export default userReducer;
