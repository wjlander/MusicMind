import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, RotateCcw, Star } from 'lucide-react';

const MemoryGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('normal');

  const colors = [
    { id: 0, color: '#ff6b6b', sound: 'C4' },
    { id: 1, color: '#4ecdc4', sound: 'D4' },
    { id: 2, color: '#45b7d1', sound: 'E4' },
    { id: 3, color: '#96ceb4', sound: 'F4' }
  ];

  const difficulties = {
    easy: { speed: 800, startLength: 2 },
    normal: { speed: 600, startLength: 3 },
    hard: { speed: 400, startLength: 4 }
  };

  const startGame = () => {
    setGameState('playing');
    setLevel(1);
    setScore(0);
    setSequence([]);
    setUserSequence([]);
    generateNextSequence();
  };

  const generateNextSequence = () => {
    const newColor = Math.floor(Math.random() * colors.length);
    const newSequence = level === 1 
      ? Array.from({ length: difficulties[difficulty].startLength }, () => Math.floor(Math.random() * colors.length))
      : [...sequence, newColor];
    
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    setIsPlaying(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, difficulties[difficulty].speed));
      // Flash the color
      document.getElementById(`color-${seq[i]}`).classList.add('active');
      
      await new Promise(resolve => setTimeout(resolve, 300));
      document.getElementById(`color-${seq[i]}`).classList.remove('active');
    }
    
    setIsPlaying(false);
  };

  const handleColorClick = (colorId) => {
    if (isPlaying) return;
    
    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    // Check if the sequence is correct so far
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Game over
      setGameState('finished');
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      // Level complete!
      setScore(prev => prev + level * 100);
      setLevel(prev => prev + 1);
      
      setTimeout(() => {
        generateNextSequence();
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setScore(0);
  };

  if (gameState === 'menu') {
    return (
      <div className="memory-container">
        <motion.div 
          className="memory-menu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="menu-header">
            <Brain size={48} className="memory-icon" />
            <h2>Memory Patterns</h2>
            <p>Follow and repeat the sequence of colors. Great for cognitive training!</p>
          </div>

          <div className="difficulty-selection">
            <h3>Choose Difficulty</h3>
            <div className="difficulty-buttons">
              {Object.entries(difficulties).map(([key, diff]) => (
                <motion.button
                  key={key}
                  className={`difficulty-button ${difficulty === key ? 'active' : ''}`}
                  onClick={() => setDifficulty(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <span>Start with {diff.startLength} colors</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            className="start-button"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Memory Challenge
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="memory-container">
        <motion.div className="memory-complete">
          <Star size={64} color="#ffd700" />
          <h2>Great Job!</h2>
          <p>You reached level {level} and scored {score} points!</p>
          <div className="memory-stats">
            <div>Level Reached: {level}</div>
            <div>Final Score: {score}</div>
            <div>Sequences Completed: {level - 1}</div>
          </div>
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw size={20} />
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="memory-container">
      <div className="game-header">
        <div>Level {level} | Score: {score}</div>
        <div>{isPlaying ? 'Watch the sequence...' : 'Repeat the sequence!'}</div>
      </div>
      
      <div className="color-grid">
        {colors.map((color, index) => (
          <motion.button
            key={color.id}
            id={`color-${color.id}`}
            className="color-button"
            style={{ backgroundColor: color.color }}
            onClick={() => handleColorClick(color.id)}
            disabled={isPlaying}
            whileHover={!isPlaying ? { scale: 1.1 } : {}}
            whileTap={!isPlaying ? { scale: 0.9 } : {}}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;