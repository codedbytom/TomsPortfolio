import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const LoadingSkeleton = () => (
    <div className="loading-skeleton">
        <div className="skeleton-title" style={{ width: '60%', height: '32px', background: '#f0f0f0', marginBottom: '20px' }}></div>
        <div className="skeleton-text" style={{ width: '80%', height: '20px', background: '#f0f0f0', marginBottom: '10px' }}></div>
        <div className="skeleton-text" style={{ width: '70%', height: '20px', background: '#f0f0f0' }}></div>
    </div>
);

const SurveyFinal = () => {
    const [survey, setSurvey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { surveyId } = useParams();
    const [searchParams] = useSearchParams();
    const [answers, setAnswers] = useState({});
    
    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const id = surveyId || searchParams.get('id') || 'U5bXdq6KnEqyt2DO5grNUQ';
                const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/${id}`);
                setSurvey(response.data);
                
                // Initialize answers state based on questions
                const initialAnswers = {};
                response.data.questions.forEach(q => {
                    initialAnswers[q.id] = q.questionType === 'MultipleChoice' ? [] : '';
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error('Error fetching survey:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurvey();
    }, [surveyId, searchParams]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleMultiChoiceChange = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: prev[questionId].includes(option)
                ? prev[questionId].filter(item => item !== option)
                : [...prev[questionId], option]
        }));
    };
    
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!survey) {
        return <div>Error loading survey</div>;
    }

    return (
        <div className="survey-container">
            <h1>{survey.title}</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                {survey.questions.map((question) => (
                    <div key={question.id} className="question-block">
                        <h2>{question.text}</h2>
                        
                        {question.questionTypeID === 3 && (
                            <div className="checkbox-group">
                                {question.answerOptions.map((option) => (
                                    <label key={option.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={answers[question.id]?.includes(option.text)}
                                            onChange={() => handleMultiChoiceChange(question.id, option.text)}
                                        />
                                        {option.text}
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.questionTypeID === 4 && (
                            <textarea
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                placeholder="Enter your answer..."
                            />
                        )}

                        {question.questionTypeID === 1 && (
                            <div className="rating-container">
                                {[...Array(10)].map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`rating-button ${answers[question.id] === (index + 1) ? 'selected' : ''}`}
                                        onClick={() => handleAnswerChange(question.id, index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                <button type="submit" className="submit-button">
                    Submit Survey
                </button>
            </form>
        </div>
    );
};

export default SurveyFinal;