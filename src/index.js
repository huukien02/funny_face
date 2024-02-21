import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import { store, persistor } from "./ver2/redux/store";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </PersistGate>
    </Provider>
  </Router>
);

reportWebVitals();
