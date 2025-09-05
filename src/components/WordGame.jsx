import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RotateCcw, Lightbulb } from 'lucide-react';

const WordGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordChain, setWordChain] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameMode, setGameMode] = useState('association');

  const startingWords = [
    'happiness', 'sunshine', 'ocean', 'music', 'friendship', 'adventure', 
    'creativity', 'peace', 'love', 'nature', 'dream', 'hope', 'joy', 'light'
  ];

  const positivePrompts = [
    'Think of something that makes you smile',
    'What brings you comfort?', 
    'Imagine your favorite place',
    'What makes you feel grateful?',
    'Think of a happy memory'
  ];

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    const startWord = startingWords[Math.floor(Math.random() * startingWords.length)];
    setCurrentWord(startWord);
    setWordChain([startWord]);
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setUserInput('');
  };

  const submitWord = () => {
    if (!userInput.trim()) return;
    
    const word = userInput.trim().toLowerCase();
    
    // Simple validation - word should be related or different from current
    if (word !== currentWord.toLowerCase() && word.length > 2) {
      setWordChain(prev => [...prev, word]);
      setCurrentWord(word);
      setScore(prev => prev + word.length * 10);
      setUserInput('');
    } else {
      // Give a gentle hint
      setUserInput('');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentWord('');
    setUserInput('');
    setWordChain([]);
    setScore(0);
    setTimeLeft(60);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitWord();
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="word-container">
        <motion.div className="word-menu">
          <div className="menu-header">
            <BookOpen size={48} className="word-icon" />
            <h2>Word Connection</h2>
            <p>Create chains of connected words and explore your creativity!</p>
          </div>

          <div className="game-info">
            <h3>How to Play:</h3>
            <ul>
              <li>You'll see a starting word</li>
              <li>Type a word that connects to it in some way</li>
              <li>Your word becomes the new starting word</li>
              <li>Keep the chain going for 60 seconds!</li>
              <li>Longer words give more points</li>
            </ul>
          </div>

          <motion.button
            className="start-button"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Word Chain
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="word-container">
        <motion.div className="word-complete">
          <Lightbulb size={64} color="#ffd700" />
          <h2>Creative Session Complete!</h2>
          <div className="word-stats">
            <div>Words Created: {wordChain.length}</div>
            <div>Final Score: {score}</div>
            <div>Your Word Chain:</div>
            <div className="word-chain-display">
              {wordChain.map((word, index) => (
                <span key={index} className="chain-word">
                  {word} {index < wordChain.length - 1 && '→'}
                </span>
              ))}
            </div>
          </div>
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw size={20} />
            New Word Chain
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="word-container">
      <div className="game-header">
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>
      
      <div className="word-display">
        <h3>Current Word:</h3>
        <div className="current-word">{currentWord}</div>
        
        <div className="prompt">
          {positivePrompts[Math.floor(Math.random() * positivePrompts.length)]}
        </div>
      </div>

      <div className="word-input-section">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a connected word..."
          className="word-input"
          autoFocus
        />
        <motion.button
          onClick={submitWord}
          className="submit-word-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Word
        </motion.button>
      </div>

      <div className="word-chain">
        <h4>Your Chain ({wordChain.length} words):</h4>
        <div className="chain-display">
          {wordChain.slice(-5).map((word, index) => (
            <motion.span
              key={index}
              className="chain-word"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordGame;