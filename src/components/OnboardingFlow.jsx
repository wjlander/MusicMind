import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Heart, 
  Brain, 
  Moon, 
  Smile,
  Target,
  Users,
  Star,
  Play
} from 'lucide-react';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    primaryGoals: [],
    experienceLevel: '',
    preferredTime: '',
    challenges: [],
    interests: []
  });
  const [showDemo, setShowDemo] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Your Wellness Journey',
      subtitle: 'Let\'s personalize your experience',
      component: WelcomeStep
    },
    {
      id: 'goals',
      title: 'What are your wellness goals?',
      subtitle: 'Select all that apply to you',
      component: GoalsStep
    },
    {
      id: 'experience',
      title: 'How familiar are you with wellness practices?',
      subtitle: 'This helps us suggest the right activities',
      component: ExperienceStep
    },
    {
      id: 'schedule',
      title: 'When do you prefer wellness activities?',
      subtitle: 'We\'ll suggest activities at the right times',
      component: ScheduleStep
    },
    {
      id: 'challenges',
      title: 'What challenges would you like support with?',
      subtitle: 'We\'ll prioritize relevant tools and resources',
      component: ChallengesStep
    },
    {
      id: 'pathway',
      title: 'Choose your wellness pathway',
      subtitle: 'Start with a guided journey',
      component: PathwayStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data and complete
      localStorage.setItem('onboarding-completed', 'true');
      localStorage.setItem('user-wellness-profile', JSON.stringify(userProfile));
      onComplete(userProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="onboarding-flow">
      <div className="onboarding-container">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="step-content"
          >
            <div className="step-header">
              <h2>{steps[currentStep].title}</h2>
              <p>{steps[currentStep].subtitle}</p>
            </div>

            <CurrentStepComponent
              userProfile={userProfile}
              updateProfile={updateProfile}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="navigation-section">
          <button
            className="nav-button secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="nav-dots">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`nav-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>

          <button
            className="nav-button primary"
            onClick={handleNext}
          >
            {isLastStep ? 'Get Started' : 'Next'}
            {isLastStep ? <Play size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-flow {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .onboarding-container {
          background: white;
          width: 100%;
          max-width: 600px;
          margin: 20px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .progress-section {
          padding: 24px 32px 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4299e1, #667eea);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          color: #6c757d;
          font-size: 14px;
          font-weight: 500;
        }

        .step-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .step-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .step-header h2 {
          color: #2d3748;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .step-header p {
          color: #718096;
          font-size: 16px;
          margin: 0;
          line-height: 1.5;
        }

        .navigation-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 14px;
        }

        .nav-button.primary {
          background: #4299e1;
          color: white;
        }

        .nav-button.primary:hover {
          background: #3182ce;
          transform: translateY(-1px);
        }

        .nav-button.secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .nav-button.secondary:hover:not(:disabled) {
          background: #cbd5e0;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .nav-dots {
          display: flex;
          gap: 8px;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e0;
          transition: background 0.2s ease;
        }

        .nav-dot.active {
          background: #4299e1;
        }

        @media (max-width: 768px) {
          .onboarding-container {
            margin: 10px;
            min-height: 80vh;
          }

          .step-content {
            padding: 24px 20px;
          }

          .navigation-section {
            padding: 20px;
          }

          .step-header h2 {
            font-size: 24px;
          }

          .nav-button {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

// Individual Step Components
const WelcomeStep = ({ userProfile, updateProfile }) => (
  <div className="welcome-step">
    <div className="welcome-icon">
      <Heart size={48} color="#ed64a6" />
    </div>
    <h3>Let's get to know you!</h3>
    <p>We'll ask you a few quick questions to personalize your wellness experience. This should take less than 3 minutes.</p>
    
    <div className="name-input">
      <label>What should we call you? (Optional)</label>
      <input
        type="text"
        placeholder="Enter your name or nickname"
        value={userProfile.name}
        onChange={(e) => updateProfile({ name: e.target.value })}
      />
    </div>

    <div className="benefits-grid">
      <div className="benefit">
        <Target size={24} />
        <span>Personalized recommendations</span>
      </div>
      <div className="benefit">
        <Brain size={24} />
        <span>Evidence-based tools</span>
      </div>
      <div className="benefit">
        <Star size={24} />
        <span>Track your progress</span>
      </div>
    </div>

    <style jsx>{`
      .welcome-step {
        text-align: center;
      }

      .welcome-icon {
        background: linear-gradient(135deg, #fbb6ce, #ed64a6);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
      }

      .welcome-step h3 {
        color: #2d3748;
        font-size: 24px;
        margin: 0 0 16px;
        font-weight: 600;
      }

      .welcome-step p {
        color: #4a5568;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 32px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }

      .name-input {
        margin-bottom: 32px;
      }

      .name-input label {
        display: block;
        color: #4a5568;
        font-weight: 500;
        margin-bottom: 8px;
        text-align: left;
      }

      .name-input input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        transition: border-color 0.2s ease;
      }

      .name-input input:focus {
        outline: none;
        border-color: #4299e1;
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }

      .benefit {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: #f7fafc;
        border-radius: 12px;
        color: #4a5568;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
      }

      .benefit svg {
        color: #4299e1;
      }
    `}</style>
  </div>
);

const GoalsStep = ({ userProfile, updateProfile }) => {
  const goals = [
    { id: 'stress', label: 'Manage stress & anxiety', icon: Brain, color: '#4299e1' },
    { id: 'mood', label: 'Improve mood', icon: Smile, color: '#48bb78' },
    { id: 'sleep', label: 'Better sleep', icon: Moon, color: '#9f7aea' },
    { id: 'mindfulness', label: 'Practice mindfulness', icon: Heart, color: '#ed64a6' },
    { id: 'relationships', label: 'Strengthen relationships', icon: Users, color: '#ed8936' },
    { id: 'habits', label: 'Build healthy habits', icon: Target, color: '#38b2ac' }
  ];

  const toggleGoal = (goalId) => {
    const currentGoals = userProfile.primaryGoals || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    updateProfile({ primaryGoals: updatedGoals });
  };

  return (
    <div className="goals-step">
      <div className="goals-grid">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = (userProfile.primaryGoals || []).includes(goal.id);
          
          return (
            <motion.div
              key={goal.id}
              className={`goal-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleGoal(goal.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="goal-icon" style={{ backgroundColor: goal.color }}>
                <Icon size={24} />
              </div>
              <span>{goal.label}</span>
              {isSelected && (
                <div className="selected-indicator">
                  <Check size={16} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .goal-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px 16px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .goal-card:hover {
          border-color: #cbd5e0;
          background: #edf2f7;
        }

        .goal-card.selected {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .goal-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .goal-card span {
          color: #2d3748;
          font-weight: 500;
          font-size: 14px;
        }

        .selected-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          background: #4299e1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        @media (max-width: 768px) {
          .goals-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .goal-card {
            padding: 16px 12px;
          }

          .goal-icon {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

const ExperienceStep = ({ userProfile, updateProfile }) => {
  const levels = [
    {
      id: 'beginner',
      title: 'New to this',
      description: 'I\'m just starting my wellness journey'
    },
    {
      id: 'some',
      title: 'Some experience',
      description: 'I\'ve tried a few wellness practices before'
    },
    {
      id: 'experienced',
      title: 'Pretty experienced',
      description: 'I have regular wellness practices'
    }
  ];

  return (
    <div className="experience-step">
      <div className="levels-list">
        {levels.map((level) => (
          <motion.div
            key={level.id}
            className={`level-card ${userProfile.experienceLevel === level.id ? 'selected' : ''}`}
            onClick={() => updateProfile({ experienceLevel: level.id })}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="level-content">
              <h4>{level.title}</h4>
              <p>{level.description}</p>
            </div>
            {userProfile.experienceLevel === level.id && (
              <div className="check-icon">
                <Check size={20} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .levels-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .level-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .level-card:hover {
          border-color: #cbd5e0;
          background: #edf2f7;
        }

        .level-card.selected {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .level-content h4 {
          color: #2d3748;
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
        }

        .level-content p {
          color: #718096;
          margin: 0;
          font-size: 14px;
        }

        .check-icon {
          color: #4299e1;
          background: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

const ScheduleStep = ({ userProfile, updateProfile }) => {
  const times = [
    { id: 'morning', label: 'Morning (6-10 AM)', description: 'Start the day mindfully' },
    { id: 'midday', label: 'Midday (10 AM-2 PM)', description: 'Take breaks during work' },
    { id: 'afternoon', label: 'Afternoon (2-6 PM)', description: 'Recharge your energy' },
    { id: 'evening', label: 'Evening (6-10 PM)', description: 'Wind down and reflect' },
    { id: 'flexible', label: 'Flexible', description: 'Remind me when I have time' }
  ];

  return (
    <div className="schedule-step">
      <div className="times-list">
        {times.map((time) => (
          <motion.div
            key={time.id}
            className={`time-card ${userProfile.preferredTime === time.id ? 'selected' : ''}`}
            onClick={() => updateProfile({ preferredTime: time.id })}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="time-content">
              <h4>{time.label}</h4>
              <p>{time.description}</p>
            </div>
            {userProfile.preferredTime === time.id && (
              <div className="check-icon">
                <Check size={20} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .times-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .time-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-card:hover {
          border-color: #cbd5e0;
          background: #edf2f7;
        }

        .time-card.selected {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .time-content h4 {
          color: #2d3748;
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 600;
        }

        .time-content p {
          color: #718096;
          margin: 0;
          font-size: 13px;
        }

        .check-icon {
          color: #4299e1;
          background: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

const ChallengesStep = ({ userProfile, updateProfile }) => {
  const challenges = [
    { id: 'anxiety', label: 'Anxiety & worry' },
    { id: 'depression', label: 'Low mood or sadness' },
    { id: 'stress', label: 'Work or life stress' },
    { id: 'insomnia', label: 'Sleep problems' },
    { id: 'focus', label: 'Difficulty concentrating' },
    { id: 'relationships', label: 'Relationship issues' },
    { id: 'self-esteem', label: 'Self-confidence' },
    { id: 'grief', label: 'Loss or grief' }
  ];

  const toggleChallenge = (challengeId) => {
    const currentChallenges = userProfile.challenges || [];
    const updatedChallenges = currentChallenges.includes(challengeId)
      ? currentChallenges.filter(id => id !== challengeId)
      : [...currentChallenges, challengeId];
    updateProfile({ challenges: updatedChallenges });
  };

  return (
    <div className="challenges-step">
      <div className="challenges-note">
        <p>Select any areas where you'd like extra support. This helps us recommend the most helpful tools.</p>
      </div>
      
      <div className="challenges-grid">
        {challenges.map((challenge) => {
          const isSelected = (userProfile.challenges || []).includes(challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              className={`challenge-tag ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleChallenge(challenge.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {challenge.label}
              {isSelected && (
                <Check size={14} className="check-icon" />
              )}
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .challenges-note {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .challenges-note p {
          color: #0c4a6e;
          margin: 0;
          font-size: 14px;
          text-align: center;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .challenge-tag {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
        }

        .challenge-tag:hover {
          border-color: #cbd5e0;
          background: #edf2f7;
        }

        .challenge-tag.selected {
          border-color: #4299e1;
          background: #ebf8ff;
          color: #2b6cb0;
        }

        .check-icon {
          color: #4299e1;
        }

        @media (max-width: 768px) {
          .challenges-grid {
            grid-template-columns: 1fr 1fr;
          }

          .challenge-tag {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

const PathwayStep = ({ userProfile, updateProfile }) => {
  const pathways = [
    {
      id: 'stress-relief',
      title: 'Stress & Anxiety Relief',
      description: 'Breathing exercises, grounding techniques, and calming activities',
      duration: '7-day journey',
      activities: ['Breathing exercises', 'Grounding techniques', 'Progressive muscle relaxation'],
      color: '#4299e1'
    },
    {
      id: 'mood-boost',
      title: 'Mood & Positivity',
      description: 'Gratitude practices, affirmations, and mood-lifting activities',
      duration: '7-day journey',
      activities: ['Daily gratitude', 'Positive affirmations', 'Mood tracking'],
      color: '#48bb78'
    },
    {
      id: 'mindful-living',
      title: 'Mindful Living',
      description: 'Meditation, mindfulness, and present-moment awareness',
      duration: '10-day journey',
      activities: ['Daily meditation', 'Mindful movement', 'Body scan'],
      color: '#9f7aea'
    },
    {
      id: 'explore-all',
      title: 'Explore Everything',
      description: 'Try different activities and find what works best for you',
      duration: 'Self-paced',
      activities: ['All wellness tools', 'Personalized recommendations', 'Progress tracking'],
      color: '#ed8936'
    }
  ];

  return (
    <div className="pathway-step">
      <div className="pathways-list">
        {pathways.map((pathway) => (
          <motion.div
            key={pathway.id}
            className={`pathway-card ${userProfile.selectedPathway === pathway.id ? 'selected' : ''}`}
            onClick={() => updateProfile({ selectedPathway: pathway.id })}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="pathway-header">
              <div className="pathway-icon" style={{ backgroundColor: pathway.color }}>
                <Target size={24} />
              </div>
              <div className="pathway-info">
                <h4>{pathway.title}</h4>
                <span className="duration">{pathway.duration}</span>
              </div>
              {userProfile.selectedPathway === pathway.id && (
                <div className="selected-indicator">
                  <Check size={20} />
                </div>
              )}
            </div>
            
            <p>{pathway.description}</p>
            
            <div className="activities-list">
              {pathway.activities.map((activity, index) => (
                <span key={index} className="activity-tag">
                  {activity}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .pathways-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pathway-card {
          padding: 20px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pathway-card:hover {
          border-color: #cbd5e0;
          background: #edf2f7;
        }

        .pathway-card.selected {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .pathway-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .pathway-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .pathway-info {
          flex: 1;
        }

        .pathway-info h4 {
          color: #2d3748;
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 600;
        }

        .duration {
          color: #718096;
          font-size: 14px;
          font-weight: 500;
        }

        .selected-indicator {
          color: #4299e1;
          background: white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .pathway-card p {
          color: #4a5568;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .activities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .activity-tag {
          background: white;
          color: #4a5568;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }

        @media (max-width: 768px) {
          .pathway-header {
            flex-wrap: wrap;
          }

          .selected-indicator {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;