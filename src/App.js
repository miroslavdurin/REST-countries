import { useContext, useEffect, useState } from 'react';
import './App.scss';
import Cards from './components/Cards/Cards';
import Details from './components/Details/Details';
import { Routes, Route, useParams } from 'react-router-dom';
import { CountryProvider } from './context/CountryContext';
import { ThemeProvider } from './context/ThemeContext';
import Nav from './components/Nav/Nav';

import ThemeContext from './context/ThemeContext';

// TODO Import icons
// TODO Make loading fetch animation


function App() {  
  
  const {dark} = useContext(ThemeContext)

  return (
      <div className={`App ${dark && 'dark-theme'}`}>      
        <header>
          <Nav />
        </header>
        <CountryProvider>
          <Routes>
            <Route path='/' element={<Cards />} />                  
            <Route path='/:country' element={<Details />} />
          </Routes> 
        </CountryProvider>           
      </div>
   
    
  );
}

export default App;
