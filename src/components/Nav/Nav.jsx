import React, {useContext} from 'react';
import ThemeContext from '../../context/ThemeContext';
import './Nav.scss';
import { ReactComponent as MoonIcon } from '../../assets/moon.svg';
import { ReactComponent as SunIcon } from '../../assets/sun.svg';

function Nav() {
    const { dark, dispatch} = useContext(ThemeContext);

    function handleThemeSwitch() {
        dispatch({type: 'toggle'})
    }

    return (
        <nav className={`nav ${dark && 'dark-theme'}`}>            
            <div className="container">
                <h1 className="heading--h1">Where in the world? &times; &#02020;</h1> 
                <button role="button" aria-label="Toggle theme" onClick={handleThemeSwitch} className="nav__btn-toggle-theme">
                    {dark ?                                                 
                        <><SunIcon /> Light Mode</>
                        :
                        <><MoonIcon /> Dark Mode</>
                    }               
                </button>
            </div>            
        </nav>
    )
}

export default Nav