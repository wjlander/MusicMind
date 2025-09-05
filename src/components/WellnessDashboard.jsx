import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  Target, 
  Award, 
  TrendingUp, 
  Heart,
  Brain,
  Moon,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';

const WellnessDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    streak: 0,
    totalPoints: 0,
    completedToday: [],
    weeklyProgress: [],
    achievements: [],
    moodAverage: 0,
    recentActivities: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load data from localStorage
    const moodHistory = JSON.parse(localStorage.getItem('mood-history') || '[]');
    const gratitudeEntries = JSON.parse(localStorage.getItem('gratitude-entries') || '[]');
    const couplesActivities = JSON.parse(localStorage.getItem('couples-activities') || '[]');
    const breathingSessions = JSON.parse(localStorage.getItem('breathing-sessions') || '[]');
    const meditationSessions = JSON.parse(localStorage.getItem('meditation-sessions') || '[]');
    
    // Calculate wellness points
    const totalPoints = 
      (moodHistory.length * 10) +
      (gratitudeEntries.length * 15) +
      (couplesActivities.length * 20) +
      (breathingSessions.length * 12) +
      (meditationSessions.length * 18);

    // Calculate streak
    const streak = calculateStreak(moodHistory);

    // Calculate mood average
    const moodAverage = moodHistory.length > 0 
      ? (moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length).toFixed(1)
      : 0;

    // Get today's activities
    const today = new Date().toDateString();
    const completedToday = [
      ...moodHistory.filter(entry => new Date(entry.timestamp).toDateString() === today),
      ...gratitudeEntries.filter(entry => new Date(entry.timestamp).toDateString() === today),
      ...couplesActivities.filter(entry => new Date(entry.completedAt).toDateString() === today)
    ];

    // Calculate achievements
    const achievements = calculateAchievements(moodHistory, gratitudeEntries, couplesActivities, totalPoints, streak);

    setDashboardData({
      streak,
      totalPoints,
      completedToday: completedToday.length,
      moodAverage,
      achievements,
      recentActivities: [...moodHistory, ...gratitudeEntries, ...couplesActivities]
        .sort((a, b) => new Date(b.timestamp || b.completedAt) - new Date(a.timestamp || a.completedAt))
        .slice(0, 10)
    });
  };

  const calculateStreak = (moodHistory) => {
    if (moodHistory.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Check consecutive days starting from today
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today - (i * oneDay));
      const hasEntry = moodHistory.some(entry => 
        new Date(entry.timestamp).toDateString() === checkDate.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break; // Break streak if we skip a day (but not today)
      }
    }
    
    return streak;
  };

  const calculateAchievements = (mood, gratitude, couples, points, streak) => {
    const achievements = [];
    
    // Streak achievements
    if (streak >= 3) achievements.push({ id: 'streak3', name: 'Getting Started', description: '3 day streak!', icon: '🔥', color: '#f56565' });
    if (streak >= 7) achievements.push({ id: 'streak7', name: 'Weekly Warrior', description: '7 day streak!', icon: '⭐', color: '#ed8936' });
    if (streak >= 30) achievements.push({ id: 'streak30', name: 'Consistency Champion', description: '30 day streak!', icon: '🏆', color: '#ffd700' });
    
    // Points achievements
    if (points >= 100) achievements.push({ id: 'points100', name: 'Wellness Explorer', description: '100 wellness points!', icon: '💎', color: '#38b2ac' });
    if (points >= 500) achievements.push({ id: 'points500', name: 'Wellness Advocate', description: '500 wellness points!', icon: '🌟', color: '#9f7aea' });
    
    // Activity achievements
    if (mood.length >= 10) achievements.push({ id: 'mood10', name: 'Mood Master', description: '10 mood check-ins!', icon: '😊', color: '#48bb78' });
    if (gratitude.length >= 5) achievements.push({ id: 'gratitude5', name: 'Gratitude Guru', description: '5 gratitude entries!', icon: '🙏', color: '#38b2ac' });
    if (couples.length >= 3) achievements.push({ id: 'couples3', name: 'Love Connection', description: '3 couples activities!', icon: '💕', color: '#ed64a6' });
    
    return achievements;
  };

  const getWellnessInsight = () => {
    const insights = [
      "Regular mood tracking helps identify patterns and triggers.",
      "Gratitude practice can improve overall life satisfaction by 25%.",
      "Just 10 minutes of meditation daily can reduce stress significantly.",
      "Couples activities strengthen relationships and reduce individual stress.",
      "Breathing exercises activate your body's natural relaxation response.",
      "Consistency is more important than perfection in wellness practices."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  return (
    <div className="dashboard-container">
      <motion.div className="wellness-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <TrendingUp size={48} className="dashboard-icon" />
            <div>
              <h2>Your Wellness Journey</h2>
              <p>Track your progress and celebrate your growth</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <motion.div 
            className="metric-card streak"
            whileHover={{ scale: 1.02 }}
          >
            <div className="metric-icon">
              <Zap size={32} />
            </div>
            <div className="metric-content">
              <h3>{dashboardData.streak}</h3>
              <p>Day Streak</p>
              <span className="metric-detail">Keep it up! 🔥</span>
            </div>
          </motion.div>

          <motion.div 
            className="metric-card points"
            whileHover={{ scale: 1.02 }}
          >
            <div className="metric-icon">
              <Award size={32} />
            </div>
            <div className="metric-content">
              <h3>{dashboardData.totalPoints}</h3>
              <p>Wellness Points</p>
              <span className="metric-detail">Every activity counts!</span>
            </div>
          </motion.div>

          <motion.div 
            className="metric-card mood"
            whileHover={{ scale: 1.02 }}
          >
            <div className="metric-icon">
              <Heart size={32} />
            </div>
            <div className="metric-content">
              <h3>{dashboardData.moodAverage}/10</h3>
              <p>Avg Mood</p>
              <span className="metric-detail">
                {dashboardData.moodAverage >= 7 ? 'Great! 😊' : 
                 dashboardData.moodAverage >= 5 ? 'Good progress 🙂' : 
                 'Keep caring for yourself 💙'}
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="metric-card today"
            whileHover={{ scale: 1.02 }}
          >
            <div className="metric-icon">
              <CheckCircle size={32} />
            </div>
            <div className="metric-content">
              <h3>{dashboardData.completedToday}</h3>
              <p>Completed Today</p>
              <span className="metric-detail">
                {dashboardData.completedToday === 0 ? 'Ready to start?' :
                 dashboardData.completedToday === 1 ? 'Great start!' :
                 'Amazing progress!'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        {dashboardData.achievements.length > 0 && (
          <div className="achievements-section">
            <h3>🏆 Your Achievements</h3>
            <div className="achievements-grid">
              {dashboardData.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="achievement-badge"
                  style={{ borderColor: achievement.color }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <h4 style={{ color: achievement.color }}>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Wellness Insight */}
        <div className="wellness-insight">
          <Brain size={24} />
          <div>
            <h4>💡 Daily Wellness Insight</h4>
            <p>{getWellnessInsight()}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>🎯 Quick Actions for Today</h3>
          <div className="actions-grid">
            <motion.div 
              className="action-card mood-check"
              whileHover={{ scale: 1.02 }}
            >
              <Heart size={24} />
              <div>
                <h4>Check Your Mood</h4>
                <p>Take a moment to reflect on how you're feeling</p>
              </div>
            </motion.div>

            <motion.div 
              className="action-card breathing"
              whileHover={{ scale: 1.02 }}
            >
              <Zap size={24} />
              <div>
                <h4>5-Minute Breathing</h4>
                <p>Quick stress relief with guided breathing</p>
              </div>
            </motion.div>

            <motion.div 
              className="action-card gratitude"
              whileHover={{ scale: 1.02 }}
            >
              <Award size={24} />
              <div>
                <h4>Gratitude Moment</h4>
                <p>Write down something you're thankful for</p>
              </div>
            </motion.div>

            <motion.div 
              className="action-card meditation"
              whileHover={{ scale: 1.02 }}
            >
              <Moon size={24} />
              <div>
                <h4>Mini Meditation</h4>
                <p>3-minute mindfulness session</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>📅 Recent Wellness Activities</h3>
          <div className="activity-timeline">
            {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="activity-type">
                    {activity.mood ? '😊 Mood Check' :
                     activity.prompt ? '🙏 Gratitude Entry' :
                     activity.title ? '💕 Couples Activity' :
                     '🌱 Wellness Activity'}
                  </div>
                  <div className="activity-date">
                    {new Date(activity.timestamp || activity.completedAt).toLocaleDateString()}
                  </div>
                  {activity.note && (
                    <div className="activity-preview">"{activity.note}"</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wellness Goals */}
        <div className="wellness-goals">
          <h3>🎯 Wellness Goals</h3>
          <div className="goals-list">
            <div className="goal-item">
              <Target size={20} />
              <div className="goal-content">
                <h4>Daily Check-in Streak</h4>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min((dashboardData.streak / 7) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span>{dashboardData.streak}/7 days</span>
                </div>
              </div>
            </div>

            <div className="goal-item">
              <Calendar size={20} />
              <div className="goal-content">
                <h4>Weekly Wellness Activities</h4>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min((dashboardData.completedToday / 3) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span>{Math.min(dashboardData.completedToday, 3)}/3 activities today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WellnessDashboard;