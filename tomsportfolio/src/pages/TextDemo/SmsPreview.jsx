import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseLayout } from '../../components/Layout';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Survey.css';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Alert } from '@mantine/core';

export default function TextPreview() {
  const location = useLocation();
  const { phoneNumber, contactName, justOptedIn } = location.state || {};
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [showAlert, setShowAlert] = useState(justOptedIn);
  const [isVisible, setIsVisible] = useState(justOptedIn);
  const [isSmsActive, setIsSmsActive] = useState(false);
  const [smsStatusLoading, setSmsStatusLoading] = useState(true);
  const bottomRef = useRef(null);
  const [messageTemplate, setMessageTemplate] = useState(null);

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('no-padding');
    return () => root.classList.remove('no-padding');
  }, []);

  useEffect(() => {
    const loadMessage = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/LoadMessage`);
      var messagee = response.data.templateText.replace('{Contact Name}', contactName);
      setMessageTemplate(messagee);
    };
    loadMessage();
  }, []);

  useEffect(() => {
    if (!contactName || !phoneNumber) return;
    const timers = [
      setTimeout(() => setStep(0), 2000),
      setTimeout(() => setStep(1), 2000),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 5000),
      setTimeout(() => setStep(4), 5000),
      setTimeout(() => setStep(5), 7000),
      setTimeout(() => setStep(6), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [contactName, phoneNumber]);

  useEffect(() => {
    if (justOptedIn) {
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        const removeTimer = setTimeout(() => setShowAlert(false), 500);
        return () => clearTimeout(removeTimer);
      }, 1500);
      return () => clearTimeout(fadeTimer);
    }
  }, [justOptedIn]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/sms/status`)
      .then(res => setIsSmsActive(res.data.isSmsActive))
      .finally(() => setSmsStatusLoading(false));
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step, sent]);

  const sendText = async () => {
    if (!phoneNumber || !contactName) {
      alert('Missing required information. Please refresh the page and try again.');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to send a text message to ${phoneNumber}?`);
    if (!confirmed) return;

    try {
      setSent(true);
      await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/SendText`, {
        phoneNumber,
        messageContent: messageTemplate,
      });
      setStep(7);
      setTimeout(() => setStep(8), 1500);
    } catch (error) {
      console.error('Error sending text:', error);
      alert('Failed to send text message. Please try again.');
    }
  };

  const TypingIndicator = () => (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );

  return (
    <BaseLayout>
      <div style={{ position: 'relative', paddingTop: '1rem' }}>
        {showAlert && (
          <div className={`alert-fade ${isVisible ? 'show' : 'hide'}`} style={{ marginBottom: '1rem' }}>
            <Alert color="green" title="Success">
              Successfully opted in! You should receive a confirmation message shortly.
            </Alert>
          </div>
        )}

        {!smsStatusLoading && !isSmsActive && (
          <Alert color="red" title="SMS Disabled" mb="md">
            SMS is currently disabled. Contact Tom to enable it.
          </Alert>
        )}

        <div className="text-message-container" style={{ borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div className="header-content">
            <img src="/media/TBI_Logo.png" alt="Contact" className="header-logo" />
            <div style={{ marginRight: '0.5rem' }}>
              <ThemeToggle />
            </div>
            <span className="contact-name">Tom Evanko</span>
          </div>

          <AnimatePresence>
            {step === 0 && (
              <motion.div key="typing-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 1 && (
              <motion.div key="instruction" className="text-bubble system-message"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Thanks for Opting In {contactName}!<br />
                Below is the text message that will be sent to: {phoneNumber}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === 2 && (
              <motion.div key="typing-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div key="message" className="text-bubble"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {messageTemplate}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === 4 && (
              <motion.div key="typing-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 6 && (
              <motion.div key="followup" className="text-bubble system-message"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Click the button below to send the text message.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === 7 && (
              <motion.div key="typing-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 8 && (
              <motion.div key="confirmation" className="text-bubble system-message"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                You should receive a text message shortly from +12018994890
              </motion.div>
            )}
          </AnimatePresence>

          {step >= 3 && !sent && (
            <div style={{ marginTop: '1rem' }}>
              <div className="ios-message-bar">
                <div className="ios-message-input">
                  <span className="message-text">
                    Tom Built It: {contactName}, you've subscribed to our SMS demo. Msg & data rates may apply. Reply HELP for help, STOP to cancel.
                  </span>
                </div>
                <button
                  className={`send-btn${isSmsActive ? ' active' : ''}`}
                  onClick={sendText}
                  disabled={!isSmsActive}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>
    </BaseLayout>
  );
}
