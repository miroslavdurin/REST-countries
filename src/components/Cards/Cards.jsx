import React from 'react';
import './Cards.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { fetchData, debounce } from '../../model/helpers';
import Card from '../Card/Card';
import { ReactComponent as Search } from '../../assets/search.svg';

import CountryContext from '../../context/CountryContext';
import ThemeContext from '../../context/ThemeContext';

//  https://restcountries.com/v3.1/name/{name}
//  https://restcountries.com/v3.1/region/{region}

/* TODO Set loading animations */


function Cards() {
    const [countries, setCountries] = useState([]);
    const [input, setInput] = useState("");
    const [selectRegion, setSelectRegion] = useState("world");
    const [isRegion, setIsRegion] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [displayBtn, setDisplayBtn] = useState(true);

    const { allCountries, country, region,dispatch, isLoaded }= useContext(CountryContext); 
    const {light, dark} = useContext(ThemeContext);

    const inputRef = useRef(null);
    
    async function getCountries() {        
        let data = [];
        if(!input) data = await fetchData();
        else {
            data = await fetchData(`name/${input}`);
        }

        data.forEach(c=> {
            c.neighbours = c.hasOwnProperty('borders') && c.borders.map(border=>{
                return data.filter(country=>country.cca3 === border)[0]
            })
        })   
  
        return data;
    }

    function handleClick(e) {
        if(e.target.classList.contains('cards__region-btn')) return;
        setIsDropdownOpen(false)
    }

    useEffect(()=>{
        setIsDropdownOpen(false)

        if(allCountries.length > 0) setCountries(allCountries.slice(0, 16))
        else {
            console.log('initial call')
            getCountries()
                .then(res=> {
                    dispatch({payload: [...res], type:'setAllCountries'})
                    setCountries([...res.slice(0, 16)])
                })                               
        }        
    }, [])


    useEffect(()=> {
        setDisplayBtn(false);
        setIsDropdownOpen(false)

        if(input === "") {
            setDisplayBtn(true);
            setSelectRegion("world")
            setCountries(allCountries.slice(0, 16));
            inputRef.current.value = "";
            return;
        }

        getCountries().then((data)=> setCountries([...data]) );        
    }, [input])
 

    useEffect(()=> {
        setDisplayBtn(true);
        setIsDropdownOpen(false)

        window.addEventListener('click', handleClick)      
      
               
        if(selectRegion==="world") {            
            isRegion === false && setCountries(allCountries.slice(0, 16));                      
            setIsRegion(false)
            
            return;
        };
       
        /* async function getRegion() {
            const data = await fetchData(`${select === "default" ? 'all' : 'region/' + select }`);           

            data.forEach(c=> {
                c.neighbours = c.hasOwnProperty('borders') && c.borders.map(border=>{
                    return data.filter(country=>country.cca3 === border)[0]
                })
            })    
            setCountries([...data]);
            
        }  */
        setInput(""); 
        setCountries(region[selectRegion].slice(0,16))
        setIsRegion(true)              
        
        return window.removeEventListener('click', handleClick)
        
    }, [selectRegion, isRegion])

    function handleMoreBtn() {

        let moreCountries;
        if(isRegion){
            moreCountries = countries.length < region[selectRegion].length ? region[selectRegion].slice(0, countries.length + 16) : region[selectRegion]            
        }else{
            moreCountries = countries.length < allCountries.length ? allCountries.slice(0, countries.length + 16) : allCountries        
        }    

        if((!isRegion && moreCountries.length === allCountries.length || isRegion && moreCountries.length === region[selectRegion].length)) setDisplayBtn(false);
    
        setCountries([...moreCountries])
    }

    function handleChange(e) {
        setInput(e.target.value)    
    }

    function handleDropdownOpen() {
        setIsDropdownOpen(state=>!state)
    }

    function handleRegionSelect(e) {
        if(!e.target.classList.contains('cards__list-item')) return;
        setSelectRegion(e.target.dataset.region);
    }

    return (
        <main className={`main-cards container ${dark && 'dark-theme'}`}>
            <div className="cards__inputs">
                {/* TODO Make input error message */}
                {/* TODO Implement Close button while tiping */}
                {/* 
                <label htmlFor="input"><Search/></label> */}
                <input size={50} id="input" className={`cards__input ${dark && 'dark-theme'}`} placeholder="Search for a country..." ref={inputRef}  name="search" type="search" value={input.value} onInput={debounce(handleChange, 500)} />
                   

                {   !input &&
                    <div className={`cards__region-select ${dark && 'dark-theme'}`}>                        
                        <button onClick={handleDropdownOpen} className="cards__region-btn">Filter by region</button>
                        {isDropdownOpen  &&
                            <ul onClick={handleRegionSelect} className={`cards__dropdown `}>
                                <li data-region="world" className="cards__list-item">World</li>
                                <li data-region="africa" className="cards__list-item">Africa</li>
                                <li data-region="americas" className="cards__list-item">Americas</li>
                                <li data-region="asia" className="cards__list-item">Asia</li>
                                <li data-region="europe" className="cards__list-item">Europe</li>
                                <li data-region="oceania" className="cards__list-item">Oceania</li>
                            </ul>
                        }                             
                    </div>
                }
                
            </div>

            {
                isLoaded ?
                <>
                    <div className='cards'>
                        {
                            countries.map(country=> <Card key={country.name.common} countryCard={country} />)
                        }
                    </div>
                    {/*( firstLoad && inputRef.current?.value === "" && (!isRegion && countries?.length < allCountries?.length || isRegion && countries?.length < region[select]?.length)) && */
                        displayBtn && 
                        <button onClick={handleMoreBtn} className={`cards__btn-more ${dark && 'dark-theme'}`}>Load more...</button>
                    }
                </>
                :
                <h1>Loading</h1>
                
            }           
            
        </main>
        
    )
}

export default Cards