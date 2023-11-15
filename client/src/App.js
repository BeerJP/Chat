import './assets/app.css';
import * as React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatpage from "./pages/Chatpage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route key={1} path='/' element={<Chatpage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
