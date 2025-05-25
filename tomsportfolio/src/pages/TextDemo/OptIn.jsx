import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {BaseLayout } from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';

const SmsOptIn = ({ workOrderId }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    countryCode: '1', // Default to US
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsenting, setIsConsenting] = useState(false);
  const navigate = useNavigate(); // Import useNavigate
  const { theme, toggleTheme } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  //Adding this to check if the server is reachable and to warm up the server from cold start
  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/Ping`);
        console.log('Server is reachable:', response.data);
      } catch (error) {
        console.error('Server is not reachable:', error);
      }
    };
    pingServer();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate phone number length
    if (formData.phoneNumber.length < 9) {
      alert('Phone number must be at least 9 digits long');
      return;
    }
    setIsSubmitting(true);
    

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/AddContact`, {
        phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
        name: formData.name,
        workOrderId: workOrderId,
      }); 
      
      
      // Simulate successful submission
      navigate('/text-demo/sms-preview', { 
        state: { 
          phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
          contactName: formData.name,
          justOptedIn: true // Add this flag to show success message
        }
      });
      
    } catch (error) {
      const errorMessage = error.response?.data || 'An error occurred';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseLayout>
      <div className="position-relative">
        <button 
          onClick={toggleTheme}
          className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2"
          style={{ zIndex: 1000 }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <img src={`/media/TBT_Logo.png`} alt="Logo" className="h-8 mr-2 SmsOptInLogo" />
      </div>
      <div id="optInBody" className="container mt-4">
        <h3 className="text-center mb-4">Text Message Demo</h3>
        <div className="card mb-4">
          <div className="card-header text-center">
            Please provide your phone number below if you would like to subscribe for Text Message Surveys
          </div>
        </div>
        <form id="contactupdate" onSubmit={handleSubmit}>
          <div className="mb-3 row">
            <label className="col-sm-3 col-form-label">Name:</label>
            <div className="col-sm-9">
              <input
                type="text"
                id="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                title="Please use only letters, hyphens, and apostrophes"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-3 col-form-label" htmlFor="PhoneNumber">Phone Number:</label>
            <div className="col-sm-9">
              <div className="input-group">
                <select
                  className="form-select country-code-select"
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                >
                  <option value="1">+1 (US)</option>
                  <option value="44">+44 (UK)</option>
                  <option value="52">+52 (MX)</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  id="PhoneNumber"
                  name="phoneNumber"
                  inputMode="numeric"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
          <div className="custom-checkbox-wrapper">
            <input 
              type="checkbox" 
              id="optIn" 
              name="optIn" 
              onChange={() => setIsConsenting(!isConsenting)}
            />
            <label htmlFor="optIn" className="custom-checkbox-label">
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                I agree to receive text message surveys and alerts from Tom Built This.
              </span>
            </label>
          </div>
        </div>
          <div className="form-group text-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !isConsenting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        <div className="card text-center mt-4">
          <div className="card-footer">
          Tom Built This text message surveys. Message and data rates may apply. Message frequency varies. Text HELP for help. Text STOP to opt-out.  View our <Link to="/legal/terms-and-conditions">Terms & Conditions</Link> and <Link to="/legal/privacy-policy" className="text-primary">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SmsOptIn; 