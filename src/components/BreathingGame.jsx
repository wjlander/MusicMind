import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Heart, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BreathingGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, breathing, paused, finished
  const [breathingPattern, setBreathingPattern] = useState('4-7-8'); // 4-7-8, box, simple
  const [currentPhase, setCurrentPhase] = useState('inhale'); // inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionTime, setSessionTime] = useState(5); // minutes
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  const intervalRef = useRef(null);
  const sessionStartTime = useRef(null);

  const breathingPatterns = {
    '4-7-8': {
      name: '4-7-8 Technique',
      description: 'Inhale for 4, hold for 7, exhale for 8. Great for anxiety and sleep.',
      inhale: 4,
      hold: 7,
      exhale: 8,
      color: '#48bb78'
    },
    'box': {
      name: 'Box Breathing',
      description: 'Equal timing for all phases. Used by Navy SEALs for stress management.',
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdEmpty: 4,
      color: '#667eea'
    },
    'simple': {
      name: 'Simple Breathing',
      description: 'Basic inhale and exhale pattern. Perfect for beginners.',
      inhale: 4,
      hold: 0,
      exhale: 6,
      color: '#ed8936'
    }
  };

  useEffect(() => {
    if (isActive && gameState === 'breathing') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            moveToNextPhase();
            return getPhaseTime(getNextPhase());
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, currentPhase, gameState]);

  useEffect(() => {
    if (sessionStartTime.current && gameState === 'breathing') {
      const elapsed = (Date.now() - sessionStartTime.current) / 1000 / 60;
      if (elapsed >= sessionTime) {
        finishSession();
      }
    }
  }, [completedCycles]);

  const getPhaseTime = (phase) => {
    const pattern = breathingPatterns[breathingPattern];
    switch (phase) {
      case 'inhale': return pattern.inhale;
      case 'hold': return pattern.hold;
      case 'exhale': return pattern.exhale;
      case 'holdEmpty': return pattern.holdEmpty || 0;
      default: return 4;
    }
  };

  const getNextPhase = () => {
    const pattern = breathingPatterns[breathingPattern];
    switch (currentPhase) {
      case 'inhale':
        return pattern.hold > 0 ? 'hold' : 'exhale';
      case 'hold':
        return 'exhale';
      case 'exhale':
        return pattern.holdEmpty > 0 ? 'holdEmpty' : 'inhale';
      case 'holdEmpty':
        return 'inhale';
      default:
        return 'inhale';
    }
  };

  const moveToNextPhase = () => {
    const nextPhase = getNextPhase();
    setCurrentPhase(nextPhase);
    
    // Complete cycle when we return to inhale
    if (nextPhase === 'inhale') {
      setCompletedCycles(prev => prev + 1);
    }
  };

  const startBreathing = () => {
    setGameState('breathing');
    setCurrentPhase('inhale');
    setTimeRemaining(getPhaseTime('inhale'));
    setCompletedCycles(0);
    setIsActive(true);
    sessionStartTime.current = Date.now();
  };

  const pauseBreathing = () => {
    setIsActive(false);
    setGameState('paused');
  };

  const resumeBreathing = () => {
    setIsActive(true);
    setGameState('breathing');
  };

  const stopBreathing = () => {
    setIsActive(false);
    finishSession();
  };

  const finishSession = () => {
    setIsActive(false);
    setGameState('finished');
    if (sessionStartTime.current) {
      setTotalSessionTime((Date.now() - sessionStartTime.current) / 1000 / 60);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentPhase('inhale');
    setTimeRemaining(0);
    setCompletedCycles(0);
    setTotalSessionTime(0);
    setIsActive(false);
    sessionStartTime.current = null;
    clearInterval(intervalRef.current);
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'holdEmpty': return 'Hold Empty';
      default: return 'Breathe';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return '#48bb78';
      case 'hold': return '#ed8936';
      case 'exhale': return '#667eea';
      case 'holdEmpty': return '#9f7aea';
      default: return '#48bb78';
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="breathing-container">
        <motion.div 
          className="breathing-menu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="menu-header">
            <Heart size={48} className="breathing-icon" />
            <h2>Mindful Breathing</h2>
            <p>Choose a breathing technique to help you relax and center yourself</p>
          </div>

          <div className="breathing-settings">
            <div className="settings-section">
              <h3>Breathing Technique</h3>
              <div className="pattern-options">
                {Object.entries(breathingPatterns).map(([key, pattern]) => (
                  <motion.button
                    key={key}
                    className={`pattern-button ${breathingPattern === key ? 'active' : ''}`}
                    onClick={() => setBreathingPattern(key)}
                    style={{ borderColor: pattern.color }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="pattern-info">
                      <h4 style={{ color: pattern.color }}>{pattern.name}</h4>
                      <p>{pattern.description}</p>
                      <div className="timing-display">
                        <span>Inhale: {pattern.inhale}s</span>
                        {pattern.hold > 0 && <span>Hold: {pattern.hold}s</span>}
                        <span>Exhale: {pattern.exhale}s</span>
                        {pattern.holdEmpty > 0 && <span>Hold: {pattern.holdEmpty}s</span>}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Session Duration</h3>
              <div className="duration-options">
                {[2, 5, 10, 15].map(minutes => (
                  <motion.button
                    key={minutes}
                    className={`duration-button ${sessionTime === minutes ? 'active' : ''}`}
                    onClick={() => setSessionTime(minutes)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {minutes} min
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              className="start-breathing-button"
              onClick={startBreathing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Start Breathing Session
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="breathing-container">
        <motion.div 
          className="breathing-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="complete-header">
            <motion.div
              className="complete-icon"
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Leaf size={64} color="#48bb78" />
            </motion.div>
            <h2>Session Complete!</h2>
            <p>Well done! You've completed your mindful breathing session.</p>
          </div>

          <div className="session-stats">
            <div className="stat">
              <span className="stat-label">Breathing Cycles</span>
              <span className="stat-value">{completedCycles}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Session Time</span>
              <span className="stat-value">{Math.round(totalSessionTime * 10) / 10} min</span>
            </div>
            <div className="stat">
              <span className="stat-label">Technique Used</span>
              <span className="stat-value">{breathingPatterns[breathingPattern].name}</span>
            </div>
          </div>

          <div className="wellness-message">
            <p>🌱 Regular breathing exercises can help reduce stress, improve focus, and promote better sleep.</p>
            <p>💚 Consider making this a daily practice for ongoing mental wellness benefits.</p>
          </div>

          <motion.button
            className="restart-breathing-button"
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
            New Session
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const progress = sessionStartTime.current 
    ? Math.min(((Date.now() - sessionStartTime.current) / 1000 / 60) / sessionTime * 100, 100)
    : 0;

  return (
    <div className="breathing-container">
      <div className="breathing-session">
        <div className="session-header">
          <div className="session-info">
            <span>Cycles: {completedCycles}</span>
            <span>{breathingPatterns[breathingPattern].name}</span>
          </div>
          <div className="session-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%`, backgroundColor: getPhaseColor() }}
              />
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="breathing-circle-container">
          <motion.div
            className="breathing-circle"
            style={{ borderColor: getPhaseColor() }}
            animate={{
              scale: currentPhase === 'inhale' ? 1.3 : currentPhase === 'exhale' ? 0.7 : 1,
            }}
            transition={{
              duration: Math.max(timeRemaining - 0.5, 0.5),
              ease: "easeInOut"
            }}
          >
            <div className="circle-content">
              <h3 style={{ color: getPhaseColor() }}>{getPhaseInstruction()}</h3>
              <div className="timer" style={{ color: getPhaseColor() }}>
                {timeRemaining}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="breathing-controls">
          {gameState === 'breathing' ? (
            <motion.button
              className="pause-button"
              onClick={pauseBreathing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={20} />
              Pause
            </motion.button>
          ) : (
            <motion.button
              className="resume-button"
              onClick={resumeBreathing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Resume
            </motion.button>
          )}
          
          <motion.button
            className="stop-button"
            onClick={stopBreathing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Stop Session
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BreathingGame;