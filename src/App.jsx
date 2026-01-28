import { useState, useEffect, useRef } from 'react'
import MusicBox from './components/MusicBox'
import Balloons from './components/Balloons'
import ConfettiEffect from './components/ConfettiEffect'
import PartyPopper from './components/PartyPopper'
import { useAudioController } from './hooks/useAudioController'
import './App.css'

function App() {
  const [selectedSong, setSelectedSong] = useState('hbd');
  const [triggerPopper, setTriggerPopper] = useState(false);
  const [gearHit, setGearHit] = useState(0);
  const [drumRotationDirection, setDrumRotationDirection] = useState(1);
  const wasPlayingRef = useRef(false);

  // Callback when a note is played
  const handleNotePlayed = (isForward) => {
    setGearHit(prev => prev + 1);
    setDrumRotationDirection(isForward ? 1 : -1);
  };

  const { isLoaded, isPlaying, handleRotation, resetAudio } = useAudioController(handleNotePlayed);

  // Callback to reset all state
  const handleReset = () => {
    setGearHit(0);
    setDrumRotationDirection(1);
    resetAudio();
  };

  // Trigger party popper when music starts playing
  useEffect(() => {
    if (isPlaying && !wasPlayingRef.current) {
      setTriggerPopper(prev => !prev); // Toggle to trigger
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Song data structure (extensible for future)
  const songs = [
    { id: 'hbd', name: 'Happy Birthday' },
    // Future songs can be added here
  ];

  return (
    <div className="app">
      <Balloons />
      <ConfettiEffect isPlaying={isPlaying} />
      <PartyPopper trigger={triggerPopper} />
      
      <div className="content">
        <MusicBox 
          onRotate={handleRotation}
          isPlaying={isPlaying}
          gearHit={gearHit}
          drumRotationDirection={drumRotationDirection}
          onReset={handleReset}
        />

        {!isLoaded && (
          <div className="loading">Loading music box audio...</div>
        )}

        {/* Hidden song selector for future use */}
        <select 
          className="song-selector hidden"
          value={selectedSong}
          onChange={(e) => setSelectedSong(e.target.value)}
        >
          {songs.map(song => (
            <option key={song.id} value={song.id}>
              {song.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default App
