import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';



function App() {

  return (
    <div className='max-w-7xl mx-auto break-all'>
      <Toaster visibleToasts={1} position='top-center' richColors />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
