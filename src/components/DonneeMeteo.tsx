import { getWeather, WheaterData } from "../services/WeatherServices";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../App.css";
import "leaflet/dist/leaflet.css";


const DonneeMeteo = () => {
  const [weatherData, setWeatherData] = useState<WheaterData | null>(null);
  const [city, setCity] = useState<string>("Namur");
  const [backgroundImage, setBackgroundImage] = useState<string>("matin");
  const [error, setError] = useState<string | null>(null);

  const [position, setPosition] = useState<{ lat: number; lon: number }>({
    lat: 50.467,
    lon: 4.87,
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleDiv = () => {
    setIsOpen(!isOpen);
  };
  

  const mapRef = useRef<L.Map | null>(null);

  const convertTimezoneToTime = (timezone: number): string => {
    const utcTime = new Date();
    const localTime = new Date(utcTime.getTime() + timezone * 1000);

    const hours = localTime.getUTCHours().toString().padStart(2, "0");
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setError(null);
        const data = await getWeather(city);
        setWeatherData(data);

        setPosition({ lat: data.coord.lat, lon: data.coord.lon });

        const localTime = new Date(Date.now() + data.timezone * 1000);
        const hour = localTime.getHours();
        if (hour >= 6 && hour < 11) {
          setBackgroundImage("matin");
        } else if (hour >= 11 && hour < 18) {
          setBackgroundImage("midi");
        } else if (hour >= 18 && hour < 22) {
          setBackgroundImage("soir");
        } else {
          setBackgroundImage("nuit");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des données météo");
      }
    };
    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([position.lat, position.lon], 13);
    }
  }, [position]);

  return (
    <div className="flex flex-col">
      <input
        type="text"
        className="mx-[25%] rounded px-3 my-5 border border-orange-500 text-slate-950 text-center"
        onChange={(e) => setCity(e.target.value)}
        placeholder="Entrez une ville"
      />
     <div
  className={`app ${backgroundImage} border-2 rounded relative p-4 border-orange-500 w-[500px] h-[500px] bg-cover bg-center 
  ${backgroundImage === "matin" || backgroundImage === "midi" ? "text-slate-900" : "text-slate-50"}`}
>
        <h1 className="uppercase absolute bottom-2 right-2 text-5xl font-bold text-end">
          {city}
        </h1>
        {error && <p className="absolute top-[50%] text-center bg-orange-500 text-white me-3 py-2 rounded">{error}</p>}
        {weatherData ? (
          <div>
            <img
              className="bg-slate-500 rounded absolute top-2 right-2 border border-orange-500 shadow shadow-slate-900"
              src={weatherData.icon}
              alt="météo"
            />
            <p className="absolute top-2 left-3 text-4xl font-black">
              {convertTimezoneToTime(weatherData.timezone)}
            </p>
            <p className="absolute top-32 right-2 text-2xl font-bold">
              {weatherData.main.temp}°C
            </p>
            <p className="absolute bottom-2 font-black text-2xl">
              Humidité: {weatherData.main.humidity}%
            </p>
          </div>
        ) : (
          <p>Chargement des données...</p>
        )}
        </div>
        
        <div className="flex flex-col justify-center">
      <button
        className="px-4 py-1 bg-orange-500 my-2 text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-orange-600"
        onClick={toggleDiv}
      >
        {isOpen ? "Fermer la carte" : "Afficher la carte"}
      </button>

      {isOpen && (
        <div className="">
           {weatherData && weatherData.coord ? (
            <MapContainer
              center={[position.lat, position.lon]} // Position initiale
              zoom={13}
              scrollWheelZoom={false}
              ref={(mapInstance) => {
                if (mapInstance) mapRef.current = mapInstance;
              }}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker position={[position.lat, position.lon]}>
                <Popup>
                  {weatherData.name} - {weatherData.weather[0].description}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p>Les coordonnées ne sont pas disponibles</p>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default DonneeMeteo;
