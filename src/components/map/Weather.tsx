import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudSun } from "react-icons/fa";
import { WeatherData } from "../../interfaces/Weather";
import { IconType } from "react-icons/lib";

interface WeatherProps {
  lat: number;
  lng: number;
  eventId: number;
}

interface EventDetailItemProps {
  Icon: IconType;
  text: string;
}

const EventDetailItem: React.FC<EventDetailItemProps> = ({ Icon, text }) => (
  <div className="flex items-center space-x-3 py-2">
    <Icon className="text-black text-lg flex-shrink-0" />
    <span className="text-sm text-black">{text}</span>
  </div>
);

export const Weather: React.FC<WeatherProps> = ({ lat, lng, eventId }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log(`Fetching weather for event: ${eventId}`);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=aff6fc402979f34945e133123d8bd143`
        );
        console.log(
          `Weather data received for event ${eventId}:`,
          response.data
        );
        setWeatherData({
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
        });
      } catch (error) {
        console.error(
          `Error fetching weather data for event ${eventId}:`,
          error
        );
        if (axios.isAxiosError(error)) {
          console.error("Response:", error.response?.data);
          console.error("Request:", error.request);
        }
      }
    };

    fetchWeather();
  }, [lat, lng, eventId]);

  if (!weatherData) return null;

  return (
    <EventDetailItem
      Icon={FaCloudSun}
      text={`${weatherData.temperature.toFixed(1)}°C, ${
        weatherData.description
      }`}
    />
  );
};
