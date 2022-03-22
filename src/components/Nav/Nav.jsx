import React from 'react';
import './Nav.scss';

function Nav() {
    return (
        <nav className="nav">            
            <h2 className="heading--h2">Where in the world?</h2> 
            <button className="nav__btn-toggle-theme">Dark Mode</button>
        </nav>
    )
}

export default Nav