import { useContext, useEffect, useState } from 'react';
import './App.scss';
import './sass/main.scss';
import Cards from './components/Cards/Cards';
import Details from './components/Details/Details';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { CountryProvider } from './context/CountryContext';
import { ThemeProvider } from './context/ThemeContext';
import Nav from './components/Nav/Nav';

import ThemeContext from './context/ThemeContext';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';


function App() {  
  
  const {dark} = useContext(ThemeContext)
  const location = useLocation();
  

  return (

      <div className={`App ${dark && 'dark-theme'}`}>      
      <header>
          <Nav />
        </header>
        
        <AnimatePresence exitBeforeEnter initial={true}>          
            <Routes location={location.pathname === '/' ? location.location : location} key={location.key}>
              <Route path='/' element={<Cards />} />                  
              <Route path=':country' element={<Details />} />
            </Routes>                
     
        </AnimatePresence>                           
      </div>  
          
  );
}

export default App;
