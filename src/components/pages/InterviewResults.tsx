import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Download, Share2 } from 'lucide-react';
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
  const navigate = useNavigate();
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
    const answersData = localStorage.getItem('interviewAnswers');
    const questionsData = localStorage.getItem('interviewQuestions');
    
    if (!answersData || !questionsData) {
      navigate('/');
      return;
    }

    const parsedAnswers = JSON.parse(answersData);
    const parsedQuestions = JSON.parse(questionsData);
    setAnswers(parsedAnswers);
    setQuestions(parsedQuestions);

    // Calculate score for history after setting answers
    const currentScore = Object.keys(parsedAnswers).length > 0
      ? Math.round(
          Object.values(parsedAnswers).reduce((acc, answer: any) => acc + answer.evaluation.score, 0) / 
          Object.keys(parsedAnswers).length
        )
      : 0;

    // Save to dashboard history
    const historyItem = {
      date: new Date().toISOString(),
      score: currentScore,
      answers: parsedAnswers,
      questions: parsedQuestions
    };

    const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    history.push(historyItem);
    localStorage.setItem('interviewHistory', JSON.stringify(history));

    // Set resources based on parsed answers
    const lowScoreTopics = Object.values(parsedAnswers)
      .filter((a: any) => a.evaluation.score < 70)
      .map((a: any) => a.evaluation.improvements)
      .flat();

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
      }
    ]);
  }, [navigate]);

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

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="container max-w-4xl p-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block"
            >
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Award className="w-12 h-12" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
              Interview Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              Here's how you performed in your interview
            </p>
          </div>

          {/* Overall Score */}
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

          {/* Question Review */}
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

          {/* Learning Resources */}
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

          {/* Actions */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
            <Button
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}