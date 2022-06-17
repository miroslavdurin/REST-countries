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

import { AnimatePresence, motion } from 'framer-motion';

function Cards() {
    const [countries, setCountries] = useState([]);
    const [input, setInput] = useState("");
    const [isError, setIsError] = useState(false)
    const [selectRegion, setSelectRegion] = useState("world");
    const [isRegion, setIsRegion] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [displayBtn, setDisplayBtn] = useState(true);
    const [isInputVisible, setIsInputVisible] = useState(false);

    const { allCountries, region,dispatch, isLoaded }= useContext(CountryContext); 
    const { dark } = useContext(ThemeContext);

    const inputRef = useRef(null);
     
    function callback(entries) {
        const [entry] = entries;
        setIsInputVisible(entry.isIntersecting);
    }

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1
    }

    useEffect(()=>{
        const observer = new IntersectionObserver(callback, options)

        if(inputRef.current) observer.observe(inputRef.current);

        return ()=>{
            if(inputRef.current) observer.unobserve(inputRef.current);
        }
    }, [inputRef])

    
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
       
        setInput(""); 
        setCountries(region[selectRegion].slice(0, 20))
        setIsRegion(true)              
        
        return ()=>{
            window.removeEventListener('click', handleClick);
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
        <motion.main exit={{opacity: 0}} className={`main-cards container ${dark && 'dark-theme'}`}>
            <div className="cards__inputs">

                <form autoComplete="off" className="cards__form">                    
                    <input 
                        size="30" 
                        id="input" 
                        className={`cards__input ${dark && 'dark-theme'} ${isError && 'error'}`} 
                        placeholder="Search for a country..." ref={inputRef}  
                        name="search" type="text" 
                        value={input.value} 
                        onInput={debounce(handleChange, 500)} 
                        aria-label="input"
                        aria-required="false"
                    />    
                    <label className="cards__input-label" htmlFor="input"><Search/></label>
                </form>                   

                {   input ? 
                        <button role="button" className="cards__btn-close" onClick={()=>setInput("")} aria-label="Clear input field">
                            <Close />  
                        </button>                    
                        :
                        <div className={`cards__region-select ${dark && 'dark-theme'}`}>                        
                            <button role="button" aria-label="Region select" onClick={handleDropdownOpen} className="cards__region-btn">Filter by region</button>
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
                            role="button"
                            aria-label="Load more countries"
                            className={`cards__btn-more ${dark && 'dark-theme'}`}>
                            Load more...
                        </motion.button>
                    }
                </>
                :                
                <Loader />                             
            }           
            <AnimatePresence>
              { !isInputVisible &&
                    <motion.button 
                        role="button"
                        aria-label="Scroll back to top"
                        initial={{opacity: 0}} 
                        animate={{opacity: 1}} 
                        exit={{opacity: 0}}
                        transition={{
                            delay: 0.2, 
                            duration: 0.2                            
                        }} 
                        onClick={()=> window.scrollTo({top: 0})} className="arrow-up">
                        <Up/>
                    </motion.button >}  
            </AnimatePresence>
            
               
        </motion.main>
    )
}

export default Cards