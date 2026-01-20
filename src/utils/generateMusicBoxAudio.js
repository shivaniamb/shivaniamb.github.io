// Music Box Note Sequences
export const getMusicBoxNotes = () => {
  // Note frequencies (in Hz) - increased by 20% for sharper, higher pitch
  const notes = {
    'G': 470.40,  // G4 → ~A#4
    'A': 528.00,  // A4 → ~C5
    'B': 592.66,  // B4 → ~D5
    'C': 627.90,  // C5 → ~D#5
    'D': 704.80,  // D5 → ~F5
    'E': 791.10,  // E5 → ~G5
    'F': 838.15,  // F5 → ~G#5
    'G5': 940.79, // G5 → ~A#5
  };
  
  // Happy Birthday melody sequence
  const happyBirthdaySequence = [
    { note: 'G', duration: 0.8 },
    { note: 'G', duration: 0.4 },
    { note: 'A', duration: 1.2 },
    { note: 'G', duration: 1.2 },
    { note: 'C', duration: 1.2 },
    { note: 'B', duration: 2.4 },
    
    { note: 'G', duration: 0.8 },
    { note: 'G', duration: 0.4 },
    { note: 'A', duration: 1.2 },
    { note: 'G', duration: 1.2 },
    { note: 'D', duration: 1.2 },
    { note: 'C', duration: 2.4 },
    
    { note: 'G', duration: 0.8 },
    { note: 'G', duration: 0.4 },
    { note: 'G5', duration: 1.2 },
    { note: 'E', duration: 1.2 },
    { note: 'C', duration: 1.2 },
    { note: 'B', duration: 1.2 },
    { note: 'A', duration: 2.4 },
    
    { note: 'F', duration: 0.8 },
    { note: 'F', duration: 0.4 },
    { note: 'E', duration: 1.2 },
    { note: 'C', duration: 1.2 },
    { note: 'D', duration: 1.2 },
    { note: 'C', duration: 2.4 },
  ];
  
  // Convert note names to frequencies
  return happyBirthdaySequence.map(item => ({
    frequency: notes[item.note],
    duration: item.duration,
  }));
};

// Play a single music box note
export const playMusicBoxNote = (audioContext, frequency, duration, gainNode) => {
  const now = audioContext.currentTime;
  
  // Use square wave for more metallic/bell-like tone
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  
  // Add subtle vibrato
  const vibrato = audioContext.createOscillator();
  vibrato.type = 'sine';
  vibrato.frequency.value = 5.5;
  
  const vibratoGain = audioContext.createGain();
  vibratoGain.gain.value = 2;
  
  vibrato.connect(vibratoGain);
  vibratoGain.connect(oscillator.frequency);
  
  // Band-pass filter to isolate metallic frequencies
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = frequency * 1.5;
  bandpass.Q.value = 8;
  
  // High-pass filter for brightness
  const highpass = audioContext.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 1200;
  highpass.Q.value = 0.7;
  
  // Create reverb effect
  const convolver = audioContext.createConvolver();
  const reverbLength = audioContext.sampleRate * 2.5; // 2.5 second reverb
  const reverbBuffer = audioContext.createBuffer(2, reverbLength, audioContext.sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = reverbBuffer.getChannelData(channel);
    for (let i = 0; i < reverbLength; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2);
    }
  }
  
  convolver.buffer = reverbBuffer;
  
  // Dry/wet mix for reverb
  const dryGain = audioContext.createGain();
  dryGain.gain.value = 0.6; // 60% dry signal
  
  const wetGain = audioContext.createGain();
  wetGain.gain.value = 0.4; // 40% wet (reverb) signal
  
  // Create envelope for music box plucking effect
  const noteGain = audioContext.createGain();
  noteGain.gain.setValueAtTime(0, now);
  noteGain.gain.linearRampToValueAtTime(0.4, now + 0.003); // Sharp attack
  noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.08); // Quick decay
  noteGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(duration, 1.5));
  
  // Add inharmonic overtones for metallic character
  const harmonic1 = audioContext.createOscillator();
  harmonic1.type = 'sine';
  harmonic1.frequency.value = frequency * 2.7;
  
  const harmonic1Gain = audioContext.createGain();
  harmonic1Gain.gain.setValueAtTime(0.15, now);
  harmonic1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  
  harmonic1.connect(harmonic1Gain);
  harmonic1Gain.connect(noteGain);
  
  // Higher harmonic for brightness
  const harmonic2 = audioContext.createOscillator();
  harmonic2.type = 'sine';
  harmonic2.frequency.value = frequency * 4.2;
  
  const harmonic2Gain = audioContext.createGain();
  harmonic2Gain.gain.setValueAtTime(0.08, now);
  harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  
  harmonic2.connect(harmonic2Gain);
  harmonic2Gain.connect(noteGain);
  
  // Connect through filters to dry/wet split
  oscillator.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(noteGain);
  
  // Split signal for dry/wet mix
  noteGain.connect(dryGain);
  noteGain.connect(convolver);
  convolver.connect(wetGain);
  
  // Merge dry and wet signals
  dryGain.connect(gainNode);
  wetGain.connect(gainNode);
  
  // Start and stop all oscillators
  const actualDuration = Math.min(duration, 2.0);
  oscillator.start(now);
  oscillator.stop(now + actualDuration);
  vibrato.start(now);
  vibrato.stop(now + actualDuration);
  harmonic1.start(now);
  harmonic1.stop(now + actualDuration);
  harmonic2.start(now);
  harmonic2.stop(now + actualDuration);
  
  return { oscillator, vibrato, harmonic1, harmonic2 };
};
