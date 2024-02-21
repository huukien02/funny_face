import { combineReducers } from "redux";
import loadingReducer from "./loadingReducer";
import userReducer from "./userReducer";

// Kết hợp các reducer lại, ở đây chỉ có userReducer
const rootReducer = combineReducers({
  loading: loadingReducer,
  user: userReducer, // userReducer quản lý trạng thái liên quan đến người dùng
});

export default rootReducer;
