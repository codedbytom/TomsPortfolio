import {BaseLayout} from '../../components/Layout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ThankYou() {
    return (
        <BaseLayout>
        <img src={`/media/TBT_Logo.png`} alt="Logo" className="h-8 mr-2 SmsOptInLogo" /> 
            <h1>Thank You</h1>
            <h3>You should receive a text message shortly with your results</h3>
            <h5>Feel free to close this tab</h5>
        </BaseLayout>
    );
}