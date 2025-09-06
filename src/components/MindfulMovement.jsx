import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle, Clock, Zap } from 'lucide-react';

const MindfulMovement = () => {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem('mindfulMovementSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const exercises = [
    {
      id: 'desk-stretch',
      title: 'Desk Relief Stretches',
      duration: 5,
      difficulty: 'Easy',
      benefits: ['Relieves tension', 'Improves posture', 'Reduces stress'],
      description: 'Perfect for taking a break during work or study',
      steps: [
        {
          name: 'Neck Rolls',
          duration: 30,
          instruction: 'Slowly roll your head in a circle. Start by bringing your chin to chest, then roll to the right, back, left, and forward. Breathe deeply.',
          benefits: 'Releases neck tension and improves flexibility'
        },
        {
          name: 'Shoulder Shrugs',
          duration: 30,
          instruction: 'Lift your shoulders up toward your ears, hold for 3 seconds, then release with a deep exhale. Repeat 5 times.',
          benefits: 'Reduces shoulder tension from hunching'
        },
        {
          name: 'Spinal Twist',
          duration: 45,
          instruction: 'Sit tall, place your right hand on left knee. Gently twist your spine to the left, looking over your shoulder. Hold and breathe, then switch sides.',
          benefits: 'Improves spinal mobility and releases back tension'
        },
        {
          name: 'Wrist Circles',
          duration: 30,
          instruction: 'Extend arms forward, make gentle circles with your wrists. 10 circles forward, 10 backward. Shake hands out gently.',
          benefits: 'Prevents repetitive strain injury'
        },
        {
          name: 'Deep Breathing',
          duration: 45,
          instruction: 'Sit tall, hands on belly. Breathe in for 4 counts, hold for 4, exhale for 6. Feel your body relax with each breath.',
          benefits: 'Activates relaxation response'
        }
      ]
    },
    {
      id: 'anxiety-release',
      title: 'Anxiety Release Movements',
      duration: 8,
      difficulty: 'Easy',
      benefits: ['Reduces anxiety', 'Calms nervous system', 'Grounds you in body'],
      description: 'Gentle movements to calm anxiety and ground yourself',
      steps: [
        {
          name: 'Progressive Muscle Release',
          duration: 60,
          instruction: 'Starting with your toes, tense each muscle group for 5 seconds, then release. Move up through legs, abdomen, arms, shoulders, and face.',
          benefits: 'Releases physical tension that accompanies anxiety'
        },
        {
          name: 'Grounding Sway',
          duration: 45,
          instruction: 'Stand with feet hip-width apart. Sway gently side to side, feeling your connection to the ground. Let your arms move naturally.',
          benefits: 'Connects you to your body and the present moment'
        },
        {
          name: 'Butterfly Arms',
          duration: 45,
          instruction: 'Extend arms wide, then wrap them around yourself in a self-hug. Open and close like butterfly wings, breathing deeply.',
          benefits: 'Self-soothing movement that calms the nervous system'
        },
        {
          name: 'Gentle Shaking',
          duration: 60,
          instruction: 'Shake out your hands, then arms, then whole body. Start gentle and let it build naturally. This helps discharge nervous energy.',
          benefits: 'Releases trapped stress and nervous energy'
        },
        {
          name: 'Centering Breath',
          duration: 90,
          instruction: 'Place hands on heart and belly. Breathe slowly and deeply, feeling your body settle. End with 3 long, slow exhales.',
          benefits: 'Activates the parasympathetic nervous system'
        }
      ]
    },
    {
      id: 'energy-boost',
      title: 'Gentle Energy Booster',
      duration: 6,
      difficulty: 'Moderate',
      benefits: ['Increases energy', 'Improves circulation', 'Elevates mood'],
      description: 'Light movements to wake up your body and mind',
      steps: [
        {
          name: 'Arm Circles',
          duration: 30,
          instruction: 'Stand tall, extend arms to sides. Make small circles, gradually getting larger. 10 forward, 10 backward. Feel the energy flowing.',
          benefits: 'Increases circulation and wakes up the upper body'
        },
        {
          name: 'Gentle Marching',
          duration: 60,
          instruction: 'March in place, lifting knees comfortably. Swing arms naturally. Keep breathing steady and smile!',
          benefits: 'Gets blood flowing and energizes the whole body'
        },
        {
          name: 'Reach and Stretch',
          duration: 45,
          instruction: 'Reach both arms overhead, then reach to each side. Stretch tall, then forward and gently arch back. Move with your breath.',
          benefits: 'Opens up the body and improves posture'
        },
        {
          name: 'Gentle Twists',
          duration: 45,
          instruction: 'Feet hip-width apart, arms loose. Twist gently side to side, letting arms wrap around your body. Feel the gentle mobility in your spine.',
          benefits: 'Improves spinal mobility and core engagement'
        },
        {
          name: 'Energy Finish',
          duration: 60,
          instruction: 'Take 5 deep breaths while reaching arms overhead on inhale, releasing on exhale. End with gentle bouncing on your toes.',
          benefits: 'Integrates the energy and leaves you feeling refreshed'
        }
      ]
    },
    {
      id: 'bedtime-release',
      title: 'Bedtime Wind-Down',
      duration: 10,
      difficulty: 'Easy',
      benefits: ['Prepares for sleep', 'Releases day tension', 'Calms mind'],
      description: 'Gentle movements to transition into restful sleep',
      steps: [
        {
          name: 'Tension Inventory',
          duration: 60,
          instruction: 'Lie down comfortably. Notice where you hold tension. Breathe into these areas and imagine the tension melting away.',
          benefits: 'Body awareness and intentional relaxation'
        },
        {
          name: 'Gentle Knee Rocks',
          duration: 60,
          instruction: 'Hug knees to chest, gently rock side to side. This massages your lower back and feels nurturing.',
          benefits: 'Releases lower back tension and feels comforting'
        },
        {
          name: 'Legs Up Wall',
          duration: 120,
          instruction: 'Lie on your back with legs up against a wall (or bent on bed). Let gravity help drain tension from your legs.',
          benefits: 'Improves circulation and activates rest response'
        },
        {
          name: 'Gentle Spinal Twist',
          duration: 90,
          instruction: 'Knees bent, gently drop them to one side while keeping shoulders down. Hold and breathe, then switch sides.',
          benefits: 'Releases spinal tension and prepares body for rest'
        },
        {
          name: 'Sleep Breathing',
          duration: 150,
          instruction: 'Hands on belly, breathe slowly and deeply. Count backwards from 10 with each exhale, letting your body sink deeper into relaxation.',
          benefits: 'Activates sleep response and calms the mind'
        }
      ]
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            // Move to next step
            const nextStep = currentStep + 1;
            if (nextStep < currentExercise.steps.length) {
              setCurrentStep(nextStep);
              return currentExercise.steps[nextStep].duration;
            } else {
              // Exercise complete
              completeSession();
              return 0;
            }
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentStep, currentExercise]);

  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
    setCurrentStep(0);
    setTimeRemaining(exercise.steps[0].duration);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(currentExercise.steps[currentStep].duration);
  };

  const completeSession = () => {
    const session = {
      id: Date.now(),
      exerciseId: currentExercise.id,
      exerciseTitle: currentExercise.title,
      date: new Date().toISOString(),
      duration: currentExercise.duration
    };
    
    const updated = [session, ...completedSessions].slice(0, 100); // Keep last 100
    setCompletedSessions(updated);
    localStorage.setItem('mindfulMovementSessions', JSON.stringify(updated));
    
    setIsActive(false);
    setCurrentExercise(null);
    setCurrentStep(0);
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

  if (currentExercise) {
    const currentStepData = currentExercise.steps[currentStep];
    const progress = ((currentStep) / currentExercise.steps.length) * 100;

    return (
      <div className="mindful-movement-session">
        <motion.div 
          className="session-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="session-info">
            <h2>{currentExercise.title}</h2>
            <div className="session-meta">
              <span>Step {currentStep + 1} of {currentExercise.steps.length}</span>
              <span>•</span>
              <span>{currentExercise.duration} minutes total</span>
            </div>
          </div>
          <motion.button
            className="back-button"
            onClick={() => setCurrentExercise(null)}
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
          <div className="step-header">
            <h3>{currentStepData.name}</h3>
            <div className="timer-display">
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="step-content">
            <p className="step-instruction">{currentStepData.instruction}</p>
            <div className="step-benefits">
              <strong>Benefits:</strong> {currentStepData.benefits}
            </div>
          </div>

          <div className="timer-controls">
            <motion.button
              className="control-button"
              onClick={toggleTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              {isActive ? 'Pause' : 'Start'}
            </motion.button>

            <motion.button
              className="control-button secondary"
              onClick={resetTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              Reset
            </motion.button>
          </div>

          {currentStep === currentExercise.steps.length - 1 && timeRemaining === 0 && (
            <motion.div 
              className="completion-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={32} className="completion-icon" />
              <h4>Session Complete!</h4>
              <p>Great job taking care of your body and mind.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mindful-movement-container">
      <motion.div 
        className="movement-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Zap size={32} className="header-icon" />
        <div>
          <h2>Mindful Movement</h2>
          <p>Gentle exercises to reduce stress and connect with your body</p>
        </div>
      </motion.div>

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
            transition={{ delay: index * 0.1 + 0.3 }}
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
              <h5>Benefits:</h5>
              <ul>
                {exercise.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="exercise-steps-preview">
              <h5>Includes {exercise.steps.length} movements:</h5>
              <div className="steps-list">
                {exercise.steps.map((step, idx) => (
                  <span key={idx} className="step-name">
                    {step.name}
                  </span>
                ))}
              </div>
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
          <h3>Recent Sessions</h3>
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
    </div>
  );
};

export default MindfulMovement;