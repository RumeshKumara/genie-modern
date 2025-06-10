import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Video, Mic, Settings, AlertCircle, ArrowLeft, Clock, 
  User, Briefcase, Award, Target, Crown, CheckCircle, XCircle, Info, Play
} from 'lucide-react';
import Webcam from 'react-webcam';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { generateQuestions } from '../../lib/gemini';

interface Question {
  question: string;
  expectedAnswer: string;
  keyPoints: string[];
  scoringCriteria: {
    max: number;
    criteria: string[];
  };
}

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [hasWebcam, setHasWebcam] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('interviewData');
    if (data) {
      setInterviewData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleDeviceCheck = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setHasWebcam(true);
      setHasMic(true);
      setIsReady(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error('Media device error:', error);
      setHasWebcam(false);
      setHasMic(false);
      setIsReady(false);
      
      if (error.name === 'NotAllowedError') {
        setPermissionError('Camera and microphone access was denied. Please enable permissions in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('No camera or microphone found. Please ensure your devices are properly connected.');
      } else {
        setPermissionError('An error occurred while accessing your camera and microphone. Please check your device connections and try again.');
      }
    }
  };

  const startInterview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (questionCount > 5 && user.plan === 'free') {
      navigate('/upgrade');
      return;
    }

    try {
      setIsLoading(true);
      const generatedQuestions = await generateQuestions(
        interviewData.jobRole,
        questionCount,
        interviewData.yearsOfExperience
      );
      
      setQuestions(generatedQuestions);
      localStorage.setItem('interviewQuestions', JSON.stringify(generatedQuestions));
      navigate('/interview/session');
    } catch (error) {
      console.error('Failed to start interview:', error);
      setPermissionError('Failed to generate interview questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (!cameraEnabled) {
      handleDeviceCheck();
    }
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    if (!micEnabled) {
      handleDeviceCheck();
    }
  };

  if (!interviewData) return null;

  const canUseMoreQuestions = user?.plan !== 'free' || questionCount <= 5;

  return (
    <div className="container p-4 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-purple-600 ">
              Interview Setup
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Let's prepare for your {interviewData.jobRole} interview
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Interview Details */}
          <div className="space-y-6 lg:col-span-1">
            {/* Interview Information */}
            <Card className="p-6 rounded-3xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Info className="w-5 h-5 text-primary" />
                  Interview Details
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Title</p>
                      <p className="text-muted-foreground">{interviewData.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Job Role</p>
                      <p className="text-muted-foreground">{interviewData.jobRole}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Experience Level</p>
                      <p className="text-muted-foreground">{interviewData.yearsOfExperience}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Interview Goal</p>
                      <p className="text-muted-foreground">
                        {interviewData.reasonForInterview === 'new-job' ? 'Looking for a new job' :
                         interviewData.reasonForInterview === 'practice' ? 'General practice' :
                         interviewData.reasonForInterview === 'upcoming' ? 'Preparing for upcoming interview' :
                         interviewData.reasonForInterview === 'skills' ? 'Improving interview skills' :
                         'Switching career paths'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Question Count Selection */}
            <Card className="p-6 rounded-3xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="w-5 h-5 text-primary" />
                  Number of Questions
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Questions:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuestionCount(Math.max(3, questionCount - 1))}
                        className="w-8 h-8 transition-colors border rounded-full border-input hover:bg-accent"
                        disabled={questionCount <= 3}
                      >
                        -
                      </button>
                      <span className="w-12 font-medium text-center">{questionCount}</span>
                      <button
                        onClick={() => setQuestionCount(Math.min(15, questionCount + 1))}
                        className="w-8 h-8 transition-colors border rounded-full border-input hover:bg-accent"
                        disabled={questionCount >= 15}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Estimated duration: {Math.round(questionCount * 3)} minutes
                  </div>
                  
                  {questionCount > 5 && user?.plan === 'free' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 border rounded-2xl bg-yellow-500/10 border-yellow-500/20 "
                    >
                      <div className="flex items-start gap-2">
                        <Crown className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-700 dark:text-yellow-400">
                            Pro Feature Required
                          </p>
                          <p className="text-yellow-600 dark:text-yellow-500">
                            More than 5 questions requires a Pro subscription.
                          </p>
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={() => navigate('/upgrade')}
                          >
                            Upgrade to Pro
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>

            {/* User Plan Info */}
            {user && (
              <Card className="p-6 rounded-3xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Your Plan
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Current Plan:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.plan === 'pro' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {user.plan.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Interviews this month:</span>
                      <span className="font-medium">{user.interviewsThisMonth}/5</span>
                    </div>
                    
                    {user.plan === 'free' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/upgrade')}
                      >
                        Upgrade for Unlimited
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Camera and Controls */}
          <div className="space-y-6 lg:col-span-2">
            {/* Camera Preview */}
            <Card className="p-6 rounded-3xl">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Camera Preview</h2>
                <div className="relative overflow-hidden rounded-3xl aspect-video bg-purple-500/10 max-w-xl mx-auto max-h-[300px]">
                  {hasWebcam && cameraEnabled ? (
                    <Webcam
                      ref={webcamRef}
                      audio={micEnabled}
                      className="object-cover w-full h-full "
                      mirrored
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="space-y-4 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto text-purple-800" />
                        <p className="text-purple-800">Camera not detected</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Indicators */}
                  <div className="absolute flex gap-2 top-4 right-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      hasWebcam ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      <Video size={14} />
                      {hasWebcam ? 'Camera Ready' : 'No Camera'}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      hasMic ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      <Mic size={14} />
                      {hasMic ? 'Mic Ready' : 'No Mic'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Device Check and Controls */}
            <Card className="p-6 rounded-3xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">System Check</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={toggleCamera}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors ${
                        cameraEnabled 
                          ? hasWebcam ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      <Video size={12} />
                      {cameraEnabled ? (hasWebcam ? 'ON' : 'Error') : 'OFF'}
                    </button>
                    <button
                      onClick={toggleMic}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors ${
                        micEnabled
                          ? hasMic ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      <Mic size={12} />
                      {micEnabled ? (hasMic ? 'ON' : 'Error') : 'OFF'}
                    </button>
                    <Button
                  onClick={handleDeviceCheck}
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Check Devices
                </Button>
                  </div>
                </div>
                
                {permissionError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm border border-red-200 rounded-md bg-red-50 dark:bg-red-950/20 dark:border-red-800"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div className="text-red-700 dark:text-red-400">
                        {permissionError}
                      </div>
                    </div>
                  </motion.div>
                )}

                
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={startInterview}
                size="lg"
                className="flex items-center justify-center gap-2"
                disabled={!isReady || isLoading || !canUseMoreQuestions}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 mr-2 border-2 border-white rounded-full border-t-transparent"
                    />
                    Preparing...
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                    </motion.div>
                    Start Interview
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}