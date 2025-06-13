import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../layout/index';
import Download from '../pages/download'
import RegForm from '../pages/form';



function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path='/' element={<RegForm />} />
          <Route path="download" element={<Download />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Pages;
