import React from 'react';
import './Cards.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { fetchData, debounce } from '../../model/helpers';
import Card from '../Card/Card';
import { ReactComponent as Search } from '../../assets/search.svg';

import CountryContext from '../../context/CountryContext';

//  https://restcountries.com/v3.1/name/{name}
//  https://restcountries.com/v3.1/region/{region}

/* TODO Set loading animations */

function Cards() {
    const [countries, setCountries] = useState([]);
    const [input, setInput] = useState("");
    const [select, setSelect] = useState("default");

    const { allCountries, country, dispatch }= useContext(CountryContext); 

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

    useEffect(()=>{
        if(allCountries.length > 0) setCountries(allCountries)
        else {
            getCountries()
                .then(res=> {
                    dispatch({payload: [...res], type:'setAllCountries'})
                    setCountries([...res])
                })                               
        }
    }, [])


    useEffect(()=> {
        getCountries().then((data)=> setCountries([...data]) );                    
    }, [input])
 

    useEffect(()=>{
        if(select==="default") return;
        async function getRegion() {
            const data = await fetchData(`${select === "default" ? 'all' : 'region/' + select }`);           

            data.forEach(c=> {
                c.neighbours = c.hasOwnProperty('borders') && c.borders.map(border=>{
                    return data.filter(country=>country.cca3 === border)[0]
                })
            })    
            setCountries([...data]);
            
        }
       
        getRegion();
        inputRef.current.value = "";
    }, [select])

    console.log(countries)

    function handleChange(e) {
        setInput(e.target.value)    
    }

    function handleSelect(e) {
        setSelect(e.target.value)
    }

    return (
        <main className="main-cards">
            <div className="cards__inputs">
                <input size={50} id="input" className="cards__input" placeholder="Search for a country..." ref={inputRef}  name="search" type="search" value={input.value} onInput={debounce(handleChange, 500)}/>
                <label className="cards__label" htmlFor="input"><Search/></label>
                <select className="cards__select" onChange={handleSelect} value={select} name="region" id="region">
                    <option disabled hidden value="default">Filter by region:</option>
                    <option value="africa">Africa</option>
                    <option value="americas">Americas</option>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="oceania">Oceania</option>
                </select>
            </div>
            
            <div className='cards'>
                {
                    countries.map(country=> <Card key={country.name.common} countryCard={country} />)
                }
            </div>
        </main>
        
    )
}

export default Cards