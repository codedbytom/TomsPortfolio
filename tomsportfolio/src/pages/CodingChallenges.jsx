import {MainLayout} from '../components/Layout';
import NightmareCard from '../components/NightmareCard';
import { nightmares } from '../data/nightmares'; //source for the coding nightmares Ive dealt with
export default function CodingNightmares() {
    return (
        <MainLayout>
            <h1 className="headerSpacing">Tom's Coding Challenges</h1>
            <h6>Note: These stories reflect anonymized and generalized experiences from legacy systems I’ve worked on. They are intended to showcase engineering challenges and how I approach them. Not to criticize individuals or companies.</h6>
            {nightmares.map(n => (
                <NightmareCard key={n.id}
                    title={n.title}
                    summary={n.summary}
                    solution={n.solution}>

                    {n.content.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}

                </NightmareCard>
            ))}
        </MainLayout>
    );
}