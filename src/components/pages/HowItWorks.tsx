import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { MessageSquare, Monitor, Brain, Award, Zap, Users, Target, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const stepCard = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.6,
      bounce: 0.3
    }
  }
};

const stepIndicator = {
  hidden: { scale: 0, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      delay: 0.2
    }
  }
};

export default function HowItWorks() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([0]); // Start with first step visible

  const steps = [
    {
      icon: <MessageSquare className="w-10 h-10 text-primary" />,
      title: "Create Your Interview",
      description: "Select the type of interview you want to practice, from technical to behavioral questions.",
      stepNumber: "01",
      features: [
        "Choose from 10+ interview types",
        "Customize difficulty level",
        "Set interview duration"
      ]
    },
    {
      icon: <Monitor className="w-10 h-10 text-primary" />,
      title: "Start the Session",
      description: "Join a video session where our AI interviewer will ask you questions based on your selected interview type.",
      stepNumber: "02",
      features: [
        "HD video recording",
        "Real-time AI interaction",
        "Natural conversation flow"
      ]
    },
    {
      icon: <Brain className="w-10 h-10 text-primary" />,
      title: "Get Intelligent Feedback",
      description: "Our AI analyzes your responses and provides detailed, personalized feedback to help you improve.",
      stepNumber: "03",
      features: [
        "Voice tone analysis",
        "Body language assessment",
        "Content quality scoring"
      ]
    },
    {
      icon: <Award className="w-10 h-10 text-primary" />,
      title: "Track Your Progress",
      description: "Review your past interviews, see your improvement over time, and focus on areas that need more practice.",
      stepNumber: "04",
      features: [
        "Performance analytics",
        "Improvement trends",
        "Skill recommendations"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (!visibleSteps.includes(nextStep)) {
        setVisibleSteps(prev => [...prev, nextStep]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setVisibleSteps([0]);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    // Reveal all steps up to the clicked one
    const stepsToReveal = Array.from({ length: index + 1 }, (_, i) => i);
    setVisibleSteps(stepsToReveal);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Real-time Analysis",
      description: "Get instant feedback on your responses, body language, and communication style."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Industry Experts",
      description: "Our AI is trained on feedback from top industry professionals across various fields."
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: "Personalized Practice",
      description: "Focus on areas where you need the most improvement with tailored question sets."
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      title: "Flexible Schedule",
      description: "Practice at your own pace, 24/7, from anywhere in the world."
    }
  ];

  const handleStartPracticing = () => {
    // Create default interview data for quick practice
    const defaultInterviewData = {
      title: 'Quick Practice Session',
      jobRole: 'Software Developer',
      yearsOfExperience: '2-4 years',
      reasonForInterview: 'practice',
      timestamp: new Date().toISOString()
    };
    
    // Store interview data in localStorage
    localStorage.setItem('interviewData', JSON.stringify(defaultInterviewData));
    
    // Navigate to interview setup
    navigate('/interview/setup');
  };

  return (
    <motion.div 
      className="space-y-12 md:px-8 lg:px-12"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Hero Section */}
      <motion.div variants={item} className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
          Master Your Interview Skills
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          Practice with our AI-powered platform and get personalized feedback to improve your interview performance
        </p>
        <Button size="lg" className="mt-6 rounded-2xl" onClick={handleStartPracticing}>
          Start Practicing Now
        </Button>
      </motion.div>

      {/* How It Works Steps */}
      <motion.div variants={item}>
        <Card className='border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-background to-background/50'>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">The InterviewGenie Process</CardTitle>
                <CardDescription>
                  Our AI-powered platform makes interview preparation simple and effective
                  <span className="block mt-2 text-sm text-muted-foreground">
                    Click "Next" to see each step or click on any step indicator below
                  </span>
                </CardDescription>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-2xl"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 rounded-2xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2 rounded-2xl"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 mt-4 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="hidden lg:block absolute top-1/2 left-full w-8 h-[2px] bg-gradient-to-r from-primary to-primary/20 -translate-y-1/2 z-0 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: visibleSteps.includes(index) && visibleSteps.includes(index + 1) ? 1 : 0 
                      }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  )}
                  
                  {/* Step Card */}
                  <motion.div
                    className={`relative z-10 cursor-pointer ${
                      currentStep === index ? 'ring-2 ring-primary ring-offset-4 rounded-3xl' : ''
                    }`}
                    variants={stepCard}
                    initial="hidden"
                    animate={visibleSteps.includes(index) ? "show" : "hidden"}
                    onClick={() => handleStepClick(index)}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Card className={`h-full transition-all duration-500 rounded-3xl border-0 shadow-xl ${
                      visibleSteps.includes(index) 
                        ? 'bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-2xl shadow-primary/10' 
                        : 'bg-muted/20 opacity-50'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                          {/* Step Number Indicator */}
                          <motion.div
                            className={`absolute -top-3 -right-3 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold shadow-lg ${
                              visibleSteps.includes(index)
                                ? 'bg-primary text-primary-foreground shadow-primary/30'
                                : 'bg-muted text-muted-foreground'
                            }`}
                            variants={stepIndicator}
                            initial="hidden"
                            animate={visibleSteps.includes(index) ? "show" : "hidden"}
                          >
                            {step.stepNumber}
                          </motion.div>
                          
                          {/* Icon */}
                          <motion.div 
                            className={`p-4 rounded-3xl transition-all duration-500 shadow-lg ${
                              visibleSteps.includes(index)
                                ? 'bg-primary/10 scale-110 shadow-primary/20'
                                : 'bg-muted/10 scale-100'
                            }`}
                            animate={{
                              rotate: visibleSteps.includes(index) ? [0, 10, -10, 0] : 0
                            }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            {step.icon}
                          </motion.div>
                          
                          {/* Content */}
                          <div className="space-y-3">
                            <motion.h3 
                              className="text-lg font-semibold"
                              animate={{
                                color: visibleSteps.includes(index) ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {step.title}
                            </motion.h3>
                            <motion.p 
                              className="text-sm text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ 
                                opacity: visibleSteps.includes(index) ? 1 : 0.5 
                              }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              {step.description}
                            </motion.p>
                            
                            {/* Features List */}
                            <motion.div
                              className="space-y-1"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ 
                                opacity: visibleSteps.includes(index) ? 1 : 0,
                                height: visibleSteps.includes(index) ? 'auto' : 0
                              }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                            >
                              {step.features.map((feature, featureIndex) => (
                                <motion.div
                                  key={featureIndex}
                                  className="flex items-center gap-2 text-xs text-muted-foreground"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ 
                                    opacity: visibleSteps.includes(index) ? 1 : 0,
                                    x: visibleSteps.includes(index) ? 0 : -10
                                  }}
                                  transition={{ 
                                    duration: 0.3, 
                                    delay: 0.5 + (featureIndex * 0.1)
                                  }}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                                  {feature}
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
            
            {/* Progress Indicator */}
            <motion.div 
              className="flex justify-center mt-8 space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-4 h-4 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg ${
                    visibleSteps.includes(index) ? 'bg-primary shadow-primary/30' : 'bg-muted'
                  } ${currentStep === index ? 'ring-2 ring-primary ring-offset-4' : ''}`}
                  animate={{
                    scale: visibleSteps.includes(index) ? 1.2 : 1
                  }}
                  whileHover={{ scale: 1.5 }}
                  onClick={() => handleStepClick(index)}
                />
              ))}
            </motion.div>
            
            {/* Step Counter */}
            <motion.div
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="px-4 py-2 text-sm text-muted-foreground bg-muted/20 rounded-2xl">
                Step {currentStep + 1} of {steps.length} - {visibleSteps.length} revealed
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Features Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={container}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <Card className="h-full border-0 shadow-xl card-hover-effect rounded-3xl bg-gradient-to-br from-background to-background/80">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 shadow-lg rounded-3xl bg-background">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl">
          <CardContent className="p-8 space-y-4 text-center">
            <h2 className="text-2xl font-bold">Ready to Ace Your Next Interview?</h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Join thousands of job seekers who have improved their interview skills with InterviewGenie
            </p>
            <Button size="lg" className="mt-4 shadow-lg rounded-2xl" onClick={handleStartPracticing}>
              Get Started for Free
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}