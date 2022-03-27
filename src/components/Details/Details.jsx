import React, { useReducer, useContext } from 'react';
import { useState, useEffect } from 'react';
import './Details.scss';

import { fetchData } from '../../model/helpers';
import { Link, useLocation } from 'react-router-dom';

import CountryContext from '../../context/CountryContext';
import ThemeContext from '../../context/ThemeContext';

function Details() {
    const location = useLocation();
    const path = location.pathname.replaceAll('%20', ' ').slice(1)

    const {allCountries, country, isLoaded, isError, dispatch} = useContext(CountryContext);  
    const {dark} = useContext(ThemeContext);
        
    useEffect(()=>{
        window.scrollTo({top: 0})

        async function getCountry() {
            try {
                const data = await fetchData(); 
                data.forEach(c=> {
                    c.neighbours = c.hasOwnProperty('borders') && c.borders.map(border=>{
                        return data.filter(country=>country.cca3 === border)[0]
                    })
                })                              
               
                const findCountry = data.find(c=>c.cca3.toLowerCase() === path);               
                
                dispatch( {
                    payload: {
                    allCountries: [...data],
                    country: {...findCountry}
                    }, 
                    type: 'setAll'
                })
            } catch(err) {
                console.log(err)
            }
        }

        if (allCountries.length === 0 ){     
            getCountry() 
        }

        if (allCountries.length > 0 && country.cca3.toLowerCase() !== path) {            
            const findCountry = allCountries.find(c=>c.cca3.toLowerCase() === path);             
            dispatch({payload: {...findCountry}, type: 'setCountry'})
        } 
    }, [location.pathname])


    return (            
        <main className='container'>
            <Link className={`details__btn-back mb-80 ${dark && 'dark-theme'}`} to='/'>&#8592; Back</Link>
            {
                isLoaded ? 
                <>
                        <div className={`details__container ${dark && 'dark-theme'}`}>
                        <div className="details__flag-container">
                            <img className="details__img" src={country.flags?.svg} alt="" />
                        </div>
                        <div className="details__info-container">
                            <h1 className="heading--h1 mb-24">{country.name?.common}</h1>
                            <div className="details__details">
                                <p className="details__paragraph">
                                    <span>Native Name: </span>
                                    {country.name?.nativeName  ? Object.values(country.name?.nativeName)[0].common : country.name?.common} 
                                </p>
                                <p className="details__paragraph">
                                    <span>Population: </span>
                                    {country.population?.toLocaleString()} 
                                </p>
                                <p className="details__paragraph">
                                    <span>Region: </span>
                                    {country.region} 
                                </p>
                                <p className="details__paragraph">
                                    <span>Sub Region: </span>
                                    {country.subregion} 
                                </p>
                                <p className="details__paragraph">
                                    <span>Capital: </span>
                                    {country.capital} 
                                </p>
                                <p className="details__paragraph">
                                    <span>Top Level Domain: </span>
                                    {country.tld} 
                                </p>
                                <p className="details__paragraph">
                                    <span>Currencies: </span>
                                    {country.currencies && Object.values(country.currencies)[0].name}
                                </p>
                                <p className="details__paragraph">
                                    <span>Languages: </span>
                                    {country.languages && Object.values(country.languages).join(', ')}
                                </p>
                            </div>
                            {
                            isLoaded && country.neighbours.length > 0 &&
                                
                                <div className="details__links">
                                    <p className="details__paragraph">
                                        <span>Border countries: </span>
                                        
                                    {isLoaded && country.neighbours.map(neighbour=> 
                                        <Link key={neighbour.name.common} className="details__link" to={`/${neighbour.cca3.toLowerCase()}`}>{neighbour.name.common}</Link> )}                                  
                                    </p>
                                </div>
                            }
                            
                        </div>
                    </div>
                </>
                :
                <h1>Loading</h1>
            }
            
        </main>                 
    
    )
}

export default Details