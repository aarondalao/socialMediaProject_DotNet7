import React from "react";
import ReactDOM from "react-dom/client";

import "semantic-ui-css/semantic.min.css";
import "./app_common/layout/styles.css";
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-calendar/dist/Calendar.css';
import reportWebVitals from "./reportWebVitals";
import { StoreContext, store } from "./app_common/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./app_common/router/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
