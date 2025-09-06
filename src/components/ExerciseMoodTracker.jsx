import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus, TrendingUp, Calendar, Star, BarChart3 } from 'lucide-react';

const ExerciseMoodTracker = () => {
  const [currentView, setCurrentView] = useState('log'); // 'log', 'insights', 'add'
  const [exerciseEntries, setExerciseEntries] = useState(() => {
    const saved = localStorage.getItem('exerciseMoodEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [newEntry, setNewEntry] = useState({
    activity: '',
    duration: 15,
    intensity: 'moderate',
    preMood: 5,
    postMood: 5,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ''
  });

  const exerciseTypes = [
    { name: 'Walking', icon: '🚶', category: 'cardio' },
    { name: 'Running', icon: '🏃', category: 'cardio' },
    { name: 'Yoga', icon: '🧘', category: 'mindful' },
    { name: 'Stretching', icon: '🤸', category: 'mindful' },
    { name: 'Cycling', icon: '🚴', category: 'cardio' },
    { name: 'Swimming', icon: '🏊', category: 'cardio' },
    { name: 'Dancing', icon: '💃', category: 'fun' },
    { name: 'Hiking', icon: '🥾', category: 'outdoor' },
    { name: 'Weight Training', icon: '🏋️', category: 'strength' },
    { name: 'Sports', icon: '⚽', category: 'fun' },
    { name: 'Tai Chi', icon: '🕴️', category: 'mindful' },
    { name: 'Pilates', icon: '🤸', category: 'strength' },
    { name: 'Rock Climbing', icon: '🧗', category: 'adventure' },
    { name: 'Martial Arts', icon: '🥋', category: 'strength' },
    { name: 'Gardening', icon: '🌱', category: 'outdoor' },
    { name: 'Cleaning', icon: '🧹', category: 'daily' }
  ];

  const intensityLevels = [
    { value: 'light', label: 'Light', description: 'Easy pace, can sing while doing it', color: '#48bb78' },
    { value: 'moderate', label: 'Moderate', description: 'Somewhat hard, can talk but not sing', color: '#ed8936' },
    { value: 'vigorous', label: 'Vigorous', description: 'Hard, difficult to speak in full sentences', color: '#e53e3e' }
  ];

  useEffect(() => {
    localStorage.setItem('exerciseMoodEntries', JSON.stringify(exerciseEntries));
  }, [exerciseEntries]);

  const addEntry = () => {
    if (!newEntry.activity.trim()) return;

    const entry = {
      ...newEntry,
      id: Date.now(),
      moodImprovement: newEntry.postMood - newEntry.preMood,
      createdAt: new Date().toISOString()
    };

    setExerciseEntries(prev => [entry, ...prev]);
    setNewEntry({
      activity: '',
      duration: 15,
      intensity: 'moderate',
      preMood: 5,
      postMood: 5,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: ''
    });
    setCurrentView('log');
  };

  const getMoodEmoji = (mood) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😕';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const getInsights = () => {
    if (exerciseEntries.length === 0) return null;

    const recentEntries = exerciseEntries.slice(0, 30); // Last 30 entries
    const avgMoodImprovement = recentEntries.reduce((sum, entry) => sum + entry.moodImprovement, 0) / recentEntries.length;
    
    // Find best performing activities
    const activityStats = {};
    recentEntries.forEach(entry => {
      if (!activityStats[entry.activity]) {
        activityStats[entry.activity] = { count: 0, totalImprovement: 0, totalDuration: 0 };
      }
      activityStats[entry.activity].count++;
      activityStats[entry.activity].totalImprovement += entry.moodImprovement;
      activityStats[entry.activity].totalDuration += entry.duration;
    });

    const bestActivity = Object.entries(activityStats)
      .map(([activity, stats]) => ({
        activity,
        avgImprovement: stats.totalImprovement / stats.count,
        count: stats.count
      }))
      .filter(item => item.count >= 2) // At least 2 sessions
      .sort((a, b) => b.avgImprovement - a.avgImprovement)[0];

    // Check consistency
    const last7Days = recentEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const uniqueDays = new Set(last7Days.map(entry => entry.date)).size;

    return {
      avgMoodImprovement,
      bestActivity,
      weeklyConsistency: uniqueDays,
      totalSessions: recentEntries.length,
      totalMinutes: recentEntries.reduce((sum, entry) => sum + entry.duration, 0)
    };
  };

  const insights = getInsights();

  if (currentView === 'add') {
    return (
      <div className="exercise-mood-container">
        <motion.div 
          className="tracker-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Activity size={32} className="header-icon" />
          <div>
            <h2>Log Exercise Session</h2>
            <p>Track how physical activity affects your mood</p>
          </div>
        </motion.div>

        <motion.div 
          className="add-entry-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="form-section">
            <h3>Activity</h3>
            <div className="activity-selector">
              {exerciseTypes.map((exercise) => (
                <motion.button
                  key={exercise.name}
                  className={`activity-option ${newEntry.activity === exercise.name ? 'selected' : ''}`}
                  onClick={() => setNewEntry(prev => ({ ...prev, activity: exercise.name }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="activity-icon">{exercise.icon}</span>
                  <span className="activity-name">{exercise.name}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="custom-activity">
              <input
                type="text"
                placeholder="Or enter custom activity..."
                value={newEntry.activity}
                onChange={(e) => setNewEntry(prev => ({ ...prev, activity: e.target.value }))}
                className="custom-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Duration & Intensity</h3>
            <div className="duration-intensity">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={newEntry.duration}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="duration-input"
                />
              </div>
              
              <div className="form-group">
                <label>Intensity</label>
                <div className="intensity-options">
                  {intensityLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      className={`intensity-option ${newEntry.intensity === level.value ? 'selected' : ''}`}
                      style={{ borderColor: level.color }}
                      onClick={() => setNewEntry(prev => ({ ...prev, intensity: level.value }))}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="intensity-label">{level.label}</div>
                      <div className="intensity-description">{level.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Mood Before & After</h3>
            <div className="mood-section">
              <div className="mood-group">
                <label>Mood Before Exercise (1-10)</label>
                <div className="mood-slider">
                  <span className="mood-emoji">{getMoodEmoji(newEntry.preMood)}</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.preMood}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, preMood: parseInt(e.target.value) }))}
                    className="slider"
                  />
                  <span className="mood-value">{newEntry.preMood}</span>
                </div>
              </div>

              <div className="mood-group">
                <label>Mood After Exercise (1-10)</label>
                <div className="mood-slider">
                  <span className="mood-emoji">{getMoodEmoji(newEntry.postMood)}</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.postMood}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, postMood: parseInt(e.target.value) }))}
                    className="slider"
                  />
                  <span className="mood-value">{newEntry.postMood}</span>
                </div>
              </div>

              {newEntry.postMood !== newEntry.preMood && (
                <div className="mood-change-preview">
                  <span className={`mood-change ${newEntry.postMood > newEntry.preMood ? 'positive' : 'negative'}`}>
                    {newEntry.postMood > newEntry.preMood ? '+' : ''}
                    {newEntry.postMood - newEntry.preMood} mood change
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>When & Notes</h3>
            <div className="datetime-section">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="date-input"
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newEntry.time}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
                  className="time-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={newEntry.notes}
                onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How did you feel? What went well? Any observations..."
                className="notes-textarea"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <motion.button
              className="action-button secondary"
              onClick={() => setCurrentView('log')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="action-button primary"
              onClick={addEntry}
              disabled={!newEntry.activity.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Log Session
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (currentView === 'insights') {
    return (
      <div className="exercise-mood-container">
        <motion.div 
          className="tracker-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BarChart3 size={32} className="header-icon" />
          <div>
            <h2>Exercise Insights</h2>
            <p>Discover patterns in how exercise affects your mood</p>
          </div>
        </motion.div>

        {insights ? (
          <div className="insights-content">
            <div className="insights-grid">
              <motion.div 
                className="insight-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TrendingUp size={24} className="insight-icon" />
                <h3>Average Mood Boost</h3>
                <div className="insight-value positive">
                  +{insights.avgMoodImprovement.toFixed(1)} points
                </div>
                <p>On average, exercise improves your mood</p>
              </motion.div>

              {insights.bestActivity && (
                <motion.div 
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Star size={24} className="insight-icon" />
                  <h3>Your Best Activity</h3>
                  <div className="insight-value">{insights.bestActivity.activity}</div>
                  <p>+{insights.bestActivity.avgImprovement.toFixed(1)} avg mood boost</p>
                </motion.div>
              )}

              <motion.div 
                className="insight-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar size={24} className="insight-icon" />
                <h3>Weekly Consistency</h3>
                <div className="insight-value">{insights.weeklyConsistency}/7 days</div>
                <p>Active days this week</p>
              </motion.div>

              <motion.div 
                className="insight-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Activity size={24} className="insight-icon" />
                <h3>Total Activity Time</h3>
                <div className="insight-value">{Math.round(insights.totalMinutes / 60)}h {insights.totalMinutes % 60}m</div>
                <p>From {insights.totalSessions} sessions</p>
              </motion.div>
            </div>

            <motion.div 
              className="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Personalized Recommendations</h3>
              <div className="recommendations-list">
                {insights.avgMoodImprovement > 1 && (
                  <div className="recommendation positive">
                    <div className="rec-icon">💪</div>
                    <div className="rec-content">
                      <h4>Keep up the great work!</h4>
                      <p>Exercise is consistently boosting your mood. Try to maintain this positive pattern.</p>
                    </div>
                  </div>
                )}
                
                {insights.weeklyConsistency < 3 && (
                  <div className="recommendation">
                    <div className="rec-icon">📅</div>
                    <div className="rec-content">
                      <h4>Try for more consistency</h4>
                      <p>Aim for at least 3-4 active days per week for maximum mood benefits.</p>
                    </div>
                  </div>
                )}

                {insights.bestActivity && insights.bestActivity.avgImprovement > 2 && (
                  <div className="recommendation positive">
                    <div className="rec-icon">⭐</div>
                    <div className="rec-content">
                      <h4>Your mood booster: {insights.bestActivity.activity}</h4>
                      <p>This activity gives you the biggest mood lift. Consider doing it more often!</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="empty-insights">
            <Activity size={48} className="empty-icon" />
            <h3>No data yet</h3>
            <p>Log a few exercise sessions to see your personalized insights!</p>
            <motion.button
              className="action-button primary"
              onClick={() => setCurrentView('add')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Log Your First Session
            </motion.button>
          </div>
        )}

        <motion.button
          className="action-button secondary"
          onClick={() => setCurrentView('log')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Log
        </motion.button>
      </div>
    );
  }

  // Main log view
  return (
    <div className="exercise-mood-container">
      <motion.div 
        className="tracker-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Activity size={32} className="header-icon" />
        <div>
          <h2>Exercise-Mood Tracker</h2>
          <p>Track how physical activity affects your mental wellbeing</p>
        </div>
      </motion.div>

      <div className="tracker-nav">
        <motion.button
          className="nav-button primary"
          onClick={() => setCurrentView('add')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Log Session
        </motion.button>
        <motion.button
          className="nav-button secondary"
          onClick={() => setCurrentView('insights')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BarChart3 size={20} />
          View Insights
        </motion.button>
      </div>

      <div className="entries-list">
        {exerciseEntries.length > 0 ? (
          <>
            <h3>Recent Sessions</h3>
            <div className="entries-grid">
              {exerciseEntries.slice(0, 10).map((entry) => (
                <motion.div
                  key={entry.id}
                  className="entry-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="entry-header">
                    <h4>{entry.activity}</h4>
                    <span className="entry-date">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="entry-details">
                    <span className="duration">{entry.duration} min</span>
                    <span className="intensity" style={{ color: intensityLevels.find(l => l.value === entry.intensity)?.color }}>
                      {entry.intensity}
                    </span>
                  </div>

                  <div className="mood-change">
                    <div className="mood-before-after">
                      <span>{getMoodEmoji(entry.preMood)} {entry.preMood}</span>
                      <span>→</span>
                      <span>{getMoodEmoji(entry.postMood)} {entry.postMood}</span>
                    </div>
                    <div className={`mood-improvement ${entry.moodImprovement >= 0 ? 'positive' : 'negative'}`}>
                      {entry.moodImprovement > 0 ? '+' : ''}{entry.moodImprovement}
                    </div>
                  </div>

                  {entry.notes && (
                    <p className="entry-notes">{entry.notes}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Activity size={48} className="empty-icon" />
            <h3>Start tracking your exercise and mood</h3>
            <p>Log your first session to see how physical activity affects your wellbeing!</p>
            <motion.button
              className="action-button primary"
              onClick={() => setCurrentView('add')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Log Your First Session
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExerciseMoodTracker;