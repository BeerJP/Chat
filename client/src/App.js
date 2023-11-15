import './assets/App.css';
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatpage from "./pages/Chatpage";


function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <Routes>
          <Route key={1} path='/' element={<Chatpage/>}/>
        </Routes>
      </BrowserRouter>
    </NextUIProvider>
  );
}

export default App;
