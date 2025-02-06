import { Coords } from "leaflet";

export interface Weather {
    description: string;
    icon: string;
    main: Main;
  }
  
  export interface Main {
    temp: number;
    humidity: number;
  }
  export interface Coord {
    lat: number;
    lon: number;
  }
  
  export interface WheaterData {
    name: string;
    weather: Weather[];
    main: Main;
    timezone: number;
    coord: Coord;
    icon: string;
  }
  
  const apiKey = 'aa12b7ccd2c449df1ac5b282ac53a1d7'; 
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  
  export const getWeather = async (city: string): Promise<WheaterData> => {
    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données météo');
    }
    const data: WheaterData = await response.json();
    return {
      name: data.name,
      weather: data.weather,
      main: data.main,
      timezone: data.timezone,
      coord: data.coord,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, 
    };
  };