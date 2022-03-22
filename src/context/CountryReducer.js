export const ACTIONS = {
    SET_COUNTRY: 'setCountry',
    SET_ALL_COUNTRIES: 'setAllCountries',
    SET_ALL: 'setAll'
}

export function CountryReducer(state, action) { 
    
    
    /* console.log(state.allCountries.map(country=>{
        return state.country.borders.find(neighbour=>neighbour === country.cca3) 
    }));  */
    
    switch(action.type) {
        case ACTIONS.SET_ALL_COUNTRIES:
            return {
                ...state,
                isLoaded: true,
                country: {},
                allCountries: action.payload
            }
        case ACTIONS.SET_COUNTRY:
            return {
                ...state,
                isLoaded: true,
                country: {
                    ...action.payload,
                    /* neighbours: action.payload.hasOwnProperty('borders') && action.payload.borders.map(border=>{
                        return state.allCountries.filter(country=>country.cca3 === border)[0]
                    }) */ 
                }
            };
        case ACTIONS.SET_ALL: 
            return {
                ...state,
                isLoaded: true,
                country: {...action.payload.country},
                allCountries: [...action.payload.allCountries]
            }
        default:
            return state
    }      
    
    
}