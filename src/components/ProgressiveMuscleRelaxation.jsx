import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Heart, CheckCircle } from 'lucide-react';

const ProgressiveMuscleRelaxation = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [phase, setPhase] = useState('preparation'); // preparation, session, completion
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const intervalRef = useRef(null);

  const muscleGroups = [
    {
      name: 'Right Hand and Forearm',
      instruction: 'Make a tight fist with your right hand. Feel the tension in your hand and forearm.',
      relaxInstruction: 'Now release and let your hand go completely limp. Notice the contrast between tension and relaxation.',
      duration: 10,
      icon: '✋'
    },
    {
      name: 'Left Hand and Forearm',
      instruction: 'Make a tight fist with your left hand. Feel the tension building.',
      relaxInstruction: 'Release and let your left hand rest completely. Feel the warm sensation of relaxation.',
      duration: 10,
      icon: '🤚'
    },
    {
      name: 'Arms and Shoulders',
      instruction: 'Bend your elbows and tense your biceps. Pull your shoulders up toward your ears.',
      relaxInstruction: 'Let your arms drop and shoulders sink down. Feel the tension melting away.',
      duration: 12,
      icon: '💪'
    },
    {
      name: 'Face and Forehead',
      instruction: 'Scrunch your face - furrow your brow, squeeze your eyes shut, and clench your jaw.',
      relaxInstruction: 'Relax all facial muscles. Let your forehead smooth, eyes gently closed, jaw loose.',
      duration: 10,
      icon: '😌'
    },
    {
      name: 'Neck and Throat',
      instruction: 'Press your head back and tighten your neck muscles. Feel the tension.',
      relaxInstruction: 'Let your head return to a comfortable position. Feel your neck muscles softening.',
      duration: 10,
      icon: '🦒'
    },
    {
      name: 'Chest and Upper Back',
      instruction: 'Take a deep breath and hold it. Arch your back slightly and pull shoulder blades together.',
      relaxInstruction: 'Exhale slowly and let your back settle. Feel your chest opening and back releasing.',
      duration: 12,
      icon: '🫁'
    },
    {
      name: 'Abdomen',
      instruction: 'Tighten your stomach muscles as if preparing for a punch. Hold the tension.',
      relaxInstruction: 'Let your stomach muscles go completely soft. Breathe naturally and deeply.',
      duration: 10,
      icon: '🤰'
    },
    {
      name: 'Right Leg and Foot',
      instruction: 'Tighten your right thigh, point your toe, and create tension throughout your leg.',
      relaxInstruction: 'Let your leg rest heavily. Feel the muscles becoming loose and heavy.',
      duration: 12,
      icon: '🦵'
    },
    {
      name: 'Left Leg and Foot',
      instruction: 'Tense your left thigh, point your toe, and feel the tension in your entire left leg.',
      relaxInstruction: 'Release completely. Both legs now feel heavy, warm, and deeply relaxed.',
      duration: 12,
      icon: '🦶'
    },
    {
      name: 'Whole Body Integration',
      instruction: 'Gently tense your entire body - all muscles working together for just a moment.',
      relaxInstruction: 'Now let everything go. Feel your whole body sinking into deep, complete relaxation.',
      duration: 15,
      icon: '🧘'
    }
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && phase === 'session') {
      // Move to next step or complete
      if (currentStep < muscleGroups.length - 1) {
        setCurrentStep(prev => prev + 1);
        setTimeLeft(muscleGroups[currentStep + 1].duration);
      } else {
        setPhase('completion');
        setIsActive(false);
        setCompletedSessions(prev => prev + 1);
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, phase, currentStep]);

  const startSession = () => {
    setPhase('session');
    setCurrentStep(0);
    setTimeLeft(muscleGroups[0].duration);
    setIsActive(true);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeLeft(muscleGroups[0].duration);
    setPhase('preparation');
  };

  const skipToNext = () => {
    if (currentStep < muscleGroups.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimeLeft(muscleGroups[currentStep + 1].duration);
    }
  };

  const currentMuscleGroup = muscleGroups[currentStep];
  const isRelaxPhase = timeLeft <= Math.floor(currentMuscleGroup.duration / 2);

  if (phase === 'completion') {
    return (
      <div className="pmr-container">
        <motion.div 
          className="pmr-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="completion-heart"
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart size={64} color="#48bb78" />
          </motion.div>
          
          <h2>Deep Relaxation Complete</h2>
          <p>Well done! You've completed a full Progressive Muscle Relaxation session. Your body and mind should now feel deeply relaxed and refreshed.</p>
          
          <div className="completion-stats">
            <div className="stat-item">
              <CheckCircle size={24} />
              <span>Session Duration</span>
              <strong>{Math.floor(muscleGroups.reduce((sum, group) => sum + group.duration, 0) / 60)} minutes</strong>
            </div>
            <div className="stat-item">
              <span className="completion-emoji">🧘</span>
              <span>Muscle Groups</span>
              <strong>{muscleGroups.length}</strong>
            </div>
            <div className="stat-item">
              <span className="completion-emoji">🎯</span>
              <span>Sessions Completed</span>
              <strong>{completedSessions}</strong>
            </div>
          </div>

          <div className="pmr-benefits">
            <h4>Benefits of Progressive Muscle Relaxation:</h4>
            <ul>
              <li>🧠 Reduces mental stress and anxiety</li>
              <li>💤 Improves sleep quality</li>
              <li>💪 Releases physical tension</li>
              <li>🫀 Lowers blood pressure and heart rate</li>
              <li>🧘 Increases body awareness</li>
              <li>😌 Promotes overall sense of calm</li>
            </ul>
          </div>

          <motion.button
            className="new-pmr-session-button"
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

  if (phase === 'session') {
    return (
      <div className="pmr-container">
        <div className="pmr-session">
          <div className="session-header">
            <h3>Progressive Muscle Relaxation</h3>
            <div className="session-progress">
              <div className="progress-info">
                <span>Step {currentStep + 1} of {muscleGroups.length}</span>
                <span>{timeLeft}s remaining</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${((currentStep + (currentMuscleGroup.duration - timeLeft) / currentMuscleGroup.duration) / muscleGroups.length) * 100}%`,
                    backgroundColor: '#48bb78'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="muscle-group-display">
            <motion.div
              className="muscle-icon"
              animate={{ 
                scale: isRelaxPhase ? [1, 1.05, 1] : [1, 1.1, 1],
                rotate: isRelaxPhase ? 0 : [0, 2, -2, 0]
              }}
              transition={{ 
                duration: isRelaxPhase ? 3 : 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span style={{ fontSize: '4rem' }}>{currentMuscleGroup.icon}</span>
            </motion.div>
            
            <h2>{currentMuscleGroup.name}</h2>
            
            <div className={`instruction-card ${isRelaxPhase ? 'relax-phase' : 'tense-phase'}`}>
              <div className="phase-indicator">
                <span className={`phase-dot ${isRelaxPhase ? 'active' : ''}`}>Relax</span>
                <span className={`phase-dot ${!isRelaxPhase ? 'active' : ''}`}>Tense</span>
              </div>
              
              <p className="instruction-text">
                {isRelaxPhase ? currentMuscleGroup.relaxInstruction : currentMuscleGroup.instruction}
              </p>
            </div>
          </div>

          <div className="breathing-guide">
            <motion.div
              className="breathing-circle"
              animate={{
                scale: isRelaxPhase ? [1, 1.2, 1] : [1, 1.1, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: isRelaxPhase ? 4 : 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundColor: isRelaxPhase ? 'rgba(72, 187, 120, 0.3)' : 'rgba(245, 101, 101, 0.3)',
                border: `3px solid ${isRelaxPhase ? '#48bb78' : '#f56565'}`
              }}
            >
              <span className="breathing-text">
                {isRelaxPhase ? 'Breathe & Release' : 'Tense & Hold'}
              </span>
            </motion.div>
          </div>

          <div className="session-controls">
            <motion.button
              onClick={pauseResume}
              className="control-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'Pause' : 'Resume'}
            </motion.button>
            
            <motion.button
              onClick={skipToNext}
              className="control-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentStep >= muscleGroups.length - 1}
            >
              Skip Step
            </motion.button>
            
            <motion.button
              onClick={resetSession}
              className="control-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              Reset
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pmr-container">
      <motion.div className="pmr-setup">
        <div className="pmr-header">
          <Heart size={48} className="pmr-icon" />
          <h2>Progressive Muscle Relaxation</h2>
          <p>A guided technique to release physical tension and achieve deep relaxation by systematically tensing and relaxing different muscle groups.</p>
        </div>

        <div className="pmr-info">
          <div className="info-section">
            <h3>What to Expect</h3>
            <ul>
              <li>🕐 <strong>Duration:</strong> About {Math.floor(muscleGroups.reduce((sum, group) => sum + group.duration, 0) / 60)} minutes</li>
              <li>💪 <strong>Muscle Groups:</strong> {muscleGroups.length} different areas</li>
              <li>🧘 <strong>Technique:</strong> Tense for 5-7 seconds, then relax for 10-15 seconds</li>
              <li>🎯 <strong>Goal:</strong> Complete physical and mental relaxation</li>
            </ul>
          </div>

          <div className="preparation-tips">
            <h3>Before You Begin</h3>
            <div className="tips-grid">
              <div className="tip-item">
                <span className="tip-emoji">🛋️</span>
                <p>Find a comfortable position lying down or in a reclining chair</p>
              </div>
              <div className="tip-item">
                <span className="tip-emoji">🌙</span>
                <p>Dim the lights and minimize distractions</p>
              </div>
              <div className="tip-item">
                <span className="tip-emoji">👕</span>
                <p>Wear loose, comfortable clothing</p>
              </div>
              <div className="tip-item">
                <span className="tip-emoji">📱</span>
                <p>Put devices on silent mode</p>
              </div>
              <div className="tip-item">
                <span className="tip-emoji">🫁</span>
                <p>Take a few deep breaths to center yourself</p>
              </div>
              <div className="tip-item">
                <span className="tip-emoji">⏰</span>
                <p>Allow uninterrupted time for the full session</p>
              </div>
            </div>
          </div>
        </div>

        <div className="muscle-groups-preview">
          <h3>Session Overview</h3>
          <div className="groups-list">
            {muscleGroups.map((group, index) => (
              <div key={index} className="group-preview">
                <span className="group-icon">{group.icon}</span>
                <span className="group-name">{group.name}</span>
                <span className="group-duration">{group.duration}s</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pmr-benefits">
          <h3>Benefits of PMR</h3>
          <p>Progressive Muscle Relaxation is a scientifically-proven technique that can help with:</p>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">😌</span>
              <strong>Stress & Anxiety</strong>
              <p>Reduces cortisol levels and promotes calm</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💤</span>
              <strong>Sleep Quality</strong>
              <p>Prepares body and mind for restful sleep</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <strong>Focus & Clarity</strong>
              <p>Improves mental concentration</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💪</span>
              <strong>Physical Tension</strong>
              <p>Releases chronic muscle tightness</p>
            </div>
          </div>
        </div>

        <motion.button
          className="start-pmr-button"
          onClick={startSession}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play size={20} />
          Begin Relaxation Session
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProgressiveMuscleRelaxation;