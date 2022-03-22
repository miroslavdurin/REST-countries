import React, { useContext, useState, useReducer } from 'react';
import { CountryReducer } from './CountryReducer';


const INITIAL_STATE = {
    allCountries: [],
    country: {},
    isLoaded: false,
    isError: false
}

const CountryContext = React.createContext(INITIAL_STATE);

export function CountryProvider({children}) {
    const [state, dispatch] = useReducer(CountryReducer, INITIAL_STATE);
/* 
    console.log(state.country.borders)
    state.allCountries.length > 0 && state.country.name && console.log(state.country.borders.map(border=>{
        return state.allCountries.filter(country=>country.cca3 === border)[0]
    })); */
    
    console.log(state)
    return (
        <CountryContext.Provider value={{
            allCountries: state.allCountries,
            country: state.country, 
            isLoaded: state.isLoaded,
            isError: state.isError,
            dispatch
        }}>
            {children}
        </CountryContext.Provider>
    )
}

export default CountryContext;