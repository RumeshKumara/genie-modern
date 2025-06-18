import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Moon, Sun, LogIn, Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, useClerk } from '@clerk/clerk-react';  // Add useClerk import
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton, SignInButton } from '@clerk/clerk-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();  // Add this hook
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

  const handleSignOut = async () => {
    await signOut();
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
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-full",
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
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-full",
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
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-full flex items-center gap-2",
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
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 overflow-hidden rounded-full",
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
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </motion.button>
              </SignInButton>
            ) : (
              <div className="relative">
                <UserButton 
                  afterSignOutUrl="/"
                  signOut={handleSignOut}
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonTrigger: "hover:bg-accent rounded-full p-2 transition-all duration-300",
                      userButtonPopover: "bg-card border border-border shadow-lg rounded-3xl overflow-hidden",
                      userPreview: "border-b border-border",
                    }
                  }}
                />
              </div>
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
                    "px-4 py-3 rounded-full text-sm font-medium transition-all duration-300",
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
                    "px-4 py-3 rounded-full text-sm font-medium transition-all duration-300",
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
                    "px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
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
                    "px-4 py-3 rounded-full text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </NavLink>
                
                {!isSignedIn && (
                  <SignInButton mode="redirect">
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-3 mx-4 mt-4 transition-all duration-300 rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <LogIn size={16} />
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}