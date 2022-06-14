import React from 'react';
import './Loader.scss';

function Loader() {
    return (
        <div className="loading-spinner">
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <h1>Loading . . . </h1>                      
        </div>
    )
}

export default Loader