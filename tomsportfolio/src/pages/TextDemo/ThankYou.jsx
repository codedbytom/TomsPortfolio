import {BaseLayout} from '../../components/Layout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ThankYou() {
    return (
        <BaseLayout>
        <img src={`/media/TBT_Logo.png`} alt="Logo" className="h-8 mr-2 SmsOptInLogo" /> 
            <h1>Thank You</h1>
        </BaseLayout>
    );
}