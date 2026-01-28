import { useState, useEffect, useRef, useCallback } from 'react';
import './MusicNotes.css';

const MusicNotes = ({ isPlaying, isVisible }) => {
  const [notes, setNotes] = useState([]);
  const intervalRef = useRef(null);
  const timeoutsRef = useRef(new Map());

  // Clean up a specific note
  const removeNote = useCallback((noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    timeoutsRef.current.delete(noteId);
  }, []);

  // Generate a new note
  const generateNote = useCallback(() => {
    const noteId = `note-${Date.now()}-${Math.random()}`;
    const newNote = {
      id: noteId,
      icon: ['♪', '♫', '♬'][Math.floor(Math.random() * 3)],
      left: 50 + (Math.random() - 0.5) * 40,
      animationType: Math.random() > 0.5 ? 'floatUp' : 'floatUpReverse',
    };
    
    setNotes(prev => [...prev, newNote]);
    
    // Schedule removal after animation completes
    const timeoutId = setTimeout(() => {
      removeNote(noteId);
    }, 4100); // Slightly longer than animation duration
    
    timeoutsRef.current.set(noteId, timeoutId);
  }, [removeNote]);

  useEffect(() => {
    if (isPlaying && isVisible) {
      // Start generating notes at constant interval
      intervalRef.current = setInterval(generateNote, 400);
    } else {
      // Stop generating new notes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isVisible, generateNote]);

  // Clear all notes and timeouts when not visible
  useEffect(() => {
    if (!isVisible) {
      setNotes([]);
      // Clear all pending timeouts
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="music-notes-container">
      {notes.map(note => (
        <div
          key={note.id}
          className={`music-note music-note-${note.animationType}`}
          style={{
            left: `${note.left}%`,
          }}
        >
          {note.icon}
        </div>
      ))}
    </div>
  );
};

export default MusicNotes;
