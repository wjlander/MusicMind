import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Calendar, TrendingUp, Award, Flame, RotateCcw } from 'lucide-react';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'wellness', icon: '💚' });
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [viewMode, setViewMode] = useState('today'); // today, week, stats

  const habitCategories = {
    wellness: { name: 'Mental Wellness', color: '#48bb78', defaultIcon: '💚' },
    physical: { name: 'Physical Health', color: '#4299e1', defaultIcon: '💪' },
    mindfulness: { name: 'Mindfulness', color: '#9f7aea', defaultIcon: '🧘' },
    social: { name: 'Social Connection', color: '#ed64a6', defaultIcon: '👥' },
    creativity: { name: 'Creativity', color: '#ed8936', defaultIcon: '🎨' },
    sleep: { name: 'Sleep & Rest', color: '#805ad5', defaultIcon: '😴' }
  };

  const commonHabits = [
    { name: 'Morning meditation', category: 'mindfulness', icon: '🧘' },
    { name: 'Gratitude journaling', category: 'wellness', icon: '🙏' },
    { name: 'Daily walk', category: 'physical', icon: '🚶' },
    { name: 'Deep breathing exercises', category: 'wellness', icon: '🫁' },
    { name: 'Drink 8 glasses of water', category: 'physical', icon: '💧' },
    { name: 'Phone-free evening hour', category: 'wellness', icon: '📵' },
    { name: 'Connect with a friend', category: 'social', icon: '💬' },
    { name: 'Read for 30 minutes', category: 'wellness', icon: '📚' },
    { name: 'Bedtime by 10 PM', category: 'sleep', icon: '🌙' },
    { name: 'Morning stretches', category: 'physical', icon: '🤸' },
    { name: 'Practice affirmations', category: 'wellness', icon: '✨' },
    { name: 'Creative activity', category: 'creativity', icon: '🎨' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('habit-tracker');
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  const saveHabits = (updatedHabits) => {
    localStorage.setItem('habit-tracker', JSON.stringify(updatedHabits));
    setHabits(updatedHabits);
  };

  const addHabit = (habitData) => {
    const habit = {
      id: Date.now(),
      name: habitData.name,
      category: habitData.category,
      icon: habitData.icon,
      completions: {},
      createdDate: new Date().toDateString()
    };
    saveHabits([...habits, habit]);
    setShowAddHabit(false);
    setNewHabit({ name: '', category: 'wellness', icon: '💚' });
  };

  const toggleHabit = (habitId, date = new Date().toDateString()) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedCompletions = { ...habit.completions };
        updatedCompletions[date] = !updatedCompletions[date];
        return { ...habit, completions: updatedCompletions };
      }
      return habit;
    });
    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    saveHabits(updatedHabits);
  };

  const getStreakCount = (habit) => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      if (habit.completions[dateString]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getCompletionRate = (habit, days = 30) => {
    let completed = 0;
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      if (habit.completions[dateString]) {
        completed++;
      }
    }
    return Math.round((completed / days) * 100);
  };

  const getTotalCompletions = (habit) => {
    return Object.values(habit.completions).filter(Boolean).length;
  };

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      week.push(date);
    }
    return week;
  };

  const getOverallStats = () => {
    const today = new Date().toDateString();
    const todayCompletions = habits.filter(habit => habit.completions[today]).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? Math.round((todayCompletions / totalHabits) * 100) : 0;
    
    const longestStreak = Math.max(...habits.map(getStreakCount), 0);
    const totalCompletions = habits.reduce((sum, habit) => sum + getTotalCompletions(habit), 0);
    
    return { todayCompletions, totalHabits, completionRate, longestStreak, totalCompletions };
  };

  if (showAddHabit) {
    return (
      <div className="habit-container">
        <motion.div 
          className="add-habit-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h3>Add New Habit</h3>
            <motion.button
              className="back-button"
              onClick={() => setShowAddHabit(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
          </div>

          <div className="habit-form">
            <div className="form-group">
              <label>Habit Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g., Morning meditation"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={newHabit.category}
                onChange={(e) => setNewHabit({...newHabit, category: e.target.value, icon: habitCategories[e.target.value].defaultIcon})}
              >
                {Object.entries(habitCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Icon (optional)</label>
              <input
                type="text"
                value={newHabit.icon}
                onChange={(e) => setNewHabit({...newHabit, icon: e.target.value})}
                placeholder="Choose an emoji"
                maxLength={2}
              />
            </div>

            <motion.button
              className="create-habit-btn"
              onClick={() => addHabit(newHabit)}
              disabled={!newHabit.name.trim()}
              whileHover={{ scale: newHabit.name.trim() ? 1.05 : 1 }}
              whileTap={{ scale: newHabit.name.trim() ? 0.95 : 1 }}
            >
              <Plus size={20} />
              Create Habit
            </motion.button>
          </div>

          <div className="common-habits">
            <h4>Quick Add: Common Wellness Habits</h4>
            <div className="common-habits-grid">
              {commonHabits.map((habit, index) => (
                <motion.button
                  key={index}
                  className="common-habit-btn"
                  onClick={() => addHabit(habit)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ borderColor: habitCategories[habit.category].color }}
                >
                  <span className="habit-icon">{habit.icon}</span>
                  <span className="habit-name">{habit.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (viewMode === 'stats') {
    const stats = getOverallStats();
    return (
      <div className="habit-container">
        <motion.div 
          className="habit-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stats-header">
            <h3>Habit Statistics</h3>
            <motion.button
              className="back-button"
              onClick={() => setViewMode('today')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Habits
            </motion.button>
          </div>

          <div className="stats-overview">
            <div className="stat-card">
              <Target size={32} />
              <div className="stat-content">
                <h4>Today's Progress</h4>
                <div className="stat-value">{stats.todayCompletions}/{stats.totalHabits}</div>
                <div className="stat-subtitle">{stats.completionRate}% complete</div>
              </div>
            </div>

            <div className="stat-card">
              <Flame size={32} />
              <div className="stat-content">
                <h4>Longest Streak</h4>
                <div className="stat-value">{stats.longestStreak}</div>
                <div className="stat-subtitle">days in a row</div>
              </div>
            </div>

            <div className="stat-card">
              <Award size={32} />
              <div className="stat-content">
                <h4>Total Completions</h4>
                <div className="stat-value">{stats.totalCompletions}</div>
                <div className="stat-subtitle">all time</div>
              </div>
            </div>
          </div>

          <div className="individual-stats">
            <h4>Individual Habit Performance</h4>
            <div className="habit-performance-list">
              {habits.map(habit => {
                const streak = getStreakCount(habit);
                const rate = getCompletionRate(habit);
                const total = getTotalCompletions(habit);
                const category = habitCategories[habit.category];
                
                return (
                  <div key={habit.id} className="performance-card">
                    <div className="performance-header">
                      <span className="habit-icon">{habit.icon}</span>
                      <div className="habit-info">
                        <h5>{habit.name}</h5>
                        <span className="habit-category" style={{ color: category.color }}>
                          {category.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="performance-stats">
                      <div className="perf-stat">
                        <span className="perf-label">Current Streak</span>
                        <span className="perf-value">{streak} days</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-label">30-Day Rate</span>
                        <span className="perf-value">{rate}%</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-label">Total Completions</span>
                        <span className="perf-value">{total}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (viewMode === 'week') {
    const weekDates = getWeekDates();
    return (
      <div className="habit-container">
        <motion.div 
          className="habit-week-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="week-header">
            <h3>Weekly Overview</h3>
            <motion.button
              className="back-button"
              onClick={() => setViewMode('today')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Today
            </motion.button>
          </div>

          <div className="week-grid">
            <div className="week-grid-header">
              <div className="habit-name-col">Habit</div>
              {weekDates.map(date => (
                <div key={date.toDateString()} className="date-col">
                  <div className="date-day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="date-number">{date.getDate()}</div>
                </div>
              ))}
            </div>

            {habits.map(habit => {
              const category = habitCategories[habit.category];
              return (
                <div key={habit.id} className="week-habit-row">
                  <div className="habit-name-col">
                    <span className="habit-icon">{habit.icon}</span>
                    <span className="habit-name">{habit.name}</span>
                  </div>
                  {weekDates.map(date => {
                    const dateString = date.toDateString();
                    const isCompleted = habit.completions[dateString];
                    const isToday = dateString === new Date().toDateString();
                    
                    return (
                      <motion.div
                        key={dateString}
                        className={`week-completion-cell ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => toggleHabit(habit.id, dateString)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ 
                          backgroundColor: isCompleted ? category.color : 'transparent',
                          borderColor: category.color 
                        }}
                      >
                        {isCompleted && <Check size={16} color="white" />}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Today view (default)
  const stats = getOverallStats();
  
  return (
    <div className="habit-container">
      <motion.div 
        className="habit-tracker"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="habit-header">
          <Target size={48} className="habit-icon" />
          <h2>Daily Habit Tracker</h2>
          <p>Build positive habits that support your mental health and wellbeing</p>
        </div>

        <div className="habit-summary">
          <div className="summary-card">
            <h4>Today's Progress</h4>
            <div className="progress-circle">
              <div className="progress-value">{stats.completionRate}%</div>
              <div className="progress-label">{stats.todayCompletions}/{stats.totalHabits} completed</div>
            </div>
          </div>
        </div>

        <div className="habit-controls">
          <motion.button
            className="add-habit-btn"
            onClick={() => setShowAddHabit(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add Habit
          </motion.button>

          <motion.button
            className="view-week-btn"
            onClick={() => setViewMode('week')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={20} />
            Week View
          </motion.button>

          <motion.button
            className="view-stats-btn"
            onClick={() => setViewMode('stats')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp size={20} />
            Statistics
          </motion.button>
        </div>

        <div className="habits-list">
          <AnimatePresence>
            {habits.map((habit, index) => {
              const category = habitCategories[habit.category];
              const isCompleted = habit.completions[new Date().toDateString()];
              const streak = getStreakCount(habit);
              
              return (
                <motion.div
                  key={habit.id}
                  className={`habit-card ${isCompleted ? 'completed' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <div className="habit-main">
                    <motion.button
                      className="habit-checkbox"
                      onClick={() => toggleHabit(habit.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ 
                        backgroundColor: isCompleted ? category.color : 'transparent',
                        borderColor: category.color 
                      }}
                    >
                      {isCompleted && <Check size={20} color="white" />}
                    </motion.button>

                    <div className="habit-info">
                      <div className="habit-name">
                        <span className="habit-icon">{habit.icon}</span>
                        <span>{habit.name}</span>
                      </div>
                      <div className="habit-meta">
                        <span className="habit-category" style={{ color: category.color }}>
                          {category.name}
                        </span>
                        {streak > 0 && (
                          <span className="habit-streak">
                            <Flame size={14} />
                            {streak} day streak
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    className="delete-habit-btn"
                    onClick={() => deleteHabit(habit.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={16} />
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {habits.length === 0 && (
            <div className="no-habits">
              <Target size={48} />
              <h3>No habits yet</h3>
              <p>Start building positive habits to support your mental wellbeing</p>
              <motion.button
                className="add-first-habit-btn"
                onClick={() => setShowAddHabit(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Add Your First Habit
              </motion.button>
            </div>
          )}
        </div>

        <div className="habit-tips">
          <h3>💡 Habit Building Tips</h3>
          <ul>
            <li>🎯 Start small - choose habits you can realistically maintain</li>
            <li>⏰ Link new habits to existing routines (habit stacking)</li>
            <li>🔄 Consistency is more important than perfection</li>
            <li>🎉 Celebrate small wins and progress</li>
            <li>📱 Use visual reminders and cues</li>
            <li>🤝 Share your goals with supportive people</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default HabitTracker;