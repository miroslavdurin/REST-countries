import React, { useContext } from 'react';
import './Card.scss';
import { useNavigate } from 'react-router-dom';
import CountryContext from '../../context/CountryContext';
import ThemeContext from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

function Card({countryCard}) {    
    const { allCountries, dispatch }= useContext(CountryContext); 
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const phoneScreen = useMediaQuery('(max-width: 768px)');    

    function handleClick() {  
        window.scrollTo({top: 0}) 

        const findCountry = allCountries.find(country=>country.cca3 === countryCard.cca3)

        dispatch({payload: {...findCountry}, type: 'setCountry'});
        
        navigate(countryCard.cca3.toLowerCase());
    }
    
    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} onClick={handleClick} className={`card ${dark && 'dark-theme'}`}>
            {phoneScreen ? 
                <div className="card__flag-container mb-24">                            
                    <img src={countryCard.flags?.svg} className="card__img" alt={countryCard.name?.common} />
                </div>

                :

                <motion.div layoutId = { countryCard.cca3.toLowerCase()} className="card__flag-container mb-24">                            
                    <img  src={countryCard.flags?.svg} className="card__img" alt={countryCard.name?.common} />
                </motion.div>
            }
            
            <div className="card__content">
                <h3 className="heading--h3 mb-16">{countryCard.name?.common}</h3>
                <p className="card__info mb-8">
                    <span>Population:</span> {countryCard.population.toLocaleString()}
                </p>
                <p className="card__info mb-8">
                    <span>Region:</span> {countryCard.region}
                </p>
                <p className="card__info">
                    <span>Capital:</span> {countryCard.capital}
                </p>
            </div>            
        </motion.div>
    )
}

export default Card;