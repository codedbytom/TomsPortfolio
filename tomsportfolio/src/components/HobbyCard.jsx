import { useState, useRef, useEffect } from 'react';

function HobbyCard({ hobby }) {
    const [showMedia, setShowMedia] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);  // Add this state

    const {
        id,
        title,
        icon,
        description,
        mediaUrl,
        mediaGallery,
        mediaType,
        showPuzzle,
        showPizza
    } = hobby;

     const handleImageClick = (img) => {
        setSelectedImage(img);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };
    return (
        <>
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">
                    {icon} {title}
                </h5>
                <p className="card-text">{description}</p>

                <button
                    className="btn btn-primary mt-3 bluebtn-text"
                    onClick={() => setShowMedia(prev => !prev)}
                >
                    {showMedia ? 'Hide' : 'Show'} {mediaType === 'video' ? 'Video' : 'Photo'}
                </button>


                {showMedia && (
                    <div className="mt-3">
                        {showPuzzle && (
                            <div className="mt-4">
                                <h6 className="fw-bold">🧠 Daily Puzzle</h6>
                                <a
                                    href="https://www.chess.com/daily-chess-puzzle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary mt-3 bluebtn-text"
                                >
                                    Solve Today’s Puzzle
                                </a>
                                <br />
                            <img src={mediaUrl} alt={title} className="img-fluid rounded" />

                            </div>
                        )}
                        {showPizza && (
                            <div className="row g-3">
                                {mediaGallery.map((img, i) => (
                                    <div className="col-6 col-md-4" key={i}>
                                        <img src={img} 
                                        className="img-fluid rounded shadow-sm" 
                                        alt={`Pizza ${i + 1}`} 
                                        onClick={() => handleImageClick(img)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {mediaType === 'video' ? (
                            <video src={mediaUrl} controls className="w-100 rounded" />
                        ) :(<div></div>)}
                    </div>
                )}
                 
            </div>
        </div>
         {/* Move the modal outside the card */}
         {selectedImage && (
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050,
                    padding: '1rem'
                }}
                onClick={handleCloseModal}
            >
                <div style={{ position: 'relative', maxWidth: '90vw', width: '100%' }}>
                    <button 
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={handleCloseModal}
                    >
                        ×
                    </button>
                    <img 
                        src={selectedImage}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '0.375rem'
                        }}
                        alt="Enlarged view"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        )}
        </>
    );
}

export default HobbyCard;