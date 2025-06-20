import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, MessageSquare, Mic, Video, AlertCircle, ChevronRight, ChevronLeft,
  CheckCircle, XCircle, Award, ThumbsUp, ThumbsDown, BookOpen, Target,
  VideoOff, MicOff, Play, Pause, RotateCcw, Settings, Eye, EyeOff, Volume2
} from 'lucide-react';
import Webcam from 'react-webcam';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

const dummyQuestions = [
  {
    id: 1,
    question: "Can you explain the concept of React hooks and give examples of commonly used hooks?",
    keyPoints: ["useState", "useEffect", "Custom Hooks", "Rules of Hooks"],
    expectedAnswer: "React hooks are functions that allow you to use state and other React features in functional components. Common hooks include useState for managing state, useEffect for side effects, useContext for context API, and useRef for mutable references. Custom hooks can be created to reuse stateful logic across components.",
    difficulty: "medium",
    category: "Technical",
  },
  {
    id: 2,
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    keyPoints: ["Problem Solving", "Team Collaboration", "Technical Challenges", "Results"],
    expectedAnswer: "A good answer should include: specific project details, challenges faced, actions taken to resolve issues, collaboration with team members, and measurable results or outcomes achieved.",
    difficulty: "hard",
    category: "Behavioral",
  },
  {
    id: 3,
    question: "How do you handle state management in large React applications?",
    keyPoints: ["Redux", "Context API", "State Architecture", "Performance"],
    expectedAnswer: "For large applications, consider using Redux or Context API based on needs. Redux is suitable for complex state with many updates, while Context works well for simpler cases. Important to structure state properly and consider performance implications.",
    difficulty: "hard",
    category: "Technical",
  },
  {
    id: 4,
    question: "What's your approach to writing clean and maintainable code?",
    keyPoints: ["Code Standards", "Documentation", "Testing", "Code Review"],
    expectedAnswer: "Focus on: consistent coding standards, clear documentation, comprehensive testing, regular code reviews, modular architecture, and following SOLID principles. Examples of refactoring and improving code quality are valuable.",
    difficulty: "medium",
    category: "Technical",
  },
  {
    id: 5,
    question: "How do you stay updated with the latest technology trends?",
    keyPoints: ["Learning Resources", "Practice", "Community", "Time Management"],
    expectedAnswer: "Discuss: reading tech blogs, participating in communities, working on side projects, attending conferences/meetups, following industry leaders, and balancing learning with practical application.",
    difficulty: "easy",
    category: "Behavioral",
  }
];

interface Answer {
  answer: string;
  evaluation: {
    score: number;
    feedback: string;
    improvements: string[];
    strengths: string[];
    keyPointsCovered: string[];
    missingPoints: string[];
  };
}

const difficultyColors = {
  easy: "text-green-500 bg-green-500/10 border-green-500/20",
  medium: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  hard: "text-red-500 bg-red-500/10 border-red-500/20"
};

const categoryColors = {
  Technical: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Behavioral: "text-purple-500 bg-purple-500/10 border-purple-500/20"
};

