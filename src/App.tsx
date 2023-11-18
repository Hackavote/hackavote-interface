import Project from 'pages/project/_id';
import Home from 'pages';
import React from 'react';
import {Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/project/:projectId' element={<Project/>}/>
    </Routes>
  );
}

export default App;
