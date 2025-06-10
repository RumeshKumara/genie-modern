import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 transition-colors text-muted-foreground hover:text-foreground"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </motion.button>

        <Card className="p-8 shadow-2xl backdrop-blur-sm bg-card/80 border-border/50 rounded-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white shadow-lg rounded-2xl bg-gradient-to-br from-primary via-purple-700 to-purple-400"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary via-purple-700 to-purple-400 bg-clip-text">
              Welcome Back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue your interview practice journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-2xl border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full py-3 pl-10 pr-12 transition-all duration-300 border rounded-2xl border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition-colors -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full py-3 transition-all duration-300 rounded-2xl "
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-8 text-sm text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>
              Don't have an account?{' '}
              <button className="font-medium transition-colors text-primary hover:underline">
                Sign up for free
              </button>
            </p>
            <p className="mt-2">
              <button className="transition-colors text-primary hover:underline">
                Forgot your password?
              </button>
            </p>
          </motion.div>
        </Card>

       
      </motion.div>
    </div>
  );
}