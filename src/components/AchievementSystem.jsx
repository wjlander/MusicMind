import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Target, Calendar, Zap, Heart, Brain } from 'lucide-react';

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('userAchievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userWellnessStats');
    return saved ? JSON.parse(saved) : {
      totalSessions: 0,
      streakDays: 0,
      bestStreak: 0,
      activitiesCompleted: 0,
      pointsEarned: 0,
      daysActive: 0
    };
  });

  const achievementCategories = [
    {
      id: 'streaks',
      name: 'Consistency Master',
      icon: Calendar,
      color: '#48bb78',
      description: 'For maintaining wellness streaks'
    },
    {
      id: 'sessions',
      name: 'Activity Champion',
      icon: Zap,
      color: '#4299e1',
      description: 'For completing wellness activities'
    },
    {
      id: 'milestones',
      name: 'Milestone Achiever',
      icon: Target,
      color: '#ed8936',
      description: 'For reaching important milestones'
    },
    {
      id: 'exploration',
      name: 'Wellness Explorer',
      icon: Brain,
      color: '#9f7aea',
      description: 'For trying different activities'
    },
    {
      id: 'dedication',
      name: 'Dedicated Healer',
      icon: Heart,
      color: '#e53e3e',
      description: 'For long-term commitment'
    }
  ];

  const allAchievements = [
    // Streak Achievements
    {
      id: 'first-streak',
      category: 'streaks',
      title: 'Getting Started',
      description: 'Complete activities for 3 days in a row',
      requirement: { type: 'streak', value: 3 },
      points: 50,
      rarity: 'common',
      icon: '🌱'
    },
    {
      id: 'week-warrior',
      category: 'streaks',
      title: 'Week Warrior',
      description: 'Maintain a 7-day wellness streak',
      requirement: { type: 'streak', value: 7 },
      points: 100,
      rarity: 'uncommon',
      icon: '🗓️'
    },
    {
      id: 'consistency-king',
      category: 'streaks',
      title: 'Consistency Champion',
      description: 'Achieve a 30-day streak',
      requirement: { type: 'streak', value: 30 },
      points: 300,
      rarity: 'rare',
      icon: '👑'
    },
    {
      id: 'streak-legend',
      category: 'streaks',
      title: 'Streak Legend',
      description: 'Maintain a 100-day streak',
      requirement: { type: 'streak', value: 100 },
      points: 1000,
      rarity: 'legendary',
      icon: '🏆'
    },

    // Session Achievements
    {
      id: 'first-session',
      category: 'sessions',
      title: 'First Step',
      description: 'Complete your first wellness activity',
      requirement: { type: 'sessions', value: 1 },
      points: 25,
      rarity: 'common',
      icon: '👟'
    },
    {
      id: 'session-enthusiast',
      category: 'sessions',
      title: 'Wellness Enthusiast',
      description: 'Complete 25 wellness activities',
      requirement: { type: 'sessions', value: 25 },
      points: 150,
      rarity: 'uncommon',
      icon: '💪'
    },
    {
      id: 'session-master',
      category: 'sessions',
      title: 'Activity Master',
      description: 'Complete 100 wellness activities',
      requirement: { type: 'sessions', value: 100 },
      points: 500,
      rarity: 'rare',
      icon: '🎯'
    },
    {
      id: 'session-legend',
      category: 'sessions',
      title: 'Wellness Legend',
      description: 'Complete 500 wellness activities',
      requirement: { type: 'sessions', value: 500 },
      points: 2000,
      rarity: 'legendary',
      icon: '⭐'
    },

    // Milestone Achievements
    {
      id: 'point-collector',
      category: 'milestones',
      title: 'Point Collector',
      description: 'Earn your first 500 points',
      requirement: { type: 'points', value: 500 },
      points: 75,
      rarity: 'common',
      icon: '💎'
    },
    {
      id: 'point-master',
      category: 'milestones',
      title: 'Point Master',
      description: 'Accumulate 2,500 points',
      requirement: { type: 'points', value: 2500 },
      points: 200,
      rarity: 'uncommon',
      icon: '💰'
    },
    {
      id: 'month-milestone',
      category: 'milestones',
      title: 'Monthly Dedicator',
      description: 'Stay active for 30 days (not necessarily consecutive)',
      requirement: { type: 'activeDays', value: 30 },
      points: 250,
      rarity: 'uncommon',
      icon: '📅'
    },

    // Exploration Achievements
    {
      id: 'activity-sampler',
      category: 'exploration',
      title: 'Activity Sampler',
      description: 'Try 5 different types of wellness activities',
      requirement: { type: 'variety', value: 5 },
      points: 100,
      rarity: 'common',
      icon: '🌈'
    },
    {
      id: 'wellness-explorer',
      category: 'exploration',
      title: 'Wellness Explorer',
      description: 'Try 10 different types of wellness activities',
      requirement: { type: 'variety', value: 10 },
      points: 200,
      rarity: 'uncommon',
      icon: '🗺️'
    },

    // Dedication Achievements
    {
      id: 'early-adopter',
      category: 'dedication',
      title: 'Early Adopter',
      description: 'Use the app for 14 days',
      requirement: { type: 'totalDays', value: 14 },
      points: 100,
      rarity: 'common',
      icon: '🌟'
    },
    {
      id: 'wellness-veteran',
      category: 'dedication',
      title: 'Wellness Veteran',
      description: 'Use the app for 90 days',
      requirement: { type: 'totalDays', value: 90 },
      points: 400,
      rarity: 'rare',
      icon: '🛡️'
    }
  ];

  useEffect(() => {
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('userWellnessStats', JSON.stringify(userStats));
  }, [userStats]);

  const checkForNewAchievements = () => {
    const newAchievements = [];
    
    allAchievements.forEach(achievement => {
      // Skip if already earned
      if (achievements.find(a => a.id === achievement.id)) return;
      
      let isEarned = false;
      
      switch (achievement.requirement.type) {
        case 'streak':
          isEarned = userStats.bestStreak >= achievement.requirement.value;
          break;
        case 'sessions':
          isEarned = userStats.totalSessions >= achievement.requirement.value;
          break;
        case 'points':
          isEarned = userStats.pointsEarned >= achievement.requirement.value;
          break;
        case 'activeDays':
          isEarned = userStats.daysActive >= achievement.requirement.value;
          break;
        case 'variety':
          // This would need to track variety of activities - simplified for demo
          isEarned = userStats.totalSessions >= achievement.requirement.value * 3;
          break;
        case 'totalDays':
          // This would need to track total days since first use - simplified for demo
          isEarned = userStats.daysActive >= achievement.requirement.value;
          break;
        default:
          break;
      }
      
      if (isEarned) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      return newAchievements;
    }
    
    return [];
  };

  const simulateProgress = () => {
    // Simulate some progress for demo purposes
    setUserStats(prev => ({
      ...prev,
      totalSessions: Math.min(prev.totalSessions + Math.floor(Math.random() * 5) + 1, 500),
      streakDays: Math.min(prev.streakDays + 1, 100),
      bestStreak: Math.max(prev.bestStreak, prev.streakDays + 1),
      activitiesCompleted: prev.activitiesCompleted + Math.floor(Math.random() * 3) + 1,
      pointsEarned: prev.pointsEarned + Math.floor(Math.random() * 100) + 50,
      daysActive: Math.min(prev.daysActive + 1, 365)
    }));
    
    // Check for new achievements after updating stats
    setTimeout(() => {
      const newAchievements = checkForNewAchievements();
      if (newAchievements.length > 0) {
        // You could show a celebration animation here
      }
    }, 100);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#48bb78';
      case 'uncommon': return '#4299e1';
      case 'rare': return '#9f7aea';
      case 'epic': return '#ed8936';
      case 'legendary': return '#d69e2e';
      default: return '#718096';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'rare': return '0 0 20px rgba(159, 122, 234, 0.5)';
      case 'epic': return '0 0 25px rgba(237, 137, 54, 0.6)';
      case 'legendary': return '0 0 30px rgba(214, 158, 46, 0.7)';
      default: return 'none';
    }
  };

  const getCategoryAchievements = (categoryId) => {
    return allAchievements.filter(a => a.category === categoryId);
  };

  const getProgressToNextAchievement = (categoryId) => {
    const categoryAchievements = getCategoryAchievements(categoryId);
    const unlockedIds = achievements.map(a => a.id);
    const nextAchievement = categoryAchievements.find(a => !unlockedIds.includes(a.id));
    
    if (!nextAchievement) return null;
    
    let currentValue = 0;
    switch (nextAchievement.requirement.type) {
      case 'streak':
        currentValue = userStats.bestStreak;
        break;
      case 'sessions':
        currentValue = userStats.totalSessions;
        break;
      case 'points':
        currentValue = userStats.pointsEarned;
        break;
      case 'activeDays':
      case 'totalDays':
        currentValue = userStats.daysActive;
        break;
      default:
        break;
    }
    
    return {
      achievement: nextAchievement,
      progress: Math.min((currentValue / nextAchievement.requirement.value) * 100, 100),
      current: currentValue,
      target: nextAchievement.requirement.value
    };
  };

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const unlockedCount = achievements.length;
  const totalAchievements = allAchievements.length;

  return (
    <div className="achievement-system-container">
      <motion.div 
        className="achievement-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy size={32} className="header-icon" />
        <div>
          <h2>Achievement System</h2>
          <p>Track your wellness journey and celebrate your progress</p>
        </div>
      </motion.div>

      <div className="achievement-overview">
        <div className="overview-stats">
          <div className="stat-card achievement">
            <Trophy size={24} />
            <div>
              <h4>Achievements</h4>
              <div className="stat-number">{unlockedCount}/{totalAchievements}</div>
            </div>
          </div>
          <div className="stat-card achievement">
            <Star size={24} />
            <div>
              <h4>Total Points</h4>
              <div className="stat-number">{totalPoints}</div>
            </div>
          </div>
          <div className="stat-card achievement">
            <Award size={24} />
            <div>
              <h4>Completion</h4>
              <div className="stat-number">{Math.round((unlockedCount / totalAchievements) * 100)}%</div>
            </div>
          </div>
        </div>
        
        <motion.button
          className="demo-progress-button"
          onClick={simulateProgress}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Simulate Progress (Demo)
        </motion.button>
      </div>

      <div className="achievement-categories">
        {achievementCategories.map((category) => {
          const categoryAchievements = getCategoryAchievements(category.id);
          const unlockedInCategory = achievements.filter(a => a.category === category.id).length;
          const nextProgress = getProgressToNextAchievement(category.id);
          const IconComponent = category.icon;

          return (
            <motion.div
              key={category.id}
              className="category-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="category-header">
                <div className="category-title">
                  <IconComponent size={24} style={{ color: category.color }} />
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                <div className="category-progress">
                  {unlockedInCategory}/{categoryAchievements.length} unlocked
                </div>
              </div>

              {nextProgress && (
                <div className="next-achievement-progress">
                  <h5>Next: {nextProgress.achievement.title}</h5>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${nextProgress.progress}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {nextProgress.current}/{nextProgress.target}
                    </span>
                  </div>
                </div>
              )}

              <div className="achievements-grid">
                {categoryAchievements.map((achievement) => {
                  const isUnlocked = achievements.find(a => a.id === achievement.id);
                  const unlockedData = isUnlocked || {};

                  return (
                    <motion.div
                      key={achievement.id}
                      className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                      style={{
                        borderColor: isUnlocked ? getRarityColor(achievement.rarity) : '#e2e8f0',
                        boxShadow: isUnlocked ? getRarityGlow(achievement.rarity) : 'none'
                      }}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    >
                      <div className="achievement-icon-container">
                        <div 
                          className="achievement-icon"
                          style={{ 
                            backgroundColor: isUnlocked ? getRarityColor(achievement.rarity) : '#cbd5e0' 
                          }}
                        >
                          {isUnlocked ? achievement.icon : '🔒'}
                        </div>
                        <div 
                          className="rarity-badge"
                          style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                        >
                          {achievement.rarity}
                        </div>
                      </div>

                      <div className="achievement-content">
                        <h4>{isUnlocked ? achievement.title : '???'}</h4>
                        <p>{isUnlocked ? achievement.description : 'Keep progressing to unlock this achievement!'}</p>
                        
                        {isUnlocked && (
                          <div className="achievement-meta">
                            <div className="points-earned">+{achievement.points} points</div>
                            <div className="unlock-date">
                              Unlocked {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="recent-achievements">
        <h3>Recent Achievements</h3>
        {achievements.length > 0 ? (
          <div className="recent-list">
            {achievements
              .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
              .slice(0, 5)
              .map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="recent-achievement"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div 
                    className="recent-icon"
                    style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                  >
                    {achievement.icon}
                  </div>
                  <div className="recent-info">
                    <h5>{achievement.title}</h5>
                    <span>+{achievement.points} points</span>
                  </div>
                  <div className="recent-date">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="no-achievements">
            <p>Start using wellness activities to unlock your first achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementSystem;