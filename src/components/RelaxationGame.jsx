import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const RelaxationGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState('forest');
  const [volume, setVolume] = useState(0.5);
  const [sessionTime, setSessionTime] = useState(0);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const scenes = {
    forest: {
      name: 'Forest Sounds',
      description: 'Birds chirping, leaves rustling, gentle forest ambiance',
      color: '#48bb78',
      // In a real app, you'd have actual audio files
      audioUrl: null, // Would be a forest sounds file
      visualElements: ['🌲', '🐦', '🍃', '🌿']
    },
    ocean: {
      name: 'Ocean Waves', 
      description: 'Gentle waves, seagulls, peaceful beach atmosphere',
      color: '#4299e1',
      audioUrl: null, // Would be ocean sounds file
      visualElements: ['🌊', '🏖️', '🐚', '☀️']
    },
    rain: {
      name: 'Gentle Rain',
      description: 'Soft rainfall, distant thunder, cozy indoor feeling',
      color: '#718096',
      audioUrl: null, // Would be rain sounds file
      visualElements: ['🌧️', '☔', '⚡', '🌈']
    },
    meadow: {
      name: 'Peaceful Meadow',
      description: 'Wind through grass, distant mountains, open sky',
      color: '#68d391',
      audioUrl: null, // Would be meadow sounds file
      visualElements: ['🌾', '🦋', '🌸', '⛰️']
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    // In a real app, you would play/pause actual audio here
    // if (audioRef.current) {
    //   if (isPlaying) {
    //     audioRef.current.pause();
    //   } else {
    //     audioRef.current.play();
    //   }
    // }
  };

  const changeScene = (sceneKey) => {
    setCurrentScene(sceneKey);
    // In a real app, you would load the new audio file here
    setSessionTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scene = scenes[currentScene];

  return (
    <div className="relaxation-container">
      <motion.div className="relaxation-player">
        <div className="player-header">
          <Leaf size={48} className="relaxation-icon" />
          <h2>Nature Sounds</h2>
          <p>Immerse yourself in calming natural environments</p>
        </div>

        <div className="scene-selector">
          <h3>Choose Your Environment:</h3>
          <div className="scene-buttons">
            {Object.entries(scenes).map(([key, sceneData]) => (
              <motion.button
                key={key}
                className={`scene-button ${currentScene === key ? 'active' : ''}`}
                onClick={() => changeScene(key)}
                style={{ 
                  borderColor: sceneData.color,
                  backgroundColor: currentScene === key ? sceneData.color : 'white',
                  color: currentScene === key ? 'white' : sceneData.color
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="scene-info">
                  <h4>{sceneData.name}</h4>
                  <p>{sceneData.description}</p>
                  <div className="scene-elements">
                    {sceneData.visualElements.map((element, index) => (
                      <span key={index} className="scene-element">{element}</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="player-controls">
          <motion.div 
            className="play-area"
            style={{ backgroundColor: `${scene.color}20` }}
          >
            <motion.button
              className="play-button-large"
              onClick={togglePlay}
              style={{ backgroundColor: scene.color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </motion.button>
            
            <div className="current-scene-info">
              <h3 style={{ color: scene.color }}>{scene.name}</h3>
              <p>{isPlaying ? 'Now Playing' : 'Paused'}</p>
              <p className="session-timer">Session: {formatTime(sessionTime)}</p>
            </div>
          </motion.div>

          <div className="volume-control">
            <VolumeX size={20} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="volume-slider"
            />
            <Volume2 size={20} />
          </div>
        </div>

        <div className="visual-feedback">
          <motion.div 
            className="sound-waves"
            style={{ borderColor: scene.color }}
          >
            {isPlaying && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="wave"
                    style={{ backgroundColor: scene.color }}
                    animate={{
                      height: isPlaying ? ['20px', '60px', '20px'] : '20px',
                    }}
                    transition={{
                      duration: 1 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        </div>

        <div className="relaxation-benefits">
          <h4>Benefits of Nature Sounds:</h4>
          <ul>
            <li>🧘 Reduces stress and anxiety</li>
            <li>💤 Improves sleep quality</li>
            <li>🧠 Enhances focus and concentration</li>
            <li>❤️ Lowers heart rate and blood pressure</li>
            <li>🌱 Connects you with nature's healing power</li>
          </ul>
        </div>

        <div className="usage-tip">
          <p><strong>Tip:</strong> Find a comfortable position, close your eyes, and let the sounds 
          wash over you. Even 5-10 minutes can help reset your mental state.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RelaxationGame;