import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Signup from './Signup';
import './index.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import Home from './Pages/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Login />}/>
      <Route path="/dashboard" element={<Home/>} />
      <Route path="/signup" exact element={<Signup />}/>
    </Routes>
  </BrowserRouter>
);
