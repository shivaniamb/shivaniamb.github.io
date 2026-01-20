import { useEffect, useState } from 'react';
import './PartyPopper.css';

const PartyPopper = ({ trigger }) => {
  const [poppers, setPoppers] = useState([]);
  const [popperId, setPopperId] = useState(0);

  useEffect(() => {
    if (trigger) {
      // Create multiple poppers
      const newPoppers = [];
      const positions = [
        { left: '15%', rotation: -30 },
        { left: '85%', rotation: 30 },
      ];

      positions.forEach((pos, index) => {
        newPoppers.push({
          id: popperId + index,
          ...pos,
        });
      });

      setPoppers(prev => [...prev, ...newPoppers]);
      setPopperId(prev => prev + positions.length);

      // Remove poppers after animation
      setTimeout(() => {
        setPoppers(prev => prev.filter(p => !newPoppers.find(np => np.id === p.id)));
      }, 2000);
    }
  }, [trigger]);

  return (
    <div className="party-popper-container">
      {poppers.map(popper => (
        <div 
          key={popper.id} 
          className="popper"
          style={{ left: popper.left }}
        >
          <div className="popper-cone" style={{ transform: `rotate(${popper.rotation}deg)` }}>
            🎉
          </div>
          <div className="popper-explosion">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="popper-particle"
                style={{
                  '--angle': `${(i * 18) + (popper.rotation)}deg`,
                  '--delay': `${i * 0.02}s`,
                  '--color': ['#ff6b9d', '#ffeaa7', '#74b9ff', '#a29bfe', '#fdcb6e'][i % 5],
                }}
              />
            ))}
            {[...Array(15)].map((_, i) => (
              <div 
                key={`streamer-${i}`} 
                className="popper-streamer"
                style={{
                  '--angle': `${(i * 24) + (popper.rotation)}deg`,
                  '--delay': `${i * 0.03}s`,
                  '--color': ['#ff6b9d', '#c44569', '#ffeaa7', '#74b9ff', '#a29bfe'][i % 5],
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartyPopper;
