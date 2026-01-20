# 🎵 Birthday Music Box Website

An interactive, birthday-themed music box website built with React where users can "crank" a virtual music box to play the Happy Birthday song, just like a real mechanical music box!

## ✨ Features

### 🎼 Interactive Music Box
- **Crank Rotation Mechanics**: Click and drag the crank handle to rotate it
- **Audio Playback**: Music plays only while you're actively cranking, mimicking a real music box
- **Speed Control**: Rotation speed affects playback speed
- **Music Box Sound**: Synthesized Happy Birthday tune that sounds like a real music box with:
  - Sine wave oscillators for bell-like tones
  - Harmonic overtones for richness
  - Vibrato effect for authentic sound
  - Envelope shaping for plucking effect

### 🎉 Birthday Theme
- **Animated Balloons**: Colorful balloons float up from the bottom with realistic swaying
- **Confetti Effect**: Party confetti continuously falls when music is playing
- **Vibrant Colors**: Beautiful gradient background with purple, pink, and blue hues
- **Festive Design**: Music box styled with birthday party colors

### 🎵 Extensible Architecture
- Song selector infrastructure built-in (currently hidden)
- Easy to add more songs to the playlist
- Modular component structure

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd music_box
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🎮 How to Use

1. **Start Cranking**: Click on the crank handle (the circular knob on the right side)
2. **Keep Moving**: Hold the mouse button and move your mouse in circular motions
3. **Listen**: The music will play as long as you keep cranking!
4. **Stop**: Release the mouse button or stop moving to pause the music

## 🏗️ Project Structure

```
music_box/
├── src/
│   ├── components/
│   │   ├── MusicBox.jsx         # Main music box with crank
│   │   ├── MusicBox.css         # Music box styling
│   │   ├── Balloons.jsx         # Floating balloon animation
│   │   ├── Balloons.css         # Balloon styling
│   │   └── ConfettiEffect.jsx   # Confetti particle effect
│   ├── hooks/
│   │   └── useAudioController.js # Audio playback logic
│   ├── utils/
│   │   └── generateMusicBoxAudio.js # Music box audio synthesis
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # App styling
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
└── package.json
```

## 🎨 Technical Highlights

### Audio Implementation
- **Web Audio API**: Used for precise audio control and synthesis
- **Real-time Synthesis**: Happy Birthday melody generated on-the-fly
- **Playback Control**: Audio speed matches crank rotation speed
- **Looping**: Seamless audio looping for continuous play

### Interaction Design
- **Mouse Tracking**: Calculates angular position relative to crank center
- **Delta Calculation**: Measures rotation speed for natural playback
- **Auto-pause**: Stops playback 200ms after rotation stops
- **Smooth Animations**: CSS transitions and transforms for fluid motion

### Visual Effects
- **CSS Animations**: Custom keyframe animations for balloons and UI elements
- **react-confetti**: Particle system for celebratory effect
- **Gradient Background**: Animated shifting gradient
- **3D Perspective**: CSS transform for depth effect on music box

## 🔮 Future Enhancements

- [ ] Add more songs to the music box
- [ ] Show song selector dropdown
- [ ] Mobile touch support for rotation
- [ ] Add volume control
- [ ] Save favorite songs
- [ ] Share button to send birthday wishes
- [ ] Custom message overlay option
- [ ] Record and playback user cranking pattern

## 📦 Dependencies

- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **react-confetti**: ^6.1.0
- **vite**: ^7.3.1

## 🎯 Browser Compatibility

Works best in modern browsers with Web Audio API support:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📝 License

This project is open source and available for personal and educational use.

## 🎊 Enjoy!

Have fun cranking the music box and celebrating birthdays! 🎂🎉

