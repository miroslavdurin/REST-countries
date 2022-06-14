import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { CountryProvider } from './context/CountryContext';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>    
    <ThemeProvider>
      <CountryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CountryProvider>
      
    </ThemeProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

