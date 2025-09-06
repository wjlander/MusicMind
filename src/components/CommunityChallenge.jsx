import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, Target, Star, CheckCircle, Clock, Award } from 'lucide-react';

const CommunityChallenge = () => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('challengeProgress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [currentView, setCurrentView] = useState('browse'); // 'browse', 'active', 'create'

  const challenges = [
    {
      id: 'gratitude-week',
      title: '7 Days of Gratitude',
      description: 'Practice gratitude daily for one week. Write down 3 things you\'re grateful for each day.',
      category: 'mindfulness',
      duration: 7,
      participants: 1247,
      startDate: '2025-01-01',
      endDate: '2025-01-07',
      difficulty: 'Easy',
      points: 100,
      icon: '🙏',
      color: '#9f7aea',
      dailyTask: 'Write down 3 things you\'re grateful for',
      benefits: ['Improved mood', 'Better perspective', 'Increased happiness'],
      status: 'active'
    },
    {
      id: 'mindful-movement',
      title: 'Move Mindfully',
      description: 'Incorporate 20 minutes of mindful movement into your daily routine for 2 weeks.',
      category: 'fitness',
      duration: 14,
      participants: 892,
      startDate: '2025-01-05',
      endDate: '2025-01-19',
      difficulty: 'Moderate',
      points: 200,
      icon: '🧘‍♀️',
      color: '#48bb78',
      dailyTask: '20 minutes of mindful movement (yoga, walking, stretching)',
      benefits: ['Better physical health', 'Stress reduction', 'Mind-body connection'],
      status: 'active'
    },
    {
      id: 'digital-detox',
      title: 'Weekend Digital Detox',
      description: 'Take a break from social media and non-essential screen time every weekend.',
      category: 'wellness',
      duration: 21,
      participants: 654,
      startDate: '2025-01-10',
      endDate: '2025-01-31',
      difficulty: 'Hard',
      points: 300,
      icon: '📵',
      color: '#e53e3e',
      dailyTask: 'No social media or non-essential screens on weekends',
      benefits: ['Better sleep', 'More present connections', 'Reduced anxiety'],
      status: 'upcoming'
    },
    {
      id: 'acts-of-kindness',
      title: '30 Acts of Kindness',
      description: 'Perform one act of kindness each day for 30 days, big or small.',
      category: 'social',
      duration: 30,
      participants: 1543,
      startDate: '2025-01-15',
      endDate: '2025-02-14',
      difficulty: 'Easy',
      points: 250,
      icon: '❤️',
      color: '#ed64a6',
      dailyTask: 'Perform one act of kindness',
      benefits: ['Increased empathy', 'Better relationships', 'Sense of purpose'],
      status: 'upcoming'
    },
    {
      id: 'sleep-hygiene',
      title: 'Sleep Better Challenge',
      description: 'Establish healthy sleep habits: consistent bedtime, no screens 1 hour before bed.',
      category: 'health',
      duration: 21,
      participants: 756,
      startDate: '2025-01-08',
      endDate: '2025-01-29',
      difficulty: 'Moderate',
      points: 180,
      icon: '😴',
      color: '#805ad5',
      dailyTask: 'Follow sleep hygiene routine (consistent bedtime, no screens before bed)',
      benefits: ['Better sleep quality', 'More energy', 'Improved mood'],
      status: 'active'
    },
    {
      id: 'creative-expression',
      title: 'Creative Daily Practice',
      description: 'Spend 15 minutes each day on creative expression: drawing, writing, music, etc.',
      category: 'creativity',
      duration: 14,
      participants: 423,
      startDate: '2025-01-12',
      endDate: '2025-01-26',
      difficulty: 'Easy',
      points: 150,
      icon: '🎨',
      color: '#d69e2e',
      dailyTask: '15 minutes of creative expression',
      benefits: ['Stress relief', 'Self-expression', 'Mental stimulation'],
      status: 'upcoming'
    }
  ];

  const [joinedChallenges, setJoinedChallenges] = useState(() => {
    const saved = localStorage.getItem('joinedChallenges');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('challengeProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('joinedChallenges', JSON.stringify(joinedChallenges));
  }, [joinedChallenges]);

  const joinChallenge = (challengeId) => {
    if (!joinedChallenges.includes(challengeId)) {
      setJoinedChallenges(prev => [...prev, challengeId]);
      setUserProgress(prev => ({
        ...prev,
        [challengeId]: {
          joinedDate: new Date().toISOString(),
          completedDays: [],
          currentStreak: 0,
          bestStreak: 0,
          totalPoints: 0
        }
      }));
    }
  };

  const markDayComplete = (challengeId, date = null) => {
    const today = date || new Date().toISOString().split('T')[0];
    
    setUserProgress(prev => {
      const challengeProgress = prev[challengeId] || {
        joinedDate: new Date().toISOString(),
        completedDays: [],
        currentStreak: 0,
        bestStreak: 0,
        totalPoints: 0
      };

      if (challengeProgress.completedDays.includes(today)) {
        return prev; // Already completed today
      }

      const newCompletedDays = [...challengeProgress.completedDays, today].sort();
      const challenge = challenges.find(c => c.id === challengeId);
      const pointsPerDay = Math.floor(challenge.points / challenge.duration);

      // Calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const newCurrentStreak = challengeProgress.completedDays.includes(yesterdayStr) 
        ? challengeProgress.currentStreak + 1 
        : 1;

      return {
        ...prev,
        [challengeId]: {
          ...challengeProgress,
          completedDays: newCompletedDays,
          currentStreak: newCurrentStreak,
          bestStreak: Math.max(challengeProgress.bestStreak, newCurrentStreak),
          totalPoints: challengeProgress.totalPoints + pointsPerDay
        }
      };
    });
  };

  const getChallengeProgress = (challengeId) => {
    return userProgress[challengeId] || {
      completedDays: [],
      currentStreak: 0,
      bestStreak: 0,
      totalPoints: 0
    };
  };

  const isJoined = (challengeId) => {
    return joinedChallenges.includes(challengeId);
  };

  const getDayStatus = (challengeId, dayOffset) => {
    const challenge = challenges.find(c => c.id === challengeId);
    const startDate = new Date(challenge.startDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOffset);
    
    const today = new Date();
    const targetDateStr = targetDate.toISOString().split('T')[0];
    const progress = getChallengeProgress(challengeId);
    
    if (targetDate > today) return 'future';
    if (progress.completedDays.includes(targetDateStr)) return 'completed';
    return 'pending';
  };

  const getTotalPoints = () => {
    return Object.values(userProgress).reduce((total, progress) => total + progress.totalPoints, 0);
  };

  const getActiveChallenges = () => {
    return challenges.filter(c => c.status === 'active' && isJoined(c.id));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#48bb78';
      case 'Moderate': return '#ed8936';
      case 'Hard': return '#e53e3e';
      default: return '#4299e1';
    }
  };

  if (currentView === 'active') {
    const activeChallenges = getActiveChallenges();
    
    return (
      <div className="community-challenge-container">
        <motion.div 
          className="challenge-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Trophy size={32} className="header-icon" />
          <div>
            <h2>My Active Challenges</h2>
            <p>Track your progress and stay motivated</p>
          </div>
        </motion.div>

        {activeChallenges.length > 0 ? (
          <div className="active-challenges">
            {activeChallenges.map((challenge) => {
              const progress = getChallengeProgress(challenge.id);
              const completionRate = (progress.completedDays.length / challenge.duration) * 100;
              const today = new Date().toISOString().split('T')[0];
              const todayCompleted = progress.completedDays.includes(today);

              return (
                <motion.div
                  key={challenge.id}
                  className="active-challenge-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="challenge-header-active">
                    <div className="challenge-icon" style={{ color: challenge.color }}>
                      {challenge.icon}
                    </div>
                    <div>
                      <h3>{challenge.title}</h3>
                      <p>{challenge.dailyTask}</p>
                    </div>
                    {!todayCompleted && (
                      <motion.button
                        className="complete-today-button"
                        onClick={() => markDayComplete(challenge.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle size={20} />
                        Complete Today
                      </motion.button>
                    )}
                    {todayCompleted && (
                      <div className="completed-badge">
                        <CheckCircle size={20} color="#48bb78" />
                        Done!
                      </div>
                    )}
                  </div>

                  <div className="challenge-progress">
                    <div className="progress-stats">
                      <div className="stat">
                        <span>Progress</span>
                        <strong>{progress.completedDays.length}/{challenge.duration} days</strong>
                      </div>
                      <div className="stat">
                        <span>Streak</span>
                        <strong>{progress.currentStreak} days</strong>
                      </div>
                      <div className="stat">
                        <span>Points</span>
                        <strong>{progress.totalPoints}</strong>
                      </div>
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

                  <div className="challenge-calendar">
                    <h5>Progress Calendar</h5>
                    <div className="calendar-grid">
                      {Array.from({ length: challenge.duration }, (_, i) => {
                        const status = getDayStatus(challenge.id, i);
                        return (
                          <div 
                            key={i} 
                            className={`calendar-day ${status}`}
                            style={{ 
                              backgroundColor: status === 'completed' ? challenge.color : 'transparent',
                              borderColor: challenge.color
                            }}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="no-active-challenges">
            <Trophy size={48} className="empty-icon" />
            <h3>No active challenges</h3>
            <p>Join a challenge to start building healthy habits with the community!</p>
            <motion.button
              className="action-button primary"
              onClick={() => setCurrentView('browse')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Challenges
            </motion.button>
          </div>
        )}

        <motion.button
          className="nav-button"
          onClick={() => setCurrentView('browse')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Browse
        </motion.button>
      </div>
    );
  }

  // Main browse view
  return (
    <div className="community-challenge-container">
      <motion.div 
        className="challenge-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy size={32} className="header-icon" />
        <div>
          <h2>Community Challenges</h2>
          <p>Join wellness challenges and build healthy habits together</p>
        </div>
      </motion.div>

      <div className="challenge-stats">
        <div className="stat-card">
          <Award size={24} />
          <div>
            <h4>Total Points</h4>
            <div className="stat-number">{getTotalPoints()}</div>
          </div>
        </div>
        <div className="stat-card">
          <Target size={24} />
          <div>
            <h4>Active Challenges</h4>
            <div className="stat-number">{getActiveChallenges().length}</div>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} />
          <div>
            <h4>Community Members</h4>
            <div className="stat-number">4.2k</div>
          </div>
        </div>
      </div>

      <div className="challenge-nav">
        <motion.button
          className={`nav-tab ${currentView === 'browse' ? 'active' : ''}`}
          onClick={() => setCurrentView('browse')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Browse All
        </motion.button>
        <motion.button
          className={`nav-tab ${currentView === 'active' ? 'active' : ''}`}
          onClick={() => setCurrentView('active')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          My Challenges ({getActiveChallenges().length})
        </motion.button>
      </div>

      <div className="challenges-grid">
        {challenges.map((challenge, index) => {
          const progress = getChallengeProgress(challenge.id);
          const joined = isJoined(challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              className={`challenge-card ${challenge.status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="challenge-status-badge">
                {challenge.status === 'active' && <span className="status active">Active</span>}
                {challenge.status === 'upcoming' && <span className="status upcoming">Starting Soon</span>}
                {joined && <span className="status joined">Joined</span>}
              </div>

              <div className="challenge-icon-large" style={{ color: challenge.color }}>
                {challenge.icon}
              </div>

              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
                
                <div className="challenge-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{challenge.duration} days</span>
                  </div>
                  <div className="detail-item">
                    <Users size={16} />
                    <span>{challenge.participants.toLocaleString()} joined</span>
                  </div>
                  <div className="detail-item">
                    <Star size={16} />
                    <span>{challenge.points} points</span>
                  </div>
                  <div className="detail-item">
                    <span 
                      className="difficulty-badge"
                      style={{ color: getDifficultyColor(challenge.difficulty) }}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <div className="daily-task">
                  <strong>Daily Task:</strong> {challenge.dailyTask}
                </div>

                <div className="challenge-benefits">
                  <strong>Benefits:</strong>
                  <div className="benefits-tags">
                    {challenge.benefits.map((benefit, idx) => (
                      <span key={idx} className="benefit-tag">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="challenge-dates">
                  <span>{new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {joined && (
                <div className="joined-progress">
                  <div className="progress-summary">
                    <span>{progress.completedDays.length}/{challenge.duration} days completed</span>
                    <span>{progress.currentStreak} day streak</span>
                  </div>
                  <div className="mini-progress-bar">
                    <div 
                      className="mini-progress-fill"
                      style={{ 
                        width: `${(progress.completedDays.length / challenge.duration) * 100}%`,
                        backgroundColor: challenge.color 
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="challenge-actions">
                {!joined ? (
                  <motion.button
                    className="join-button"
                    style={{ backgroundColor: challenge.color }}
                    onClick={() => joinChallenge(challenge.id)}
                    disabled={challenge.status === 'upcoming'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {challenge.status === 'upcoming' ? (
                      <><Clock size={16} /> Starting Soon</>
                    ) : (
                      <>Join Challenge</>
                    )}
                  </motion.button>
                ) : (
                  <div className="joined-badge">
                    <CheckCircle size={16} />
                    Joined
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="challenge-info-section">
        <h3>How Community Challenges Work</h3>
        <div className="info-grid">
          <div className="info-item">
            <Trophy size={24} />
            <h4>Join & Commit</h4>
            <p>Choose challenges that align with your wellness goals and commit to the daily tasks.</p>
          </div>
          <div className="info-item">
            <CheckCircle size={24} />
            <h4>Daily Check-ins</h4>
            <p>Mark your daily progress and build consistency with the support of the community.</p>
          </div>
          <div className="info-item">
            <Star size={24} />
            <h4>Earn Rewards</h4>
            <p>Complete challenges to earn points, badges, and the satisfaction of building healthy habits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChallenge;