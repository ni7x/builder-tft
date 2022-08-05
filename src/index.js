import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Builder from './Containers/Builder';
import {
    BrowserRouter as Router,
    Route,
    Routes, 
  } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Router basename={process.env.PUBLIC_URL}>
     <Routes>
        <Route path='/' element={<Builder/>} />
    </Routes>
 </Router>
);
