import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Shield, Zap, Clock, CheckCircle, Star, BookOpen } from 'lucide-react';

const EmotionRegulationSkills = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceSessions, setPracticeSessions] = useState(() => {
    const saved = localStorage.getItem('emotionRegulationSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);

  const emotionRegulationSkills = [
    {
      id: 'opposite-action',
      title: 'Opposite Action',
      description: 'Act opposite to your emotional urge when the emotion doesn\'t fit the facts',
      category: 'behavioral',
      difficulty: 'Medium',
      duration: 5,
      icon: Zap,
      color: '#e53e3e',
      whenToUse: 'When your emotion is very intense but doesn\'t match the situation, or when acting on the emotion would make things worse',
      emotionTargets: ['anger', 'fear', 'sadness', 'guilt', 'shame'],
      steps: [
        {
          title: 'Identify the Emotion',
          instruction: 'Name the specific emotion you\'re feeling and rate its intensity from 1-10.',
          duration: 60,
          practice: 'Take a moment to really notice what you\'re feeling in your body and mind.'
        },
        {
          title: 'Check if Emotion Fits the Facts',
          instruction: 'Ask: Is this emotion justified by the actual situation? Is acting on it helpful?',
          duration: 90,
          practice: 'Consider: What are the actual facts vs. my interpretations? Will acting on this emotion help or hurt?'
        },
        {
          title: 'Identify the Action Urge',
          instruction: 'What does this emotion make you want to do? Name the specific urge.',
          duration: 60,
          practice: 'Notice the impulse without acting on it. What behavior is this emotion pushing you toward?'
        },
        {
          title: 'Do the Opposite',
          instruction: 'Deliberately act in a way that\'s opposite to your emotional urge.',
          duration: 120,
          practice: 'If angry: act gently. If sad: do something active. If afraid: approach (safely). If guilty: don\'t apologize unnecessarily.'
        }
      ],
      examples: [
        'Angry at someone → Act kindly instead of lashing out',
        'Afraid of social situation → Approach it gradually instead of avoiding',
        'Sad and wanting to isolate → Reach out to others instead',
        'Feeling guilty over minor mistake → Don\'t over-apologize'
      ]
    },
    {
      id: 'distress-tolerance',
      title: 'TIPP for Crisis Survival',
      description: 'Quickly calm your nervous system during emotional emergencies',
      category: 'physiological',
      difficulty: 'Easy',
      duration: 3,
      icon: Shield,
      color: '#4299e1',
      whenToUse: 'During emotional crises, panic attacks, or when emotions feel overwhelming and dangerous',
      emotionTargets: ['panic', 'rage', 'overwhelming sadness', 'suicidal thoughts'],
      steps: [
        {
          title: 'Temperature',
          instruction: 'Change your body temperature quickly to calm your nervous system.',
          duration: 30,
          practice: 'Hold ice cubes, splash cold water on face, or take a hot/cold shower. This activates the dive response.'
        },
        {
          title: 'Intense Exercise',
          instruction: 'Do intense physical activity for a few minutes to burn off stress chemicals.',
          duration: 60,
          practice: 'Try jumping jacks, running in place, push-ups, or vigorous walking. Match the intensity to your emotion.'
        },
        {
          title: 'Paced Breathing',
          instruction: 'Slow your breathing to activate the parasympathetic nervous system.',
          duration: 90,
          practice: 'Breathe in for 4, out for 6. Make your exhale longer than your inhale. Focus on slowing everything down.'
        },
        {
          title: 'Progressive Muscle Relaxation',
          instruction: 'Tense and release muscle groups to release physical tension.',
          duration: 90,
          practice: 'Tense muscles for 5 seconds, then release. Start with fists, then arms, shoulders, face, and whole body.'
        }
      ],
      examples: [
        'Panic attack → Ice on wrists and deep breathing',
        'Intense anger → Sprint or push-ups then slow breathing',
        'Overwhelming sadness → Cold shower then muscle relaxation',
        'Anxiety spike → Fast walk while doing paced breathing'
      ]
    },
    {
      id: 'wise-mind',
      title: 'Accessing Wise Mind',
      description: 'Find the balance between emotional mind and rational mind',
      category: 'cognitive',
      difficulty: 'Medium',
      duration: 8,
      icon: Brain,
      color: '#9f7aea',
      whenToUse: 'When you need to make important decisions, resolve conflicts, or find balance during emotional situations',
      emotionTargets: ['confusion', 'conflicted feelings', 'decision paralysis', 'relationship issues'],
      steps: [
        {
          title: 'Notice Emotional Mind',
          instruction: 'Identify what your emotions are telling you about this situation.',
          duration: 90,
          practice: 'What do you feel? What do your emotions want you to do? Don\'t judge, just notice.'
        },
        {
          title: 'Notice Rational Mind',
          instruction: 'Identify what logic and facts tell you about this situation.',
          duration: 90,
          practice: 'What are the facts? What would be logical? What would you advise a friend?'
        },
        {
          title: 'Find the Integration',
          instruction: 'Look for where emotion and reason can work together.',
          duration: 120,
          practice: 'How can you honor both your feelings and the facts? What solution respects both?'
        },
        {
          title: 'Check Your Gut',
          instruction: 'Notice your intuitive sense of what feels right and wise.',
          duration: 120,
          practice: 'What feels true in your core? What choice would you be proud of later? Trust your inner wisdom.'
        },
        {
          title: 'Act from Wise Mind',
          instruction: 'Take action that integrates emotion, reason, and intuition.',
          duration: 120,
          practice: 'Move forward with the decision that honors all parts of yourself. Act with integrity and wisdom.'
        }
      ],
      examples: [
        'Relationship conflict → Honor your hurt feelings while being fair',
        'Career decision → Consider both passion and practical needs',
        'Setting boundaries → Be firm yet compassionate',
        'Difficult conversation → Express feelings while staying respectful'
      ]
    },
    {
      id: 'please-skills',
      title: 'PLEASE for Emotional Vulnerability',
      description: 'Reduce emotional vulnerability by taking care of your basic needs',
      category: 'self-care',
      difficulty: 'Easy',
      duration: 10,
      icon: Heart,
      color: '#48bb78',
      whenToUse: 'As daily maintenance to prevent emotional overwhelm and increase resilience',
      emotionTargets: ['general emotional instability', 'frequent mood swings', 'feeling overwhelmed'],
      steps: [
        {
          title: 'Treat Physical Illness',
          instruction: 'Take care of any physical health issues that might affect your mood.',
          duration: 120,
          practice: 'Take prescribed medications, see doctors when needed, rest when sick. Physical health affects emotional health.'
        },
        {
          title: 'Balance Eating',
          instruction: 'Eat regularly and avoid foods that negatively affect your mood.',
          duration: 120,
          practice: 'Eat at regular times, avoid excessive sugar/caffeine, include protein and complex carbs. Notice how food affects your emotions.'
        },
        {
          title: 'Avoid Mood-Altering Substances',
          instruction: 'Stay away from alcohol and drugs that can destabilize your emotions.',
          duration: 60,
          practice: 'When emotions are intense, substances can make them worse. Find healthy coping strategies instead.'
        },
        {
          title: 'Balance Sleep',
          instruction: 'Get adequate sleep and maintain a consistent sleep schedule.',
          duration: 120,
          practice: 'Aim for 7-9 hours. Go to bed and wake up at consistent times. Create a calming bedtime routine.'
        },
        {
          title: 'Get Exercise',
          instruction: 'Engage in regular physical activity to boost mood and manage stress.',
          duration: 180,
          practice: 'Even 20 minutes of walking can help. Find movement you enjoy. Exercise is a powerful mood regulator.'
        }
      ],
      examples: [
        'Feeling emotionally fragile → Check if you\'re tired, hungry, or sick',
        'Mood swings → Review sleep, eating, and exercise patterns',
        'Stress building → Use movement and rest as prevention',
        'Emotional overwhelm → Return to basics: sleep, eat, move, breathe'
      ]
    }
  ];

  const emotionTypes = [
    { id: 'anger', label: 'Anger', color: '#e53e3e', emoji: '😠' },
    { id: 'sadness', label: 'Sadness', color: '#4299e1', emoji: '😢' },
    { id: 'fear', label: 'Fear/Anxiety', color: '#ed8936', emoji: '😰' },
    { id: 'guilt', label: 'Guilt', color: '#9f7aea', emoji: '😔' },
    { id: 'shame', label: 'Shame', color: '#718096', emoji: '😳' },
    { id: 'overwhelm', label: 'Overwhelmed', color: '#d69e2e', emoji: '🤯' }
  ];

  useEffect(() => {
    localStorage.setItem('emotionRegulationSessions', JSON.stringify(practiceSessions));
  }, [practiceSessions]);

  const startSkillPractice = (skill) => {
    setActiveSkill(skill);
    setCurrentStep(0);
  };

  const completeStep = () => {
    if (currentStep < activeSkill.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    const session = {
      id: Date.now(),
      skillId: activeSkill.id,
      skillTitle: activeSkill.title,
      emotion: selectedEmotion,
      startIntensity: emotionIntensity,
      endIntensity: Math.max(1, emotionIntensity - Math.floor(Math.random() * 4) - 2),
      date: new Date().toISOString(),
      duration: activeSkill.duration
    };
    
    setPracticeSessions(prev => [session, ...prev].slice(0, 50));
    setActiveSkill(null);
    setCurrentStep(0);
  };

  const getSkillRecommendations = (emotion) => {
    return emotionRegulationSkills.filter(skill => 
      skill.emotionTargets.some(target => 
        target.toLowerCase().includes(emotion.toLowerCase()) ||
        emotion.toLowerCase().includes(target.toLowerCase())
      )
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#48bb78';
      case 'Medium': return '#ed8936';
      case 'Hard': return '#e53e3e';
      default: return '#4299e1';
    }
  };

  if (activeSkill) {
    const currentStepData = activeSkill.steps[currentStep];
    const IconComponent = activeSkill.icon;
    const progress = ((currentStep + 1) / activeSkill.steps.length) * 100;

    return (
      <div className="skill-practice-session">
        <motion.div 
          className="session-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="session-info">
            <IconComponent size={32} style={{ color: activeSkill.color }} />
            <div>
              <h2>{activeSkill.title}</h2>
              <div className="session-meta">
                <span>Step {currentStep + 1} of {activeSkill.steps.length}</span>
                {selectedEmotion && (
                  <>
                    <span>•</span>
                    <span>Working with: {selectedEmotion}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <motion.button
            className="exit-session-button"
            onClick={() => setActiveSkill(null)}
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
              backgroundColor: activeSkill.color 
            }}
          />
        </div>

        <motion.div 
          className="current-step-emotion"
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="step-header-emotion">
            <h3>{currentStepData.title}</h3>
            <div className="step-timer">
              <Clock size={16} />
              {Math.floor(currentStepData.duration / 60)}:{(currentStepData.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="step-instruction">
            <p>{currentStepData.instruction}</p>
          </div>

          <div className="step-practice">
            <h4>Practice Guide:</h4>
            <p>{currentStepData.practice}</p>
          </div>

          <motion.button
            className="complete-step-button"
            onClick={completeStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === activeSkill.steps.length - 1 ? (
              <>
                <CheckCircle size={20} />
                Complete Session
              </>
            ) : (
              'Next Step →'
            )}
          </motion.button>
        </motion.div>

        {currentStep === activeSkill.steps.length - 1 && (
          <motion.div 
            className="session-completion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4>🎉 Skill Practice Complete!</h4>
            <p>Take a moment to notice how you feel now compared to when you started.</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="emotion-regulation-container">
      <motion.div 
        className="regulation-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Heart size={32} className="header-icon" />
        <div>
          <h2>Emotion Regulation Skills</h2>
          <p>Learn evidence-based techniques to manage intense emotions effectively</p>
        </div>
      </motion.div>

      <div className="emotion-check-in">
        <h3>How are you feeling right now?</h3>
        <div className="emotion-selector">
          {emotionTypes.map(emotion => (
            <motion.button
              key={emotion.id}
              className={`emotion-button ${selectedEmotion === emotion.id ? 'selected' : ''}`}
              style={{ borderColor: emotion.color }}
              onClick={() => setSelectedEmotion(emotion.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="emotion-emoji">{emotion.emoji}</span>
              <span className="emotion-label">{emotion.label}</span>
            </motion.button>
          ))}
        </div>

        {selectedEmotion && (
          <motion.div 
            className="intensity-selector"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <label>How intense is this feeling? (1-10)</label>
            <div className="intensity-slider">
              <span>Mild</span>
              <input
                type="range"
                min="1"
                max="10"
                value={emotionIntensity}
                onChange={(e) => setEmotionIntensity(parseInt(e.target.value))}
                className="slider"
              />
              <span>Intense</span>
              <div className="intensity-value">{emotionIntensity}</div>
            </div>
          </motion.div>
        )}
      </div>

      {selectedEmotion && (
        <motion.div 
          className="skill-recommendations"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Recommended Skills for {emotionTypes.find(e => e.id === selectedEmotion)?.label}</h3>
          <div className="recommendations-grid">
            {getSkillRecommendations(selectedEmotion).map(skill => {
              const IconComponent = skill.icon;
              return (
                <motion.div
                  key={skill.id}
                  className="recommended-skill-card"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => startSkillPractice(skill)}
                >
                  <IconComponent size={24} style={{ color: skill.color }} />
                  <h4>{skill.title}</h4>
                  <p>{skill.description}</p>
                  <div className="skill-meta">
                    <span>{skill.duration} min</span>
                    <span style={{ color: getDifficultyColor(skill.difficulty) }}>
                      {skill.difficulty}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="all-skills-section">
        <h3>All Emotion Regulation Skills</h3>
        <div className="skills-grid">
          {emotionRegulationSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            
            return (
              <motion.div
                key={skill.id}
                className="emotion-skill-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="skill-header">
                  <IconComponent size={28} style={{ color: skill.color }} />
                  <div className="skill-badges">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(skill.difficulty) }}
                    >
                      {skill.difficulty}
                    </span>
                    <span className="category-badge">{skill.category}</span>
                  </div>
                </div>

                <h3>{skill.title}</h3>
                <p>{skill.description}</p>

                <div className="skill-details">
                  <div className="when-to-use">
                    <h5>When to use:</h5>
                    <p>{skill.whenToUse}</p>
                  </div>

                  <div className="skill-examples">
                    <h5>Examples:</h5>
                    <ul>
                      {skill.examples.slice(0, 2).map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="skill-meta">
                  <span><Clock size={16} /> {skill.duration} minutes</span>
                  <span>{skill.steps.length} steps</span>
                </div>

                <motion.button
                  className="practice-skill-button"
                  style={{ backgroundColor: skill.color }}
                  onClick={() => startSkillPractice(skill)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Practice This Skill
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {practiceSessions.length > 0 && (
        <motion.div 
          className="recent-practice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Recent Practice Sessions</h3>
          <div className="practice-history">
            {practiceSessions.slice(0, 5).map(session => (
              <div key={session.id} className="practice-session-item">
                <div className="session-info">
                  <h5>{session.skillTitle}</h5>
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="session-progress">
                  <span>Emotion: {session.emotion}</span>
                  <div className="intensity-change">
                    {session.startIntensity} → {session.endIntensity}
                    {session.endIntensity < session.startIntensity && (
                      <span className="improvement">↓ Improved</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="regulation-education">
        <h3>Understanding Emotion Regulation</h3>
        <div className="education-grid">
          <div className="education-card">
            <BookOpen size={24} />
            <h4>What is Emotion Regulation?</h4>
            <p>The ability to influence which emotions you have, when you have them, and how you experience and express them.</p>
          </div>
          <div className="education-card">
            <Brain size={24} />
            <h4>Why It Matters</h4>
            <p>Good emotion regulation improves relationships, decision-making, mental health, and overall life satisfaction.</p>
          </div>
          <div className="education-card">
            <Star size={24} />
            <h4>Skills Can Be Learned</h4>
            <p>Like any skill, emotion regulation improves with practice. Be patient and consistent with yourself.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionRegulationSkills;