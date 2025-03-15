import React from "react";
import loading from "../assets/loading.svg";

//TODO: loading component for mobile view
const Loading = () => (
  <div className="spinner">
    <img src={loading} alt="Loading" />
  </div>
);

export default Loading;
