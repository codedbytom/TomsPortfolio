import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg fixed-top px-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">My Portfolio</Link>

                <div className="d-flex align-items-center">
                    {/* Theme Toggle */}
                    <div className="me-2">
                        <ThemeToggle />
                    </div>

                    {/* Toggler button (hamburger) */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                {/* Collapsible nav links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/resume">Resume</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/text-demo/opt-in">Text Demo</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/coding-nightmares">Coding Nightmares</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hobbies">Hobbies</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
