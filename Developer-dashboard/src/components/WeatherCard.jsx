import { useEffect, useState } from "react";
function codeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] ?? "Unknown";
}
export default function WeatherCard({ city }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [localTime, setLocalTime] = useState("--:--:--");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=1`
        );
        if (!geoRes.ok) throw new Error(`Geocoding failed (${geoRes.status})`);
        const geo = await geoRes.json();
        if (!geo.results || geo.results.length === 0)
          throw new Error("City not found");

        const { latitude, longitude, timezone } = geo.results[0];
        setTimezone(timezone);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=${encodeURIComponent(
            timezone
          )}`
        );
        if (!weatherRes.ok) throw new Error(`Weather fetch failed (${weatherRes.status})`);
        const w = await weatherRes.json();
        if (!w || !w.current) throw new Error("Unexpected weather response");

        setWeather(w.current);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Unable to fetch weather");
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (!timezone) return;
    const tick = () => {
      try {
        const now = new Date();
        setLocalTime(
          now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: timezone,
          })
        );
      } catch (err) {
        console.error(err);
        setLocalTime("Invalid timezone");
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  if (loading) return <p className="text-center text-gray-600">Loading weather...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!weather) return <p className="text-center text-red-500">No weather data.</p>;

  return (
<div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
        {city}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-2">
        {codeToText(weather.weather_code)}
      </p>

      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
        {Math.round(weather.temperature_2m)}°C
      </p>

      <div className="mt-3 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
        <p>
          💨 <span className="font-medium">Wind:</span>{" "}
          {Math.round(weather.wind_speed_10m)} km/h
        </p>
        <p>
          🕒 <span className="font-medium">Local Time:</span> {localTime}
        </p>
      </div>
    </div>
  );
}