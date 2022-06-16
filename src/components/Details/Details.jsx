import React, { useReducer, useContext } from 'react';
import { useState, useEffect } from 'react';
import './Details.scss';
import { ReactComponent as Arrow } from '../../assets/arrow-left.svg';

import { fetchData } from '../../model/helpers';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Loader from '../Loader/Loader';
import CountryContext from '../../context/CountryContext';
import ThemeContext from '../../context/ThemeContext';

import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';

function Details() {
    const location = useLocation();
    const path = location.pathname.replaceAll('%20', ' ').slice(1)

    const {allCountries, country, isLoaded, dispatch, isDetails} = useContext(CountryContext);  
    const {dark} = useContext(ThemeContext);


    const [isExiting, setIsExiting] = useState(false);    

    console.log(isDetails);
    let navigate = useNavigate()
 
    useEffect(()=>{
        if(Array.isArray(country.neighbours) && country.neighbours.length > 0 ) {country.neighbours.forEach(neighbour=>{
            const img = new Image(); 
            img.src = neighbour.flags.svg;
        })}       
    },[]) 

    useEffect(()=>{
        window.scrollTo({top: 0})

        console.log(location.pathname)

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
            if(!path) return;
            const findCountry = allCountries.find(c=>c.cca3.toLowerCase() === path);             
            dispatch({payload: {...findCountry}, type: 'setCountry'})
        }  

    }, [location.pathname])

/* FIXME South africa bug */
    return (                    
            <motion.main  
            transition={{duration:0.3}} animate={isExiting && {opacity:1}} exit={isExiting && {opacity:0}} className='container' >
            <button onClick={()=>{
                dispatch({payload: false, type: 'setIsDetails'});
                setIsExiting(true);           
                navigate('/');                   
               
                }} className={`details__btn-back mb-80 ${dark && 'dark-theme'}`} ><Arrow/> Back</button>
            {
                isLoaded ? 
                <>
                        <div className={`details__container ${dark && 'dark-theme'}`}>
                        
                        <motion.div   
                              transition={{layout: 
                                {duration: 1,
                                ease: "backInOut" }}}
                                /* onAnimationComplete={()=>dispatch({payload: true, type: 'setIsDetails'})}    */                           
                                layoutId={ country.cca3.toLowerCase() }
                                className="details__flag-container"
                                onLayoutAnimationComplete={()=>dispatch({payload: true, type: 'setIsDetails'})}
                                
                                >                                                         
                                <motion.img 
                                    layoutId= {isDetails && 'flag'}
                                    transition={{layout: 
                                        {duration:  0.4 ,
                                        ease: "easeOut"  }}}
                                    className="details__img" src={country.flags?.svg} alt={country.name} />                          
                        </motion.div>
                        <motion.div key={country.capital} 
                            initial={{opacity:0}}  
                            animate={{opacity:1}} 
                            exit={{ opacity:0, }}  
                            transition={{duration: 0.2 }} 
                            className="details__info-container">
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
                                        <Link /* onClick={()=>dispatch({payload: true, type: 'setIsDetails'})} */ key={neighbour.name.common} className="details__link" to={`/${neighbour.cca3.toLowerCase()}`}>{neighbour.name.common}</Link> )}                                  
                                    </p>
                                </div>
                            }
                            
                        </motion.div>  
                        
                        
                    </div>
                </>
                :
                <Loader />
            }
            
        </motion.main>     
                      
    )
}

export default Details