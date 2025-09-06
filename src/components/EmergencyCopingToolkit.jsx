import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Brain, Wind, Anchor, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const EmergencyCopingToolkit = () => {
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [usageStats, setUsageStats] = useState(() => {
    const saved = localStorage.getItem('copingToolkitUsage');
    return saved ? JSON.parse(saved) : {};
  });

  const copingStrategies = [
    {
      id: 'panic-attack',
      title: 'Panic Attack Relief',
      description: 'Immediate strategies to manage panic and regain control',
      urgency: 'high',
      duration: 3,
      icon: Heart,
      color: '#e53e3e',
      situation: 'When you feel overwhelmed by panic, racing heart, or can\'t catch your breath',
      steps: [
        {
          title: 'Acknowledge & Accept',
          instruction: 'Say to yourself: "I\'m having a panic attack. This is temporary and will pass. I am not in actual danger."',
          duration: 30,
          breathing: false
        },
        {
          title: '4-7-8 Breathing',
          instruction: 'Breathe in for 4 counts, hold for 7, exhale for 8. This activates your body\'s relaxation response.',
          duration: 120,
          breathing: true
        },
        {
          title: 'Grounding & Reality Check',
          instruction: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
          duration: 60,
          breathing: false
        }
      ]
    },
    {
      id: 'overwhelm',
      title: 'Overwhelm Reset',
      description: 'Quick techniques to clear your mind when everything feels too much',
      urgency: 'high',
      duration: 4,
      icon: Brain,
      color: '#ed8936',
      situation: 'When you feel mentally overloaded, can\'t think clearly, or everything feels chaotic',
      steps: [
        {
          title: 'Mental Pause',
          instruction: 'Stop what you\'re doing. Say "STOP" out loud or in your head. Take 3 deep breaths.',
          duration: 30,
          breathing: true
        },
        {
          title: 'Brain Dump',
          instruction: 'Quickly write down everything on your mind. Don\'t organize, just get it all out of your head.',
          duration: 90,
          breathing: false
        },
        {
          title: 'One Thing Focus',
          instruction: 'Choose ONE thing from your list. Say: "Right now, I only need to focus on ___"',
          duration: 30,
          breathing: false
        },
        {
          title: 'Reset Breathing',
          instruction: 'Take 10 slow, deep breaths. With each exhale, let go of everything except your one focus.',
          duration: 90,
          breathing: true
        }
      ]
    },
    {
      id: 'anxiety-spiral',
      title: 'Anxiety Spiral Stopper',
      description: 'Break the cycle of anxious thoughts before they escalate',
      urgency: 'medium',
      duration: 5,
      icon: Wind,
      color: '#4299e1',
      situation: 'When anxious thoughts are building and you feel them starting to spiral out of control',
      steps: [
        {
          title: 'Notice & Name',
          instruction: 'Notice you\'re spiraling. Say: "I\'m having anxious thoughts. These are thoughts, not facts."',
          duration: 30,
          breathing: false
        },
        {
          title: 'Box Breathing',
          instruction: 'Breathe in for 4, hold for 4, exhale for 4, hold for 4. Repeat 5 times.',
          duration: 80,
          breathing: true
        },
        {
          title: 'Fact vs. Fear',
          instruction: 'Ask: "What do I know for sure right now?" vs "What am I imagining might happen?"',
          duration: 60,
          breathing: false
        },
        {
          title: 'Present Moment Anchor',
          instruction: 'Feel your feet on the ground. Notice 3 things in your immediate environment.',
          duration: 60,
          breathing: false
        },
        {
          title: 'Self-Compassion',
          instruction: 'Place hand on heart. Say: "This is a moment of anxiety. Anxiety is part of life. May I be kind to myself."',
          duration: 70,
          breathing: false
        }
      ]
    },
    {
      id: 'emotional-storm',
      title: 'Emotional Storm Survival',
      description: 'Ride out intense emotions safely without making them worse',
      urgency: 'high',
      duration: 6,
      icon: Anchor,
      color: '#9f7aea',
      situation: 'When you\'re experiencing very intense emotions like anger, sadness, or frustration',
      steps: [
        {
          title: 'Safe Space Check',
          instruction: 'Make sure you\'re physically safe. Step away from any stressful situation if possible.',
          duration: 30,
          breathing: false
        },
        {
          title: 'Name the Emotion',
          instruction: 'Say: "I\'m feeling [emotion] right now. This feeling is valid and temporary."',
          duration: 30,
          breathing: false
        },
        {
          title: 'TIPP Technique',
          instruction: 'Temperature: splash cold water on face or hold ice. This calms your nervous system.',
          duration: 60,
          breathing: false
        },
        {
          title: 'Intense Exercise',
          instruction: 'Do 30 jumping jacks, push-ups, or run in place. Burn off the stress chemicals.',
          duration: 60,
          breathing: false
        },
        {
          title: 'Paced Breathing',
          instruction: 'Breathe slower than normal. Exhale longer than you inhale. This is calming.',
          duration: 120,
          breathing: true
        },
        {
          title: 'Emotional Surfing',
          instruction: 'Imagine the emotion as a wave. You\'re surfing it, not drowning in it. Waves always come and go.',
          duration: 120,
          breathing: false
        }
      ]
    },
    {
      id: 'intrusive-thoughts',
      title: 'Intrusive Thought Defuser',
      description: 'Techniques to handle unwanted, distressing thoughts',
      urgency: 'medium',
      duration: 4,
      icon: Shield,
      color: '#38a169',
      situation: 'When you\'re experiencing unwanted, disturbing, or repetitive thoughts',
      steps: [
        {
          title: 'Thought Labeling',
          instruction: 'Say: "I\'m having the thought that..." This creates distance between you and the thought.',
          duration: 30,
          breathing: false
        },
        {
          title: 'Thank Your Brain',
          instruction: 'Say: "Thank you brain, but I don\'t need this thought right now." Be gentle, not angry.',
          duration: 30,
          breathing: false
        },
        {
          title: 'Redirect Focus',
          instruction: 'Engage a different sense: count 10 things you can see, or listen to sounds around you.',
          duration: 90,
          breathing: false
        },
        {
          title: 'Grounding Activity',
          instruction: 'Do something requiring focus: count backwards from 100 by 7s, or name all US states.',
          duration: 150,
          breathing: false
        }
      ]
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      setIsTimerActive(false);
      // Auto-advance to next step if timer completes
      if (currentStep < activeStrategy.steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setTimeRemaining(activeStrategy.steps[currentStep + 1].duration);
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, currentStep, activeStrategy]);

  useEffect(() => {
    localStorage.setItem('copingToolkitUsage', JSON.stringify(usageStats));
  }, [usageStats]);

  const startStrategy = (strategy) => {
    setActiveStrategy(strategy);
    setCurrentStep(0);
    setTimeRemaining(strategy.steps[0].duration);
    setIsTimerActive(false);
    
    // Track usage
    setUsageStats(prev => ({
      ...prev,
      [strategy.id]: {
        count: (prev[strategy.id]?.count || 0) + 1,
        lastUsed: new Date().toISOString()
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < activeStrategy.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeRemaining(activeStrategy.steps[currentStep + 1].duration);
      setIsTimerActive(false);
    } else {
      completeStrategy();
    }
  };

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const completeStrategy = () => {
    setActiveStrategy(null);
    setCurrentStep(0);
    setIsTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#e53e3e';
      case 'medium': return '#ed8936';
      case 'low': return '#38a169';
      default: return '#4299e1';
    }
  };

  const getMostUsedStrategy = () => {
    const entries = Object.entries(usageStats);
    if (entries.length === 0) return null;
    
    const mostUsed = entries.reduce((max, current) => 
      current[1].count > max[1].count ? current : max
    );
    
    return copingStrategies.find(strategy => strategy.id === mostUsed[0]);
  };

  if (activeStrategy) {
    const currentStepData = activeStrategy.steps[currentStep];
    const IconComponent = activeStrategy.icon;
    const progress = ((currentStep + 1) / activeStrategy.steps.length) * 100;

    return (
      <div className="coping-session">
        <motion.div 
          className="session-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="session-info">
            <IconComponent size={32} style={{ color: activeStrategy.color }} />
            <div>
              <h2>{activeStrategy.title}</h2>
              <div className="session-meta">
                <span>Step {currentStep + 1} of {activeStrategy.steps.length}</span>
                <span>•</span>
                <span>{activeStrategy.duration} minutes total</span>
              </div>
            </div>
          </div>
          <motion.button
            className="emergency-exit-button"
            onClick={completeStrategy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Exit
          </motion.button>
        </motion.div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progress}%`,
              backgroundColor: activeStrategy.color 
            }}
          />
        </div>

        <motion.div 
          className="current-step-coping"
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="step-header-coping">
            <h3>{currentStepData.title}</h3>
            {timeRemaining > 0 && (
              <div className="timer-display-large">
                <Clock size={20} />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <div className="step-instruction-large">
            <p>{currentStepData.instruction}</p>
          </div>

          {currentStepData.breathing && (
            <div className="breathing-indicator">
              <motion.div 
                className="breathing-circle"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span>Breathe with the circle</span>
            </div>
          )}

          <div className="step-controls-large">
            {!isTimerActive && timeRemaining > 0 && (
              <motion.button
                className="start-timer-button"
                onClick={startTimer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Timer
              </motion.button>
            )}

            <motion.button
              className="next-step-button"
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === activeStrategy.steps.length - 1 ? (
                <>
                  <CheckCircle size={20} />
                  Complete
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </div>

          {isTimerActive && (
            <div className="timer-active-message">
              <p>Take your time with this step. The timer is just a guide.</p>
            </div>
          )}
        </motion.div>

        {currentStep === activeStrategy.steps.length - 1 && (
          <motion.div 
            className="completion-message-large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={32} style={{ color: activeStrategy.color }} />
            <h4>You've completed this coping strategy</h4>
            <p>Take a moment to notice how you feel now. You handled this difficult moment with strength and skill.</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="emergency-coping-container">
      <motion.div 
        className="coping-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Shield size={32} className="header-icon emergency" />
        <div>
          <h2>Emergency Coping Toolkit</h2>
          <p>Quick relief for intense emotions, panic, and overwhelming moments</p>
        </div>
      </motion.div>

      <div className="emergency-notice">
        <div className="notice-content">
          <h3>🚨 When to Use This Toolkit</h3>
          <p>These are rapid intervention techniques for acute emotional distress. If you're having thoughts of self-harm or suicide, please contact emergency services or use the Crisis Support section immediately.</p>
        </div>
      </div>

      {Object.keys(usageStats).length > 0 && (
        <div className="quick-access">
          <h3>Quick Access</h3>
          <div className="most-used">
            {getMostUsedStrategy() && (
              <motion.div
                className="most-used-strategy"
                whileHover={{ scale: 1.02 }}
                onClick={() => startStrategy(getMostUsedStrategy())}
              >
                <div className="strategy-icon" style={{ color: getMostUsedStrategy().color }}>
                  {React.createElement(getMostUsedStrategy().icon, { size: 24 })}
                </div>
                <div>
                  <h4>Your Go-To Strategy</h4>
                  <p>{getMostUsedStrategy().title}</p>
                  <span>Used {usageStats[getMostUsedStrategy().id].count} times</span>
                </div>
                <ArrowRight size={20} />
              </motion.div>
            )}
          </div>
        </div>
      )}

      <div className="strategies-grid">
        <h3>Choose Your Situation</h3>
        {copingStrategies.map((strategy, index) => {
          const IconComponent = strategy.icon;
          const usageCount = usageStats[strategy.id]?.count || 0;
          
          return (
            <motion.div
              key={strategy.id}
              className="strategy-card emergency"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => startStrategy(strategy)}
            >
              <div className="strategy-header">
                <div className="strategy-icon" style={{ color: strategy.color }}>
                  <IconComponent size={28} />
                </div>
                <div className="urgency-badge" style={{ color: getUrgencyColor(strategy.urgency) }}>
                  {strategy.urgency} urgency
                </div>
              </div>

              <h3>{strategy.title}</h3>
              <p className="strategy-description">{strategy.description}</p>

              <div className="situation-description">
                <strong>Use when:</strong>
                <p>{strategy.situation}</p>
              </div>

              <div className="strategy-meta">
                <div className="duration">
                  <Clock size={16} />
                  {strategy.duration} minutes
                </div>
                <div className="steps-count">
                  {strategy.steps.length} steps
                </div>
                {usageCount > 0 && (
                  <div className="usage-count">
                    Used {usageCount} times
                  </div>
                )}
              </div>

              <div className="card-footer emergency">
                <span className="start-text">Start Now</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="coping-tips">
        <h3>Remember</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>🎯 It's Temporary</h4>
            <p>All intense emotions and panic attacks are temporary. They will pass.</p>
          </div>
          <div className="tip">
            <h4>🛡️ You're Safe</h4>
            <p>Anxiety feels dangerous but rarely is. Your body is trying to protect you.</p>
          </div>
          <div className="tip">
            <h4>💪 You Can Handle This</h4>
            <p>You've gotten through difficult moments before. You have the strength to get through this one too.</p>
          </div>
          <div className="tip">
            <h4>🤝 It's Okay to Ask for Help</h4>
            <p>Using coping strategies is a sign of strength. If you need more support, reach out.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCopingToolkit;