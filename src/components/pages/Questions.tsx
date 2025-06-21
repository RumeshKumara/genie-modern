import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Code, Users, Brain, Target, Timer, MessageCircle, ThumbsUp, Play, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

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

const dialogAnimation = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const overlayAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

type QuestionCategory = 'all' | 'technical' | 'behavioral' | 'system-design';

interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  description: string;
  timesAsked: number;
  successRate: number;
  hints: string[];
  solution: string;
}

export default function Questions() {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Practice session state
  const [isPracticing, setIsPracticing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startPracticeSession = (question: Question) => {
    setSelectedQuestion(question);
    setIsPracticing(true);
    setUserAnswer('');
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setShowHints(false);
    setShowSolution(false);
    setIsModalOpen(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  const toggleHints = () => {
    setShowHints(prev => !prev);
  };

  const toggleSolution = () => {
    setShowSolution(prev => !prev);
  };

  const submitAnswer = () => {
    // Here you could add logic to evaluate the answer
    alert('Answer submitted! In a real application, this would be evaluated.');
  };

  const resetSession = () => {
    setUserAnswer('');
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setShowHints(false);
    setShowSolution(false);
  };

  const questions: Question[] = [
    {
      id: '1',
      category: 'technical',
      difficulty: 'medium',
      question: 'Explain the concept of closures in JavaScript',
      description: 'Focus on scope, lexical environment, and practical use cases',
      timesAsked: 1250,
      successRate: 75,
      hints: [
        'Think about functions defined inside other functions',
        'Consider how inner functions access outer function variables',
        'Remember that closures "close over" variables from their lexical scope'
      ],
      solution: `A closure is created when an inner function has access to variables from its outer (enclosing) function scope even after the outer function has finished executing.

Key points:
1. Lexical Scoping: Functions have access to variables in their outer scope
2. Persistence: The outer function's variables remain accessible even after it returns
3. Practical uses: Module pattern, data privacy, callbacks, and event handlers

Example:
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // 'x' is from outer scope
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8`
    },
    {
      id: '2',
      category: 'behavioral',
      difficulty: 'medium',
      question: 'Tell me about a time you handled a difficult team situation',
      description: 'Use the STAR method to structure your response',
      timesAsked: 980,
      successRate: 82,
      hints: [
        'Use the STAR method: Situation, Task, Action, Result',
        'Focus on your specific actions and role in resolving the conflict',
        'Emphasize communication, empathy, and problem-solving skills'
      ],
      solution: `STAR Method Framework:

Situation: Describe the context and background
- Set the scene with specific details
- Explain the team dynamics and the conflict

Task: Explain your responsibility
- What was your role in addressing the situation?
- What needed to be accomplished?

Action: Detail your specific actions
- How did you approach the problem?
- What steps did you take to resolve the conflict?
- How did you communicate with team members?

Result: Share the outcomes
- What was the resolution?
- What did you learn?
- How did it improve team dynamics?

Example structure: "In my previous role as [position], we had a situation where [describe conflict]. My responsibility was to [task]. I took the following actions: [specific steps]. As a result, [positive outcome and lessons learned]."`
    },
    {
      id: '3',
      category: 'system-design',
      difficulty: 'hard',
      question: 'Design a real-time chat application',
      description: 'Consider scalability, message delivery, and offline support',
      timesAsked: 750,
      successRate: 68,
      hints: [
        'Consider WebSocket connections for real-time communication',
        'Think about message persistence and delivery guarantees',
        'Plan for horizontal scaling with load balancers',
        'Design for offline support with message queuing'
      ],
      solution: `High-Level Architecture:

1. Client Layer:
   - WebSocket connections for real-time messaging
   - Local storage for offline message caching
   - Progressive Web App for cross-platform support

2. Load Balancer:
   - Distribute connections across multiple servers
   - Handle WebSocket sticky sessions

3. Application Servers:
   - Handle WebSocket connections
   - Message routing and validation
   - User authentication and authorization

4. Message Queue (Redis/RabbitMQ):
   - Temporary message storage
   - Handle offline users
   - Ensure message delivery

5. Database Layer:
   - Message persistence (MongoDB/PostgreSQL)
   - User data and chat room information
   - Message history and search indexing

6. Additional Components:
   - File upload service (AWS S3)
   - Push notification service
   - Monitoring and logging

Scalability Considerations:
- Horizontal scaling of app servers
- Database sharding by chat room or user
- CDN for file sharing
- Caching layer for frequently accessed data`
    },
    {
      id: '4',
      category: 'technical',
      difficulty: 'easy',
      question: 'What is the difference between let, const, and var?',
      description: 'Explain scope, hoisting, and best practices',
      timesAsked: 1500,
      successRate: 88,
      hints: [
        'Think about block scope vs function scope',
        'Consider hoisting behavior differences',
        'Remember const is for constants, let for variables'
      ],
      solution: `Key Differences:

1. Scope:
   - var: Function-scoped or globally-scoped
   - let/const: Block-scoped

2. Hoisting:
   - var: Hoisted and initialized with undefined
   - let/const: Hoisted but not initialized (Temporal Dead Zone)

3. Re-declaration:
   - var: Can be re-declared in same scope
   - let/const: Cannot be re-declared in same scope

4. Re-assignment:
   - var/let: Can be re-assigned
   - const: Cannot be re-assigned (but objects/arrays can be mutated)

Example:
// var
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 (accessible outside block)
}

// let/const
function example2() {
  if (true) {
    let y = 1;
    const z = 2;
  }
  console.log(y); // ReferenceError
  console.log(z); // ReferenceError
}

Best Practices:
- Use const by default
- Use let when you need to reassign
- Avoid var in modern JavaScript`
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: BookOpen },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'system-design', name: 'System Design', icon: Brain }
  ];

  const filteredQuestions = questions.filter(q => 
    (selectedCategory === 'all' || q.category === selectedCategory) &&
    (q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     q.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-orange-500 bg-orange-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <motion.div 
      className="space-y-6 md:px-8 lg:px-12"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item}>
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
          Question Bank
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse and practice common interview questions
        </p>
      </motion.div>

      {/* Categories */}
      <motion.div variants={item} className="flex flex-wrap gap-4">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(category.id as QuestionCategory)}
            >
              <Icon size={16} />
              {category.name}
            </Button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 transition-all border rounded-3xl border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </motion.div>

      {/* Questions Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-4"
        variants={container}
      >
        {filteredQuestions.map((question) => (
          <motion.div key={question.id} variants={item}>
            <Card className="card-hover-effect rounded-3xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{question.question}</CardTitle>
                    <CardDescription>{question.description}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-muted-foreground" />
                    <span>Asked {question.timesAsked} times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-muted-foreground" />
                    <span>{question.successRate}% success rate</span>
                  </div>
                  <Button 
                    className="ml-auto"
                    onClick={() => startPracticeSession(question)}
                  >
                    Practice Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Practice Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="mb-2 text-xl font-semibold">
                      {selectedQuestion.question}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedQuestion.description}
                    </DialogDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                    {selectedQuestion.difficulty.charAt(0).toUpperCase() + selectedQuestion.difficulty.slice(1)}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Timer and Controls */}
                <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Timer size={20} className="text-primary" />
                    <span className="font-mono text-lg font-semibold">
                      {formatTime(timeElapsed)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTimer}
                      className="flex items-center gap-2"
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause size={16} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Start
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetTimer}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </Button>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleHints}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle size={16} />
                      {showHints ? 'Hide Hints' : 'Show Hints'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSolution}
                      className="flex items-center gap-2"
                    >
                      {showSolution ? (
                        <>
                          <EyeOff size={16} />
                          Hide Solution
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          View Solution
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Hints Section */}
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Card className="border-orange-200 bg-orange-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <MessageCircle size={18} className="text-orange-500" />
                            Hints
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedQuestion.hints.map((hint, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-2"
                              >
                                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-sm">{hint}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Answer Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Your Answer:
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full h-40 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type your answer here... Take your time to think through the problem and provide a comprehensive response."
                  />
                  <div className="text-xs text-muted-foreground">
                    {userAnswer.length} characters
                  </div>
                </div>

                {/* Solution Section */}
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Card className="border-green-200 bg-green-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <ThumbsUp size={18} className="text-green-500" />
                            Sample Solution
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedQuestion.solution}
                          </pre>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp size={16} />
                    Submit Answer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetSession}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reset Session
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsPracticing(false);
                      resetSession();
                    }}
                    className="ml-auto"
                  >
                    Close Practice
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}