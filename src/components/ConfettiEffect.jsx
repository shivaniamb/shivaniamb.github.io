import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const ConfettiEffect = ({ isPlaying }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPlaying && !showConfetti) {
      setShowConfetti(true);
    }
  }, [isPlaying]);

  if (!showConfetti) return null;

  return (
    <Confetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      numberOfPieces={isPlaying ? 200 : 50}
      recycle={isPlaying}
      colors={['#ff6b9d', '#c44569', '#ffeaa7', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e']}
      gravity={0.3}
    />
  );
};

export default ConfettiEffect;
