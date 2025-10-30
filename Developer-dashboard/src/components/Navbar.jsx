
export default function Navbar({ toggleTheme, theme }) {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Developer Dashboard
      </h1>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 font-medium hover:opacity-90 transition duration-300"
      >
        {theme === "light" ? (
          <>
            <span>🌙</span>
            <span>Dark Mode</span>
          </>
        ) : (
          <>
            <span>☀️</span>
            <span>Light Mode</span>
          </>
        )}
      </button>
    </nav>
  );
}
