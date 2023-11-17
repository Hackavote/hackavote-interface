import Home from 'pages';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RoutePath from './routes';

function App() {
  return (
    <Routes>
      <Route path={RoutePath.LANDING} element={<Home />} />
    </Routes>
  );
}

export default App;
