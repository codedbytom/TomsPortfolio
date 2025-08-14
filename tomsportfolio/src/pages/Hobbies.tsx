import {MainLayout} from '../components/Layout';
import { hobbies } from '../data/hobbies';
import HobbyCard from '../components/HobbyCard';

export default function Hobbies() {
    return (
        <MainLayout>
            <h1 className="headerSpacing">Hobbies Page</h1>
            {hobbies.map((hobby) => (
                <HobbyCard key={hobby.title} hobby={hobby} />
            ))}
        </MainLayout>
    );
}
