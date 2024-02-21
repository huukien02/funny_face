import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // mặc định là localStorage cho web

// Cấu hình cho Redux Persist
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading"],
};

// Tạo persistedReducer, kết hợp rootReducer với cấu hình của Redux Persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store của Redux, áp dụng middleware thunk và dev tools
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// Tạo persistor từ store để quản lý việc lưu trữ trạng thái Redux
let persistor = persistStore(store);

export { store, persistor };
