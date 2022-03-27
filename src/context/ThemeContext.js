import React, { useReducer } from 'react';

//TODO load theme from local storage

const INITIAL_STATE = {
    light: true,
    dark: false
}

const ThemeContext = React.createContext(INITIAL_STATE);

export const ACTIONS = {
    LIGHT_THEME: 'lightTheme',
    DARK_THEME: 'darkTheme',
    TOGGLE: 'toggle'
}

export function ThemeReducer(state, action) { 
              
    switch(action.type) {
        case ACTIONS.LIGHT_THEME:
            return {
                ...state,
                light: true,
                dark: false
            }
        case ACTIONS.DARK_THEME:
            return {
                ...state,
                light: true,
                dark: false
            };
        case ACTIONS.TOGGLE: 
            return {
                ...state,
                light: !state.light,
                dark: !state.dark
            }
        default:
            return state
    }      
    
    
}


export function ThemeProvider({children}) {
    const [state, dispatch] = useReducer(ThemeReducer, INITIAL_STATE);
/* 
    console.log(state.country.borders)
    state.allCountries.length > 0 && state.country.name && console.log(state.country.borders.map(border=>{
        return state.allCountries.filter(country=>country.cca3 === border)[0]
    })); */
    
    console.log(state)
    return (
        <ThemeContext.Provider value={{
            light: state.light,
            dark: state.dark,
            dispatch
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;