import React, {useContext} from 'react';
import ThemeContext from '../../context/ThemeContext';
import './Nav.scss';

function Nav() {
    const {light, dark, dispatch} = useContext(ThemeContext);

    function handleThemeSwitch() {
        dispatch({type: 'toggle'})
    }

    return (
        <nav className={`nav ${dark && 'dark-theme'}`}>            
            <div className="container">
                <h2 className="heading--h2">Where in the world?</h2> 
                <button onClick={handleThemeSwitch} className="nav__btn-toggle-theme">
                    {light ? 'Dark Mode' : 'Light Mode'}
                </button>
            </div>            
        </nav>
    )
}

export default Nav