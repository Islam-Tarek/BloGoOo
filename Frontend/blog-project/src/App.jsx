import React from "react";
import { Routes, Route } from "react-router";
import "./App.css";

import Home from "./pages/Home";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}
