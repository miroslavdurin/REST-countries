import React, {useReducer, useContext, useEffect} from 'react';
import './Card.scss';
import { useNavigate } from 'react-router-dom';
import CountryContext from '../../context/CountryContext';

// TODO Make card hover animations


function Card({countryCard}) {    
    const {allCountries, dispatch}= useContext(CountryContext); 


    const navigate = useNavigate();    
    function handleClick() {
        const findCountry = allCountries.find(country=>country.name.common === countryCard.name.common)

        dispatch({payload: {...findCountry}, type: 'setCountry'});
        navigate(countryCard.name.common.toLowerCase());
    }

    return (
        <div onClick={handleClick} className='card'>
            <div className="card__flag-container mb-24">
                <img src={countryCard.flags?.svg} className="card__img" alt={countryCard.name?.common} />
            </div>
            <div className="card__content">
                <h3 className="heading--h3 mb-16">{countryCard.name?.common}</h3>
                <p className="card__info mb-8">
                    <span>Population:</span> {countryCard.population}
                </p>
                <p className="card__info mb-8">
                    <span>Region:</span> {countryCard.region}
                </p>
                {<p className="card__info">
                    <span>Capital:</span> {countryCard.capital}
                </p>}
            </div>            
        </div>
    )
}

export default Card;