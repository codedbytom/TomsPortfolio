import { useState, useRef, useEffect } from 'react';
import '../styles/NightmareCard.css'; // Make sure to import the CSS

function NightmareCard({ title, summary, solution, children }) {
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        if (open && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [open]);

    const handleCardClick = (e) => {
        // Prevent the click from triggering if the button was clicked
        if (e.target.tagName !== 'BUTTON') {
            setOpen(!open);
        }
    };

    return (
        <div 
            className="card mb-3 shadow-sm nightmare-card" 
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{title}</h5>
                <button
                    className="btn btn-primary mt-3 bluebtn-text"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                    }}
                >
                    {open ? 'Collapse' : 'Expand'}
                </button>
            </div>
            <div className="card-body">
                <p className="card-text">{summary}</p>
                <div
                    className="nightmare-collapse transition"
                    style={{ maxHeight: `${height}px` }}
                >
                    <div ref={contentRef} className="pt-3 border-top">
                        {children}
                        <p className="card-text border-top">Solution: {solution}</p>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default NightmareCard;
