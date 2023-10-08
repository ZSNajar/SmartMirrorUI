import React, { useState, useEffect } from 'react';
import './Weather.css'; 

const Weather = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const API_KEY = 'ba825e49b56d1c53bc8cffde07f57591';

    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=45219,us&appid=${API_KEY}&units=imperial`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
      })
      .catch(error => {
        console.error("Error fetching weather data: ", error);
      });
  }, []);

  if (!weather) return <p>Loading...</p>;

  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    
    <div className="weather-container">
      <img src={iconUrl} alt="Weather Icon" />
      <h1>{Math.round(weather.main.temp)}°F</h1>
    </div>
    
  );
};

export default Weather;
