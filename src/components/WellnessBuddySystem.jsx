import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, CheckCircle, Calendar, Star, Trophy, RefreshCw, Clock } from 'lucide-react';

const WellnessBuddySystem = () => {
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'create', 'join', 'buddy'
  const [buddyConnection, setBuddyConnection] = useState(() => {
    const saved = localStorage.getItem('wellnessBuddy');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [sharedGoals, setSharedGoals] = useState(() => {
    const saved = localStorage.getItem('buddySharedGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [checkIns, setCheckIns] = useState(() => {
    const saved = localStorage.getItem('buddyCheckIns');
    return saved ? JSON.parse(saved) : [];
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness',
    targetDays: 7,
    dailyTarget: ''
  });

  const [todayCheckIn, setTodayCheckIn] = useState({
    mood: 5,
    completed: false,
    note: '',
    goals: {}
  });

  const goalCategories = [
    { id: 'wellness', label: 'General Wellness', icon: '🌟', color: '#4299e1' },
    { id: 'exercise', label: 'Physical Activity', icon: '🏃', color: '#48bb78' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: '#9f7aea' },
    { id: 'sleep', label: 'Sleep', icon: '😴', color: '#805ad5' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗', color: '#38a169' },
    { id: 'social', label: 'Social Connection', icon: '👥', color: '#ed64a6' },
    { id: 'learning', label: 'Learning & Growth', icon: '📚', color: '#ed8936' },
    { id: 'creativity', label: 'Creativity', icon: '🎨', color: '#d69e2e' }
  ];

  const wellnessGoalTemplates = [
    {
      category: 'exercise',
      title: 'Daily Movement',
      description: 'Get at least 30 minutes of physical activity',
      dailyTarget: '30 minutes of movement'
    },
    {
      category: 'mindfulness',
      title: 'Meditation Practice',
      description: 'Practice mindfulness or meditation daily',
      dailyTarget: '10 minutes of meditation'
    },
    {
      category: 'sleep',
      title: 'Consistent Sleep Schedule',
      description: 'Go to bed and wake up at consistent times',
      dailyTarget: 'Sleep by 10:30 PM'
    },
    {
      category: 'wellness',
      title: 'Gratitude Practice',
      description: 'Write down 3 things you\'re grateful for each day',
      dailyTarget: 'List 3 gratitudes'
    },
    {
      category: 'social',
      title: 'Social Connection',
      description: 'Reach out to at least one person each day',
      dailyTarget: 'Connect with someone'
    },
    {
      category: 'nutrition',
      title: 'Hydration Goal',
      description: 'Drink adequate water throughout the day',
      dailyTarget: '8 glasses of water'
    }
  ];

  useEffect(() => {
    localStorage.setItem('wellnessBuddy', JSON.stringify(buddyConnection));
  }, [buddyConnection]);

  useEffect(() => {
    localStorage.setItem('buddySharedGoals', JSON.stringify(sharedGoals));
  }, [sharedGoals]);

  useEffect(() => {
    localStorage.setItem('buddyCheckIns', JSON.stringify(checkIns));
  }, [checkIns]);

  const createBuddyConnection = () => {
    const connection = {
      id: Date.now(),
      buddyName: 'Alex', // Simulated buddy
      avatar: '🌟',
      connectionDate: new Date().toISOString(),
      streak: 0,
      totalCheckIns: 0
    };
    setBuddyConnection(connection);
    setCurrentView('buddy');
  };

  const addSharedGoal = (template = null) => {
    const goalData = template || newGoal;
    if (!goalData.title.trim()) return;

    const goal = {
      id: Date.now(),
      ...goalData,
      createdDate: new Date().toISOString(),
      progress: [],
      myStreak: 0,
      buddyStreak: 0,
      active: true
    };

    setSharedGoals(prev => [...prev, goal]);
    
    if (!template) {
      setNewGoal({
        title: '',
        description: '',
        category: 'wellness',
        targetDays: 7,
        dailyTarget: ''
      });
    }
    
    setCurrentView('buddy');
  };

  const submitDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const checkIn = {
      id: Date.now(),
      date: today,
      ...todayCheckIn,
      goals: Object.fromEntries(
        sharedGoals.map(goal => [goal.id, todayCheckIn.goals[goal.id] || false])
      ),
      submittedAt: new Date().toISOString()
    };

    setCheckIns(prev => [checkIn, ...prev]);
    
    // Update buddy connection
    if (buddyConnection) {
      setBuddyConnection(prev => ({
        ...prev,
        totalCheckIns: prev.totalCheckIns + 1,
        streak: prev.streak + 1
      }));
    }

    // Reset today's check-in
    setTodayCheckIn({
      mood: 5,
      completed: true,
      note: '',
      goals: {}
    });
  };

  const getGoalCategory = (categoryId) => {
    return goalCategories.find(cat => cat.id === categoryId);
  };

  const getTodaysCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(checkIn => checkIn.date === today);
  };

  const getBuddySimulatedData = () => {
    // Simulate buddy data for demo purposes
    return {
      todayMood: Math.floor(Math.random() * 4) + 6, // 6-9 range
      checkInCompleted: Math.random() > 0.3, // 70% chance
      goalCompletion: sharedGoals.map(goal => ({
        goalId: goal.id,
        completed: Math.random() > 0.4 // 60% completion rate
      }))
    };
  };

  const getStreakInfo = () => {
    if (checkIns.length === 0) return { current: 0, best: 0 };
    
    const sortedCheckIns = checkIns.sort((a, b) => new Date(b.date) - new Date(a.date));
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    let currentDate = new Date();
    for (let checkIn of sortedCheckIns) {
      const checkInDate = new Date(checkIn.date);
      const daysDiff = Math.floor((currentDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === currentStreak) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    tempStreak = 0;
    for (let i = 0; i < sortedCheckIns.length; i++) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
      
      if (i < sortedCheckIns.length - 1) {
        const current = new Date(sortedCheckIns[i].date);
        const next = new Date(sortedCheckIns[i + 1].date);
        const daysDiff = Math.floor((current - next) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) {
          tempStreak = 0;
        }
      }
    }

    return { current: currentStreak, best: bestStreak };
  };

  if (currentView === 'create') {
    return (
      <div className="buddy-system-container">
        <motion.div 
          className="buddy-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Target size={32} className="header-icon" />
          <div>
            <h2>Create Shared Goal</h2>
            <p>Set a wellness goal to work on together with your buddy</p>
          </div>
        </motion.div>

        <div className="create-goal-content">
          <div className="goal-templates">
            <h3>Quick Start Templates</h3>
            <div className="templates-grid">
              {wellnessGoalTemplates.map((template, index) => {
                const category = getGoalCategory(template.category);
                return (
                  <motion.div
                    key={index}
                    className="template-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => addSharedGoal(template)}
                  >
                    <div className="template-icon" style={{ color: category.color }}>
                      {category.icon}
                    </div>
                    <h4>{template.title}</h4>
                    <p>{template.description}</p>
                    <div className="template-target">{template.dailyTarget}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="custom-goal-form">
            <h3>Or Create Custom Goal</h3>
            
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What do you want to achieve together?"
                className="goal-input"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal and why it matters..."
                className="goal-textarea"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="category-select"
                >
                  {goalCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={newGoal.targetDays}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDays: parseInt(e.target.value) }))}
                  className="duration-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Daily Target</label>
              <input
                type="text"
                value={newGoal.dailyTarget}
                onChange={(e) => setNewGoal(prev => ({ ...prev, dailyTarget: e.target.value }))}
                placeholder="What needs to be done each day?"
                className="target-input"
              />
            </div>

            <div className="form-actions">
              <motion.button
                className="action-button secondary"
                onClick={() => setCurrentView('buddy')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="action-button primary"
                onClick={() => addSharedGoal()}
                disabled={!newGoal.title.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Goal
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'buddy' && buddyConnection) {
    const todaysCheckIn = getTodaysCheckIn();
    const buddyData = getBuddySimulatedData();
    const streakInfo = getStreakInfo();

    return (
      <div className="buddy-system-container">
        <motion.div 
          className="buddy-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Users size={32} className="header-icon" />
          <div>
            <h2>Wellness Buddy Dashboard</h2>
            <p>Stay accountable and motivated together</p>
          </div>
        </motion.div>

        <div className="buddy-overview">
          <div className="buddy-info-card">
            <div className="buddy-avatar">{buddyConnection.avatar}</div>
            <div className="buddy-details">
              <h3>Your Buddy: {buddyConnection.buddyName}</h3>
              <div className="buddy-stats">
                <span>🔥 {streakInfo.current} day streak</span>
                <span>📅 {buddyConnection.totalCheckIns} check-ins</span>
              </div>
            </div>
          </div>

          <div className="streak-display">
            <div className="streak-item">
              <h4>Current Streak</h4>
              <div className="streak-number">{streakInfo.current}</div>
              <span>days</span>
            </div>
            <div className="streak-item">
              <h4>Best Streak</h4>
              <div className="streak-number">{streakInfo.best}</div>
              <span>days</span>
            </div>
          </div>
        </div>

        {!todaysCheckIn && (
          <motion.div 
            className="daily-checkin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Today's Check-In</h3>
            
            <div className="checkin-mood">
              <label>How are you feeling today? (1-10)</label>
              <div className="mood-slider">
                <span>😢</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={todayCheckIn.mood}
                  onChange={(e) => setTodayCheckIn(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                  className="slider"
                />
                <span>😊</span>
                <div className="mood-value">{todayCheckIn.mood}</div>
              </div>
            </div>

            {sharedGoals.length > 0 && (
              <div className="goals-checkin">
                <h4>Today's Goals</h4>
                <div className="goals-list">
                  {sharedGoals.map(goal => {
                    const category = getGoalCategory(goal.category);
                    return (
                      <div key={goal.id} className="goal-checkin-item">
                        <div className="goal-info">
                          <span className="goal-icon" style={{ color: category.color }}>
                            {category.icon}
                          </span>
                          <div>
                            <div className="goal-title">{goal.title}</div>
                            <div className="goal-target">{goal.dailyTarget}</div>
                          </div>
                        </div>
                        <motion.button
                          className={`goal-check ${todayCheckIn.goals[goal.id] ? 'completed' : ''}`}
                          onClick={() => setTodayCheckIn(prev => ({
                            ...prev,
                            goals: {
                              ...prev.goals,
                              [goal.id]: !prev.goals[goal.id]
                            }
                          }))}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CheckCircle size={20} />
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="checkin-note">
              <label>Note for your buddy (optional)</label>
              <textarea
                value={todayCheckIn.note}
                onChange={(e) => setTodayCheckIn(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Share how your day went, any wins, or challenges..."
                className="note-textarea"
                rows="3"
              />
            </div>

            <motion.button
              className="checkin-submit"
              onClick={submitDailyCheckIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={20} />
              Submit Check-In
            </motion.button>
          </motion.div>
        )}

        <div className="buddy-status">
          <h3>Buddy Status</h3>
          <div className="status-grid">
            <div className="status-card">
              <h4>{buddyConnection.buddyName}'s Mood</h4>
              <div className="buddy-mood">
                <span className="mood-emoji">
                  {buddyData.todayMood <= 4 ? '😕' : 
                   buddyData.todayMood <= 7 ? '🙂' : '😊'}
                </span>
                <span>{buddyData.todayMood}/10</span>
              </div>
            </div>
            
            <div className="status-card">
              <h4>Check-In Status</h4>
              <div className="checkin-status">
                {buddyData.checkInCompleted ? (
                  <><CheckCircle size={20} color="#48bb78" /> Completed</>
                ) : (
                  <><Clock size={20} color="#ed8936" /> Pending</>
                )}
              </div>
            </div>

            {sharedGoals.length > 0 && (
              <div className="status-card">
                <h4>Goal Progress</h4>
                <div className="buddy-goals-status">
                  {buddyData.goalCompletion.map(goalStatus => {
                    const goal = sharedGoals.find(g => g.id === goalStatus.goalId);
                    return (
                      <div key={goalStatus.goalId} className="buddy-goal-item">
                        <span>{goal?.title}</span>
                        {goalStatus.completed ? (
                          <CheckCircle size={16} color="#48bb78" />
                        ) : (
                          <span className="pending-icon">⏳</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shared-goals-section">
          <div className="section-header">
            <h3>Shared Goals</h3>
            <motion.button
              className="add-goal-button"
              onClick={() => setCurrentView('create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target size={16} />
              Add Goal
            </motion.button>
          </div>

          {sharedGoals.length > 0 ? (
            <div className="goals-grid">
              {sharedGoals.map(goal => {
                const category = getGoalCategory(goal.category);
                const completedDays = checkIns.filter(checkIn => 
                  checkIn.goals[goal.id]
                ).length;
                
                return (
                  <div key={goal.id} className="shared-goal-card">
                    <div className="goal-header">
                      <span className="goal-category-icon" style={{ color: category.color }}>
                        {category.icon}
                      </span>
                      <h4>{goal.title}</h4>
                    </div>
                    <p>{goal.description}</p>
                    <div className="goal-progress">
                      <div className="progress-stat">
                        <span>Your Progress</span>
                        <strong>{completedDays}/{goal.targetDays} days</strong>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${(completedDays / goal.targetDays) * 100}%`,
                            backgroundColor: category.color 
                          }}
                        />
                      </div>
                    </div>
                    <div className="goal-target">
                      Daily: {goal.dailyTarget}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-goals">
              <Target size={48} className="empty-icon" />
              <h4>No shared goals yet</h4>
              <p>Create your first goal to start your wellness journey together!</p>
              <motion.button
                className="action-button primary"
                onClick={() => setCurrentView('create')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create First Goal
              </motion.button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main overview / setup view
  return (
    <div className="buddy-system-container">
      <motion.div 
        className="buddy-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Users size={32} className="header-icon" />
        <div>
          <h2>Wellness Buddy System</h2>
          <p>Partner with someone for accountability and mutual support</p>
        </div>
      </motion.div>

      <div className="buddy-intro">
        <motion.div 
          className="intro-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>How the Buddy System Works</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <Target size={24} />
              <h4>Shared Goals</h4>
              <p>Set and track wellness goals together for mutual accountability</p>
            </div>
            <div className="benefit-item">
              <CheckCircle size={24} />
              <h4>Daily Check-ins</h4>
              <p>Share your daily mood and progress with encouraging support</p>
            </div>
            <div className="benefit-item">
              <Trophy size={24} />
              <h4>Celebrate Together</h4>
              <p>Build streaks, celebrate wins, and motivate each other</p>
            </div>
          </div>

          <div className="buddy-features">
            <h4>Features Include:</h4>
            <ul>
              <li>Anonymous pairing for privacy and safety</li>
              <li>Shared goal tracking and progress visualization</li>
              <li>Daily mood and wellness check-ins</li>
              <li>Streak tracking and achievement milestones</li>
              <li>Supportive accountability without judgment</li>
            </ul>
          </div>

          <motion.button
            className="connect-button"
            onClick={createBuddyConnection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={20} />
            Connect with a Wellness Buddy
          </motion.button>

          <div className="demo-note">
            <p>💡 This is a demo version. In the full app, you'd be matched with a real person who shares similar wellness goals and values.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WellnessBuddySystem;