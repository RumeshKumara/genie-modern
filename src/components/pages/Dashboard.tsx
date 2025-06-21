import { useState } from 'react';
import { Plus, Calendar, ArrowRight, Search, Filter, BarChart2, Award, Target, Crown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { useUser } from '@clerk/clerk-react';
import NewInterviewModal from '../features/NewInterviewModal';
import InterviewResultModal from '../features/InterviewResultModal';
import { useNavigate } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const feedbackModalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: 20 }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: clerkUser, isSignedIn } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState<Array<{
    id: string;
    title: string;
    jobRole: string;
    createdAt: Date;
    lastUpdated: Date | null;
    score?: number;
    status: 'completed';
    yearsOfExperience?: string;
    reasonForInterview?: string;
  }>>([
    {
      id: '1',
      title: 'Frontend Developer Interview',
      jobRole: 'Senior React Developer',
      createdAt: new Date('2024-03-10'),
      lastUpdated: new Date('2024-03-15'),
      score: 85,
      status: 'completed',
      yearsOfExperience: '5+ years',
      reasonForInterview: 'Career Switch'
    },
    {
      id: '2',
      title: 'System Design Discussion',
      jobRole: 'Software Architect',
      createdAt: new Date('2024-03-12'),
      lastUpdated: new Date('2024-03-12'),
      score: 78,
      status: 'completed',
      yearsOfExperience: '3-5 years',
      reasonForInterview: 'Skill Enhancement'
    },
    {
      id: '3',
      title: 'Behavioral Interview',
      jobRole: 'Product Manager',
      createdAt: new Date('2024-03-14'),
      lastUpdated: new Date('2024-03-14'),
      score: 92,
      status: 'completed',
      yearsOfExperience: '5+ years',
      reasonForInterview: 'Career Growth'
    },
    {
      id: '4',
      title: 'Backend Development',
      jobRole: 'Node.js Developer',
      createdAt: new Date('2024-03-15'),
      lastUpdated: new Date('2024-03-15'),
      score: 88,
      status: 'completed',
      yearsOfExperience: '2-4 years',
      reasonForInterview: 'Job Opportunity'
    },
    {
      id: '5',
      title: 'Data Structures & Algorithms',
      jobRole: 'Software Engineer',
      createdAt: new Date('2024-03-16'),
      lastUpdated: new Date('2024-03-16'),
      score: 95,
      status: 'completed',
      yearsOfExperience: '1-3 years',
      reasonForInterview: 'Practice'
    },
    {
      id: '6',
      title: 'Full Stack Discussion',
      jobRole: 'Full Stack Engineer',
      createdAt: new Date('2024-03-17'),
      lastUpdated: new Date('2024-03-17'),
      score: 89,
      status: 'completed',
      yearsOfExperience: '4-6 years',
      reasonForInterview: 'Skill Enhancement'
    }
  ]);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const handleCreateInterview = (interviewData: {
    title: string;
    jobRole: string;
    description?: string;
  }) => {
    const newInterview = {
      id: crypto.randomUUID(),
      title: interviewData.title,
      jobRole: interviewData.jobRole,
      createdAt: new Date(),
      lastUpdated: null,
      status: 'completed' as const,
      score: 0
    };
    
    setInterviews([newInterview, ...interviews]);
    setIsModalOpen(false);
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalInterviews: interviews.length,
    completedInterviews: interviews.filter(i => i.status === 'completed').length,
    averageScore: Math.round(
      interviews
        .filter(i => i.score)
        .reduce((acc, curr) => acc + (curr.score || 0), 0) /
        interviews.filter(i => i.score).length
    ),
    streak: 5
  };

  // Modify the mock feedback data in interviewsWithFeedback
  const interviewsWithFeedback = interviews.map(interview => ({
    ...interview,
    feedback: {
      overallScore: interview.score || 0,
      technicalScore: Math.round(Math.random() * 20 + 75),
      communicationScore: Math.round(Math.random() * 20 + 75),
      detailedFeedback: "You demonstrated strong technical knowledge and communication skills. Keep working on system design concepts.",
      strengths: [
        "Clear communication",
        "Strong problem-solving approach",
        "Good technical fundamentals"
      ],
      improvements: [
        "Deepen system design knowledge",
        "Practice time management",
        "Elaborate more on past experiences"
      ],
      questions: [
        {
          question: "Explain React's Virtual DOM and its benefits",
          yourAnswer: "The Virtual DOM is a lightweight copy of the actual DOM that React uses to improve performance.",
          correctAnswer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to perform a diffing process, comparing the Virtual DOM with the real DOM to determine minimal necessary updates. This process, called reconciliation, improves performance by reducing expensive DOM operations.",
          score: 85,
          feedback: "Good basic understanding, but could have elaborated on reconciliation process",
          keywords: ["lightweight", "performance", "diffing", "reconciliation"]
        },
        {
          question: "Describe the Redux data flow",
          yourAnswer: "Redux follows a unidirectional data flow where actions are dispatched to modify state.",
          correctAnswer: "Redux follows a strict unidirectional data flow: 1) Actions are dispatched to describe state changes 2) Reducers process these actions and update the store 3) Components subscribe to store changes and re-render accordingly. This pattern ensures predictable state management.",
          score: 90,
          feedback: "Excellent grasp of core concepts, could mention middleware",
          keywords: ["unidirectional", "actions", "reducers", "store"]
        },
        {
          question: "Explain CSS Box Model",
          yourAnswer: "The box model consists of content, padding, border, and margin.",
          correctAnswer: "The CSS Box Model is fundamental to layout and consists of: content (innermost), padding (space around content), border (boundary around padding), and margin (outer space). Each element can be modified using properties like padding, border-width, and margin.",
          score: 88,
          feedback: "Basic understanding shown, could have provided more details on usage",
          keywords: ["content", "padding", "border", "margin"]
        }
      ]
    }
  }));

  const handleInterviewClick = (interview: any) => {
    if (interview.status === 'completed') {
      const selectedWithFeedback = interviewsWithFeedback.find(i => i.id === interview.id);
      if (selectedWithFeedback) {
        setSelectedFeedback(selectedWithFeedback);
        setShowFeedback(true);
      }
    } else {
      navigate(`/interview/${interview.id}`);
    }
  };

  // Add this before the return statement
  const FeedbackModal = () => (
    <AnimatePresence>
      {showFeedback && selectedFeedback && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFeedback(false)}
        >
          <motion.div
            className="w-full max-w-4xl p-6 m-4 space-y-6 bg-card rounded-3xl"
            variants={feedbackModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold">{selectedFeedback.title}</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowFeedback(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 rounded-2xl bg-blue-500/10">
                <h3 className="font-semibold text-blue-500">Technical Score</h3>
                <p className="text-2xl font-bold">{selectedFeedback.feedback.technicalScore}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-500/10">
                <h3 className="font-semibold text-green-500">Communication Score</h3>
                <p className="text-2xl font-bold">{selectedFeedback.feedback.communicationScore}%</p>
              </div>
            </div>

            <div className="p-4 space-y-3 rounded-2xl bg-primary/5">
              <h3 className="font-semibold">Detailed Feedback</h3>
              <p className="text-muted-foreground">{selectedFeedback.feedback.detailedFeedback}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-500">Strengths</h3>
                <ul className="space-y-1">
                  {selectedFeedback.feedback.strengths.map((strength: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-green-500">✓</span> {strength}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-orange-500">Areas for Improvement</h3>
                <ul className="space-y-1">
                  {selectedFeedback.feedback.improvements.map((improvement: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-orange-500">➤</span> {improvement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Questions and Answers Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Questions and Answers</h3>
              {selectedFeedback.feedback.questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 space-y-3 border rounded-2xl bg-background/50"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{q.question}</h4>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      q.score >= 90 ? 'bg-green-500/10 text-green-500' :
                      q.score >= 80 ? 'bg-blue-500/10 text-blue-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      Score: {q.score}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-primary/5">
                      <p className="text-sm font-medium text-primary">Your Answer:</p>
                      <p className="text-sm text-muted-foreground">{q.yourAnswer}</p>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-green-500/5">
                      <p className="text-sm font-medium text-green-500">Model Answer:</p>
                      <p className="text-sm text-muted-foreground">{q.correctAnswer}</p>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-blue-500/5">
                      <p className="text-sm font-medium text-blue-500">Feedback:</p>
                      <p className="text-sm text-muted-foreground">{q.feedback}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {q.keywords.map((keyword, ki) => (
                        <span key={ki} className="px-2 py-1 text-xs text-purple-500 rounded-full bg-purple-500/10">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowFeedback(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // Save to PDF or export functionality could be added here
                  console.log('Export feedback');
                }}
              >
                Export Feedback
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      className="space-y-8 md:px-8 lg:px-12"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary via-purple-700 to-purple-500 bg-clip-text">
            {isSignedIn && clerkUser ? `Welcome back, ${clerkUser.firstName || 'User'}!` : 'Dashboard'}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {isSignedIn ? 'Ready to ace your next interview?' : 'Create and practice AI-powered mock interviews'}
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="flex items-center gap-2 shadow-lg group"
        >
          <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
          New Interview
        </Button>
      </motion.div>

      {/* User Plan Banner */}
      <AnimatePresence>
        {isSignedIn && clerkUser && (
          <motion.div 
            variants={item}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          >
            <Card className="p-6 rounded-full bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-500/20">
                    <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Upgrade to Pro</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlock unlimited interviews, advanced feedback, and more features
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/upgrade'}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  Upgrade Now
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
      >
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/20 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <BarChart2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <h4 className="text-2xl font-bold">{stats.totalInterviews}</h4>
                <p className="flex items-center gap-1 mt-1 text-xs text-blue-500">
                  <TrendingUp size={12} />
                  +2 this week
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <h4 className="text-2xl font-bold">{stats.completedInterviews}</h4>
                <p className="flex items-center gap-1 mt-1 text-xs text-green-500">
                  <TrendingUp size={12} />
                  +1 this week
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/20 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <h4 className="text-2xl font-bold">{stats.averageScore}%</h4>
                <p className="flex items-center gap-1 mt-1 text-xs text-purple-500">
                  <TrendingUp size={12} />
                  +5% improvement
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="p-6 card-hover-effect bg-gradient-to-br from-orange-500/5 to-orange-600/5 border-orange-500/20 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <h4 className="text-2xl font-bold">{stats.streak} days</h4>
                <p className="flex items-center gap-1 mt-1 text-xs text-orange-500">
                  🔥 Keep it up!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row ">
        <div className="relative flex-1 ">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-10 pr-4 transition-all border rounded-3xl border-purple-400 dark:border-[#341350] bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm "
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 py-6 text-purple-600 rounded-3xl bg-purple-500/10 backdrop-blur-sm">
          <Filter size={16} />
          Filter
        </Button>
      </motion.div>

      {/* Interview Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
      >
        {/* Add New Interview Card */}
        <motion.div variants={item}>
          <Card 
            className="group flex flex-col items-center justify-center min-h-[320px] p-8 cursor-pointer bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 hover:from-primary/10 hover:via-purple-500/10 hover:to-pink-500/10 border-dashed border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 card-hover-effect rounded-3xl"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <motion.div 
                className="p-6 text-white transition-transform duration-300 rounded-full shadow-lg bg-gradient-to-br from-primary via-purple-700 to-purple-400 group-hover:scale-110"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Plus size={32} />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-600">
                  Create New Interview
                </h3>
                <p className="text-muted-foreground">Start practicing with AI-powered interviews</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Interview cards */}
        {filteredInterviews.map((interview) => (
          <motion.div key={interview.id} variants={item}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleInterviewClick(interview)}
              className="p-6 space-y-4 transition-colors border shadow-lg cursor-pointer rounded-3xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold line-clamp-2">{interview.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    interview.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{interview.jobRole}</p>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Created: {interview.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  <span>Experience: {interview.yearsOfExperience || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight size={16} />
                  <span>Purpose: {interview.reasonForInterview || 'Practice'}</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex gap-2">
                  <motion.button 
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-green-500 rounded-3xl group bg-green-500/10 hover:bg-green-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInterviewClick(interview);
                    }}
                  >
                    View Feedback
                  </motion.button>

                  <motion.button 
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white rounded-3xl group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const interviewData = {
                        id: interview.id,
                        title: interview.title,
                        jobRole: interview.jobRole,
                        yearsOfExperience: interview.yearsOfExperience || '3-5 years',
                        reasonForInterview: interview.reasonForInterview || 'Practice'
                      };
                      localStorage.setItem('interviewData', JSON.stringify(interviewData));
                      navigate('/interview/setup');
                    }}
                  >
                    Start Again
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modals */}
      <NewInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateInterview}
      />
      
      <InterviewResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        interview={selectedInterview}
      />
      <FeedbackModal />
    </motion.div>
  );
}