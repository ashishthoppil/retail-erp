"use client";

import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2400}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
    />
  );
}
