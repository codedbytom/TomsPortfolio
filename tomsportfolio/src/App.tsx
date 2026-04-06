import './App.css';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Hobbies from './pages/Hobbies';
import CodingChallenges from './pages/CodingChallenges';
import OptIn from './pages/TextDemo/OptIn';
import SmsPreview from './pages/TextDemo/SmsPreview';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TestPage from './pages/Admin/TestPage';
import KillSms from './pages/Admin/KillSms';
import Survey from './pages/TextDemo/Survey';
import ThankYou from './pages/TextDemo/ThankYou';
import ScrollToTop from './components/ScrollToTop';
import Playground from './pages/Playground/Playground';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
});

function App() {
  const preferredColorScheme = useColorScheme();
  const savedScheme = localStorage.getItem('mantine-color-scheme') as 'light' | 'dark' | null;
  const defaultColorScheme = savedScheme ?? preferredColorScheme ?? 'dark';

  return (
    <MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/coding-challenges" element={<CodingChallenges />} />
          <Route path="/text-demo/opt-in" element={<OptIn />} />
          <Route path="/text-demo/sms-preview" element={<SmsPreview />} />
          <Route path="/text-demo/survey/:responseGuid" element={<Survey />} />
          <Route path="/text-demo/survey" element={<Survey />} />
          <Route path="/text-demo/survey/results/:responseGuid" element={<Survey/>} />
          <Route path="/text-demo/thank-you/:responseGuid" element={<ThankYou />} />
          <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin/test-page" element={<TestPage />} />
          <Route path="/admin/kill-sms" element={<KillSms />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
