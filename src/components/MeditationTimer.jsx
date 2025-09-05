import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Bell, Waves } from 'lucide-react';

const MeditationTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [sessionType, setSessionType] = useState('mindfulness');
  const [phase, setPhase] = useState('preparation'); // preparation, meditation, completion
  const [totalTime, setTotalTime] = useState(300);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  const durations = [
    { minutes: 3, label: '3 min', description: 'Quick reset' },
    { minutes: 5, label: '5 min', description: 'Perfect start' },
    { minutes: 10, label: '10 min', description: 'Deep focus' },
    { minutes: 15, label: '15 min', description: 'Full session' },
    { minutes: 20, label: '20 min', description: 'Extended practice' },
    { minutes: 30, label: '30 min', description: 'Advanced session' }
  ];

  const sessionTypes = {
    mindfulness: {
      name: 'Mindfulness',
      description: 'Focus on the present moment and your breath',
      color: '#48bb78',
      icon: '🧘',
      guidance: [
        'Find a comfortable position and close your eyes',
        'Take three deep breaths to center yourself',
        'Notice your natural breathing rhythm',
        'When your mind wanders, gently return to your breath',
        'Observe thoughts without judgment'
      ]
    },
    loving_kindness: {
      name: 'Loving Kindness',
      description: 'Cultivate compassion and kindness for yourself and others',
      color: '#ed64a6',
      icon: '💝',
      guidance: [
        'Begin by sending loving wishes to yourself',
        'May I be happy, may I be healthy, may I be at peace',
        'Extend these wishes to someone you love',
        'Then to someone neutral, and finally to someone difficult',
        'End by sending love to all beings everywhere'
      ]
    },
    body_scan: {
      name: 'Body Scan',
      description: 'Progressive relaxation and body awareness',
      color: '#9f7aea',
      icon: '🌸',
      guidance: [
        'Lie down comfortably and close your eyes',
        'Start by noticing your toes and feet',
        'Slowly move your attention up through your body',
        'Notice any tension and allow it to release',
        'End by feeling your whole body relaxed and peaceful'
      ]
    },
    gratitude: {
      name: 'Gratitude',
      description: 'Reflect on things you\'re thankful for',
      color: '#38b2ac',
      icon: '🙏',
      guidance: [
        'Take a moment to settle into stillness',
        'Think of three things you\'re grateful for today',
        'Feel the warmth and appreciation in your heart',
        'Let gratitude fill your entire being',
        'Carry this feeling with you throughout your day'
      ]
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && phase === 'meditation') {
      setPhase('completion');
      setIsActive(false);
      playCompletionSound();
      // Increment completed sessions
      setCompletedSessions(prev => prev + 1);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, phase]);

  const playCompletionSound = () => {
    // In a real app, you'd play a gentle bell sound
    // For now, we'll use the Web Audio API to create a simple tone
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(528, ctx.currentTime); // "Love frequency"
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 2);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const startMeditation = () => {
    setPhase('meditation');
    setTimeLeft(selectedDuration * 60);
    setTotalTime(selectedDuration * 60);
    setIsActive(true);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    setPhase('preparation');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const currentSession = sessionTypes[sessionType];

  if (phase === 'completion') {
    return (
      <div className="meditation-container">
        <motion.div 
          className="meditation-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="completion-bell"
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, 10, -10, 5, -5, 0] }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <Bell size={64} color={currentSession.color} />
          </motion.div>
          
          <h2>Meditation Complete</h2>
          <p>Well done! You've completed a {selectedDuration}-minute {currentSession.name.toLowerCase()} meditation.</p>
          
          <div className="completion-stats">
            <div className="stat-item">
              <Clock size={24} />
              <span>Session Time</span>
              <strong>{selectedDuration} minutes</strong>
            </div>
            <div className="stat-item">
              <currentSession.icon style={{ fontSize: '24px' }} />
              <span>Practice Type</span>
              <strong>{currentSession.name}</strong>
            </div>
            <div className="stat-item">
              <span className="completion-emoji">🎯</span>
              <span>Sessions Today</span>
              <strong>{completedSessions}</strong>
            </div>
          </div>

          <div className="meditation-benefits">
            <h4>Benefits of Regular Meditation:</h4>
            <ul>
              <li>🧠 Reduces stress and anxiety</li>
              <li>💤 Improves sleep quality</li>
              <li>🎯 Enhances focus and concentration</li>
              <li>❤️ Increases emotional well-being</li>
              <li>🌱 Builds self-awareness and mindfulness</li>
            </ul>
          </div>

          <motion.button
            className="new-session-button"
            onClick={() => setPhase('preparation')}
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

  if (phase === 'meditation') {
    return (
      <div className="meditation-container">
        <div className="meditation-session">
          <div className="session-header">
            <h3 style={{ color: currentSession.color }}>{currentSession.name} Meditation</h3>
            <div className="session-progress">
              <div className="progress-circle">
                <svg width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={currentSession.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - getProgress() / 100)}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="timer-display">
                  <span className="time-left">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="breathing-visual">
            <motion.div
              className="breathing-orb"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ backgroundColor: `${currentSession.color}30` }}
            />
          </div>

          <div className="meditation-guidance">
            <p className="guidance-text">
              {currentSession.guidance[Math.floor(((totalTime - timeLeft) / totalTime) * currentSession.guidance.length)]}
            </p>
          </div>

          <div className="meditation-controls">
            <motion.button
              onClick={pauseResume}
              className="control-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              {isActive ? 'Pause' : 'Resume'}
            </motion.button>
            
            <motion.button
              onClick={resetSession}
              className="control-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={24} />
              Reset
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meditation-container">
      <motion.div className="meditation-setup">
        <div className="meditation-header">
          <Waves size={48} className="meditation-icon" />
          <h2>Guided Meditation</h2>
          <p>Take a moment to pause, breathe, and reconnect with yourself</p>
        </div>

        <div className="session-type-selection">
          <h3>Choose Your Practice</h3>
          <div className="session-types">
            {Object.entries(sessionTypes).map(([key, session]) => (
              <motion.button
                key={key}
                className={`session-type-button ${sessionType === key ? 'active' : ''}`}
                onClick={() => setSessionType(key)}
                style={{ 
                  borderColor: session.color,
                  backgroundColor: sessionType === key ? session.color : 'white',
                  color: sessionType === key ? 'white' : session.color
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="session-icon">{session.icon}</span>
                <div className="session-info">
                  <h4>{session.name}</h4>
                  <p>{session.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="duration-selection">
          <h3>Session Duration</h3>
          <div className="duration-options">
            {durations.map((duration) => (
              <motion.button
                key={duration.minutes}
                className={`duration-option ${selectedDuration === duration.minutes ? 'active' : ''}`}
                onClick={() => setSelectedDuration(duration.minutes)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="duration-time">{duration.label}</span>
                <span className="duration-desc">{duration.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="preparation-guidance">
          <h3>Before You Begin</h3>
          <div className="guidance-card">
            <ul>
              {currentSession.guidance.map((guide, index) => (
                <li key={index}>{guide}</li>
              ))}
            </ul>
          </div>
        </div>

        <motion.button
          className="start-meditation-button"
          onClick={startMeditation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play size={20} />
          Begin {selectedDuration}-Minute Session
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MeditationTimer;