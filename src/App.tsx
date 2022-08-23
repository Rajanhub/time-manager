import React from "react";
import logo from "./logo.svg";
// import "./App.css";
import Daily from "./containers/Daily";
import Weekly from "./containers/Weekly";
import Monthly from "./containers/Monthly";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "styles/styles.scss";
import { APIProvider } from "context";

function App() {
  return (
    <APIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Monthly />} />
          <Route path="/:month" element={<Weekly />} />
          <Route path="/:month/:week" element={<Daily />} />
        </Routes>
      </BrowserRouter>
    </APIProvider>
  );
}

export default App;
