import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Download, Share2, User, Briefcase, Timer, Target, MessageCircle, Brain } from 'lucide-react';
import Confetti from 'react-confetti';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

interface Answer {
  answer: string;
  evaluation: {
    score: number;
    feedback: string;
    improvements: string[];
  };
}

interface LearningResource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course';
}

export default function InterviewResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);

  // Calculate overallScore first
  const overallScore = Object.keys(answers).length > 0
    ? Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      )
    : 0;

  useEffect(() => {
    const interviewData = location.state?.interview || JSON.parse(localStorage.getItem('selectedInterview') || 'null');
    const answersData = localStorage.getItem('interviewAnswers');
    const questionsData = localStorage.getItem('interviewQuestions');
    
    if (!interviewData || !answersData || !questionsData) {
      console.log('Missing data:', { interviewData, answersData, questionsData });
      // navigate('/');
      // return;
    }

    setInterview(interviewData);
    const parsedAnswers = answersData ? JSON.parse(answersData) : {};
    const parsedQuestions = questionsData ? JSON.parse(questionsData) : [];
    setAnswers(parsedAnswers);
    setQuestions(parsedQuestions);

    // Set resources based on feedback
    if (interviewData?.feedback?.improvements) {
      setResources([
        {
          title: "System Design Interview Guide",
          url: "https://example.com/guide",
          type: "article"
        },
        {
          title: "Data Structures Fundamentals",
          url: "https://example.com/ds",
          type: "course"
        },
        ...interviewData.feedback.improvements.map((imp: string) => ({
          title: `Guide: ${imp}`,
          url: "https://example.com/guide",
          type: "article"
        }))
      ]);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const feedback = [
    {
      category: "Technical Knowledge",
      score: Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      ),
      feedback: "Overall technical understanding demonstrated",
      improvements: Array.from(
        new Set(
          Object.values(answers)
            .flatMap(answer => answer.evaluation.improvements)
            .slice(0, 2)
        )
      )
    },
    {
      category: "Communication",
      score: Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      ),
      feedback: "Clear and structured responses provided",
      improvements: [
        "Use more specific examples",
        "Reduce filler words"
      ]
    },
    {
      category: "Problem Solving",
      score: Math.round(
        Object.values(answers).reduce((acc, answer) => acc + answer.evaluation.score, 0) / 
        Object.keys(answers).length
      ),
      feedback: "Good approach to problem-solving demonstrated",
      improvements: [
        "Explain thought process more clearly",
        "Consider edge cases"
      ]
    }
  ];

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return '📹';
      case 'course': return '📚';
      default: return '📄';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const interviewDetails = {
    candidate: {
      name: "John Smith",
      role: "Senior Frontend Developer",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Node.js", "System Design"]
    },
    interview: {
      duration: "45 minutes",
      questionsAnswered: questions.length,
      communicationScore: 85,
      technicalScore: 92,
      overallScore: overallScore
    },
    keyHighlights: [
      "Excellent problem-solving approach",
      "Strong communication skills",
      "Deep understanding of React ecosystem",
      "Good system design principles"
    ]
  };

  return (
    <AnimatePresence>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <motion.div
        className="container max-w-4xl p-4 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3 
            }}
            className="inline-block"
          >
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Award className="w-12 h-12" />
            </div>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text"
          >
            Interview Results
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground">
            {interview?.title || 'Interview Performance Review'}
          </motion.p>
        </motion.div>

        {/* Interview Details */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="p-6 overflow-hidden">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <h3 className="text-sm text-muted-foreground">Job Role</h3>
                <p className="text-lg font-medium">{interview?.jobRole}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Experience Level</h3>
                <p className="text-lg font-medium">{interview?.yearsOfExperience}</p>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Overall Score */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Overall Performance</h2>
              <div className="text-6xl font-bold text-primary">{overallScore}%</div>
              <p className="text-muted-foreground">
                {overallScore >= 80 ? 'Excellent job!' : 
                 overallScore >= 60 ? 'Good effort!' : 
                 'Keep practicing!'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Interview Information */}
        <motion.div variants={itemVariants} className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Interview Details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Candidate Info */}
            <Card className="p-6 overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Candidate Profile</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{interviewDetails.candidate.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">{interviewDetails.candidate.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">{interviewDetails.candidate.experience}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {interviewDetails.candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Card>

            {/* Interview Stats */}
            <Card className="p-6 overflow-hidden bg-gradient-to-br from-purple-500/5 to-transparent">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-500/10">
                    <Brain className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">Performance Metrics</h3>
                </div>
                <div className="space-y-4">
                  {/* Scores Display */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background/50">
                      <div className="text-sm text-muted-foreground">Technical</div>
                      <div className="text-2xl font-bold text-purple-500">
                        {interviewDetails.interview.technicalScore}%
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <div className="text-sm text-muted-foreground">Communication</div>
                      <div className="text-2xl font-bold text-purple-500">
                        {interviewDetails.interview.communicationScore}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Interview Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{interviewDetails.interview.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Questions</span>
                      <span className="font-medium">{interviewDetails.interview.questionsAnswered}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </div>
          
          {/* Key Highlights */}
          <Card className="p-6 mt-6 overflow-hidden bg-gradient-to-br from-green-500/5 to-transparent">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold">Key Highlights</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {interviewDetails.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Question Review */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Question Review</h2>
            {questions.map((question, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                    <span className="text-2xl font-bold text-primary">
                      {answers[index]?.evaluation.score}%
                    </span>
                  </div>
                  <p className="text-muted-foreground">{question.question}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Feedback</h4>
                    <p className="text-muted-foreground">{answers[index]?.evaluation.feedback}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Areas to Improve</h4>
                    <ul className="space-y-1">
                      {answers[index]?.evaluation.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-primary" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Learning Resources */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recommended Resources</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-primary/5"
                  >
                    <span className="text-2xl">{renderResourceIcon(resource.type)}</span>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm capitalize text-muted-foreground">{resource.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Action buttons with hover animations */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col justify-center gap-4 mt-8 sm:flex-row"
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 transition-transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              const data = {
                questions,
                answers,
                overallScore,
                feedback
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'interview-results.json';
              a.click();
            }}
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(
                `I just completed an AI interview and scored ${overallScore}%! 🎉`
              );
            }}
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}