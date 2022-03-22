import './App.scss';
import Cards from './components/Cards/Cards';
import Details from './components/Details/Details';
import { Routes, Route, useParams } from 'react-router-dom';
import { CountryProvider } from './context/CountryContext';
import Nav from './components/Nav/Nav';

// TODO Import icons

function App() {  

  return (
    <div className="App container">
      <header>
        <Nav />
      </header>
      <CountryProvider>
        <Routes>
          <Route path='/' element={<Cards />} />                    {/* TODO Make dark and light theme */}
          <Route path='/:country' element={<Details />} /> {/* TODO Fix bottom padding */}
        </Routes> 
      </CountryProvider>           
    </div>
  );
}

export default App;
