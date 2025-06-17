import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import RootLayout from './components/layouts/RootLayout';
import Dashboard from './components/pages/Dashboard';
import Questions from './components/pages/Questions';
import HowItWorks from './components/pages/HowItWorks';
import Upgrade from './components/pages/Upgrade';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import InterviewSetup from './components/pages/InterviewSetup';
import InterviewSession from './components/pages/InterviewSession';
import InterviewResults from './components/pages/InterviewResults';
import { RedirectToSignIn, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />

        {/* Protected routes */}
        <Route element={
          <>
            <SignedIn>
              <RootLayout />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }></Route>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="questions" element={<Questions />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="interview">
            <Route path="setup" element={<InterviewSetup />} />
            <Route path="session" element={<InterviewSession />} />
            <Route path="results" element={<InterviewResults />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;