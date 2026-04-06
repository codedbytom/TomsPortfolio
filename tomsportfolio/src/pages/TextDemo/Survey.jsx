import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle';
import './Survey.css';
import axios from 'axios';
import { Loader, Text, Center, Table, Button, Anchor, SimpleGrid, Image } from '@mantine/core';
import { MainLayout } from '../../components/Layout';

const LoadingSkeleton = () => (
  <Center h={200}>
    <div style={{ textAlign: 'center' }}>
      <Loader size="lg" />
      <Text mt="md" c="dimmed">Loading survey...</Text>
    </div>
  </Center>
);

const SurveyFinal = () => {
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const surveyId = useParams();
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

    const [column1, setItems] = useState([]);
    const [column2, setItems2] = useState([]);

    const addItemToColumn1 = (newItem) => setItems(prev => [...prev, newItem]);
    const addItemToColumn2 = (newItem) => setItems2(prev => [...prev, newItem]);
    const id = surveyId.responseGuid || searchParams.get('id') || 'U5bXdq6KnEqyt2DO5grNUQ';
    
    useEffect(() => {
        const root = document.getElementById('root');
        root.classList.add('survey-mode');
        return () => root.classList.remove('survey-mode');
    }, []);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                if (mode === 'results' && id) {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/results/${id}`);
                    setSurvey(response.data);
                } else {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/${id}`);
                    setSurvey(response.data);

                    const initialAnswers = {};
                    const initialComments = {};

                    const multiChoiceQuestion = response.data.questions.find(q => q.questionTypeID === 3);
                    multiChoiceQuestion?.answerOptions.forEach((answer, idx) => {
                        if (idx % 2 === 0) addItemToColumn1(answer);
                        else addItemToColumn2(answer);
                    });

                    response.data.questions.forEach(q => {
                        initialAnswers[q.id] = q.questionTypeID === 3 ? [] : '';
                        initialComments[q.id] = '';
                    });
                    setAnswers(initialAnswers);
                    setComments(initialComments);
                    setFormData({ responseGuidID: id });
                }
            } catch (error) {
                console.error('Error fetching survey:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSurvey();
    }, [id, mode]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleCommentChange = (questionId, value) => {
        setComments(prev => ({ ...prev, [questionId]: value }));
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
        const answersArray = Object.entries(answers).flatMap(([questionId, answer]) => {
            const question = survey.questions.find(q => q.id === parseInt(questionId));
            var questionTypeID = question?.questionTypeID ?? survey.questions?.[questionId]?.[0]?.questionTypeID ?? null;

            if (Array.isArray(answer)) {
                return answer.map(option => ({
                    surveyQuestionTemplateId: parseInt(questionId),
                    AnswerOptionTemplateId: option,
                    answeredAt: new Date().toISOString(),
                    comment: comments[questionId]
                }));
            } else {
                return [{
                    surveyQuestionTemplateId: parseInt(questionId),
                    FreeTextAnswer: questionTypeID === 4 ? answer.toString() : null,
                    AnswerOptionTemplateId: questionTypeID === 4 ? null : answer.toString(),
                    answeredAt: new Date().toISOString(),
                    comment: questionTypeID === 4 ? '' : comments[questionId]
                }];
            }
        });

        const submitData = {
            Answers: answersArray,
            EncodedGuidID: formData.responseGuidID,
            StartDateTime: startDateRef.current
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/submit`, submitData);
        } catch (error) {
            console.error('Error submitting survey:', error);
        } finally {
            navigate({ pathname: `/text-demo/thank-you/${formData.responseGuidID}` });
        }
    };

    if (isLoading) return <LoadingSkeleton />;
    if (!survey) return <Text>Error loading survey</Text>;

    return (
        
        <div className="survey-container">
            <div>
                <ThemeToggle/>
            </div>
            <Image src="/media/TBI_Logo.png" alt="Logo" h={64} w="auto" fit="contain" mx="auto" mb="md" className="SmsOptInLogo" />
            <h1>{survey.title}</h1>

            {mode !== 'results' ? (
                <form onSubmit={handleSubmit}>
                    {survey.questions.map((question) => (
                        <div key={question.id} className="question-block">
                            <h2 className="question-text">{question.text}</h2>

                            {question.questionTypeID === 3 && (
                                <div className="checkbox-group">
                                    <SimpleGrid cols={2} spacing="sm">
                                        <div>
                                            {column1.map((option) => (
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
                                        <div>
                                            {column2.map((option) => (
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
                                    </SimpleGrid>
                                </div>
                            )}

                            {question.questionTypeID === 4 && (
                                <textarea
                                    value={answers[question.id] || ''}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    placeholder="Enter your answer..."
                                    className="survey-text-area"
                                />
                            )}

                            {question.questionTypeID === 2 && (
                                <div className="recommendation-buttons">
                                    {question.answerOptions.map((answer) => (
                                        <button
                                            key={answer.id}
                                            type="button"
                                            className={`recommendation-button${answers[question.id] === answer.id ? ' selected' : ''}`}
                                            onClick={() => handleAnswerChange(question.id, answer.id)}
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
                                            className={`rating-button${answers[question.id] === index.id ? ' selected' : ''}`}
                                            onClick={() => handleAnswerChange(question.id, index.id)}
                                        >
                                            {index.text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {question.questionTypeID !== 4 && (
                                <textarea
                                    placeholder="Additional comments..."
                                    value={comments[question.id] || ''}
                                    onChange={(e) => handleCommentChange(question.id, e.target.value)}
                                    className="comment-textarea"
                                />
                            )}
                        </div>
                    ))}

                    <button type="submit" className="submit-button">Submit Survey</button>
                </form>
            ) : (
                <div>
                    <Table striped withBorder withColumnBorders highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Question</Table.Th>
                                <Table.Th>Answer / Comment</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {survey.questions.map((question, idx) => (
                                <Table.Tr key={idx}>
                                    <Table.Td>{question.text}</Table.Td>
                                    <Table.Td>
                                        {question.answerOptions.map((answer, i) => (
                                            <div key={i} style={{ marginBottom: '0.5rem' }}>
                                                <strong>{question.questionTypeID !== 4 ? answer.text : answer.freeTextAnswer}</strong>
                                                {answer?.comment && question.questionTypeID !== 3 && (
                                                    <Text size="sm" c="dimmed" fs="italic">{answer.comment}</Text>
                                                )}
                                            </div>
                                        ))}
                                        {question.questionTypeID === 3 && (
                                            <Text size="sm" c="dimmed" fs="italic">{question.answerOptions[0]?.comment}</Text>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    <Center mt="xl">
                        <Button component={Link} to="/">Back to Home</Button>
                    </Center>
                </div>
            )}
        </div>
    );
};

export default SurveyFinal;
