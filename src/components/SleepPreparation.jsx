import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Clock, CheckCircle, Star, Zap, Volume2, VolumeX } from 'lucide-react';

const SleepPreparation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [customRoutine, setCustomRoutine] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bedtime, setBedtime] = useState('22:00');

  const sleepActivities = [
    {
      id: 'environment',
      title: 'Prepare Your Sleep Environment',
      description: 'Create the perfect conditions for restful sleep',
      duration: '5 minutes',
      icon: '🛏️',
      color: '#4c51bf',
      steps: [
        'Dim or turn off bright lights throughout your home',
        'Set your bedroom temperature between 65-68°F (18-20°C)',
        'Make sure your bed is comfortable and inviting',
        'Remove electronic devices or put them in sleep mode',
        'Use blackout curtains or an eye mask if needed'
      ],
      benefits: ['Better sleep onset', 'Deeper sleep', 'Improved sleep quality']
    },
    {
      id: 'digital_sunset',
      title: 'Digital Sunset',
      description: 'Disconnect from technology to prepare your mind',
      duration: '15 minutes',
      icon: '📱',
      color: '#ed8936',
      steps: [
        'Put all devices on "Do Not Disturb" or sleep mode',
        'Avoid scrolling social media or checking emails',
        'Turn off TVs and computers',
        'If you must use devices, enable blue light filters',
        'Keep phones out of the bedroom if possible'
      ],
      benefits: ['Reduced blue light exposure', 'Calmer mind', 'Better melatonin production']
    },
    {
      id: 'gentle_stretching',
      title: 'Gentle Bedtime Stretches',
      description: 'Release physical tension with calming movements',
      duration: '10 minutes',
      icon: '🧘',
      color: '#48bb78',
      steps: [
        'Child\'s pose: Kneel and stretch arms forward, hold for 1 minute',
        'Neck rolls: Gently roll your head in slow circles',
        'Shoulder shrugs: Lift shoulders to ears, then release',
        'Legs up the wall: Lie on your back with legs up against a wall',
        'Gentle spinal twist: Lie down and twist knees to each side'
      ],
      benefits: ['Muscle relaxation', 'Tension release', 'Mind-body connection']
    },
    {
      id: 'gratitude_reflection',
      title: 'Gratitude & Reflection',
      description: 'End your day with positive thoughts',
      duration: '5 minutes',
      icon: '🙏',
      color: '#38b2ac',
      steps: [
        'Think of three good things that happened today',
        'Express gratitude for people who helped you',
        'Acknowledge one thing you accomplished',
        'Forgive yourself for any mistakes made today',
        'Set a positive intention for tomorrow'
      ],
      benefits: ['Positive mindset', 'Reduced worry', 'Emotional balance']
    },
    {
      id: 'breathing_exercise',
      title: '4-7-8 Breathing Technique',
      description: 'Activate your body\'s relaxation response',
      duration: '8 minutes',
      icon: '🫁',
      color: '#9f7aea',
      steps: [
        'Sit or lie down comfortably',
        'Exhale completely through your mouth',
        'Inhale through nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat this cycle 4 times'
      ],
      benefits: ['Activates parasympathetic nervous system', 'Reduces anxiety', 'Promotes sleepiness']
    },
    {
      id: 'progressive_relaxation',
      title: 'Body Scan Relaxation',
      description: 'Systematically relax your entire body',
      duration: '10 minutes',
      icon: '🌙',
      color: '#805ad5',
      steps: [
        'Lie down comfortably on your back',
        'Start by relaxing your toes and feet',
        'Move up to your legs, feeling them get heavy',
        'Relax your torso, arms, and hands',
        'Let your neck and face muscles soften',
        'Feel your whole body sinking into relaxation'
      ],
      benefits: ['Physical relaxation', 'Mental calm', 'Better sleep transition']
    }
  ];

  const sleepTips = [
    "Keep a consistent sleep schedule, even on weekends",
    "Avoid caffeine after 2 PM",
    "Create a wind-down routine you follow every night",
    "Keep your bedroom cool, dark, and quiet",
    "Don't eat large meals close to bedtime",
    "Get natural sunlight exposure during the day"
  ];

  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (currentStep < sleepActivities.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSessionComplete(true);
      // Save completion to localStorage
      const completedSessions = JSON.parse(localStorage.getItem('sleep-sessions') || '[]');
      completedSessions.push({
        date: new Date().toISOString(),
        activitiesCompleted: completedSteps.length + 1,
        duration: sleepActivities.reduce((sum, activity) => sum + parseInt(activity.duration), 0)
      });
      localStorage.setItem('sleep-sessions', JSON.stringify(completedSessions));
    }
  };

  const skipStep = () => {
    if (currentStep < sleepActivities.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const restartRoutine = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setSessionComplete(false);
  };

  const currentActivity = sleepActivities[currentStep];

  if (sessionComplete) {
    return (
      <div className="sleep-container">
        <motion.div 
          className="sleep-complete"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="completion-moon"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Moon size={64} color="#805ad5" />
          </motion.div>
          
          <h2>Sweet Dreams! 🌙</h2>
          <p>You've completed your bedtime routine. Your mind and body are now prepared for a restful night's sleep.</p>
          
          <div className="completion-stats">
            <div className="stat-item">
              <CheckCircle size={24} />
              <span>Activities Completed</span>
              <strong>{completedSteps.length + 1}</strong>
            </div>
            <div className="stat-item">
              <Clock size={24} />
              <span>Routine Duration</span>
              <strong>~{Math.floor(sleepActivities.reduce((sum, activity) => sum + parseInt(activity.duration), 0) / 60)} minutes</strong>
            </div>
            <div className="stat-item">
              <Star size={24} />
              <span>Readiness Level</span>
              <strong>Excellent</strong>
            </div>
          </div>

          <div className="final-sleep-tips">
            <h4>🌟 Final Sleep Tips</h4>
            <ul>
              <li>💤 If you can't fall asleep within 20 minutes, try reading quietly</li>
              <li>🧘 Use the 4-7-8 breathing technique if your mind is racing</li>
              <li>📝 Keep a notepad by your bed for any worried thoughts</li>
              <li>🌙 Trust that your body knows how to sleep</li>
            </ul>
          </div>

          <div className="sleep-affirmation">
            <p className="affirmation-text">
              "I release the day and welcome peaceful sleep. My body and mind are ready to restore and rejuvenate."
            </p>
          </div>

          <motion.button
            className="restart-routine-button"
            onClick={restartRoutine}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start New Routine
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="sleep-container">
      <motion.div className="sleep-preparation">
        <div className="sleep-header">
          <Moon size={48} className="sleep-icon" />
          <h2>Bedtime Preparation Routine</h2>
          <p>A gentle, guided routine to prepare your mind and body for restful sleep</p>
        </div>

        <div className="routine-progress">
          <div className="progress-header">
            <h3>Step {currentStep + 1} of {sleepActivities.length}</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((currentStep) / sleepActivities.length) * 100}%`,
                  backgroundColor: currentActivity.color
                }}
              />
            </div>
          </div>
        </div>

        <motion.div 
          className="activity-card"
          key={currentActivity.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="activity-header"
            style={{ backgroundColor: currentActivity.color }}
          >
            <div className="activity-icon">
              <span>{currentActivity.icon}</span>
            </div>
            <div className="activity-info">
              <h3>{currentActivity.title}</h3>
              <p>{currentActivity.description}</p>
              <div className="activity-meta">
                <Clock size={16} />
                <span>{currentActivity.duration}</span>
              </div>
            </div>
          </div>

          <div className="activity-content">
            <div className="activity-steps">
              <h4>Follow these steps:</h4>
              <ul>
                {currentActivity.steps.map((step, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="activity-benefits">
              <h4>Benefits:</h4>
              <div className="benefits-list">
                {currentActivity.benefits.map((benefit, index) => (
                  <span key={index} className="benefit-tag">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="activity-controls">
            <motion.button
              onClick={() => completeStep(currentActivity.id)}
              className="complete-step-button"
              style={{ backgroundColor: currentActivity.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={20} />
              Complete This Step
            </motion.button>
            
            <motion.button
              onClick={skipStep}
              className="skip-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skip for Now
            </motion.button>
          </div>
        </motion.div>

        <div className="completed-steps">
          <h4>✅ Completed Steps ({completedSteps.length})</h4>
          <div className="completed-list">
            {sleepActivities
              .filter(activity => completedSteps.includes(activity.id))
              .map((activity) => (
                <div key={activity.id} className="completed-item">
                  <span className="completed-icon">{activity.icon}</span>
                  <span className="completed-title">{activity.title}</span>
                  <CheckCircle size={16} color="#48bb78" />
                </div>
              ))}
          </div>
        </div>

        <div className="sleep-tip-of-day">
          <h4>💡 Sleep Tip</h4>
          <p>{sleepTips[Math.floor(Math.random() * sleepTips.length)]}</p>
        </div>

        <div className="bedtime-settings">
          <h4>⏰ Sleep Schedule</h4>
          <div className="bedtime-input">
            <label>Target Bedtime:</label>
            <input 
              type="time" 
              value={bedtime} 
              onChange={(e) => setBedtime(e.target.value)}
            />
          </div>
          <p className="bedtime-note">
            Consistency is key! Try to go to bed and wake up at the same time every day.
          </p>
        </div>

        <div className="sound-controls">
          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="sound-toggle"
            whileHover={{ scale: 1.05 }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {soundEnabled ? 'Sounds On' : 'Sounds Off'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SleepPreparation;