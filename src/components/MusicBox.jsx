import { useState, useRef, useEffect } from 'react';
import './MusicBox.css';

const MusicBox = ({ onRotate, isPlaying, gearHit, drumRotationDirection }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cylinderRotation, setCylinderRotation] = useState(0);
  const [isIntroView, setIsIntroView] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLidOpen, setIsLidOpen] = useState(false);
  const crankRef = useRef(null);
  const lastAngleRef = useRef(0);
  const animationFrameRef = useRef(null);

  const getCrankCenter = () => {
    if (!crankRef.current) return { x: 0, y: 0 };
    const rect = crankRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const calculateAngle = (clientX, clientY) => {
    const center = getCrankCenter();
    const dx = clientX - center.x;
    const dy = clientY - center.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const handleMouseDown = (e) => {
    if (isIntroView || isTransitioning) return;
    e.preventDefault();
    setIsDragging(true);
    lastAngleRef.current = calculateAngle(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (isIntroView || isTransitioning) return;
    if (e.cancelable) e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    lastAngleRef.current = calculateAngle(touch.clientX, touch.clientY);
  };

  const handleIntroClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsLidOpen(true);
    
    // Start view transition immediately
    setIsIntroView(false);
    
    // Complete transition after animation duration
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentAngle = calculateAngle(e.clientX, e.clientY);
    let delta = currentAngle - lastAngleRef.current;

    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setRotation((prev) => prev + delta);
    
    // Notify parent about rotation (with direction)
    if (onRotate && Math.abs(delta) > 0.5) {
      onRotate(delta);
    }

    lastAngleRef.current = currentAngle;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentAngle = calculateAngle(touch.clientX, touch.clientY);
    let delta = currentAngle - lastAngleRef.current;

    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setRotation((prev) => prev + delta);
    
    // Notify parent about rotation (with direction)
    if (onRotate && Math.abs(delta) > 0.5) {
      onRotate(delta);
    }

    lastAngleRef.current = currentAngle;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const crankElement = crankRef.current;
    if (crankElement) {
      crankElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      if (crankElement) {
        crankElement.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [isIntroView, isTransitioning]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  // Rotate drum when a note is hit
  useEffect(() => {
    if (gearHit > 0) {
      setCylinderRotation(prev => prev + (14.4 * drumRotationDirection)); // Rotate 14.4 degrees per note, direction based on cranking
    }
  }, [gearHit, drumRotationDirection]);

  return (
    <div className="music-box-container">
      <div 
        className={`music-box ${isIntroView ? 'intro-view' : 'top-view'} ${isTransitioning ? 'transitioning' : ''}`}
        onClick={isIntroView ? handleIntroClick : undefined}
        style={{ cursor: isIntroView ? 'pointer' : 'default' }}
      >
        <div className="box-body">
          {/* Lid element */}
          <div className={`box-lid ${isLidOpen ? 'opening' : ''}`}>
            <div className="lid-surface">
              <div className="decorative-pattern"></div>
            </div>
          </div>
          
          <div className="box-front">
            <div className="decorative-pattern"></div>
            
            {/* Internal mechanism always visible */}
            <div className="box-interior">
              {/* Horizontal shaft - rotates with crank */}
              <div className="horizontal-shaft" style={{ backgroundPositionY: `${rotation * 0.15}px` }}></div>
              <div className="horizontal-shaft bottom"></div>
              
              {/* Vertical shaft - connects horizontal shaft to drum */}
              <div className="vertical-shaft" style={{ backgroundPositionX: `${rotation * 0.15}px` }}></div>
              <div className="vertical-shaft left"></div>
              {/* Rotating Drum with Pins */}
              <div className="drum" style={{ backgroundPositionX: `${cylinderRotation * 0.15}px` }}>
                {[...Array(20)].map((_, i) => {
                  // Random positions for each pin across the drum surface - very tight horizontal bounds
                  const positions = [
                    { left: '49%', top: '35%' },
                    { left: '48%', top: '62%' },
                    { left: '49%', top: '48%' },
                    { left: '48%', top: '73%' },
                    { left: '49%', top: '31%' },
                    { left: '48%', top: '55%' },
                    { left: '49%', top: '77%' },
                    { left: '48%', top: '42%' },
                    { left: '49%', top: '68%' },
                    { left: '48%', top: '38%' },
                    { left: '49%', top: '58%' },
                    { left: '48%', top: '33%' },
                    { left: '49%', top: '71%' },
                    { left: '48%', top: '51%' },
                    { left: '49%', top: '44%' },
                    { left: '48%', top: '65%' },
                    { left: '49%', top: '79%' },
                    { left: '48%', top: '46%' },
                    { left: '49%', top: '36%' },
                    { left: '48%', top: '60%' }
                  ];
                  const rotation = cylinderRotation + (i * 18);
                  const normalizedRotation = ((rotation % 360) + 360) % 360;
                  // Hide pins when they rotate to the back (90-270 degrees)
                  const isVisible = normalizedRotation < 90 || normalizedRotation > 270;
                  return (
                    <div 
                      key={i}
                      className="drum-pin" 
                      style={{ 
                        left: positions[i].left,
                        top: positions[i].top,
                        transform: `rotateY(${rotation}deg) translateZ(42px)`,
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.1s ease-out'
                      }}
                    ></div>
                  );
                })}
              </div>
              {/* Metal Comb with Tines */}
              <div className="tine-comb">
                {[...Array(20)].map((_, i) => {
                  // Fixed widths for tines to prevent re-rendering changes
                  const tineWidths = [102, 108, 100, 112, 105, 103, 110, 106, 104, 101, 109, 107, 102, 111, 105, 108, 103, 106, 110, 104];
                  return (
                    <div key={i} className="tine" style={{ width: `${tineWidths[i]}px` }}></div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="box-side"></div>
          <div className="box-left"></div>
          <div className="box-bottom"></div>
          <div className="box-back"></div>
        </div>
        
        <div 
          ref={crankRef}
          className={`crank ${isDragging ? 'dragging' : ''} ${isPlaying ? 'playing' : ''}`}
          style={{ 
            transform: `rotate(${rotation}deg) ${!isIntroView ? 'translateZ(175px)' : 'translateZ(100px)'}`,
            pointerEvents: isIntroView || isTransitioning ? 'none' : 'auto',
            opacity: isIntroView ? 0.7 : 1,
            right: (isIntroView) ? -80 : -76,
            transition: (isIntroView || isTransitioning) ? 'filter 0.2s, transform 1.5s ease-in-out, right 1.5s ease-in-out' : 'filter 0.2s',
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="crank-handle"></div>
          <div className="crank-arm"></div>
          <div className="crank-knob">
            <div className="crank-knob-center"></div>
          </div>
        </div>
      </div>
      {isIntroView && (
          <div className={`touch-prompt ${isTransitioning ? 'fade-out' : ''}`}>
          Touch the box to play
          </div>
      )}
      {!isIntroView && isDragging && (
        <div className="instruction-hint fade-out">Keep Cranking!</div>
      )}
      {!isIntroView && !isDragging && !isPlaying && (
        <div className="instruction-hint">Click/Tap and drag the crank →</div>
      )}
    </div>
  );
};

export default MusicBox;
