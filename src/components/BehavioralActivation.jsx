import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Star, CheckCircle, RotateCcw, TrendingUp, Heart } from 'lucide-react';

const BehavioralActivation = () => {
  const [currentView, setCurrentView] = useState('schedule'); // 'schedule', 'add', 'tracking'
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('behavioralActivities');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: 'pleasant',
    scheduledTime: '',
    date: new Date().toISOString().split('T')[0],
    anticipatedMood: 5,
    actualMood: null,
    completed: false
  });

  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem('behavioralWeeklyData');
    return saved ? JSON.parse(saved) : {};
  });

  const activitySuggestions = {
    pleasant: [
      'Take a warm bath', 'Listen to favorite music', 'Watch a funny movie', 'Call a friend',
      'Go for a nature walk', 'Practice a hobby', 'Read a good book', 'Cook a favorite meal',
      'Dance to music', 'Pet an animal', 'Look at photos', 'Garden', 'Draw or paint',
      'Play a game', 'Visit a park', 'Take photos', 'Stretch or yoga', 'Enjoy a hot drink'
    ],
    social: [
      'Meet a friend for coffee', 'Video call family', 'Join a group activity', 'Write a letter',
      'Plan an outing with friends', 'Attend a community event', 'Volunteer', 'Join a club',
      'Have a meal with others', 'Play board games', 'Attend a workshop', 'Go to a movie',
      'Visit a museum with someone', 'Take a class', 'Help a neighbor', 'Go to a concert'
    ],
    productive: [
      'Organize a space', 'Learn something new', 'Complete a project', 'Set goals',
      'Plan future activities', 'Update resume', 'Research interests', 'Write in journal',
      'Practice a skill', 'Clean and organize', 'Do online course', 'Create something',
      'Make a to-do list', 'Plan a trip', 'Work on personal growth', 'Budget finances'
    ],
    physical: [
      'Go for a walk', 'Do gentle exercise', 'Practice yoga', 'Stretch', 'Dance',
      'Swim', 'Bike ride', 'Play sports', 'Hiking', 'Tai chi', 'Rock climbing',
      'Martial arts', 'Tennis', 'Basketball', 'Soccer', 'Volleyball', 'Running', 'Weightlifting'
    ]
  };

  const categoryColors = {
    pleasant: '#48bb78',
    social: '#ed64a6',
    productive: '#4299e1',
    physical: '#ed8936'
  };

  const categoryIcons = {
    pleasant: Heart,
    social: Users,
    productive: TrendingUp,
    physical: Star
  };

  useEffect(() => {
    localStorage.setItem('behavioralActivities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('behavioralWeeklyData', JSON.stringify(weeklyData));
  }, [weeklyData]);

  const addActivity = () => {
    if (!newActivity.name.trim()) return;

    const activity = {
      ...newActivity,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    setActivities(prev => [...prev, activity]);
    setNewActivity({
      name: '',
      category: 'pleasant',
      scheduledTime: '',
      date: new Date().toISOString().split('T')[0],
      anticipatedMood: 5,
      actualMood: null,
      completed: false
    });
    setCurrentView('schedule');
  };

  const completeActivity = (id, actualMood) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id 
        ? { ...activity, completed: true, actualMood, completedAt: new Date().toISOString() }
        : activity
    ));

    // Update weekly data for tracking
    const today = new Date().toISOString().split('T')[0];
    setWeeklyData(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        activitiesCompleted: (prev[today]?.activitiesCompleted || 0) + 1,
        averageMood: actualMood
      }
    }));
  };

  const getTodaysActivities = () => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(activity => activity.date === today);
  };

  const getWeekActivities = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDays.push(day.toISOString().split('T')[0]);
    }

    return weekDays.map(date => ({
      date,
      activities: activities.filter(activity => activity.date === date),
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    }));
  };

  const getRandomSuggestion = (category) => {
    const suggestions = activitySuggestions[category];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  if (currentView === 'add') {
    return (
      <div className="behavioral-activation-container">
        <motion.div 
          className="activation-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Calendar size={32} className="header-icon" />
          <div>
            <h2>Schedule Pleasant Activity</h2>
            <p>Plan activities that boost your mood and energy</p>
          </div>
        </motion.div>

        <motion.div 
          className="add-activity-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="form-group">
            <label>Activity Name</label>
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
              placeholder="What would you like to do?"
              className="activity-input"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-selector">
              {Object.entries(categoryColors).map(([category, color]) => {
                const IconComponent = categoryIcons[category];
                return (
                  <motion.button
                    key={category}
                    className={`category-option ${newActivity.category === category ? 'selected' : ''}`}
                    style={{ borderColor: color }}
                    onClick={() => setNewActivity(prev => ({ ...prev, category }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={20} style={{ color }} />
                    <span>{category}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="suggestions-section">
            <h4>Need ideas? Try these {newActivity.category} activities:</h4>
            <div className="suggestions-grid">
              {activitySuggestions[newActivity.category].slice(0, 6).map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="suggestion-button"
                  onClick={() => setNewActivity(prev => ({ ...prev, name: suggestion }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                className="date-input"
              />
            </div>
            <div className="form-group">
              <label>Time (optional)</label>
              <input
                type="time"
                value={newActivity.scheduledTime}
                onChange={(e) => setNewActivity(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="time-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>How do you expect this activity to make you feel? (1-10)</label>
            <div className="mood-slider">
              <span>😟</span>
              <input
                type="range"
                min="1"
                max="10"
                value={newActivity.anticipatedMood}
                onChange={(e) => setNewActivity(prev => ({ ...prev, anticipatedMood: parseInt(e.target.value) }))}
                className="slider"
              />
              <span>😊</span>
              <div className="mood-value">{newActivity.anticipatedMood}</div>
            </div>
          </div>

          <div className="form-actions">
            <motion.button
              className="action-button secondary"
              onClick={() => setCurrentView('schedule')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="action-button primary"
              onClick={addActivity}
              disabled={!newActivity.name.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Schedule Activity
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (currentView === 'tracking') {
    const weekActivities = getWeekActivities();
    const totalCompleted = activities.filter(a => a.completed).length;
    const avgMoodImprovement = activities
      .filter(a => a.completed && a.actualMood && a.anticipatedMood)
      .reduce((acc, a) => acc + (a.actualMood - a.anticipatedMood), 0) / 
      Math.max(1, activities.filter(a => a.completed && a.actualMood && a.anticipatedMood).length);

    return (
      <div className="behavioral-activation-container">
        <motion.div 
          className="activation-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TrendingUp size={32} className="header-icon" />
          <div>
            <h2>Progress Tracking</h2>
            <p>See how activities affect your mood and energy</p>
          </div>
        </motion.div>

        <div className="tracking-content">
          <div className="stats-overview">
            <div className="stat-card">
              <h3>Activities Completed</h3>
              <div className="stat-number">{totalCompleted}</div>
            </div>
            <div className="stat-card">
              <h3>Avg Mood Improvement</h3>
              <div className="stat-number">
                {avgMoodImprovement > 0 ? '+' : ''}{avgMoodImprovement.toFixed(1)}
              </div>
            </div>
            <div className="stat-card">
              <h3>This Week</h3>
              <div className="stat-number">
                {weekActivities.reduce((sum, day) => sum + day.activities.filter(a => a.completed).length, 0)}
              </div>
            </div>
          </div>

          <div className="week-view">
            <h3>This Week's Activities</h3>
            <div className="week-grid">
              {weekActivities.map((day) => (
                <div key={day.date} className="day-column">
                  <h4>{day.dayName}</h4>
                  <div className="day-date">{new Date(day.date).getDate()}</div>
                  <div className="day-activities">
                    {day.activities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className={`mini-activity ${activity.completed ? 'completed' : 'pending'}`}
                        style={{ borderColor: categoryColors[activity.category] }}
                      >
                        <div className="activity-name">{activity.name}</div>
                        {activity.completed && (
                          <div className="mood-badge">
                            {activity.actualMood}/10
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            className="action-button primary"
            onClick={() => setCurrentView('schedule')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Schedule
          </motion.button>
        </div>
      </div>
    );
  }

  // Main schedule view
  const todaysActivities = getTodaysActivities();
  const pendingActivities = todaysActivities.filter(a => !a.completed);
  const completedActivities = todaysActivities.filter(a => a.completed);

  return (
    <div className="behavioral-activation-container">
      <motion.div 
        className="activation-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Calendar size={32} className="header-icon" />
        <div>
          <h2>Behavioral Activation</h2>
          <p>Schedule pleasant activities to improve your mood and energy</p>
        </div>
      </motion.div>

      <div className="activation-nav">
        <motion.button
          className="nav-button primary"
          onClick={() => setCurrentView('add')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add Activity
        </motion.button>
        <motion.button
          className="nav-button secondary"
          onClick={() => setCurrentView('tracking')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp size={20} />
          View Progress
        </motion.button>
      </div>

      <div className="todays-schedule">
        <h3>Today's Activities</h3>
        
        {pendingActivities.length > 0 && (
          <div className="activities-section">
            <h4>Planned ({pendingActivities.length})</h4>
            <div className="activities-list">
              {pendingActivities.map((activity) => {
                const IconComponent = categoryIcons[activity.category];
                return (
                  <motion.div
                    key={activity.id}
                    className="activity-card pending"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="activity-info">
                      <div className="activity-header">
                        <IconComponent 
                          size={20} 
                          style={{ color: categoryColors[activity.category] }} 
                        />
                        <h5>{activity.name}</h5>
                        {activity.scheduledTime && (
                          <span className="scheduled-time">{activity.scheduledTime}</span>
                        )}
                      </div>
                      <div className="activity-meta">
                        <span className="category-badge" style={{ backgroundColor: categoryColors[activity.category] }}>
                          {activity.category}
                        </span>
                        <span className="anticipated-mood">Expected mood: {activity.anticipatedMood}/10</span>
                      </div>
                    </div>
                    
                    <div className="completion-section">
                      <p>How did this activity make you feel?</p>
                      <div className="mood-completion">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                          <motion.button
                            key={mood}
                            className="mood-button"
                            onClick={() => completeActivity(activity.id, mood)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {mood}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {completedActivities.length > 0 && (
          <div className="activities-section">
            <h4>Completed ({completedActivities.length})</h4>
            <div className="activities-list">
              {completedActivities.map((activity) => {
                const IconComponent = categoryIcons[activity.category];
                const moodImprovement = activity.actualMood - activity.anticipatedMood;
                return (
                  <motion.div
                    key={activity.id}
                    className="activity-card completed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="activity-info">
                      <div className="activity-header">
                        <CheckCircle size={20} style={{ color: '#48bb78' }} />
                        <h5>{activity.name}</h5>
                        <span className="completion-time">
                          {new Date(activity.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="activity-meta">
                        <span className="mood-result">
                          Mood: {activity.actualMood}/10
                          {moodImprovement !== 0 && (
                            <span className={`mood-change ${moodImprovement > 0 ? 'positive' : 'negative'}`}>
                              ({moodImprovement > 0 ? '+' : ''}{moodImprovement})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {todaysActivities.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Calendar size={48} className="empty-icon" />
            <h4>No activities scheduled for today</h4>
            <p>Start by adding some pleasant activities to boost your mood!</p>
            <motion.button
              className="action-button primary"
              onClick={() => setCurrentView('add')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Schedule Your First Activity
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BehavioralActivation;