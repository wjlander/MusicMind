import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Target, Calendar, CheckCircle, Star, TrendingUp, Award, RefreshCw } from 'lucide-react';

const PersonalGrowthChallenges = () => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('growthChallengeProgress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [currentView, setCurrentView] = useState('browse');
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('completedGrowthChallenges');
    return saved ? JSON.parse(saved) : [];
  });

  const growthChallenges = [
    {
      id: 'comfort-zone',
      title: '30-Day Comfort Zone Expansion',
      description: 'Do one thing outside your comfort zone each day for 30 days',
      category: 'courage',
      duration: 30,
      difficulty: 'Medium',
      color: '#e53e3e',
      icon: '🚀',
      benefits: ['Increased confidence', 'New experiences', 'Personal growth', 'Resilience building'],
      dailyPrompts: [
        'Take a different route to work or a familiar place',
        'Start a conversation with a stranger',
        'Try a new food you\'ve never eaten before',
        'Speak up in a meeting or group discussion',
        'Learn a new skill for 30 minutes',
        'Call someone you haven\'t talked to in a while',
        'Say no to something you usually agree to',
        'Ask for help with something you struggle with',
        'Wear something outside your usual style',
        'Take on a small leadership role',
        'Share an opinion that might be unpopular',
        'Try a new hobby or activity',
        'Attend a social event alone',
        'Give someone a genuine compliment',
        'Ask for feedback on something you created'
      ],
      reflectionQuestions: [
        'What did I learn about myself today?',
        'How did this experience make me feel?',
        'What would I do differently next time?',
        'How has this expanded my perspective?'
      ]
    },
    {
      id: 'gratitude-deep',
      title: 'Deep Gratitude Practice',
      description: 'Go beyond surface gratitude to find appreciation in challenging moments',
      category: 'mindfulness',
      duration: 21,
      difficulty: 'Easy',
      color: '#d69e2e',
      icon: '🙏',
      benefits: ['Deeper appreciation', 'Improved perspective', 'Emotional resilience', 'Mindfulness'],
      dailyPrompts: [
        'Find gratitude in a recent disappointment',
        'Appreciate someone who challenged you',
        'Be grateful for a mistake you made',
        'Thank your body for something it does automatically',
        'Appreciate a difficult emotion you felt',
        'Find gratitude in waiting or being delayed',
        'Be thankful for a problem that taught you something',
        'Appreciate your ability to feel sadness',
        'Be grateful for criticism you received',
        'Thank someone from your past who hurt you',
        'Appreciate a current struggle or challenge',
        'Be grateful for having enough when others have less',
        'Thank yourself for your imperfections',
        'Appreciate the people who disagree with you',
        'Be grateful for endings that led to new beginnings'
      ],
      reflectionQuestions: [
        'How did this shift my perspective?',
        'What new insight did I gain?',
        'How can I carry this appreciation forward?',
        'What surprised me about this practice?'
      ]
    },
    {
      id: 'fear-facing',
      title: 'Face Your Fears Challenge',
      description: 'Gradually confront small fears to build courage and confidence',
      category: 'courage',
      duration: 14,
      difficulty: 'Hard',
      color: '#9f7aea',
      icon: '🦁',
      benefits: ['Reduced anxiety', 'Increased confidence', 'Better coping skills', 'Personal empowerment'],
      dailyPrompts: [
        'Identify one small fear you have',
        'Write about why this fear exists',
        'Take one tiny step toward facing this fear',
        'Practice breathing while thinking about your fear',
        'Visualize successfully handling this situation',
        'Share your fear with someone you trust',
        'Research others who overcame similar fears',
        'Create a plan to gradually face this fear',
        'Take another small step forward',
        'Celebrate progress, no matter how small',
        'Try a exposure exercise related to your fear',
        'Reflect on how you\'ve grown through this process',
        'Take a bigger step if you feel ready',
        'Plan how to maintain your progress'
      ],
      reflectionQuestions: [
        'What did I discover about my fear today?',
        'How has my relationship with this fear changed?',
        'What strength did I show today?',
        'How can I apply this courage to other areas?'
      ]
    },
    {
      id: 'self-compassion',
      title: 'Self-Compassion Mastery',
      description: 'Learn to treat yourself with the same kindness you show others',
      category: 'self-care',
      duration: 28,
      difficulty: 'Medium',
      color: '#ed64a6',
      icon: '💖',
      benefits: ['Reduced self-criticism', 'Emotional healing', 'Better relationships', 'Inner peace'],
      dailyPrompts: [
        'Notice when you\'re being self-critical today',
        'Write yourself a letter of forgiveness',
        'Practice the loving-kindness meditation',
        'Speak to yourself like a good friend would',
        'Acknowledge a mistake without harsh judgment',
        'Give yourself permission to rest when needed',
        'Celebrate one thing you did well today',
        'Practice self-forgiveness for a past mistake',
        'Treat yourself to something small and kind',
        'Notice your self-talk and gently correct it',
        'Honor your feelings without trying to fix them',
        'Practice saying "I\'m doing my best" when struggling',
        'Write down your strengths and good qualities',
        'Be patient with yourself while learning something new'
      ],
      reflectionQuestions: [
        'How did I show myself kindness today?',
        'What critical thought did I transform?',
        'How does self-compassion feel in my body?',
        'What would I tell a friend in my situation?'
      ]
    },
    {
      id: 'creativity-unlock',
      title: 'Creativity Unleashed',
      description: 'Explore and develop your creative potential through daily practice',
      category: 'creativity',
      duration: 21,
      difficulty: 'Easy',
      color: '#38a169',
      icon: '🎨',
      benefits: ['Enhanced creativity', 'Stress relief', 'Self-expression', 'Problem-solving skills'],
      dailyPrompts: [
        'Draw or doodle for 10 minutes without judgment',
        'Write a short story or poem',
        'Take photos from unusual angles',
        'Create something useful from recyclable materials',
        'Improvise a song or dance',
        'Design your ideal living space',
        'Write in a stream of consciousness for 5 minutes',
        'Create a collage from magazine cutouts',
        'Invent a new recipe or modify an existing one',
        'Build something with whatever materials you have',
        'Create art using only one color',
        'Write a letter to your future self',
        'Design a solution to a problem you face',
        'Create a playlist that tells a story'
      ],
      reflectionQuestions: [
        'What surprised me about my creative process?',
        'How did creating make me feel?',
        'What new idea emerged today?',
        'How can I bring more creativity into daily life?'
      ]
    },
    {
      id: 'connection-builder',
      title: 'Meaningful Connection Builder',
      description: 'Deepen relationships and create new meaningful connections',
      category: 'social',
      duration: 30,
      difficulty: 'Medium',
      color: '#4299e1',
      icon: '🤝',
      benefits: ['Stronger relationships', 'Better communication', 'Expanded network', 'Emotional support'],
      dailyPrompts: [
        'Have a meaningful conversation with someone close',
        'Ask someone about their dreams or goals',
        'Share something vulnerable with a trusted person',
        'Express appreciation to someone in writing',
        'Listen to someone without trying to solve their problems',
        'Reconnect with an old friend',
        'Ask for advice from someone you respect',
        'Share your struggles with someone supportive',
        'Introduce two people who would get along',
        'Have lunch with a colleague you don\'t know well',
        'Compliment a stranger genuinely',
        'Join a group activity or community event',
        'Volunteer for a cause you care about',
        'Practice empathy by truly trying to understand someone\'s perspective',
        'Offer help to someone who might need it'
      ],
      reflectionQuestions: [
        'What did I learn about this person today?',
        'How did this interaction make me feel?',
        'What barrier to connection did I overcome?',
        'How can I nurture this relationship further?'
      ]
    }
  ];

  useEffect(() => {
    localStorage.setItem('growthChallengeProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('completedGrowthChallenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  const startChallenge = (challengeId) => {
    setActiveChallenge(challengeId);
    if (!userProgress[challengeId]) {
      setUserProgress(prev => ({
        ...prev,
        [challengeId]: {
          startDate: new Date().toISOString(),
          completedDays: [],
          reflections: {},
          currentDay: 1
        }
      }));
    }
    setCurrentView('active');
  };

  const completeDay = (challengeId, day, reflection) => {
    const today = new Date().toISOString().split('T')[0];
    
    setUserProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...prev[challengeId],
        completedDays: [...(prev[challengeId]?.completedDays || []), today],
        reflections: {
          ...prev[challengeId]?.reflections,
          [day]: reflection
        },
        currentDay: Math.min(day + 1, growthChallenges.find(c => c.id === challengeId).duration)
      }
    }));

    // Check if challenge is complete
    const challenge = growthChallenges.find(c => c.id === challengeId);
    if ((userProgress[challengeId]?.completedDays.length || 0) + 1 >= challenge.duration) {
      completeChallenge(challengeId);
    }
  };

  const completeChallenge = (challengeId) => {
    const challenge = growthChallenges.find(c => c.id === challengeId);
    const completion = {
      challengeId,
      title: challenge.title,
      completedDate: new Date().toISOString(),
      duration: challenge.duration,
      category: challenge.category
    };
    
    setCompletedChallenges(prev => [...prev, completion]);
  };

  const getChallengeProgress = (challengeId) => {
    return userProgress[challengeId] || { completedDays: [], currentDay: 1, reflections: {} };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#48bb78';
      case 'Medium': return '#ed8936';
      case 'Hard': return '#e53e3e';
      default: return '#4299e1';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'courage': return '🦁';
      case 'mindfulness': return '🧘';
      case 'self-care': return '💖';
      case 'creativity': return '🎨';
      case 'social': return '🤝';
      default: return '🌱';
    }
  };

  if (currentView === 'active' && activeChallenge) {
    const challenge = growthChallenges.find(c => c.id === activeChallenge);
    const progress = getChallengeProgress(activeChallenge);
    const currentDay = progress.currentDay;
    const isCompleted = progress.completedDays.length >= challenge.duration;
    const todayCompleted = progress.completedDays.includes(new Date().toISOString().split('T')[0]);

    return (
      <div className="growth-challenge-active">
        <motion.div 
          className="active-challenge-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="challenge-info">
            <span className="challenge-icon">{challenge.icon}</span>
            <div>
              <h2>{challenge.title}</h2>
              <p>Day {currentDay} of {challenge.duration}</p>
            </div>
          </div>
          <motion.button
            className="back-button"
            onClick={() => setCurrentView('browse')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Challenges
          </motion.button>
        </motion.div>

        <div className="challenge-progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(progress.completedDays.length / challenge.duration) * 100}%`,
              backgroundColor: challenge.color 
            }}
          />
          <span className="progress-text">
            {progress.completedDays.length}/{challenge.duration} days completed
          </span>
        </div>

        {!isCompleted && !todayCompleted && (
          <motion.div 
            className="daily-challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Today's Challenge</h3>
            
            <div className="daily-prompt">
              <h4>Your Task:</h4>
              <p>{challenge.dailyPrompts[currentDay - 1] || challenge.dailyPrompts[Math.floor(Math.random() * challenge.dailyPrompts.length)]}</p>
            </div>

            <div className="reflection-section">
              <h4>Daily Reflection</h4>
              <div className="reflection-questions">
                {challenge.reflectionQuestions.map((question, index) => (
                  <div key={index} className="reflection-question">
                    <p>{question}</p>
                    <textarea
                      placeholder="Write your reflection..."
                      className="reflection-input"
                      rows="2"
                    />
                  </div>
                ))}
              </div>

              <motion.button
                className="complete-day-button"
                onClick={() => completeDay(activeChallenge, currentDay, 'Sample reflection')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={20} />
                Complete Today's Challenge
              </motion.button>
            </div>
          </motion.div>
        )}

        {todayCompleted && (
          <div className="today-completed">
            <CheckCircle size={32} color="#48bb78" />
            <h3>Great Job!</h3>
            <p>You've completed today's challenge. Check back tomorrow for the next one!</p>
          </div>
        )}

        <div className="challenge-calendar">
          <h3>Progress Calendar</h3>
          <div className="calendar-grid">
            {Array.from({ length: challenge.duration }, (_, i) => {
              const dayNumber = i + 1;
              const isCompleted = progress.completedDays.length >= dayNumber;
              const isCurrent = dayNumber === currentDay;
              
              return (
                <div 
                  key={dayNumber}
                  className={`calendar-day-growth ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  style={{ 
                    backgroundColor: isCompleted ? challenge.color : 'transparent',
                    borderColor: challenge.color
                  }}
                >
                  {dayNumber}
                  {isCompleted && <CheckCircle size={12} className="day-check" />}
                </div>
              );
            })}
          </div>
        </div>

        {isCompleted && (
          <motion.div 
            className="challenge-completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Award size={48} style={{ color: challenge.color }} />
            <h3>Challenge Complete!</h3>
            <p>Congratulations! You've completed the {challenge.title} challenge.</p>
            <div className="completion-stats">
              <div>🏆 {challenge.duration} days completed</div>
              <div>📝 {Object.keys(progress.reflections).length} reflections written</div>
              <div>⭐ Personal growth achieved</div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="personal-growth-container">
      <motion.div 
        className="growth-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sprout size={32} className="header-icon" />
        <div>
          <h2>Personal Growth Challenges</h2>
          <p>Transform yourself through purposeful daily practices</p>
        </div>
      </motion.div>

      <div className="growth-stats">
        <div className="stat-card">
          <Target size={24} />
          <div>
            <h4>Active Challenges</h4>
            <div className="stat-number">
              {Object.keys(userProgress).filter(id => {
                const progress = userProgress[id];
                const challenge = growthChallenges.find(c => c.id === id);
                return progress.completedDays.length < challenge.duration;
              }).length}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <Award size={24} />
          <div>
            <h4>Completed</h4>
            <div className="stat-number">{completedChallenges.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} />
          <div>
            <h4>Total Days</h4>
            <div className="stat-number">
              {Object.values(userProgress).reduce((total, progress) => total + progress.completedDays.length, 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="challenges-grid">
        {growthChallenges.map((challenge, index) => {
          const progress = getChallengeProgress(challenge.id);
          const isActive = progress.completedDays.length > 0 && progress.completedDays.length < challenge.duration;
          const isCompleted = completedChallenges.some(c => c.challengeId === challenge.id);
          const completionRate = (progress.completedDays.length / challenge.duration) * 100;

          return (
            <motion.div
              key={challenge.id}
              className={`growth-challenge-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="challenge-header">
                <span className="challenge-icon-large">{challenge.icon}</span>
                <div className="challenge-badges">
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="category-badge">
                    {getCategoryIcon(challenge.category)} {challenge.category}
                  </span>
                </div>
              </div>

              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>

              <div className="challenge-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{challenge.duration} days</span>
                </div>
                <div className="meta-item">
                  <Star size={16} />
                  <span>{challenge.benefits.length} benefits</span>
                </div>
              </div>

              <div className="challenge-benefits">
                <h5>What you'll gain:</h5>
                <ul>
                  {challenge.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {isActive && (
                <div className="challenge-progress">
                  <div className="progress-info">
                    <span>Day {progress.currentDay} of {challenge.duration}</span>
                    <span>{Math.round(completionRate)}% complete</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${completionRate}%`,
                        backgroundColor: challenge.color 
                      }}
                    />
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="completed-badge">
                  <Award size={20} />
                  <span>Completed!</span>
                </div>
              )}

              <div className="challenge-actions">
                {!isActive && !isCompleted ? (
                  <motion.button
                    className="start-challenge-button"
                    style={{ backgroundColor: challenge.color }}
                    onClick={() => startChallenge(challenge.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Challenge
                  </motion.button>
                ) : isActive ? (
                  <motion.button
                    className="continue-challenge-button"
                    onClick={() => {
                      setActiveChallenge(challenge.id);
                      setCurrentView('active');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue Challenge
                  </motion.button>
                ) : (
                  <motion.button
                    className="restart-challenge-button"
                    onClick={() => startChallenge(challenge.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw size={16} />
                    Restart
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {completedChallenges.length > 0 && (
        <div className="completed-challenges">
          <h3>Your Growth Journey</h3>
          <div className="journey-timeline">
            {completedChallenges.map((completion, index) => (
              <motion.div
                key={completion.challengeId}
                className="journey-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="journey-icon">
                  {growthChallenges.find(c => c.id === completion.challengeId)?.icon}
                </div>
                <div className="journey-content">
                  <h5>{completion.title}</h5>
                  <span>{completion.duration} days completed</span>
                  <div className="completion-date">
                    {new Date(completion.completedDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="growth-philosophy">
        <h3>Growth Mindset</h3>
        <div className="philosophy-grid">
          <div className="philosophy-card">
            <h4>🌱 Progress Over Perfection</h4>
            <p>Every small step forward is meaningful. Focus on consistent effort rather than perfect execution.</p>
          </div>
          <div className="philosophy-card">
            <h4>🔄 Embrace the Process</h4>
            <p>Growth happens in the journey, not just the destination. Enjoy each day's learning and discovery.</p>
          </div>
          <div className="philosophy-card">
            <h4>💪 Challenge Creates Strength</h4>
            <p>Stepping outside your comfort zone is where real transformation happens. Be brave and patient.</p>
          </div>
          <div className="philosophy-card">
            <h4>🏆 Celebrate Small Wins</h4>
            <p>Acknowledge every achievement, no matter how small. Each victory builds momentum for the next.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalGrowthChallenges;