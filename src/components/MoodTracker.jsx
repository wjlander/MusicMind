import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Calendar, Smile, Meh, Frown, Star, Sun } from 'lucide-react';

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [completedToday, setCompletedToday] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState([]);

  const moodLevels = [
    { value: 1, emoji: '😢', color: '#f56565', label: 'Very Low' },
    { value: 2, emoji: '😔', color: '#fd7f48', label: 'Low' },
    { value: 3, emoji: '😐', color: '#fbb040', label: 'Okay' },
    { value: 4, emoji: '🙂', color: '#68d391', label: 'Good' },
    { value: 5, emoji: '😊', color: '#48bb78', label: 'Great' },
    { value: 6, emoji: '😄', color: '#38b2ac', label: 'Excellent' },
    { value: 7, emoji: '🤗', color: '#4299e1', label: 'Amazing' },
    { value: 8, emoji: '😍', color: '#9f7aea', label: 'Euphoric' },
    { value: 9, emoji: '🥰', color: '#ed64a6', label: 'Blissful' },
    { value: 10, emoji: '✨', color: '#ffd700', label: 'Perfect' }
  ];

  const moodFactors = [
    { id: 'sleep', label: 'Good Sleep', icon: '😴' },
    { id: 'exercise', label: 'Exercise', icon: '🏃' },
    { id: 'social', label: 'Social Time', icon: '👥' },
    { id: 'work', label: 'Work Stress', icon: '💼' },
    { id: 'weather', label: 'Nice Weather', icon: '☀️' },
    { id: 'food', label: 'Good Food', icon: '🍎' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'nature', label: 'Time in Nature', icon: '🌳' },
    { id: 'family', label: 'Family Time', icon: '👨‍👩‍👧‍👦' },
    { id: 'accomplishment', label: 'Achievement', icon: '🏆' }
  ];

  useEffect(() => {
    // Load mood history from localStorage
    const saved = localStorage.getItem('mood-history');
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
    
    // Check if mood logged today
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('mood-last-date');
    setCompletedToday(savedDate === today);
  }, []);

  const saveMoodEntry = () => {
    const newEntry = {
      id: Date.now(),
      mood: currentMood,
      note: moodNote.trim(),
      factors: selectedFactors,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    
    const updatedHistory = [newEntry, ...moodHistory.slice(0, 29)]; // Keep last 30 entries
    setMoodHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('mood-history', JSON.stringify(updatedHistory));
    localStorage.setItem('mood-last-date', new Date().toDateString());
    
    setCompletedToday(true);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const toggleFactor = (factorId) => {
    setSelectedFactors(prev => 
      prev.includes(factorId) 
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    );
  };

  const newEntry = () => {
    setCompletedToday(false);
    setCurrentMood(5);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodHistory.length).toFixed(1);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'neutral';
    const recent = moodHistory.slice(0, 3);
    const older = moodHistory.slice(3, 6);
    
    if (recent.length === 0 || older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
    const olderAvg = older.reduce((acc, entry) => acc + entry.mood, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const currentMoodData = moodLevels.find(level => level.value === currentMood);
  const trend = getMoodTrend();

  if (completedToday && moodHistory.length > 0) {
    return (
      <div className="mood-container">
        <motion.div className="mood-complete">
          <Heart size={64} color={currentMoodData.color} />
          <h2>Today's Mood Logged!</h2>
          <p>Thank you for taking time to check in with yourself.</p>
          
          <div className="mood-summary">
            <div className="today-mood">
              <span className="mood-emoji">{moodHistory[0].emoji || currentMoodData.emoji}</span>
              <h3>Today: {currentMoodData.label}</h3>
              {moodHistory[0].note && (
                <p className="mood-note-display">"{moodHistory[0].note}"</p>
              )}
            </div>
          </div>

          <div className="mood-insights">
            <h4>Your Mood Insights</h4>
            <div className="insights-grid">
              <div className="insight-card">
                <TrendingUp size={24} />
                <span>Average Mood</span>
                <strong>{getAverageMood()}/10</strong>
              </div>
              <div className="insight-card">
                <Calendar size={24} />
                <span>Days Tracked</span>
                <strong>{moodHistory.length}</strong>
              </div>
              <div className="insight-card">
                <Star size={24} />
                <span>Trend</span>
                <strong className={`trend-${trend}`}>
                  {trend === 'improving' && '📈 Improving'}
                  {trend === 'declining' && '📉 Needs attention'}
                  {trend === 'stable' && '➡️ Stable'}
                </strong>
              </div>
            </div>
          </div>

          <div className="mood-tips">
            <h4>💡 Wellness Tips</h4>
            <ul>
              <li>🌅 Regular mood tracking helps identify patterns</li>
              <li>💚 Small daily actions can improve mood over time</li>
              <li>🤝 Consider sharing your feelings with someone you trust</li>
              <li>🎯 Focus on factors within your control</li>
            </ul>
          </div>

          <motion.button
            onClick={newEntry}
            className="new-mood-button"
            whileHover={{ scale: 1.05 }}
          >
            Log Another Entry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mood-container">
      <motion.div className="mood-tracker">
        <div className="mood-header">
          <Heart size={48} className="mood-icon" />
          <h2>Daily Mood Check-in</h2>
          <p>How are you feeling today? Taking a moment to recognize your emotions is a powerful wellness practice.</p>
        </div>

        <div className="mood-selector">
          <h3>Rate Your Mood (1-10)</h3>
          <div className="mood-scale">
            {moodLevels.map((level) => (
              <motion.button
                key={level.value}
                className={`mood-level ${currentMood === level.value ? 'active' : ''}`}
                onClick={() => setCurrentMood(level.value)}
                style={{ 
                  borderColor: level.color,
                  backgroundColor: currentMood === level.value ? level.color : 'white',
                  color: currentMood === level.value ? 'white' : level.color
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="mood-emoji">{level.emoji}</span>
                <span className="mood-number">{level.value}</span>
                <span className="mood-label">{level.label}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="current-selection">
            <span className="selected-emoji">{currentMoodData.emoji}</span>
            <span>You're feeling: <strong style={{ color: currentMoodData.color }}>{currentMoodData.label}</strong></span>
          </div>
        </div>

        <div className="mood-factors">
          <h3>What's influencing your mood today? (Optional)</h3>
          <div className="factors-grid">
            {moodFactors.map((factor) => (
              <motion.button
                key={factor.id}
                className={`factor-button ${selectedFactors.includes(factor.id) ? 'selected' : ''}`}
                onClick={() => toggleFactor(factor.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="factor-icon">{factor.icon}</span>
                <span className="factor-label">{factor.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mood-note">
          <h3>Any thoughts or feelings you'd like to note? (Optional)</h3>
          <textarea
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="What's on your mind today? Any specific events, thoughts, or feelings you want to remember..."
            className="mood-textarea"
            rows={4}
          />
        </div>

        <motion.button
          onClick={saveMoodEntry}
          className="save-mood-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={20} />
          Save Today's Mood
        </motion.button>

        {moodHistory.length > 0 && (
          <div className="mood-history-preview">
            <h3>Recent Entries ({moodHistory.length} total)</h3>
            <div className="history-list">
              {moodHistory.slice(0, 5).map((entry) => {
                const moodData = moodLevels.find(level => level.value === entry.mood);
                return (
                  <div key={entry.id} className="history-item">
                    <span className="history-emoji">{moodData.emoji}</span>
                    <div className="history-details">
                      <span className="history-date">{entry.date}</span>
                      <span className="history-mood" style={{ color: moodData.color }}>
                        {moodData.label} ({entry.mood}/10)
                      </span>
                      {entry.note && <span className="history-note">"{entry.note}"</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodTracker;