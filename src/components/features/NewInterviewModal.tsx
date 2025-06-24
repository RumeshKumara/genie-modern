import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Briefcase, FileText, Clock, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import Button from '../ui/Button';

interface NewInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    jobRole: string; 
    yearsOfExperience: string;
    reasonForInterview: string;
  }) => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modal = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const experienceOptions = [
  "0-1 years",
  "1-3 years", 
  "3-5 years",
  "5-8 years",
  "8+ years"
];

const reasonOptions = [
  { value: "new-job", label: "Looking for a new job" },
  { value: "practice", label: "General practice" },
  { value: "upcoming", label: "Preparing for upcoming interview" },
  { value: "skills", label: "Improving interview skills" },
  { value: "career-switch", label: "Switching career paths" }
];

export default function NewInterviewModal({ isOpen, onClose, onSubmit }: NewInterviewModalProps) {
  const navigate = useNavigate();
  const { isSignedIn, userId } = useAuth();
  const { signIn } = useSignIn();
  const [formData, setFormData] = useState({
    title: '',
    jobRole: '',
    yearsOfExperience: '',
    reasonForInterview: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      // Redirect to Clerk sign-in
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_google', // or your preferred strategy
        redirectUrl: window.location.href,
        redirectUrlComplete: '/interview/setup'
      });
      return;
    }

    // Store interview data in localStorage
    localStorage.setItem('interviewData', JSON.stringify({
      ...formData,
      timestamp: new Date().toISOString(),
      userId: userId
    }));

    // Navigate to interview setup
    navigate('/interview/setup');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div 
            className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border/50"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-br from-primary via-purple-700 to-purple-400"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles size={20} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary via-purple-700 to-purple-500 bg-clip-text">
                  Create New Interview
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 transition-colors rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText size={16} className="text-primary" />
                  Interview Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 transition-all duration-200 border rounded-2xl border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                  placeholder="e.g., Frontend Developer Interview"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="jobRole" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Briefcase size={16} className="text-primary" />
                  Job Role
                </label>
                <input
                  type="text"
                  id="jobRole"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 transition-all duration-200 border rounded-2xl border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                  placeholder="e.g., Senior React Developer"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="yearsOfExperience" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock size={16} className="text-primary" />
                  Years of Experience
                </label>
                <select
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 transition-colors duration-300 ease-in-out border rounded-2xl border-input bg-background/50 hover:bg-accent/20 focus:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm text-foreground [&>option]:transition-colors [&>option]:duration-300 [&>option]:bg-background [&>option:checked]:bg-primary/80 [&>option:checked]:text-white"
                >
                  <option value="" className="text-muted-foreground bg-background/90 hover:bg-accent/50">Select experience level</option>
                  {experienceOptions.map(option => (
                    <option 
                      key={option} 
                      value={option} 
                      className="text-foreground bg-background/90 hover:bg-accent/50"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="reasonForInterview" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Award size={16} className="text-primary" />
                  Why are you interviewing?
                </label>
                <select
                  id="reasonForInterview"
                  name="reasonForInterview"
                  value={formData.reasonForInterview}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 transition-colors duration-300 ease-in-out border rounded-2xl border-input bg-background/50 hover:bg-accent/20 focus:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm text-foreground [&>option]:transition-colors [&>option]:duration-300 [&>option]:bg-background [&>option:checked]:bg-primary/80 [&>option:checked]:text-white"
                >
                  <option value="" className="text-muted-foreground bg-background/90 hover:bg-accent/50">Select your goal</option>
                  {reasonOptions.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="text-foreground bg-background/90 hover:bg-accent/50"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              

              <motion.div 
                className="flex justify-end gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="button-hover-effect"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.title || !formData.jobRole || !formData.yearsOfExperience || !formData.reasonForInterview}
                  className="button-hover-effect"
                >
                  {isSignedIn ? 'Start Interview' : 'Sign In to Continue'}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}