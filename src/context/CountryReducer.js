export const ACTIONS = {
    SET_COUNTRY: 'setCountry',
    SET_ALL_COUNTRIES: 'setAllCountries',
    SET_ALL: 'setAll',
    SET_IS_DETAILS: 'setIsDetails'
}

export function CountryReducer(state, action) { 
    function createRegions(allCountries) {
        const region = {}
    
        allCountries.forEach(country=>{
            if(!region[country.region.toLowerCase()]) region[country.region.toLowerCase()] = [country]
            else region[country.region.toLowerCase()].push(country);
        })

        return region;
    }
          
    switch(action.type) {
        case ACTIONS.SET_ALL_COUNTRIES:
            return {
                ...state,
                isLoaded: true,
                country: {},
                allCountries: action.payload,
                region: createRegions(action.payload)
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
                allCountries: [...action.payload.allCountries],
                region: createRegions(action.payload.allCountries)
            };
        case ACTIONS.SET_IS_DETAILS: 
            return {
                ...state,
                isDetails: action.payload
            }
        default:
            return state
    }      
    
    
}