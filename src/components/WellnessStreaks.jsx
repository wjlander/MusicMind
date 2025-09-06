import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Target, TrendingUp, CheckCircle, Award, Star } from 'lucide-react';

const WellnessStreaks = () => {
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('wellnessStreaks');
    return saved ? JSON.parse(saved) : {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      streakHistory: [],
      lastCheckIn: null,
      weeklyGoal: 7,
      monthlyGoal: 30
    };
  });

  const [todayActivities, setTodayActivities] = useState(() => {
    const saved = localStorage.getItem('todayWellnessActivities');
    return saved ? JSON.parse(saved) : [];
  });

  const [streakCategories, setStreakCategories] = useState(() => {
    const saved = localStorage.getItem('categoryStreaks');
    return saved ? JSON.parse(saved) : {
      mindfulness: 0,
      exercise: 0,
      gratitude: 0,
      journaling: 0,
      social: 0
    };
  });

  const activityCategories = [
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', color: '#9f7aea' },
    { id: 'exercise', name: 'Exercise', icon: '💪', color: '#48bb78' },
    { id: 'gratitude', name: 'Gratitude', icon: '🙏', color: '#d69e2e' },
    { id: 'journaling', name: 'Journaling', icon: '📝', color: '#4299e1' },
    { id: 'social', name: 'Social', icon: '👥', color: '#ed64a6' }
  ];

  const streakMilestones = [
    { days: 3, title: 'Getting Started', reward: 'First Spark', icon: '✨' },
    { days: 7, title: 'One Week Strong', reward: 'Week Warrior', icon: '🗓️' },
    { days: 14, title: 'Two Week Champion', reward: 'Momentum Master', icon: '💪' },
    { days: 21, title: 'Habit Former', reward: 'Routine Builder', icon: '🏗️' },
    { days: 30, title: 'Monthly Master', reward: 'Consistency King', icon: '👑' },
    { days: 50, title: 'Halfway Hero', reward: 'Dedication Award', icon: '🎖️' },
    { days: 100, title: 'Century Achiever', reward: 'Legendary Streak', icon: '🏆' }
  ];

  useEffect(() => {
    localStorage.setItem('wellnessStreaks', JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    localStorage.setItem('todayWellnessActivities', JSON.stringify(todayActivities));
  }, [todayActivities]);

  useEffect(() => {
    localStorage.setItem('categoryStreaks', JSON.stringify(streakCategories));
  }, [streakCategories]);

  const checkDayComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    return todayActivities.length > 0 && 
           todayActivities.some(activity => activity.date === today);
  };

  const addTodayActivity = (category) => {
    const today = new Date().toISOString().split('T')[0];
    const activity = {
      id: Date.now(),
      category,
      date: today,
      timestamp: new Date().toISOString()
    };

    setTodayActivities(prev => [...prev, activity]);
    
    // Update category streak
    setStreakCategories(prev => ({
      ...prev,
      [category]: prev[category] + 1
    }));

    // Check if this completes the day
    if (!checkDayComplete()) {
      updateMainStreak();
    }
  };

  const updateMainStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setStreakData(prev => {
      let newCurrentStreak = prev.currentStreak;
      
      // If we haven't checked in today yet
      if (prev.lastCheckIn !== today) {
        // If we checked in yesterday, continue the streak
        if (prev.lastCheckIn === yesterdayStr) {
          newCurrentStreak += 1;
        } else {
          // Streak broken, start over
          newCurrentStreak = 1;
        }

        return {
          ...prev,
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(prev.longestStreak, newCurrentStreak),
          totalDays: prev.totalDays + 1,
          lastCheckIn: today,
          streakHistory: [...prev.streakHistory, {
            date: today,
            streakDay: newCurrentStreak,
            activities: todayActivities.filter(a => a.date === today).length
          }]
        };
      }
      
      return prev;
    });
  };

  const getStreakMotivation = (streak) => {
    if (streak === 0) return "Ready to start your wellness journey? 🌱";
    if (streak < 3) return "Great start! Keep building momentum! 💪";
    if (streak < 7) return "You're developing a habit! Amazing work! ⭐";
    if (streak < 14) return "Your consistency is inspiring! 🔥";
    if (streak < 30) return "You're a wellness warrior! Keep going! 🏆";
    if (streak < 100) return "Incredible dedication! You're unstoppable! 🌟";
    return "You're a wellness legend! Absolutely phenomenal! 👑";
  };

  const getNextMilestone = () => {
    return streakMilestones.find(milestone => milestone.days > streakData.currentStreak);
  };

  const getCurrentMilestone = () => {
    const milestones = streakMilestones.filter(milestone => milestone.days <= streakData.currentStreak);
    return milestones[milestones.length - 1];
  };

  const getWeekProgress = () => {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasActivity = todayActivities.some(activity => activity.date === dateStr) ||
                         streakData.streakHistory.some(entry => entry.date === dateStr);
      
      weekDays.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasActivity,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isFuture: date > today
      });
    }
    
    return weekDays;
  };

  const getStreakColor = (streak) => {
    if (streak < 3) return '#ed8936';
    if (streak < 7) return '#48bb78';
    if (streak < 14) return '#4299e1';
    if (streak < 30) return '#9f7aea';
    if (streak < 100) return '#d69e2e';
    return '#e53e3e';
  };

  const simulateActivity = () => {
    const categories = ['mindfulness', 'exercise', 'gratitude', 'journaling', 'social'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    addTodayActivity(randomCategory);
  };

  const weekProgress = getWeekProgress();
  const nextMilestone = getNextMilestone();
  const currentMilestone = getCurrentMilestone();
  const isCompleteToday = checkDayComplete();
  const todayProgress = weekProgress.find(day => day.isToday);

  return (
    <div className="wellness-streaks-container">
      <motion.div 
        className="streaks-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Flame size={32} className="header-icon streak" />
        <div>
          <h2>Wellness Streaks</h2>
          <p>Build consistency and momentum in your wellness journey</p>
        </div>
      </motion.div>

      <div className="main-streak-display">
        <motion.div 
          className="streak-counter"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="streak-flame">
            <Flame 
              size={48} 
              style={{ color: getStreakColor(streakData.currentStreak) }}
              fill={streakData.currentStreak > 0 ? getStreakColor(streakData.currentStreak) : 'none'}
            />
          </div>
          <div className="streak-number">{streakData.currentStreak}</div>
          <div className="streak-label">Current Streak</div>
        </motion.div>

        <div className="streak-stats">
          <div className="stat-item">
            <Trophy size={20} />
            <div>
              <div className="stat-number">{streakData.longestStreak}</div>
              <div className="stat-label">Best Streak</div>
            </div>
          </div>
          <div className="stat-item">
            <Calendar size={20} />
            <div>
              <div className="stat-number">{streakData.totalDays}</div>
              <div className="stat-label">Total Days</div>
            </div>
          </div>
          <div className="stat-item">
            <Target size={20} />
            <div>
              <div className="stat-number">{Math.round((streakData.totalDays / (streakData.weeklyGoal * 4)) * 100)}%</div>
              <div className="stat-label">Monthly Goal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="motivation-message">
        <motion.p
          key={streakData.currentStreak}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="motivation-text"
        >
          {getStreakMotivation(streakData.currentStreak)}
        </motion.p>
      </div>

      <div className="today-status">
        <div className="today-header">
          <h3>Today's Progress</h3>
          {isCompleteToday ? (
            <div className="completion-badge">
              <CheckCircle size={20} color="#48bb78" />
              <span>Complete!</span>
            </div>
          ) : (
            <div className="incomplete-badge">
              <span>Add an activity to continue your streak</span>
            </div>
          )}
        </div>

        {!isCompleteToday && (
          <div className="quick-activities">
            <h4>Quick Activities</h4>
            <div className="activity-buttons">
              {activityCategories.map(category => (
                <motion.button
                  key={category.id}
                  className="activity-button"
                  style={{ borderColor: category.color }}
                  onClick={() => addTodayActivity(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="activity-icon">{category.icon}</span>
                  <span className="activity-name">{category.name}</span>
                </motion.button>
              ))}
            </div>
            
            <motion.button
              className="demo-activity-button"
              onClick={simulateActivity}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Random Activity (Demo)
            </motion.button>
          </div>
        )}
      </div>

      <div className="week-calendar">
        <h3>This Week</h3>
        <div className="calendar-grid">
          {weekProgress.map((day, index) => (
            <motion.div
              key={day.date}
              className={`calendar-day ${day.hasActivity ? 'complete' : ''} ${day.isToday ? 'today' : ''} ${day.isFuture ? 'future' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="day-name">{day.dayName}</div>
              <div className="day-number">{new Date(day.date).getDate()}</div>
              {day.hasActivity && (
                <CheckCircle size={16} className="day-check" />
              )}
              {day.isToday && !day.hasActivity && (
                <div className="today-marker">Today</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="category-streaks">
        <h3>Category Streaks</h3>
        <div className="categories-grid">
          {activityCategories.map(category => (
            <motion.div
              key={category.id}
              className="category-streak-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="category-header">
                <span className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </span>
                <h4>{category.name}</h4>
              </div>
              <div className="category-streak-number">
                {streakCategories[category.id] || 0}
              </div>
              <div className="category-streak-label">activities</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="milestones-section">
        <h3>Milestones</h3>
        
        {currentMilestone && (
          <div className="current-milestone">
            <Award size={24} style={{ color: '#d69e2e' }} />
            <div>
              <h4>Latest Achievement: {currentMilestone.title}</h4>
              <p>You earned: {currentMilestone.reward} {currentMilestone.icon}</p>
            </div>
          </div>
        )}

        {nextMilestone && (
          <div className="next-milestone">
            <div className="milestone-progress">
              <h4>Next Milestone: {nextMilestone.title}</h4>
              <div className="progress-info">
                <span>{streakData.currentStreak}/{nextMilestone.days} days</span>
                <span>{nextMilestone.days - streakData.currentStreak} days to go</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(streakData.currentStreak / nextMilestone.days) * 100}%`,
                    backgroundColor: getStreakColor(streakData.currentStreak)
                  }}
                />
              </div>
              <div className="milestone-reward">
                Reward: {nextMilestone.reward} {nextMilestone.icon}
              </div>
            </div>
          </div>
        )}

        <div className="all-milestones">
          <h4>All Milestones</h4>
          <div className="milestones-list">
            {streakMilestones.map(milestone => {
              const isAchieved = streakData.longestStreak >= milestone.days;
              return (
                <div 
                  key={milestone.days}
                  className={`milestone-item ${isAchieved ? 'achieved' : 'locked'}`}
                >
                  <div className="milestone-icon">
                    {isAchieved ? milestone.icon : '🔒'}
                  </div>
                  <div className="milestone-info">
                    <h5>{milestone.title}</h5>
                    <span>{milestone.days} days</span>
                  </div>
                  <div className="milestone-reward-badge">
                    {milestone.reward}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="streak-tips">
        <h3>Streak Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🔄 Start Small</h4>
            <p>Begin with just 5 minutes of any wellness activity. Consistency matters more than duration.</p>
          </div>
          <div className="tip-card">
            <h4>⏰ Set a Daily Time</h4>
            <p>Link your wellness activity to an existing habit or set a specific time each day.</p>
          </div>
          <div className="tip-card">
            <h4>🎯 Be Flexible</h4>
            <p>If you miss a day, don't give up! Start a new streak the next day and keep building momentum.</p>
          </div>
          <div className="tip-card">
            <h4>🏆 Celebrate Wins</h4>
            <p>Acknowledge your progress! Every day you show up for yourself is a victory worth celebrating.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessStreaks;