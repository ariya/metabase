import React from "react";
import ReactDOM from "react-dom";

import { init } from "./app";
import { getRoutes } from "./routes-public";
import reducers from "./reducers-public";

import BarChart from "metabase/visualizations/visualizations/BarChart";

init(reducers, getRoutes, () => {
  const series = [];
  ReactDOM.render(
    <BarChart series={series} />,
    document.getElementById("root"),
  );
});
