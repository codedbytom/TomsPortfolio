import { useState, useEffect } from 'react';
import axios from 'axios';
import './Survey.css';

const Survey = () => {
  const [formData, setFormData] = useState({
    rating: '',
    recommendation: '',
    likes: [],
    comments: {
      rating: '',
      recommendation: '',
      likes: '',
      suggestions: ''
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      comments: {
        ...prev.comments,
        [field]: value
      }
    }));
  };

  const handleLikesChange = (option) => {
    setFormData(prev => ({
      ...prev,
      likes: prev.likes.includes(option)
        ? prev.likes.filter(item => item !== option)
        : [...prev.likes, option]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Survey submitted:', formData);
    
    try{ 
      const response = await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/submit`, formData);
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
    navigate('/thank-you');
  };

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h1>TomBuiltThis</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="survey-form">
        <div className="question-block">
          <h2>1. What is your thoughts on the demo so far? (1 being awful and 10 being perfect)</h2>
          <div className="rating-container">
            {[...Array(10)].map((_, index) => (
              <button
                key={index + 1}
                type="button"
                className={`rating-button ${formData.rating === (index + 1) ? 'selected' : ''}`}
                onClick={() => handleInputChange('rating', index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Additional comments..."
            value={formData.comments.rating}
            onChange={(e) => handleCommentChange('rating', e.target.value)}
          />
        </div>

        <div className="question-block">
          <h2>2. Would you recommend this demo to a friend or family member?</h2>
          <div className="recommendation-buttons">
            <button
              type="button"
              className={`recommendation-button ${formData.recommendation === 'Yes' ? 'selected' : ''}`}
              onClick={() => handleInputChange('recommendation', 'Yes')}
            >
              Yes
            </button>
            <button
              type="button"
              className={`recommendation-button ${formData.recommendation === 'No' ? 'selected' : ''}`}
              onClick={() => handleInputChange('recommendation', 'No')}
            >
              No
            </button>
          </div>
          <textarea
            placeholder="Additional comments..."
            value={formData.comments.recommendation}
            onChange={(e) => handleCommentChange('recommendation', e.target.value)}
          />
        </div>

        <div className="question-block">
          <h2>3. What do you like so far about the demo?</h2>
          <div className="checkbox-group">
            {[
              'The Text Messages',
              'The iMessage like preview',
              'The Slack Opt-in Page',
              'Ease of Use',
              'The Survey itself',
              'N/A'
            ].map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.likes.includes(option)}
                  onChange={() => handleLikesChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <textarea
            placeholder="Additional comments..."
            value={formData.comments.likes}
            onChange={(e) => handleCommentChange('likes', e.target.value)}
          />
        </div>

        <div className="question-block">
          <h2>4. Any thoughts or suggestions?</h2>
          <textarea
            placeholder="Share your thoughts..."
            value={formData.comments.suggestions}
            onChange={(e) => handleCommentChange('suggestions', e.target.value)}
            className="large-textarea"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Survey
        </button>
      </form>
    </div>
  );
};

export default Survey; 