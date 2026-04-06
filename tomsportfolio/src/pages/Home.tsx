import {MainLayout} from '../components/Layout';

export default function Home() {
    return (
        <MainLayout>
            <section className="hero">
                <h1>Tom Evanko</h1>
                <h3>Full Stack Developer | Systems Stabilizer | Performance Optimizer</h3>
                <p>Building scalable systems, modernizing legacy code, and solving the problems others run from.</p>
            </section>

            <section className="about">
                <h2>About</h2>
                <p>
                    I'm a Full Stack Developer with 10+ years of experience transforming unstable, outdated systems into fast, reliable platforms.
                </p>

                <p>I specialize in:</p>
                <div className="list-container">
                    <ul className="checkBulletList">
                        <li>API Integrations (Nextiva, Zoom, SMS platforms)</li>
                        <li>Real Time Application Development (Text messaging opt-ins, live survey feedback)</li>
                        <li>Database Optimization (Reduced multi day SQL waits to under 3 hours)</li>
                        <li>Infrastructure & Server Setup (Built full QA environment from scratch)</li>
                        <li>Legacy System Modernization (.NET 4, AngularJS 1.0 → Stabilized and expanded)</li>
                    </ul>
                </div>
                <p>
                    Whether it's cutting a 10-minute report down to under a second, saving clients from churn with real-time demos, or stabilizing production systems that used to require server restarts every two weeks — I deliver real, measurable impact across the stack.
                </p>
            </section>

            <section className="projects">
                <h2>Highlight Projects</h2>
                
                <article className="project">
                    <h3>Full Phone System Migrations</h3>
                    <p>Integrated Nextiva and Zoom APIs across 3 web applications, enabling live call listening and click-to-dial functionality.</p>
                </article>

                <article className="project">
                    <h3>Real Time SMS Feedback System</h3>
                    <p>Designed and built an SMS opt-in and survey demo in under 48 hours, directly saving major client accounts.</p>
                </article>

                <article className="project">
                    <h3>QA Server Buildout</h3>
                    <p>Independently configured a full QA environment (.NET 4, AngularJS 1.0, SQL Server) with no documentation to mirror production reliably.</p>
                </article>

                <article className="project">
                    <h3>Database and Import Optimizations</h3>
                    <p>Reduced SQL wait times from days to hours, and slashed import processing times by 75%.</p>
                </article>

                <article className="project">
                    <h3>System Stabilization</h3>
                    <p>Stopped weekly server restarts by diagnosing and correcting app pool, IIS, and database stability issues.</p>
                </article>
            </section>
        </MainLayout>
    );
}