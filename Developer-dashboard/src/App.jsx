import React from "react";
import { useEffect, useState } from "react";
import GitHubCard from "./components/GitHubcard.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import Navbar from "./components/Navbar.jsx";
function App() {
  const username = "Bonifilda";
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <div className="container mx-auto p-4 grid gap-6 md:grid-cols-2">
        <GitHubCard username={username} />
        <WeatherCard city="Kigali" />
      </div>
    </div>
  );
}
export default App;