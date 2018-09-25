import React from "react";
import { render } from "react-dom";
import { ReactMdeDemo } from "./ReactMdeDemo";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./style.css";

const App = () => (
  <div className="container">
    <ReactMdeDemo />
  </div>
);

render(<App />, document.getElementById("root"));
