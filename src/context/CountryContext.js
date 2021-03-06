import React, { useContext, useState, useReducer } from 'react';
import { CountryReducer } from './CountryReducer';


const INITIAL_STATE = {
    allCountries: [],
    region:{},
    country: {},
    isLoaded: false,
    isError: false,
    isDetails: false
}

const CountryContext = React.createContext(INITIAL_STATE);

export function CountryProvider({children}) {
    const [state, dispatch] = useReducer(CountryReducer, INITIAL_STATE);
    
    return (
        <CountryContext.Provider value={{
            allCountries: state.allCountries,
            country: state.country, 
            isLoaded: state.isLoaded,
            isError: state.isError,
            region: state.region,
            isDetails: state.isDetails,
            dispatch
        }}>
            {children}
        </CountryContext.Provider>
    )
}

export default CountryContext;