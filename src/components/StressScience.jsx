import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Heart, Shield, Activity, Users, Lightbulb, CheckCircle } from 'lucide-react';

const StressScience = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [completedModules, setCompletedModules] = useState(() => {
    const saved = localStorage.getItem('stressModulesCompleted');
    return saved ? JSON.parse(saved) : [];
  });

  const stressModules = [
    {
      id: 'overview',
      title: 'Understanding Stress',
      icon: Brain,
      color: '#4299e1',
      duration: '5 min read',
      content: {
        introduction: 'Stress is your body\'s natural response to challenges and demands. While often viewed negatively, stress can actually be beneficial when understood and managed properly.',
        sections: [
          {
            title: 'What Happens in Your Body',
            content: 'When you encounter a stressor, your hypothalamus (a tiny control tower in your brain) sets off an alarm. This triggers your adrenal glands to release hormones like adrenaline and cortisol. Your heart rate increases, breathing quickens, muscles tighten, and your senses become sharper. This is the famous "fight-or-flight" response.',
            keyPoints: [
              'Stress response evolved to help us survive physical dangers',
              'Modern stressors (work, relationships) trigger the same ancient response',
              'The stress response is automatic and happens within milliseconds'
            ]
          },
          {
            title: 'Good Stress vs. Bad Stress',
            content: 'Not all stress is harmful. Eustress (good stress) can motivate you, improve performance, and lead to growth. Distress (bad stress) occurs when stress becomes overwhelming or chronic.',
            keyPoints: [
              'Eustress: Exercise, exciting challenges, positive life changes',
              'Distress: Chronic work pressure, relationship conflicts, financial worries',
              'The same situation can be eustress for one person and distress for another'
            ]
          }
        ],
        practicalTips: [
          'Recognize that some stress is normal and even beneficial',
          'Pay attention to how your body responds to different stressors',
          'Notice the difference between exciting challenges and overwhelming pressure'
        ]
      }
    },
    {
      id: 'physiology',
      title: 'The Stress Response System',
      icon: Activity,
      color: '#e53e3e',
      duration: '7 min read',
      content: {
        introduction: 'Your stress response system is incredibly sophisticated, involving multiple body systems working together to help you respond to challenges.',
        sections: [
          {
            title: 'The HPA Axis',
            content: 'The Hypothalamic-Pituitary-Adrenal (HPA) axis is your body\'s stress control center. When you perceive a threat, your hypothalamus releases CRH (corticotropin-releasing hormone), which signals your pituitary gland to release ACTH (adrenocorticotropic hormone), which then tells your adrenal glands to produce cortisol.',
            keyPoints: [
              'This system is designed to turn on quickly and shut off when danger passes',
              'Chronic stress keeps this system activated, leading to health problems',
              'Cortisol affects nearly every organ system in your body'
            ]
          },
          {
            title: 'Nervous System Response',
            content: 'Your autonomic nervous system has two main branches: sympathetic (gas pedal) and parasympathetic (brakes). Stress activates the sympathetic system, while relaxation activates the parasympathetic system.',
            keyPoints: [
              'Sympathetic: Increases heart rate, breathing, muscle tension',
              'Parasympathetic: Promotes rest, digestion, and recovery',
              'You can consciously activate your parasympathetic system through breathing and relaxation'
            ]
          },
          {
            title: 'Physical Effects of Chronic Stress',
            content: 'When stress becomes chronic, it can affect every system in your body, leading to both physical and mental health problems.',
            keyPoints: [
              'Cardiovascular: High blood pressure, increased risk of heart disease',
              'Immune: Weakened immune response, slower healing',
              'Digestive: Stomach problems, changes in appetite',
              'Mental: Anxiety, depression, cognitive problems'
            ]
          }
        ],
        practicalTips: [
          'Learn to recognize early signs of stress activation',
          'Practice techniques that activate your parasympathetic nervous system',
          'Take chronic stress seriously - it\'s not just "in your head"'
        ]
      }
    },
    {
      id: 'psychology',
      title: 'Psychology of Stress',
      icon: Brain,
      color: '#9f7aea',
      duration: '6 min read',
      content: {
        introduction: 'How you think about and interpret situations largely determines whether you experience them as stressful. Understanding the psychology of stress gives you power to change your response.',
        sections: [
          {
            title: 'Cognitive Appraisal Theory',
            content: 'Psychologist Richard Lazarus showed that stress depends on two assessments: Primary appraisal (Is this a threat?) and Secondary appraisal (Can I handle this?). Your answers to these questions determine your stress level more than the actual situation.',
            keyPoints: [
              'The same event can be stressful or exciting depending on your interpretation',
              'Changing how you think about a situation can change your stress response',
              'Past experiences influence how you appraise new situations'
            ]
          },
          {
            title: 'Common Thinking Patterns That Increase Stress',
            content: 'Certain thinking patterns make situations seem more threatening than they actually are, increasing your stress response unnecessarily.',
            keyPoints: [
              'Catastrophizing: Imagining the worst possible outcome',
              'All-or-nothing thinking: Seeing situations in black and white',
              'Mind reading: Assuming you know what others are thinking',
              'Fortune telling: Predicting negative futures without evidence'
            ]
          },
          {
            title: 'The Role of Control and Predictability',
            content: 'Situations feel less stressful when you have some sense of control or predictability. Even small amounts of control can significantly reduce stress.',
            keyPoints: [
              'Focus on what you can control rather than what you can\'t',
              'Having choices, even small ones, reduces stress',
              'Uncertainty often feels more stressful than known challenges'
            ]
          }
        ],
        practicalTips: [
          'Challenge negative thought patterns when you notice them',
          'Focus on what aspects of a situation you can influence',
          'Practice accepting uncertainty as a normal part of life'
        ]
      }
    },
    {
      id: 'management',
      title: 'Stress Management Strategies',
      icon: Shield,
      color: '#48bb78',
      duration: '8 min read',
      content: {
        introduction: 'Effective stress management involves multiple strategies that address different aspects of the stress response. The goal isn\'t to eliminate stress but to manage it skillfully.',
        sections: [
          {
            title: 'Problem-Focused vs. Emotion-Focused Coping',
            content: 'There are two main types of coping strategies. Problem-focused coping addresses the source of stress directly. Emotion-focused coping helps you manage the emotional response to stress.',
            keyPoints: [
              'Problem-focused: Time management, problem-solving, seeking help',
              'Emotion-focused: Relaxation, reframing, emotional support',
              'Use problem-focused when you can change the situation',
              'Use emotion-focused when the situation can\'t be changed'
            ]
          },
          {
            title: 'Quick Stress Relief Techniques',
            content: 'These techniques can help you manage stress in the moment when you don\'t have time for longer interventions.',
            keyPoints: [
              'Deep breathing: 4-7-8 breathing pattern',
              'Progressive muscle relaxation: Tense and release muscle groups',
              'Grounding: 5-4-3-2-1 sensory technique',
              'Mindful movement: Gentle stretching or walking'
            ]
          },
          {
            title: 'Long-term Stress Management',
            content: 'Building resilience requires ongoing practices that strengthen your ability to handle stress over time.',
            keyPoints: [
              'Regular exercise: Reduces stress hormones and builds resilience',
              'Quality sleep: Essential for stress recovery and emotional regulation',
              'Social support: Strong relationships buffer against stress',
              'Mindfulness practice: Builds awareness and emotional regulation skills'
            ]
          }
        ],
        practicalTips: [
          'Develop a toolkit of stress management techniques',
          'Practice stress management skills when you\'re calm, not just when stressed',
          'Remember that different strategies work better for different types of stress'
        ]
      }
    },
    {
      id: 'resilience',
      title: 'Building Stress Resilience',
      icon: Zap,
      color: '#d69e2e',
      duration: '6 min read',
      content: {
        introduction: 'Resilience is your ability to bounce back from stress, adapt to challenges, and even grow stronger through difficult experiences. It\'s a skill that can be developed.',
        sections: [
          {
            title: 'The Science of Resilience',
            content: 'Research shows that resilient people have certain characteristics and habits that help them handle stress better. The good news is that these can be learned and strengthened.',
            keyPoints: [
              'Resilience involves both psychological and biological factors',
              'Neuroplasticity means your brain can develop new stress response patterns',
              'Small, consistent practices build resilience over time'
            ]
          },
          {
            title: 'Key Components of Resilience',
            content: 'Resilience isn\'t just one trait but a combination of skills, attitudes, and behaviors that work together.',
            keyPoints: [
              'Emotional regulation: Managing intense emotions effectively',
              'Cognitive flexibility: Adapting your thinking to new situations',
              'Social connection: Maintaining supportive relationships',
              'Self-care: Taking care of your physical and mental health',
              'Meaning-making: Finding purpose and growth in challenges'
            ]
          },
          {
            title: 'Post-Traumatic Growth',
            content: 'Sometimes people don\'t just bounce back from difficult experiences - they actually grow stronger. This is called post-traumatic growth.',
            keyPoints: [
              'Not everyone experiences growth, and that\'s okay',
              'Growth often happens alongside, not instead of, pain',
              'Common areas of growth: relationships, personal strength, life priorities, spirituality'
            ]
          }
        ],
        practicalTips: [
          'View challenges as opportunities to build strength',
          'Cultivate a growth mindset about your ability to handle stress',
          'Invest in relationships and social connections'
        ]
      }
    },
    {
      id: 'workplace',
      title: 'Workplace Stress',
      icon: Users,
      color: '#ed8936',
      duration: '7 min read',
      content: {
        introduction: 'Work-related stress is one of the most common sources of chronic stress. Understanding workplace stress can help you manage it more effectively.',
        sections: [
          {
            title: 'Common Sources of Workplace Stress',
            content: 'Workplace stress can come from many sources, and identifying them is the first step in addressing them.',
            keyPoints: [
              'Workload: Too much work, tight deadlines, unrealistic expectations',
              'Control: Lack of input in decisions, unclear job expectations',
              'Relationships: Conflicts with colleagues, poor management, bullying',
              'Environment: Noise, poor lighting, uncomfortable workspace',
              'Job security: Fear of layoffs, unstable employment'
            ]
          },
          {
            title: 'The Cost of Workplace Stress',
            content: 'Chronic workplace stress affects both individuals and organizations, making it important for everyone to address.',
            keyPoints: [
              'Individual costs: Burnout, health problems, decreased job satisfaction',
              'Organizational costs: Decreased productivity, higher turnover, increased sick days',
              'Early intervention is more effective than trying to fix burnout'
            ]
          },
          {
            title: 'Strategies for Managing Workplace Stress',
            content: 'You can take steps to reduce workplace stress even when you can\'t change the work environment completely.',
            keyPoints: [
              'Set boundaries: Learn to say no, take breaks, disconnect after work',
              'Organize your work: Prioritize tasks, break large projects into steps',
              'Communicate: Discuss workload concerns, ask for clarification',
              'Find meaning: Connect your work to your values and larger purpose'
            ]
          }
        ],
        practicalTips: [
          'Take regular breaks throughout the day, even if they\'re short',
          'Create a transition ritual between work and personal time',
          'Build positive relationships with colleagues when possible'
        ]
      }
    }
  ];

  const completeModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      setCompletedModules(updated);
      localStorage.setItem('stressModulesCompleted', JSON.stringify(updated));
    }
  };

  const getCurrentModule = () => {
    return stressModules.find(module => module.id === activeModule);
  };

  const isCompleted = (moduleId) => {
    return completedModules.includes(moduleId);
  };

  const currentModule = getCurrentModule();

  return (
    <div className="stress-science-container">
      <motion.div 
        className="stress-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Zap size={32} className="header-icon" />
        <div>
          <h2>The Science of Stress</h2>
          <p>Understand how stress works and learn evidence-based management strategies</p>
        </div>
      </motion.div>

      <div className="learning-progress">
        <h3>Your Progress</h3>
        <div className="progress-stats">
          <div className="stat">
            <span>Modules Completed</span>
            <strong>{completedModules.length}/{stressModules.length}</strong>
          </div>
          <div className="stat">
            <span>Completion Rate</span>
            <strong>{Math.round((completedModules.length / stressModules.length) * 100)}%</strong>
          </div>
        </div>
      </div>

      <div className="modules-navigation">
        <h3>Learning Modules</h3>
        <div className="modules-grid">
          {stressModules.map((module, index) => {
            const IconComponent = module.icon;
            const completed = isCompleted(module.id);
            
            return (
              <motion.button
                key={module.id}
                className={`module-card ${activeModule === module.id ? 'active' : ''} ${completed ? 'completed' : ''}`}
                onClick={() => setActiveModule(module.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="module-icon" style={{ color: module.color }}>
                  <IconComponent size={24} />
                  {completed && <CheckCircle size={16} className="completion-badge" />}
                </div>
                <div className="module-info">
                  <h4>{module.title}</h4>
                  <span className="module-duration">{module.duration}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeModule}
          className="module-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="module-header">
            <div className="module-title">
              <currentModule.icon size={32} style={{ color: currentModule.color }} />
              <div>
                <h2>{currentModule.title}</h2>
                <span className="reading-time">{currentModule.duration}</span>
              </div>
            </div>
            {!isCompleted(currentModule.id) && (
              <motion.button
                className="complete-module-button"
                onClick={() => completeModule(currentModule.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={16} />
                Mark Complete
              </motion.button>
            )}
          </div>

          <div className="module-introduction">
            <p>{currentModule.content.introduction}</p>
          </div>

          <div className="module-sections">
            {currentModule.content.sections.map((section, index) => (
              <motion.div
                key={index}
                className="content-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3>{section.title}</h3>
                <p>{section.content}</p>
                
                <div className="key-points">
                  <h4>Key Points:</h4>
                  <ul>
                    {section.keyPoints.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="practical-tips">
            <h3>
              <Lightbulb size={24} />
              Practical Tips
            </h3>
            <div className="tips-list">
              {currentModule.content.practicalTips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="tip-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="tip-number">{index + 1}</div>
                  <p>{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {!isCompleted(currentModule.id) && (
            <div className="module-completion">
              <motion.button
                className="complete-button-large"
                onClick={() => completeModule(currentModule.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={20} />
                Complete Module
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="learning-summary">
        <h3>Remember</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <Heart size={24} />
            <h4>Stress is Normal</h4>
            <p>Everyone experiences stress. It's a natural and often helpful response to life's challenges.</p>
          </div>
          <div className="summary-card">
            <Brain size={24} />
            <h4>You Have Control</h4>
            <p>While you can't control all stressors, you can influence how you respond to them.</p>
          </div>
          <div className="summary-card">
            <Zap size={24} />
            <h4>Skills Can Be Learned</h4>
            <p>Stress management and resilience are skills that improve with practice and time.</p>
          </div>
          <div className="summary-card">
            <Shield size={24} />
            <h4>Help is Available</h4>
            <p>If stress becomes overwhelming, don't hesitate to seek support from professionals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressScience;