import {BaseLayout} from '../../components/Layout';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, Link, useParams} from 'react-router-dom';

function ThankYou() {
    const { responseGuid } = useParams();

    useEffect(() => {
        const sendResultsText = async() => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/DemoSurvey/Completed/${responseGuid}`);
                console.log("Endpoint Hit");
            }
            catch(error)
            {
                console.log('Error hitting endpoint', error);
            }
        }
        sendResultsText();
    }, [responseGuid]);

    return (
        <BaseLayout>
        <img src={`/media/TBT_Logo.png`} alt="Logo" className="h-8 mr-2 SmsOptInLogo" /> 
            <h1>Thank You</h1>
            <h3>You should receive a text message shortly with your results</h3>
            <h5>Feel free to close this tab</h5>
        </BaseLayout>
    );
}

export default ThankYou;