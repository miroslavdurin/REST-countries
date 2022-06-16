import React from 'react';
import './Cards.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { fetchData, debounce } from '../../model/helpers';
import Card from '../Card/Card';
import Loader from '../Loader/Loader';
import { ReactComponent as Search } from '../../assets/search.svg';
import { ReactComponent as Close } from '../../assets/close.svg';
import { ReactComponent as Up } from '../../assets/arrow-up.svg';

import CountryContext from '../../context/CountryContext';
import ThemeContext from '../../context/ThemeContext';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

//  https://restcountries.com/v3.1/name/{name}
//  https://restcountries.com/v3.1/region/{region}



function Cards() {
    const [countries, setCountries] = useState([]);
    const [input, setInput] = useState("");
    const [isError, setIsError] = useState(false)
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
            try {
                data = await fetchData(`name/${input}`);                
            }
            catch(err) {
                console.log(err)
                setIsError(true);
            }
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
        console.log(allCountries)


        if(allCountries.length > 0) setCountries(allCountries.slice(0, 20))
        else {
            getCountries()
                .then(res=> {
                    dispatch({payload: [...res], type:'setAllCountries'})
                    setCountries([...res.slice(0, 20)])
                })                               
        }        
    }, [])


    useEffect(()=> {
        setDisplayBtn(false);
        setIsDropdownOpen(false);

        if(input === "") {
            setDisplayBtn(true);
            setSelectRegion("world")
            setCountries(allCountries.slice(0, 20));
            inputRef.current.value = "";
            setIsError(false);

            return;
        }

        getCountries().then((data)=> setCountries([...data]) );                
    }, [input])
 

    useEffect(()=> {
        setDisplayBtn(true);
        setIsDropdownOpen(false)

        window.addEventListener('click', handleClick)   
                       
        if(selectRegion==="world") {            
            isRegion === false && setCountries(allCountries.slice(0, 20));                      
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
        setCountries(region[selectRegion].slice(0, 20))
        setIsRegion(true)              
        
        return ()=>{
            window.removeEventListener('click', handleClick);
            window.scrollTo({top: 200});
            }
        
    }, [selectRegion, isRegion])

    function handleMoreBtn() {

        let moreCountries;
        if(isRegion){
            moreCountries = countries.length < region[selectRegion].length ? region[selectRegion].slice(0, countries.length + 20) : region[selectRegion]            
        }else{
            moreCountries = countries.length < allCountries.length ? allCountries.slice(0, countries.length + 20) : allCountries        
        }    

        if((!isRegion && moreCountries.length === allCountries.length || isRegion && moreCountries.length === region[selectRegion].length)) setDisplayBtn(false);
    
        setCountries([...moreCountries])
    }

    function handleChange(e) {
        setIsError(false)
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

                <form autoComplete="off" className="cards__form">                    
                    <input size="30" id="input" className={`cards__input ${dark && 'dark-theme'} ${isError && 'error'}`} placeholder="Search for a country..." ref={inputRef}  name="search" type="text" value={input.value} onInput={debounce(handleChange, 500)} />    
                    <label className="cards__input-label" htmlFor="input"><Search/></label>
                </form>                   

                {   input ? 
                        <button className="cards__btn-close" onClick={()=>setInput("")} aria-label="Clear input field">
                            <Close />  
                        </button>                    
                        :
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
                    
                    {
                        displayBtn
                        && 
                        <motion.button 
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        onClick={handleMoreBtn} 
                        className={`cards__btn-more ${dark && 'dark-theme'}`}>
                            Load more...
                        </motion.button>
                    }
                </>
                :                
                <Loader />                             
            }           
            
            <div onClick={()=> window.scrollTo({top: 0})} className="arrow-up">
                <Up/>
            </div>
        </main>
    )
}

export default Cards