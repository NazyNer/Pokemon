import React from 'react';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import HomePage from './components/HomePage/HomePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" component={LandingPage} />
        <Route path='/*' element={
          <h1>No existe esta pag</h1>
        } />
        <Route path='/home' element={
          <Route path="/home" component={HomePage} />
        } />
        {/* <Route path='/about' element={
          
        } />
        <Route path='/detail/:id' element={
          
        } />
        <Route path='/favorites' element={
          
        } /> */}
      </Routes>
    </div>
  );
}

export default App;
