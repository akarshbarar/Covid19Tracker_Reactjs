import React from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

import Infobox from './Infobox';
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import {sortData} from './util';

import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';
function App() {

  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("WorldWide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType, setCasesType] = useState("cases");

  //!USEEFFECT :  Runs a piece of code fr a given piece of condition 
  useEffect(()=>{
    //!The code inside will run only once when componetn loads
    //TODO: ASYNC => SEND A REQUEST WAIT FOR IT DO SOMETHING

    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
          const countries = data.map((country) =>(
            {
              name:country.country,
              value:country.countryInfo.iso2
            }
          ));

            const sortedData=sortData(data)
            setTableData(sortedData);
            setCountries(countries);
            setMapCountries(data);
      });
    };
    getCountriesData();

    fetch("https://disease.sh/v3/covid-19/all")
    .then(responce=>responce.json())
    .then(data=>{
        //All Country data
        setCountryInfo(data);
    });
  },[]);



  const onCountryChange=async (event)=>{
    const countryCode=event.target.value;
    setCountry(countryCode);
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries
    const url=countryCode==="WorldWide"
    ?"https://disease.sh/v3/covid-19/all"
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(responce=>responce.json())
    .then(data=>{
        setCountry(countryCode);
        //All Country data
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
        setMapZoom(5);
    });
  };

  return (
    <div className="app">
        <div className="app__left">
            <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app___dropdown">
                <Select variant="outlined" value={country} onChange={onCountryChange} >
                <MenuItem value="WorldWide">WorldWide</MenuItem>
                  {
                    countries.map( country =>(
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
                </Select>
            </FormControl>
          </div>
          

          <div className="app__stats">
            <Infobox isRed active={casesType==="cases"} onClick={(e)=>setCasesType("cases")} title="Coronavirus Cases" total={countryInfo.cases} cases={prettyPrintStat(countryInfo.todayCases)}/>
            <Infobox active={casesType==="recovered"} onClick={(e)=>setCasesType("recovered")} title="Recovered" total={countryInfo.recovered} cases={prettyPrintStat(countryInfo.todayRecovered)}/>
            <Infobox isRed active={casesType==="deaths"} onClick={(e)=>setCasesType("deaths")} title="Deaths" total={countryInfo.deaths} cases={prettyPrintStat(countryInfo.todayDeaths)}/>
            
          </div>
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div> 
        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>World wide New {casesType}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
          <h6>Made by:-Akarsh Barar</h6>
          <h6>Contact me</h6>

          <div className="contact">
            <a href="https://twitter.com/CodeCave2">
            <img align="left" alt="CodeCave's Twitter" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg" />
            </a>
            <a href="https://twitter.com/AkarshBarar">
              <img align="left" alt="Akarsh's Twitter" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg" />
            </a>
            <a href="https://www.linkedin.com/in/akarsh-barar-50588b131/">
              <img align="left" alt="Akarsh Barar's Linkdein" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg" />
            </a>
            <a href="https://github.com/akarshbarar">
              <img align="left" alt="Akarsh Barar's Github" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg" />
            </a>
            <a href="https://www.instagram.com/mycodecave/">
              <img align="left" alt="Akarsh Barar || CodeCave 's Instagram" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg" />
            </a>
            <a href="https://www.facebook.com/akarsh.barar.7">
              <img align="left" alt="Akarsh Barar's Facebook" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/facebook.svg" />
            </a>
            <a href="https://www.youtube.com/c/CodeCave">
              <img align="left" alt="CodeCave's Youtube" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/youtube.svg" />
            </a>
            <a href="https://chat.whatsapp.com/JoALuglQOKtHeNXE0wlfoK">
              <img align="left" alt="Join Whatsapp Group" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/whatsapp.svg" />
            </a>

            <br/>
            <br/>
          </div>
         
        </Card>
    </div>
  );
}

export default App;
