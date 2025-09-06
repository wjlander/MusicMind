import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Eye, Ear, Hand, Nose, Coffee, CheckCircle, RotateCcw, Clock } from 'lucide-react';

const GroundingTechniques = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem('groundingSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGuided, setIsGuided] = useState(true);
  const [stepTimer, setStepTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const exercises = [
    {
      id: '54321',
      title: '5-4-3-2-1 Sensory Grounding',
      description: 'Use your five senses to anchor yourself in the present moment',
      duration: 5,
      difficulty: 'Easy',
      bestFor: ['Anxiety', 'Panic', 'Dissociation', 'Overwhelm'],
      steps: [
        {
          sense: 'sight',
          instruction: 'Look around and name 5 things you can see',
          detail: 'Take your time to really notice the colors, shapes, and details of each item.',
          timer: 60,
          icon: Eye
        },
        {
          sense: 'touch',
          instruction: 'Notice 4 things you can feel',
          detail: 'Feel the temperature of the air, the texture of your clothes, the surface you\'re sitting on.',
          timer: 60,
          icon: Hand
        },
        {
          sense: 'hearing',
          instruction: 'Listen for 3 sounds around you',
          detail: 'These might be distant sounds, nearby sounds, or even the sound of your own breathing.',
          timer: 60,
          icon: Ear
        },
        {
          sense: 'smell',
          instruction: 'Identify 2 scents you can smell',
          detail: 'This might be your perfume, coffee, fresh air, or any subtle scents around you.',
          timer: 60,
          icon: Nose
        },
        {
          sense: 'taste',
          instruction: 'Notice 1 taste in your mouth',
          detail: 'This could be lingering from something you drank or ate, or just the natural taste in your mouth.',
          timer: 60,
          icon: Coffee
        }
      ]
    },
    {
      id: 'physical-grounding',
      title: 'Physical Grounding',
      description: 'Use physical sensations to reconnect with your body and the present',
      duration: 6,
      difficulty: 'Easy',
      bestFor: ['Dissociation', 'Anxiety', 'Racing thoughts', 'Panic'],
      steps: [
        {
          name: 'Feel Your Feet',
          instruction: 'Press your feet firmly into the ground',
          detail: 'Whether sitting or standing, feel the weight and pressure of your feet. Wiggle your toes inside your shoes.',
          timer: 60,
          icon: Anchor
        },
        {
          name: 'Temperature Check',
          instruction: 'Notice the temperature on your skin',
          detail: 'Feel the air temperature on your face, arms, and hands. Is it warm or cool? Notice any differences.',
          timer: 60,
          icon: Hand
        },
        {
          name: 'Pressure Points',
          instruction: 'Press your hands together firmly',
          detail: 'Feel the pressure between your palms. Press firmly for 10 seconds, then release and notice the sensation.',
          timer: 60,
          icon: Hand
        },
        {
          name: 'Body Scan',
          instruction: 'Quickly scan your body from head to toe',
          detail: 'Notice any tensions, aches, or comfortable spots. Don\'t judge, just observe.',
          timer: 90,
          icon: Eye
        },
        {
          name: 'Breathing Anchor',
          instruction: 'Focus on the physical sensation of breathing',
          detail: 'Feel the air entering and leaving your nostrils. Notice the rise and fall of your chest or belly.',
          timer: 90,
          icon: Nose
        }
      ]
    },
    {
      id: 'cognitive-grounding',
      title: 'Cognitive Grounding',
      description: 'Use mental exercises to bring your mind back to the present',
      duration: 4,
      difficulty: 'Easy',
      bestFor: ['Racing thoughts', 'Worry', 'Rumination', 'Overwhelm'],
      steps: [
        {
          name: 'Name This Moment',
          instruction: 'State the basic facts of this moment',
          detail: 'Say to yourself: "My name is ___, I am ___ years old, today is ___, I am in ___"',
          timer: 60,
          icon: Eye
        },
        {
          name: 'Category Game',
          instruction: 'Name 5 items in a category',
          detail: 'Choose a category like colors, animals, countries, or foods and name 5 items. Focus completely on this task.',
          timer: 90,
          icon: Eye
        },
        {
          name: 'Backwards Counting',
          instruction: 'Count backwards from 100 by 7s',
          detail: '100, 93, 86, 79... This mental math requires focus and pulls attention from worrying thoughts.',
          timer: 90,
          icon: Eye
        }
      ]
    },
    {
      id: 'soothing-grounding',
      title: 'Soothing Grounding',
      description: 'Combine grounding with self-compassion for emotional regulation',
      duration: 7,
      difficulty: 'Moderate',
      bestFor: ['Emotional overwhelm', 'Sadness', 'Anger', 'Trauma responses'],
      steps: [
        {
          name: 'Safe Space Visualization',
          instruction: 'Imagine or remember a place where you feel completely safe',
          detail: 'This could be real or imaginary. Notice the details - what do you see, hear, and feel in this safe space?',
          timer: 90,
          icon: Eye
        },
        {
          name: 'Supportive Touch',
          instruction: 'Give yourself soothing physical comfort',
          detail: 'Place a hand on your heart, give yourself a hug, or gently stroke your arm. This activates self-compassion.',
          timer: 60,
          icon: Hand
        },
        {
          name: 'Kind Words',
          instruction: 'Speak to yourself with kindness',
          detail: 'Say something you would tell a good friend: "This is hard right now, but I\'m safe" or "I\'m doing my best."',
          timer: 90,
          icon: Coffee
        },
        {
          name: 'Gratitude Anchor',
          instruction: 'Think of 3 things you\'re grateful for right now',
          detail: 'These can be simple things - your breath, a person you love, or something that made you smile recently.',
          timer: 90,
          icon: Eye
        }
      ]
    }
  ];

  useEffect(() => {
    let interval = null;
    if (timerActive && stepTimer > 0) {
      interval = setInterval(() => {
        setStepTimer(time => time - 1);
      }, 1000);
    } else if (stepTimer === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, stepTimer]);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    setStepTimer(exercise.steps[0].timer);
    setTimerActive(false);
  };

  const nextStep = () => {
    if (currentStep < activeExercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setStepTimer(activeExercise.steps[currentStep + 1].timer);
      setTimerActive(false);
    } else {
      completeSession();
    }
  };

  const startStepTimer = () => {
    setTimerActive(true);
  };

  const completeSession = () => {
    const session = {
      id: Date.now(),
      exerciseId: activeExercise.id,
      exerciseTitle: activeExercise.title,
      date: new Date().toISOString(),
      duration: activeExercise.duration
    };
    
    const updated = [session, ...completedSessions].slice(0, 100);
    setCompletedSessions(updated);
    localStorage.setItem('groundingSessions', JSON.stringify(updated));
    
    setActiveExercise(null);
    setCurrentStep(0);
    setTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#48bb78';
      case 'Moderate': return '#ed8936';
      case 'Hard': return '#e53e3e';
      default: return '#4299e1';
    }
  };

  const getTodaysCount = () => {
    const today = new Date().toDateString();
    return completedSessions.filter(session => 
      new Date(session.date).toDateString() === today
    ).length;
  };

  if (activeExercise) {
    const currentStepData = activeExercise.steps[currentStep];
    const IconComponent = currentStepData.icon;
    const progress = ((currentStep + 1) / activeExercise.steps.length) * 100;

    return (
      <div className="grounding-session">
        <motion.div 
          className="session-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="session-info">
            <h2>{activeExercise.title}</h2>
            <div className="session-meta">
              <span>Step {currentStep + 1} of {activeExercise.steps.length}</span>
              <span>•</span>
              <span>{activeExercise.duration} minutes total</span>
            </div>
          </div>
          <motion.button
            className="back-button"
            onClick={() => setActiveExercise(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
        </motion.div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <motion.div 
          className="current-step"
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="step-icon-container">
            <IconComponent size={40} className="step-icon" />
          </div>

          <div className="step-content">
            <h3>{currentStepData.name || currentStepData.instruction}</h3>
            <p className="step-instruction">{currentStepData.instruction}</p>
            <p className="step-detail">{currentStepData.detail}</p>
          </div>

          {isGuided && (
            <div className="timer-section">
              <div className="timer-display">
                <Clock size={20} />
                {formatTime(stepTimer)}
              </div>
              
              <div className="timer-controls">
                <motion.button
                  className="timer-button"
                  onClick={startStepTimer}
                  disabled={timerActive}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {timerActive ? 'Timer Running' : 'Start Timer'}
                </motion.button>
              </div>
            </div>
          )}

          <div className="step-navigation">
            <motion.button
              className="nav-button primary"
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === activeExercise.steps.length - 1 ? (
                <>
                  <CheckCircle size={20} />
                  Complete
                </>
              ) : (
                'Next Step'
              )}
            </motion.button>
          </div>

          {currentStep === activeExercise.steps.length - 1 && (
            <motion.div 
              className="completion-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>Take a moment to notice how you feel now compared to when you started.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grounding-container">
      <motion.div 
        className="grounding-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Anchor size={32} className="header-icon" />
        <div>
          <h2>Grounding Techniques</h2>
          <p>Practical exercises to anchor yourself in the present moment</p>
        </div>
      </motion.div>

      <div className="grounding-intro">
        <motion.div 
          className="intro-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>What is Grounding?</h3>
          <p>Grounding techniques help you connect with the present moment when you feel anxious, overwhelmed, or disconnected. These exercises use your five senses and awareness to anchor you in the here and now.</p>
          
          <div className="when-to-use">
            <h4>Use grounding when you feel:</h4>
            <ul>
              <li>Anxious or panicked</li>
              <li>Overwhelmed by emotions</li>
              <li>Disconnected or "spaced out"</li>
              <li>Caught in racing thoughts</li>
              <li>Triggered by memories</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="daily-progress">
        <div className="progress-stat">
          <h4>Today's Sessions</h4>
          <div className="stat-number">{getTodaysCount()}</div>
        </div>
        <div className="progress-stat">
          <h4>Total Sessions</h4>
          <div className="stat-number">{completedSessions.length}</div>
        </div>
      </div>

      <div className="exercises-grid">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            className="exercise-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => startExercise(exercise)}
          >
            <div className="exercise-header">
              <h3>{exercise.title}</h3>
              <div className="exercise-meta">
                <span className="duration">
                  <Clock size={16} />
                  {exercise.duration} min
                </span>
                <span 
                  className="difficulty"
                  style={{ color: getDifficultyColor(exercise.difficulty) }}
                >
                  {exercise.difficulty}
                </span>
              </div>
            </div>

            <p className="exercise-description">{exercise.description}</p>

            <div className="exercise-benefits">
              <h5>Best for:</h5>
              <div className="benefits-tags">
                {exercise.bestFor.map((benefit, idx) => (
                  <span key={idx} className="benefit-tag">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div className="exercise-steps-count">
              {exercise.steps.length} steps • {exercise.duration} minutes
            </div>

            <div className="card-footer">
              <span className="start-text">Click to Start</span>
            </div>
          </motion.div>
        ))}
      </div>

      {completedSessions.length > 0 && (
        <motion.div 
          className="recent-sessions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Recent Grounding Sessions</h3>
          <div className="sessions-list">
            {completedSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <span className="session-title">{session.exerciseTitle}</span>
                  <span className="session-date">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="session-duration">
                  {session.duration} min
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="emergency-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h4>Emergency Grounding</h4>
        <p>If you're in crisis or having thoughts of self-harm, please reach out for immediate help. Use the Crisis Support section of this app or contact emergency services.</p>
      </motion.div>
    </div>
  );
};

export default GroundingTechniques;