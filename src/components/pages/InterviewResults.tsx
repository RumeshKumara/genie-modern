import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Download, Share2, FileText, User, Briefcase, Timer, Target, MessageCircle, Brain, BookOpen, Video, GraduationCap, ArrowUpRight, X, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

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
      case 'video': return <Video className="w-6 h-6 text-blue-500" />;
      case 'course': return <GraduationCap className="w-6 h-6 text-green-500" />;
      default: return <BookOpen className="w-6 h-6 text-purple-500" />;
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(var(--primary) / 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: { scale: 0.98 }
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

  const QuestionModal = ({ questionIndex, onClose }: { questionIndex: number; onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl p-6 mx-4 space-y-4 bg-background/95 backdrop-blur-md rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">Question {questionIndex + 1}</h3>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-full hover:bg-primary/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Question */}
          <div className="p-4 space-y-2 rounded-lg bg-primary/5">
            <h4 className="font-medium">Question:</h4>
            <p className="text-muted-foreground">{questions[questionIndex].question}</p>
          </div>

          {/* Your Answer */}
          <div className="p-4 space-y-2 rounded-lg bg-blue-500/5">
            <h4 className="font-medium text-blue-500">Your Answer:</h4>
            <p className="text-muted-foreground">{answers[questionIndex]?.answer}</p>
          </div>

          {/* Evaluation */}
          <div className="p-4 space-y-4 rounded-lg bg-green-500/5">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-green-500">Evaluation</h4>
              <span className="px-3 py-1 text-sm font-medium text-green-500 rounded-full bg-green-500/10">
                {answers[questionIndex]?.evaluation.score}%
              </span>
            </div>
            <p className="text-muted-foreground">{answers[questionIndex]?.evaluation.feedback}</p>
          </div>

          {/* Improvements */}
          <div className="p-4 space-y-3 rounded-lg bg-purple-500/5">
            <h4 className="font-medium text-purple-500">Areas to Improve</h4>
            <ul className="space-y-2">
              {answers[questionIndex]?.evaluation.improvements.map((improvement, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 mt-1 text-purple-500 shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const QuestionCard = ({ question, index, answers }: any) => (
    <motion.div
      variants={cardHoverVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => setSelectedQuestion(index)}
    >
      <Card className="relative p-6 transition-all cursor-pointer rounded-3xl group">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">Question {index + 1}</h3>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary"
            >
              {answers[index]?.evaluation.score}%
            </motion.span>
          </div>
          <p className="text-muted-foreground line-clamp-2">{question.question}</p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Click to view details</span>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );

  const downloadPDF = async () => {
    const element = document.getElementById('interview-results');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`interview-results-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleShare = async (type: 'copy' | 'whatsapp' | 'telegram') => {
    const shareText = `I just completed an AI interview and scored ${overallScore}%! 🎉`;
    const shareUrl = window.location.href;

    switch (type) {
      case 'copy':
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        // You might want to add a toast notification here
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const ShareMenu = () => (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setShowShareMenu(!showShareMenu)}
      >
        <Share2 className="w-4 h-4" />
        Share Results
      </Button>

      {showShareMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 z-50 p-2 mt-2 space-y-2 border shadow-lg bg-background rounded-xl w-52"
        >
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center w-full gap-2 p-2 text-sm transition-colors rounded-lg hover:bg-primary/10"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center w-full gap-2 p-2 text-sm transition-colors rounded-lg hover:bg-primary/10"
          >
            <MessageCircle className="w-4 h-4" />
            Share on WhatsApp
          </button>
          <button
            onClick={() => handleShare('telegram')}
            className="flex items-center w-full gap-2 p-2 text-sm transition-colors rounded-lg hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4" />
            Share on Telegram
          </button>
        </motion.div>
      )}
    </div>
  );

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
        id="interview-results"
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
          <Card className="p-6 overflow-hidden rounded-3xl">
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
          <Card className="p-8 text-center rounded-3xl">
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
            <Card className="p-6 overflow-hidden bg-gradient-to-br from-primary/5 to-transparent rounded-3xl">
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
            <Card className="p-6 overflow-hidden bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl">
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
          <Card className="p-6 mt-6 overflow-hidden bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl">
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
            <motion.div 
              className="grid gap-4 sm:grid-cols-2"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  question={question}
                  index={index}
                  answers={answers}
                />
              ))}
            </motion.div>
          </div>
          <AnimatePresence>
            {selectedQuestion !== null && (
              <QuestionModal
                questionIndex={selectedQuestion}
                onClose={() => setSelectedQuestion(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Learning Resources */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recommended Resources</h2>
            <Card className="p-6 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-3xl">
              <motion.div className="space-y-4">
                {resources.map((resource, index) => (
                  <motion.a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 transition-all duration-200 rounded-3xl group hover:bg-primary/10 "
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-background">
                        {renderResourceIcon(resource.type)}
                      </div>
                      <div>
                        <h3 className="font-medium transition-colors group-hover:text-primary">
                          {resource.title}
                        </h3>
                        <p className="text-sm capitalize text-muted-foreground">
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                  </motion.a>
                ))}
              </motion.div>
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
            onClick={downloadPDF}
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </Button>
          <ShareMenu />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}