export default function InterviewSession() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState('');
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [showExpectedAnswer, setShowExpectedAnswer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isRecording) {
      handleStopRecording();
    }
  }, [timeLeft, isRecording]);

  const handleStartRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isCameraOn, 
        audio: isMicOn 
      });
      
      if (webcamRef.current && isCameraOn) {
        webcamRef.current.video!.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('Recording data available');
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeLeft(180);
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionError('Failed to start recording. Please check your device permissions.');
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    setIsEvaluating(true);
    
    // Simulate AI evaluation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const currentQuestion = dummyQuestions[currentQuestionIndex];
    const coveredPoints = currentQuestion.keyPoints
      .filter(() => Math.random() > 0.3);
    const missingPoints = currentQuestion.keyPoints
      .filter(point => !coveredPoints.includes(point));

    const evaluation = {
      score: Math.floor(Math.random() * 30) + 70,
      feedback: "Your answer demonstrated good understanding of the core concepts.",
      improvements: [
        "Provide more specific examples",
        "Structure your answer more clearly",
        "Cover all key points systematically"
      ],
      strengths: [
        "Clear communication",
        "Good technical depth",
        "Logical flow of ideas"
      ],
      keyPointsCovered: coveredPoints,
      missingPoints: missingPoints
    };

    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        answer: notes,
        evaluation
      }
    }));
    
    setIsEvaluating(false);
    setShowEvalModal(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < dummyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setNotes(answers[currentQuestionIndex + 1]?.answer || '');
      setTimeLeft(180);
      setIsRecording(false);
      setShowExpectedAnswer(false);
    } else {
      const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr.evaluation.score, 0);
      const averageScore = Math.round(totalScore / Object.keys(answers).length);

      localStorage.setItem('interviewAnswers', JSON.stringify(answers));
      localStorage.setItem('interviewQuestions', JSON.stringify(dummyQuestions));
      localStorage.setItem('overallScore', averageScore.toString());

      navigate('/interview/results');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setNotes(answers[currentQuestionIndex - 1]?.answer || '');
      setTimeLeft(180);
      setIsRecording(false);
      setShowExpectedAnswer(false);
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (mediaRecorderRef.current && isRecording) {
      // Restart recording with new settings
      handleStopRecording();
      setTimeout(() => handleStartRecording(), 500);
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (mediaRecorderRef.current && isRecording) {
      // Restart recording with new settings
      handleStopRecording();
      setTimeout(() => handleStartRecording(), 500);
    }
  };

  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9; // Slightly slower for better clarity
    speech.pitch = 1;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(speech);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getTimeColor = () => {
    if (timeLeft <= 30) return "text-red-500 animate-pulse";
    if (timeLeft <= 60) return "text-orange-500";
    return "text-primary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container p-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left Column - Question and Notes */}
          <div className="space-y-6 xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden border shadow-2xl bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-xl rounded-2xl border-border/50"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="p-8 space-y-8"
                >
                  {/* Progress Bar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-purple-600">
                        Question {currentQuestionIndex + 1} of {dummyQuestions.length}
                      </h2>
                      <motion.div 
                        className={`flex items-center gap-3 px-6 py-3 rounded-full font-mono text-lg font-bold ${getTimeColor()} bg-card border border-border shadow-lg`}
                        animate={{ scale: timeLeft <= 30 ? [1, 1.05, 1] : 1 }}
                        transition={{ repeat: timeLeft <= 30 ? Infinity : 0, duration: 1 }}
                      >
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {dummyQuestions.map((_, index) => (
                        <motion.div
                          key={index}
                          className="flex-1 h-3 overflow-hidden rounded-full bg-purple-900/10"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <motion.div
                            className="h-full bg-purple-700"
                            initial={{ width: "0%" }}
                            animate={{
                              width: index < currentQuestionIndex
                                ? "100%"
                                : index === currentQuestionIndex
                                ? "50%"
                                : "0%"
                            }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Question Header */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <motion.span 
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${
                          difficultyColors[dummyQuestions[currentQuestionIndex].difficulty]
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {dummyQuestions[currentQuestionIndex].difficulty.toUpperCase()}
                      </motion.span>
                      <motion.span 
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${
                          categoryColors[dummyQuestions[currentQuestionIndex].category]
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {dummyQuestions[currentQuestionIndex].category}
                      </motion.span>
                    </div>

                    {/* Question Content */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="p-6 border bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-xl border-primary/10">
                        <div className="flex items-start gap-3">
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                            whileTap={{ scale: 0.95, rotate: 0 }}
                            onClick={() => speakText(dummyQuestions[currentQuestionIndex].question)}
                            className="flex-shrink-0 p-2 rounded-full hover:bg-primary/10"
                            aria-label="Speak question"
                          >
                            <Volume2 className="w-5 h-5 text-primary" />
                          </motion.button>
                          <motion.p
                            className="text-xl font-medium leading-relaxed"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            {dummyQuestions[currentQuestionIndex].question}
                          </motion.p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Key Points to Cover</h4>
                        <div className="flex flex-wrap gap-2">
                          {dummyQuestions[currentQuestionIndex].keyPoints.map((point, index) => (
                            <motion.span
                              key={index}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              whileHover={{ scale: 1.05 }}
                              className="px-4 py-2 text-sm font-medium border rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border-primary/20"
                            >
                              {point}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-muted-foreground">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Your Notes & Answer
                    </div>
                    <motion.textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-48 p-6 text-lg leading-relaxed transition-all duration-300 border resize-none rounded-xl border-input bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="Start typing your answer here... Be detailed and cover the key points mentioned above."
                      disabled={isRecording}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  {/* Evaluation Results */}
                  {answers[currentQuestionIndex] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="p-8 space-y-6 border bg-gradient-to-br from-card via-card to-card/50 border-border/50 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="flex items-center gap-3 text-xl font-bold">
                            <motion.div
                              className="p-2 bg-purple-600 rounded-full"
                              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Award className="w-5 h-5 text-white" />
                            </motion.div>
                            Evaluation Results
                          </h3>
                          <motion.span 
                            className={`text-4xl font-bold ${
                              getScoreColor(answers[currentQuestionIndex].evaluation.score)
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                          >
                            {answers[currentQuestionIndex].evaluation.score}%
                          </motion.span>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <h4 className="flex items-center gap-2 font-semibold text-green-600">
                              <ThumbsUp className="w-4 h-4" />
                              Strengths
                            </h4>
                            <ul className="space-y-2">
                              {answers[currentQuestionIndex].evaluation.strengths.map((strength, i) => (
                                <motion.li 
                                  key={i} 
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>

                          <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <h4 className="flex items-center gap-2 font-semibold text-orange-600">
                              <Target className="w-4 h-4" />
                              Areas to Improve
                            </h4>
                            <ul className="space-y-2">
                              {answers[currentQuestionIndex].evaluation.improvements.map((improvement, i) => (
                                <motion.li 
                                  key={i} 
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                  <XCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                  {improvement}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <Button
                            variant="outline"
                            onClick={() => setShowExpectedAnswer(!showExpectedAnswer)}
                            className="flex items-center justify-center w-full gap-2 hover:bg-primary/5"
                          >
                            <BookOpen className="w-4 h-4" />
                            {showExpectedAnswer ? 'Hide' : 'Show'} Model Answer
                            <motion.div
                              animate={{ rotate: showExpectedAnswer ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                          </Button>
                        </div>

                        <AnimatePresence>
                          {showExpectedAnswer && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-3 border-t border-border/30">
                                <h4 className="font-semibold text-primary">Model Answer</h4>
                                <div className="p-4 border rounded-lg bg-primary/5 border-primary/10">
                                  <p className="text-sm leading-relaxed">
                                    {dummyQuestions[currentQuestionIndex].expectedAnswer}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Controls - Remove this section */}
                  <div className="flex items-center gap-4 pt-4">
                    {/* Remove all the button content here */}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Video and Progress */}
          <div className="space-y-6">
            {/* Video Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden border shadow-2xl bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-xl rounded-2xl border-border/50"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Camera Feed</h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={toggleCamera}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isCameraOn 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      onClick={toggleMic}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isMicOn 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 transition-all duration-300 rounded-full hover:bg-accent"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Settings className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-black aspect-video rounded-xl">
                  {isCameraOn ? (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="object-cover w-full h-full"
                      mirrored
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                      <motion.div 
                        className="space-y-4 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <VideoOff className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-gray-400">Camera is off</p>
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Status Indicators */}
                  <div className="absolute flex gap-2 top-4 left-4">
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full"
                        >
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />
                          REC
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="absolute flex gap-2 top-4 right-4">
                    <motion.div 
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isCameraOn ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {isCameraOn ? <Video size={12} /> : <VideoOff size={12} />}
                    </motion.div>
                    <motion.div 
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isMicOn ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    >
                      {isMicOn ? <Mic size={12} /> : <MicOff size={12} />}
                    </motion.div>
                  </div>

                  {/* Permission Error */}
                  {permissionError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center p-4 text-center text-white bg-black/80"
                    >
                      <div className="space-y-4">
                        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
                        <p className="text-sm">{permissionError}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Evaluation Overlay */}
                  {isEvaluating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                      <div className="space-y-4 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="w-12 h-12 mx-auto border-4 rounded-full border-primary border-t-transparent"
                        />
                        <p className="font-medium text-white">Evaluating your answer...</p>
                        <div className="flex items-center justify-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-primary"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Camera Settings */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3 rounded-lg bg-accent/50">
                        <h4 className="text-sm font-medium">Camera Settings</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Camera</span>
                            <button
                              onClick={toggleCamera}
                              className={`relative w-10 h-6 rounded-full transition-colors ${
                                isCameraOn ? 'bg-primary' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute w-4 h-4 bg-white rounded-full shadow top-1"
                                animate={{ x: isCameraOn ? 20 : 2 }}
                                transition={{ duration: 0.2 }}
                              />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Microphone</span>
                            <button
                              onClick={toggleMic}
                              className={`relative w-10 h-6 rounded-full transition-colors ${
                                isMicOn ? 'bg-primary' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute w-4 h-4 bg-white rounded-full shadow top-1"
                                animate={{ x: isMicOn ? 20 : 2 }}
                                transition={{ duration: 0.2 }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Add Controls here - after camera feed, before progress overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isRecording}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  className="relative flex items-center justify-center flex-1 gap-2 overflow-hidden"
                  disabled={!!answers[currentQuestionIndex]}
                >
                  <Play className="w-4 h-4" />
                  Start Recording
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  variant="outline"
                  className="flex items-center justify-center flex-1 gap-2 text-red-500 border-red-500/50 hover:bg-red-500/10"
                >
                  <Pause className="w-4 h-4" />
                  Stop Recording
                </Button>
              )}

              <Button
                onClick={handleNextQuestion}
                disabled={!answers[currentQuestionIndex] || isRecording}
                className="flex items-center gap-2"
              >
                {currentQuestionIndex === dummyQuestions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden border shadow-2xl bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-xl rounded-2xl border-border/50"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Target className="w-5 h-5 text-primary" />
                    Interview Progress
                  </h3>
                  <span className="px-3 py-1 text-sm rounded-full text-muted-foreground bg-accent/50">
                    {Object.keys(answers).length} of {dummyQuestions.length} completed
                  </span>
                </div>

                <div className="space-y-4">
                  {dummyQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        index === currentQuestionIndex
                          ? 'border-primary bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 shadow-lg'
                          : index < currentQuestionIndex
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-border/50 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === currentQuestionIndex
                              ? 'bg-purple-600 text-white shadow-lg'
                              : index < currentQuestionIndex
                              ? 'bg-green-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          animate={index === currentQuestionIndex ? { 
                            boxShadow: ["0 0 0 0 rgba(139, 92, 246, 0.4)", "0 0 0 10px rgba(139, 92, 246, 0)", "0 0 0 0 rgba(139, 92, 246, 0)"] 
                          } : {}}
                          transition={{ repeat: index === currentQuestionIndex ? Infinity : 0, duration: 2 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => speakText(question.question)}
                              className="p-1 mt-0.5 rounded-full hover:bg-primary/10"
                            >
                              <Volume2 className="w-4 h-4 text-primary" />
                            </motion.button>
                            <p className="text-sm font-medium truncate">{question.question}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              difficultyColors[question.difficulty]
                            }`}>
                              {question.difficulty}
                            </span>
                            {answers[index] && (
                              <motion.span 
                                className={`text-sm font-bold ${
                                  getScoreColor(answers[index].evaluation.score)
                                }`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                {answers[index].evaluation.score}%
                              </motion.span>
                            )}
                          </div>
                        </div>
                        {index < currentQuestionIndex && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Overall Progress */}
                <div className="pt-4 border-t border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-muted-foreground">
                        {Math.round((Object.keys(answers).length / dummyQuestions.length) * 100)}%
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-muted/30">
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${(Object.keys(answers).length / dummyQuestions.length) * 100}%`
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      <AnimatePresence>
        {showEvalModal && answers[currentQuestionIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEvalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl p-6 mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 space-y-6 border shadow-2xl bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-xl rounded-2xl border-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-3 text-2xl font-bold">
                    <motion.div
                      className="p-2 bg-purple-600 rounded-full"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Award className="w-6 h-6 text-white" />
                    </motion.div>
                    Evaluation Results
                  </h3>
                  <motion.span 
                    className={`text-5xl font-bold ${
                      getScoreColor(answers[currentQuestionIndex].evaluation.score)
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {answers[currentQuestionIndex].evaluation.score}%
                  </motion.span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="flex items-center gap-2 font-semibold text-green-600">
                      <ThumbsUp className="w-4 h-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {answers[currentQuestionIndex].evaluation.strengths.map((strength, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="flex items-center gap-2 font-semibold text-orange-600">
                      <Target className="w-4 h-4" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {answers[currentQuestionIndex].evaluation.improvements.map((improvement, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <XCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {improvement}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={() => setShowEvalModal(false)}
                    className="flex items-center gap-2"
                  >
                    Close and Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}