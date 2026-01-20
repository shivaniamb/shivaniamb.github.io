import { useState, useEffect, useRef } from 'react';
import { getMusicBoxNotes, playMusicBoxNote } from '../utils/generateMusicBoxAudio';

export const useAudioController = (onNotePlayed) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const notesSequenceRef = useRef([]);
  const currentNoteIndexRef = useRef(0);
  const rotationAccumulatorRef = useRef(0);
  const stopTimeoutRef = useRef(null);
  const lastPlayedNoteRef = useRef(null);
  const activeNotesRef = useRef([]); // Track currently playing notes
  const lastRotationTimeRef = useRef(null); // Track time of last rotation
  const currentSpeedRef = useRef(1); // Current cranking speed multiplier
  
  // Constants
  const DEGREES_PER_NOTE = 90; // Degrees of rotation required per note (increased for slower playback)
  const REFERENCE_SPEED = 90; // Normal speed in degrees per second

  useEffect(() => {
    // Initialize audio context
    const initAudio = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 0.6;
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      // Get the note sequence
      notesSequenceRef.current = getMusicBoxNotes();
      
      setIsLoaded(true);
    };

    initAudio();

    return () => {
      // Clean up
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNextNote = (speedMultiplier) => {
    if (!audioContextRef.current || notesSequenceRef.current.length === 0) return;

    const noteData = notesSequenceRef.current[currentNoteIndexRef.current];
    
    // Adjust duration based on cranking speed
    // Faster cranking = shorter duration, slower = longer duration
    const adjustedDuration = noteData.duration / speedMultiplier;
    
    // Play the note with adjusted duration
    const noteNodes = playMusicBoxNote(
      audioContextRef.current,
      noteData.frequency,
      adjustedDuration,
      gainNodeRef.current
    );
    
    activeNotesRef.current.push(noteNodes);
    lastPlayedNoteRef.current = Date.now();
    
    // Notify that a note was played
    if (onNotePlayed) {
      onNotePlayed();
    }
    
    // Clean up after note finishes
    setTimeout(() => {
      activeNotesRef.current = activeNotesRef.current.filter(n => n !== noteNodes);
    }, adjustedDuration * 1000 + 100);
    
    // Move to next note
    currentNoteIndexRef.current = (currentNoteIndexRef.current + 1) % notesSequenceRef.current.length;
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    rotationAccumulatorRef.current = 0;
  };

  const handleRotation = (rotationDelta) => {
    if (!isLoaded) return;

    // Clear any existing stop timeout
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    const now = Date.now();
    
    // Calculate current cranking speed (degrees per second)
    if (lastRotationTimeRef.current) {
      const timeDelta = (now - lastRotationTimeRef.current) / 1000; // Convert to seconds
      if (timeDelta > 0) {
        const instantSpeed = Math.abs(rotationDelta) / timeDelta; // degrees per second
        // Smooth the speed using exponential moving average
        currentSpeedRef.current = currentSpeedRef.current * 0.7 + (instantSpeed / REFERENCE_SPEED) * 0.3;
        // Clamp speed multiplier to reasonable range (0.3x to 3x)
        currentSpeedRef.current = Math.max(0.3, Math.min(3, currentSpeedRef.current));
      }
    }
    lastRotationTimeRef.current = now;

    // Accumulate rotation
    rotationAccumulatorRef.current += Math.abs(rotationDelta);
    
    // Check if we've rotated enough to play the next note
    // Each note should play after DEGREES_PER_NOTE rotation
    if (rotationAccumulatorRef.current >= DEGREES_PER_NOTE) {
      // Calculate how many notes we should play (in case of very fast rotation)
      const notesToPlay = Math.floor(rotationAccumulatorRef.current / DEGREES_PER_NOTE);
      
      // Play notes (usually just 1, but could be more if rotation was very fast)
      for (let i = 0; i < notesToPlay; i++) {
        playNextNote(currentSpeedRef.current);
      }
      
      // Reduce accumulator by the exact amount used
      rotationAccumulatorRef.current -= notesToPlay * DEGREES_PER_NOTE;
      
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }

    // Set timeout to stop if rotation stops
    stopTimeoutRef.current = setTimeout(() => {
      stopPlaying();
    }, 200); // Stop after 200ms of no rotation
  };

  return {
    isLoaded,
    isPlaying,
    handleRotation,
  };
};
