import { Moon, Sun } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/40 bg-slate-950/70 backdrop-blur-lg text-slate-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight">TradeSim Pro</Link>
        <div className="flex items-center gap-3">
          {location.pathname === '/' && (
            <>
              <a href="#about" className="text-sm hover:text-cyan-400">About</a>
              <a href="#skills" className="text-sm hover:text-cyan-400">Skills</a>
            </>
          )}
          <NavLink to="/dashboard" className="text-sm hover:text-cyan-400">Dashboard</NavLink>
          {!isAuthenticated ? (
            <NavLink to="/auth" className="rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-cyan-400">Login</NavLink>
          ) : (
            <button onClick={logout} className="rounded-md border border-slate-600 px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-300">Logout</button>
          )}
          <button onClick={toggleTheme} className="rounded-full border border-slate-600 p-2 hover:border-cyan-400" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
