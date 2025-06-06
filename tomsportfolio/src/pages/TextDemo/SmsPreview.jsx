import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {BaseLayout} from '../../components/Layout';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Survey.css';

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
    return () => {
      root.classList.remove('no-padding');
    };
  }, []);

    
  useEffect(() => {
    const loadMessage = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/LoadMessage`);
      var messagee = response.data.templateText.replace('{Contact Name}', contactName);
      setMessageTemplate(messagee);
      console.log('Message loaded:', response.data);
    };
    loadMessage();
  }, []);

  useEffect(() => {
    if (!contactName || !phoneNumber) return;

    const timers = [
      setTimeout(() => setStep(0), 2000), // Show typing 
      setTimeout(() => setStep(1), 2000), // Show welcome message
      setTimeout(() => setStep(2), 3000), // Show typing
      setTimeout(() => setStep(3), 5000), // Show message sent to phone number
      setTimeout(() => setStep(4), 5000), // Show typing
      setTimeout(() => setStep(5), 7000), // Show submit button
      setTimeout(() => setStep(6), 7000), // Show followup
    ];

    return () => timers.forEach(clearTimeout);
  }, [contactName, phoneNumber]);
  
  useEffect(() => {
    if (justOptedIn) {
      // Start fade out after 1.5 seconds
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        // Remove from DOM after fade-out (e.g., 500ms for fade animation)
        const removeTimer = setTimeout(() => setShowAlert(false), 500); // 500ms = fade duration
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
    // Double check the phone number and contact name are still valid
    if (!phoneNumber || !contactName) {
      alert('Missing required information. Please refresh the page and try again.');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to send a text message to ${phoneNumber}?`
    );
    
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/SendText`, {
        phoneNumber: phoneNumber,
        messageContent: messageTemplate
      });
      
      setSent(true);
      setStep(7); //Show typing indicator
      setTimeout(() => setStep(8), 1500); //Show message from the phone number
    } catch (error) {
      console.error('Error sending text:', error);
      alert('Failed to send text message. Please try again.');
    }
  };

  return (
    <BaseLayout>
    <div className="relative pt-16 sms-preview-page"> 
      {showAlert && (
        <div className={`alert alert-success alert-fade ${isVisible ? 'show' : 'hide'}  absolute top-4 left-0 right-0 z-10`}
        role="alert">
          Successfully opted in! You should receive a confirmation message shortly.
        </div>
      )}
      {!smsStatusLoading && !isSmsActive && (
        <div className='alert alert-danger'>
          SMS is currently disabled. Contact Tom to enable it.
        </div>
      )}
      <div className="text-message-container rounded-xl p-4 shadow-md max-w-md mx-auto">
        {/* Header */}
        <div className="header-content">
          <img 
            src={`/media/TBT_Logo.png`} 
            alt="Contact" 
            className="header-logo"
          />
          <span className="contact-name">Tom Evanko</span>
        </div>
        <AnimatePresence>
          {(step === 0) && (
            <motion.div
              key="typing"
              className="typing-indicator flex space-x-1 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Instruction Bubble */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              key="instruction"
              className="text-bubble system-message bg-gray-200 rounded-xl px-4 py-2 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Thanks for Opting In {contactName}!
              <br/>
              Below is the text message that will be sent to: {phoneNumber}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {(step === 2) && (
            <motion.div
              key="typing"
              className="typing-indicator flex space-x-1 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Bubble */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              key="message"
              className="text-bubble bg-blue-500 text-white rounded-xl px-4 py-2 self-end mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {messageTemplate}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Typing Indicator */}
        <AnimatePresence>
          {(step === 4) && (
            <motion.div
              key="typing"
              className="typing-indicator flex space-x-1 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </motion.div>
          )}
        </AnimatePresence>


        <AnimatePresence>
          {step >= 6 && (
            <motion.div
              key="followup"
              className="text-bubble system-message btn-primary bg-gray-100 text-blue-800 rounded-xl px-4 py-2 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >Click the button below to send the text message.
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {(step === 7) && (
            <motion.div
              key="typing"
              className="typing-indicator flex space-x-1 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Final Confirmation Bubble */}
        <AnimatePresence>
          {step >= 8 && (
            <motion.div
              key="followup"
              className="text-bubble system-message btn-primary bg-gray-100 text-blue-800 rounded-xl px-4 py-2 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              You should receive a text message shortly from +12018994890
            </motion.div>
          )}
        </AnimatePresence>

        {/* Send Button */}
        {step >= 3 && !sent && (
          <div className="mt-4">
        <div className="ios-message-bar">
          <div className="ios-message-input">

            <span className="message-text">Tom Built It: {contactName}, you've subscribed to our SMS demo. Msg & data rates may apply. Reply HELP for help, STOP to cancel.</span>
          </div>
          <button
            className={`send-btn ${isSmsActive ? ' active' : ''}`}
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