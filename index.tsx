import './index.css';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';

// The images are assumed to be in the same directory as the application.
// The file names are based on the files provided in the prompt.
const slides = [
  'https://github.com/mwanjeronie/pitch-deck-viewer/blob/main/images/1.jpeg?raw=true',
  'https://github.com/mwanjeronie/pitch-deck-viewer/blob/main/images/2.jpeg?raw=true',
  'https://github.com/mwanjeronie/pitch-deck-viewer/blob/main/images/3.jpeg?raw=true',
  'https://github.com/mwanjeronie/pitch-deck-viewer/blob/main/images/4.jpeg?raw=true',
  'https://github.com/mwanjeronie/pitch-deck-viewer/blob/main/images/5.jpeg?raw=true',
  'https://github.com/mwanjeronie/pitch-deck-viewer/blob/main/images/6.jpeg?raw=true',
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  }

  useEffect(() => {
    // This handler uses the functional form of setState, so it doesn't need
    // to be recreated and doesn't depend on component state.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else if (event.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // Preload images for a smoother user experience
    slides.forEach((slideSrc) => {
      const img = new Image();
      img.src = slideSrc;
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="pitch-deck-container" aria-roledescription="carousel">
      <div className="slide-viewer" aria-live="polite" aria-atomic="true">
        <img
          src={slides[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="slide-image"
          onError={e => (e.currentTarget.src = 'https://via.placeholder.com/1920x1080?text=Image+not+found')}
        />
        <button onClick={goToPrevious} className="nav-button prev" aria-label="Previous slide">&#8249;</button>
        <button onClick={goToNext} className="nav-button next" aria-label="Next slide">&#8250;</button>
      </div>

      <div className="controls">
        <div className="dots" role="tablist">
          {slides.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={currentSlide === index}
              aria-label={`Go to slide ${index + 1}`}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </div>
      <p className="slide-counter" aria-label={`Slide ${currentSlide + 1} of ${slides.length}`}>
        {currentSlide + 1} / {slides.length}
      </p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
