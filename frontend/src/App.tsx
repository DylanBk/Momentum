import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Auth from './components/pages/Auth';
import ToDo from './components/pages/ToDos';
import Settings from './components/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth formType='signup' />} />
        <Route path='/signup' element={<Auth formType='signup' />} />
        <Route path='/login' element={<Auth formType='login' />} />
        <Route path='/todo' element={<ToDo />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/*' element={<Auth formType='signup' />} /> // take user to auth if url wrong, they will be redirected to ToDo if logged in
      </Routes>
    </BrowserRouter>
  );
};