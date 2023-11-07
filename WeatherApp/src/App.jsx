import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Select from "react-select";

function App() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [weatherData, setWeatherData] = useState("");

  useEffect(() => {
    axios
      // .get("https://restcountries.com/v3.1/all")
      // .then((response) => {
      //   const countryOptions = response.data.map((country) => ({
      //     value: country.cca2,
      //     label: country.name.common,
      //   }));
      .get("https://api.countrystatecity.in/v1/countries", {
        headers: {
          "X-CSCAPI-KEY":
            "NWhrU2FIakxibzljVDZFOXJKdktvR3VsWDFSYXk0ZmtqaVl6NWxDZA==",
        },
      })
      .then((response) => {
        const countryOptions = response.data.map((country) => ({
          value: country.iso2,
          label: country.name,
        }));
        setCountryOptions(countryOptions);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const fetchData = () => {
    const optionsData = {
      method: "GET",
      url: "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather",
      params: { city: city.label },
      headers: {
        "X-RapidAPI-Key": "6829abde76mshf794d68e8387478p1c3a96jsne68bccde7065",
        "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
      },
    };
    axios
      .request(optionsData)
      .then((response) => {
        setWeatherData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const callStates = (e) => {
    console.log(e,country);
    if (country) {
      axios
        // .get(`https://api.apilayer.com/geo/country/cities/${country.value}`, {
        //   redirect: "follow",
        //   headers: {
        //     apikey: "niWCA7alvujSoKYPM6Zv1NoYkYUuNy18",
        //   },
        // })
        // .then((response) => {
        //   const cityOptions = response.data.map((result) => ({
        //     value: result.name,
        //     label: result.name,
        //   }));
        //   setCityOptions(cityOptions);
        //   console.log(cityOptions);
        // })
        .get(`https://api.countrystatecity.in/v1/countries/${country.value}/states`, {
        headers: {
          "X-CSCAPI-KEY":
            "NWhrU2FIakxibzljVDZFOXJKdktvR3VsWDFSYXk0ZmtqaVl6NWxDZA==",
        },
      })
      .then((response) => {
        const stateOptions = response.data.map((state) => ({
          value: state.iso2,
          label: state.name,
        }));
        console.log(stateOptions);
        setStateOptions(stateOptions);
      })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }

  const callCities = (e) => {
    setState(e);
    console.log("From city",country,state);
    if (state != "") {
      axios
        .get(`https://api.countrystatecity.in/v1/countries/${country.value}/states/${state.value}/cities`, {
        headers: {
          "X-CSCAPI-KEY":
            "NWhrU2FIakxibzljVDZFOXJKdktvR3VsWDFSYXk0ZmtqaVl6NWxDZA==",
        },
      })
      .then((response) => {
        const cityOptions = response.data.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        console.log(response);
        setCityOptions(cityOptions);
      })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  };
  console.log(country);
  //const multi = country&&city
  return (
    <div className="body">
      <div className="container">
        <div className="header">
          <h1>Weather App</h1>
        </div>
        <div className="location">
          <Select
            options={countryOptions}
            placeholder="Select Country"
            value={country}
            onClick={(e)=>setCountry(e)}
            onChange={callStates}
          />
          <Select
            options={stateOptions}
            placeholder="Select City"
            value={state}
            onChange={callCities}
          />
          <Select
            options={cityOptions}
            placeholder="Select City"
            value={city}
            onChange={(selectedOption) => setCity(selectedOption)}
          />
          <button id="search" onClick={fetchData}>
            Search
          </button>
        </div>
        <div className="weather-info">
          {/* {multi &&(
            <div>
              <h2 id="location">City : {city.value}</h2>
            <h2 id="location">Country: {country.label}</h2>
            </div>
          )} */}
          <h2 id="location">City : {city.value}</h2>
          <h2 id="location">Country: {country.label}</h2>
          <div className="weather-details">
            <img
              id="weather-icon"
              src="https://via.placeholder.com/100"
              alt="Weather Icon"
            />
            <div className="temperature">
              <span id="temperature">{weatherData.temp}</span>°C
            </div>
            <div id="description" className="description">
              Weather Description
            </div>
          </div>
        </div>
        <div className="forecast">
          <div className="forecast-item">
            <div className="day">Max Temp</div>
            <div className="temperature">5{weatherData.max_temp}C</div>
          </div>
          <div className="forecast-item">
            <div className="day">Min Temp</div>
            <div className="temperature">{weatherData.min_temp}C</div>
          </div>
          <div className="forecast-item">
            <div className="day">Humidity</div>
            <div className="temperature">{weatherData.humidity}°C</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
