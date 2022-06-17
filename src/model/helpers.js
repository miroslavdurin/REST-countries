import axios from 'axios';

export async function fetchData(query = "all") {
    try {
        const res = await axios({
            method: 'GET',
            url: `https://restcountries.com/v3.1/${query.toLowerCase()}`
        });

        if(res.statusText !== "OK") throw new Error({message: "Could not fetch data"})
        return res.data;
        
    }catch(err){
      throw err;
    }
}       

export function debounce(func, wait) {
    let timeout;
  
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

