import { useState, useEffect } from "react";
export default function GitHubCard({ username }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`https://api.github.com/users/MUZIGA`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);
  if (loading) return <p className="text-center text-gray-600">Loading GitHub data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center">
      <img
        src={data.avatar_url}
        alt={data.name}
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-semibold mt-2 text-gray-800 dark:text-white">
        {data.name}
      </h2>
      <p className="text-gray-600 dark:text-gray-300">@{data.login}</p>
      <div className="flex justify-around mt-4 text-gray-800 dark:text-gray-200">
        <p>Repos: {data.public_repos}</p>
        <p>Followers: {data.followers}</p>
        <p>Following: {data.following}</p>
      </div>
    </div>
  );
}