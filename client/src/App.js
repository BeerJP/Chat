import './assets/app.css';
import { React, Fragment, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Authpage from "./pages/Authpage";
import Chatpage from "./pages/Chatpage";


function App() {
  return (
    <Fragment>
      <Container maxWidth="md">
        <BrowserRouter>
          <Routes>
            <Route key={1} path='/' element={<Authpage/>}/>
            <Route key={2} path='/chatroom' element={<Chatpage/>}/>
          </Routes>
        </BrowserRouter>
      </Container>
    </Fragment>
  );
}

export default App;
