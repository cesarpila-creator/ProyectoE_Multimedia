import React from "react";

import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";

import { SearchProvider } from "./context/SearchContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <App />

          <Toaster position="top-right" />
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
