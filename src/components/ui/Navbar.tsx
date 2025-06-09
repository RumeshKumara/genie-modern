import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Moon, Sun, LogIn, LogOut, User, Settings, Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled
        ? "bg-background/50 backdrop-blur-lg border-b border-border/40"
        : "bg-background"
    )}>
      <div className="container px-4 py-4 mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            <motion.div
              className="flex items-center justify-center w-10 h-10 text-white shadow-lg rounded-xl bg-gradient-to-br from-primary via-purple-800 to-purple-500"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={24} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-primary via-purple-700 to-purple-500 bg-clip-text">
                InterviewGenie
              </span>
              <span className="-mt-1 text-xs text-muted-foreground">AI Interview Coach</span>
            </motion.div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-8 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-lg",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
              end
            >
              {({ isActive }) => (
                <>
                  Dashboard
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/questions"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-lg",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {({ isActive }) => (
                <>
                  Questions
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/upgrade"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-lg flex items-center gap-2",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {({ isActive }) => (
                <>
                  <Crown size={16} className="text-yellow-500" />
                  Upgrade
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) => cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-lg",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {({ isActive }) => (
                <>
                  How it Works
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="navbar-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button 
              onClick={toggleTheme} 
              className="p-2 transition-all duration-300 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </motion.button>
            
            {/* Authentication */}
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-2 transition-all duration-300 rounded-lg hover:bg-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-purple-500">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{user.plan} Plan</p>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 w-56 mt-2 overflow-hidden border rounded-lg shadow-lg bg-card border-border"
                    >
                      <div className="p-4 border-b border-border">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.plan === 'pro' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {user.plan.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.interviewsThisMonth}/5 interviews
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <button className="flex items-center w-full gap-3 px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent">
                          <Settings size={16} />
                          Settings
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full gap-3 px-3 py-2 text-sm text-red-500 transition-colors rounded-md hover:bg-accent"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button 
              className="p-2 transition-colors duration-300 rounded-full md:hidden text-foreground/70 hover:text-foreground hover:bg-accent"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="mt-4 overflow-hidden border-t md:hidden border-border/40"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-2 py-4">
                <NavLink
                  to="/"
                  className={({ isActive }) => cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  end
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/questions"
                  className={({ isActive }) => cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Questions
                </NavLink>
                <NavLink
                  to="/upgrade"
                  className={({ isActive }) => cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown size={16} className="text-yellow-500" />
                  Upgrade
                </NavLink>
                <NavLink
                  to="/how-it-works"
                  className={({ isActive }) => cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </NavLink>
                
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 mx-4 mt-4 transition-all duration-300 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}