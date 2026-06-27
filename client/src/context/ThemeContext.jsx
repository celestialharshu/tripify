import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

// small wrapper so components can just call useTheme() instead of useContext(ThemeContext)
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // figure out the starting theme: saved preference > system preference > light
  const getInitialTheme = () => {
    const saved = localStorage.getItem("tripify_theme");
    if (saved) return saved;

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return systemPrefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // whenever theme changes, update the html tag and remember the choice
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tripify_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
