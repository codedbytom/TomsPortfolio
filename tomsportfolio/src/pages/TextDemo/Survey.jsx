import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import './Survey.css';
import axios from 'axios';

const LoadingSkeleton = () => (
    <div className="loading-skeleton">
        <div className="skeleton-title" style={{ width: '60%', height: '32px', background: '#f0f0f0', marginBottom: '20px' }}></div>
        <div className="skeleton-text" style={{ width: '80%', height: '20px', background: '#f0f0f0', marginBottom: '10px' }}></div>
        <div className="skeleton-text" style={{ width: '70%', height: '20px', background: '#f0f0f0' }}></div>
    </div>
);

const SurveyFinal = () => {
    const navigate = useNavigate(); // Import useNavigate
    const [survey, setSurvey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const  surveyId  = useParams();
    const [searchParams] = useSearchParams();
    const [answers, setAnswers] = useState({});
    const [comments, setComments] = useState({});
    const location = useLocation();

    const mode = location.pathname.includes('results') ? 'results' : 'new';
    const startDateRef = useRef(new Date().toISOString());
    const [formData, setFormData] = useState({
        answers: {},
        startDateTime: startDateRef,
        responseGuidID: '00000000-0000-0000-0000-000000000000'
    });
    
    // Do this to remove the spacing on the root just for the survey page for mobile
    useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('survey-mode');
    return () => root.classList.remove('survey-mode');
    }, []);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                console.log('Fetching survey');
                const id = surveyId.responseGuid || searchParams.get('id') || 'U5bXdq6KnEqyt2DO5grNUQ';
                if(mode == 'results' && id){
                    const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/results/${id}`);
                    setSurvey(response.data);
                }
                else{
                    const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/${id}`);
                    setSurvey(response.data);
                    
                    // Initialize answers and comments state based on questions
                    const initialAnswers = {};
                    const initialComments = {};
                    response.data.questions.forEach(q => {
                        initialAnswers[q.id] = q.questionTypeID === 3 ? [] : '';
                        initialComments[q.id] = '';
                    });
                    setAnswers(initialAnswers);
                    setComments(initialComments);
                    setFormData({
                        responseGuidID: id
                    });
                }
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

    const handleCommentChange = (questionId, value) => {
        setComments(prev => ({
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
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Transform answers object into array of SurveyResponseAnswer objects
        const answersArray = Object.entries(answers).flatMap(([questionId, answer]) => {
            const question = survey.questions.find(q => q.id === parseInt(questionId));
            const questionTypeID = question?.questionTypeID ?? null;
            
            if(questionTypeID == null){
                questionTypeID = survey.questions?.[questionId][0].questionTypeID;
            }

            if (Array.isArray(answer)) {
                // Multiple choice: one SurveyResponseAnswer per selected option
                return answer.map(option => ({
                    surveyQuestionTemplateId: parseInt(questionId),
                    AnswerOptionTemplateId: option,
                    answeredAt: new Date().toISOString(),
                    comment: comments[questionId]
                }));
            } else {
                // Single answer: one SurveyResponseAnswer
                return [{
                    surveyQuestionTemplateId: parseInt(questionId),
                    FreeTextAnswer: questionTypeID === 4 ? answer.toString() : null,
                    AnswerOptionTemplateId: questionTypeID === 4 ? null : answer.toString(),
                    answeredAt: new Date().toISOString(),
                    comment: questionTypeID === 4 ? "" : comments[questionId]
                }];
            }
        });

        // Transform comments object into array
        const commentsArray = Object.values(comments);

        const submitData = {
            Answers: answersArray,
            EncodedGuidID: formData.responseGuidID,
            StartDateTime: startDateRef.current
        };

        console.log('Survey submitted:', submitData);
        
        try{ 
          const response = await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/submit`, submitData);
        } catch (error) {
          console.error('Error submitting survey:', error);
        }
        finally{
          navigate( { pathname: '/text-demo/thank-you' });
        }
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!survey) {
        return <div>Error loading survey</div>;
    }

    return (
        <div className="survey-container">
            <img src={`/media/TBT_Logo.png`} alt="Logo" className="h-8 mr-2 SmsOptInLogo" /> 
            <h1>{survey.title}</h1>
            {mode !== 'results' ? (
                <form onSubmit={handleSubmit}>
                {survey.questions.map((question) => (
                    <div key={question.id} className="question-block">
                        <h2>{question.text}</h2>
                        
                        {question.questionTypeID === 3 && (
                            <div className="checkbox-group">
                                {question.answerOptions.map((option) => (
                                    <label key={option.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={answers[question.id]?.includes(option.id)}
                                            onChange={() => handleMultiChoiceChange(question.id, option.id)}
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

                        {question.questionTypeID === 2 && (

                            <div className="recommendation-buttons">
                                {question.answerOptions.map((answer) => (
                                    <button
                                    type="button"
                                    className={`recommendation-button ${answers[question.id] === answer.id ? 'selected' : ''}`}
                                    onClick={() => handleAnswerChange(question.id,answer.id)}
                                >
                                    {answer.text}
                                </button>
                                ))}
                            </div>
                        )}

                        {question.questionTypeID === 1 && (
                            <div className="rating-container">
                                {question.answerOptions.map((index) => (
                                    <button
                                        key={index.id}
                                        type="button"
                                        className={`rating-button ${answers[question.id] === (index.id) ? 'selected' : ''}`}
                                        onClick={() => handleAnswerChange(question.id, index.id)}
                                    >
                                        {index.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {question.questionTypeID !== 4 && ( <textarea
                            placeholder="Additional comments..."
                            value={comments[question.id] || ''}
                            onChange={(e) => handleCommentChange(question.id, e.target.value)}
                            className="comment-textarea"
                        />)} 
                        {/* only show for non-text questions */}
                    </div>
                ))}
                
                <button type="submit" className="submit-button">
                    Submit Survey
                </button>
            </form>
            ) : (
                survey.questions.map((question) => (
                    <div key={question.id}>
                        <h2>{question.text}</h2>
                        {question.answerOptions.map((answer) => (
                            <h5 key={answer.id}>{answer.text}</h5>
                        ))}
                        {question.answerOptions[0].comment}
                    </div>
                ))
            )}
        </div>
    );
};

export default SurveyFinal;