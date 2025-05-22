import { useState, useEffect } from 'react';
import axios from 'axios';
import './Survey.css';

const Survey = () => {
  const [formData, setFormData] = useState({});
  const [survey, setSurvey] = useState(null);

  
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

  const renderQuestionInput = (q) => {
    switch (q.questionTypeID) {
      case 1: //1-10 rating
      return <div className="rating-container">
           {q.answerOptions.map((option, rating) => (
            <label key={option.id}>
              <input
                type="radio"
                className={`rating-button ${formData[q.id] === option.id ? 'selected' : ''}`}
                name={`question-${q.id}`}
                checked={formData[q.id] === option.id}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  [q.id]: option.id
                }))}
              />
              {option.text}
            </label>
          ))}
        </div>
        case 2: //yes/no
        return <div className="recommendation-buttons">
          {q.answerOptions.map(option => (
            <label key={option.id}>
              <button
                type="button"
                className={`recommendation-button ${formData[q.id] === option.id ? 'selected' : ''}`}
                onChange={() => {
                  setFormData(prev => {
                    const current = prev[q.id] || [];
                    return {
                      ...prev,
                      [q.id]: current.includes(option.id)
                        ? current.filter(id => id !== option.id)
                        : [...current, option.id]
                    };
                  });
                }}
              />
              {option.text}
            </label>
          ))}
        </div>
        case 3: //multi-choice
          return (
            <div className="rating-container">
              {q.answerOptions.map(option => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    checked={formData[q.id]?.includes(option.id)}
                    onChange={() => {
                    setFormData(prev => {
                      const current = prev[q.id] || [];
                      return {
                        ...prev,
                        [q.id]: current.includes(option.id)
                          ? current.filter(id => id !== option.id)
                          : [...current, option.id]
                      };
                    });
                    }}
                  />
                  {option.text}
                </div>
              ))}
            </div>
          );
        case 4: //text
          return (
            <textarea
              placeholder="Your answer..."
              value={formData[q.id] || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                [q.id]: e.target.value
              }))}
            />
          );
        default:
          return null;
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Survey submitted:', formData);
    
    try{ 
      const response = await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/submit`, formData);
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };
  useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL_HTTP}/api/demosurvey/VMvTQNdzEEWIOKbrNdqrww`)
        .then(res => res.json())
        .then(data => {
          setSurvey(data);
          const initialFormData = data.questions.reduce((acc, q) => {
            acc[q.id] = q.answerOptions.length > 1 ? [] : '';
            return acc;
          }, {});
          setFormData(initialFormData);
        });
  }, []);

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h1>TomBuiltIt</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="survey-form">
        {survey && survey.questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <h2>{idx + 1}. {q.text}</h2>
            {renderQuestionInput(q)}
          </div>
        ))}

        <button type="submit" className="submit-button">
          Submit Survey
        </button>
      </form>
    </div>
  );
};

export default Survey; 