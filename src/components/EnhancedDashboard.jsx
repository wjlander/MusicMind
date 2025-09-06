import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Award, 
  Brain, 
  Heart, 
  Zap, 
  Moon,
  Activity,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Clock,
  Star,
  BarChart3
} from 'lucide-react';
import wellnessDataService from '../services/wellnessDataService';
import PersonalizedRecommendations from './PersonalizedRecommendations';

const EnhancedDashboard = ({ onNavigateToActivity }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [todaysFocus, setTodaysFocus] = useState(null);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh dashboard data every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get comprehensive wellness insights
      const insights = wellnessDataService.getWellnessInsights(
        selectedPeriod === 'week' ? 7 : 
        selectedPeriod === 'month' ? 30 : 90
      );
      
      // Get today's focus
      const focus = wellnessDataService.getTodaysFocus();
      
      // Prepare quick actions based on recent activity
      const actions = generateQuickActions(insights);
      
      setDashboardData(insights);
      setTodaysFocus(focus);
      setQuickActions(actions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuickActions = (insights) => {
    const actions = [];
    const data = wellnessDataService.getAllData();
    const today = new Date().toDateString();

    // Check if mood tracking is done today
    const todayMood = data.mood.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
    
    if (todayMood.length === 0) {
      actions.push({
        id: 'mood-checkin',
        title: 'Mood Check-in',
        description: 'Track how you\'re feeling today',
        icon: Heart,
        color: '#ed64a6',
        component: 'MoodTracker',
        urgent: true
      });
    }

    // Emergency actions based on recent mood
    const recentMoods = data.mood.slice(-3);
    const avgRecentMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
      : 5;

    if (avgRecentMood < 4) {
      actions.push({
        id: 'emergency-support',
        title: 'Need Support?',
        description: 'Quick access to coping tools',
        icon: AlertCircle,
        color: '#e53e3e',
        component: 'EmergencyCopingToolkit',
        urgent: true
      });
    }

    // Regular activity suggestions
    if (insights.overview.currentStreak === 0) {
      actions.push({
        id: 'start-streak',
        title: 'Start Your Streak',
        description: 'Begin with a simple activity',
        icon: Target,
        color: '#4299e1',
        component: 'BreathingGame'
      });
    }

    // Add more quick actions based on patterns
    if (data.meditation.length === 0) {
      actions.push({
        id: 'try-meditation',
        title: 'Try Meditation',
        description: 'Experience mindfulness',
        icon: Brain,
        color: '#9f7aea',
        component: 'MeditationTimer'
      });
    }

    return actions.slice(0, 4); // Limit to 4 quick actions
  };

  const getWellnessScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    if (score >= 40) return '#ecc94b';
    return '#e53e3e';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return Activity;
      default: return Activity;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#48bb78';
      case 'declining': return '#e53e3e';
      default: return '#718096';
    }
  };

  if (loading) {
    return (
      <div className="enhanced-dashboard loading">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading your wellness insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Your Wellness Journey</h1>
          <p>Track your progress, discover patterns, and stay motivated</p>
        </div>
        
        <div className="period-selector">
          {['week', 'month', 'quarter'].map((period) => (
            <button
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'quarter' ? '3 months' : `This ${period}`}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Focus Card */}
      {todaysFocus && (
        <motion.div
          className="todays-focus-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="focus-header">
            <div className="focus-icon">
              <Target size={24} />
            </div>
            <div className="focus-content">
              <h3>Today's Focus</h3>
              <h2>{todaysFocus.title}</h2>
              <p>{todaysFocus.description}</p>
            </div>
            <div className="focus-meta">
              <span className="time-estimate">
                <Clock size={16} />
                {todaysFocus.estimatedTime} min
              </span>
              <span className={`priority-badge ${todaysFocus.priority}`}>
                {todaysFocus.priority}
              </span>
            </div>
          </div>
          
          <button
            className="start-focus-btn"
            onClick={() => onNavigateToActivity(todaysFocus.component)}
          >
            Start Now
            <ArrowRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  className={`quick-action-card ${action.urgent ? 'urgent' : ''}`}
                  onClick={() => onNavigateToActivity(action.component)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="action-icon" style={{ backgroundColor: action.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>Wellness Score</h3>
              <div className="stat-value">
                <span 
                  className="score" 
                  style={{ color: getWellnessScoreColor(dashboardData.overview.wellnessScore) }}
                >
                  {dashboardData.overview.wellnessScore}
                </span>
                <span className="score-max">/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${dashboardData.overview.wellnessScore}%`,
                    backgroundColor: getWellnessScoreColor(dashboardData.overview.wellnessScore)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <h3>Current Streak</h3>
              <div className="stat-value">
                <span className="number">{dashboardData.overview.currentStreak}</span>
                <span className="unit">days</span>
              </div>
              <p className="stat-description">
                Best: {dashboardData.overview.bestStreak} days
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div className="stat-content">
              <h3>Average Mood</h3>
              <div className="stat-value">
                <span className="number">{dashboardData.overview.avgMood}</span>
                <span className="unit">/10</span>
              </div>
              {dashboardData.trends.mood && (
                <div className="trend-indicator">
                  {React.createElement(getTrendIcon(dashboardData.trends.mood), {
                    size: 16,
                    color: getTrendColor(dashboardData.trends.mood)
                  })}
                  <span style={{ color: getTrendColor(dashboardData.trends.mood) }}>
                    {dashboardData.trends.mood}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Activities</h3>
              <div className="stat-value">
                <span className="number">{dashboardData.overview.totalActivities}</span>
              </div>
              <p className="stat-description">
                {dashboardData.overview.activeDays} active days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="activity-breakdown">
        <h3>Activity Summary</h3>
        <div className="activities-grid">
          {Object.entries(dashboardData.overview.activityCounts).map(([activity, count]) => {
            const icons = {
              mood: Heart,
              gratitude: Star,
              breathing: Moon,
              meditation: Brain,
              exercise: Activity,
              journal: CheckCircle
            };
            
            const colors = {
              mood: '#ed64a6',
              gratitude: '#38b2ac',
              breathing: '#4299e1',
              meditation: '#9f7aea',
              exercise: '#48bb78',
              journal: '#ed8936'
            };

            const Icon = icons[activity] || CheckCircle;
            
            return (
              <div key={activity} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: colors[activity] }}>
                  <Icon size={16} />
                </div>
                <div className="activity-info">
                  <span className="activity-name">{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
                  <span className="activity-count">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <PersonalizedRecommendations onSelectActivity={onNavigateToActivity} />

      <style jsx>{`
        .enhanced-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .loading-content {
          text-align: center;
        }

        .loading-spinner {
          margin-bottom: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .header-content h1 {
          margin: 0 0 8px;
          color: #2d3748;
          font-size: 32px;
          font-weight: 700;
        }

        .header-content p {
          margin: 0;
          color: #718096;
          font-size: 16px;
        }

        .period-selector {
          display: flex;
          background: #f7fafc;
          border-radius: 12px;
          padding: 4px;
        }

        .period-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #718096;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .period-btn.active {
          background: white;
          color: #2d3748;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .todays-focus-card {
          background: linear-gradient(135deg, #4299e1, #667eea);
          color: white;
          padding: 24px;
          border-radius: 20px;
          margin-bottom: 24px;
          box-shadow: 0 8px 16px rgba(66, 153, 225, 0.3);
        }

        .focus-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .focus-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .focus-content {
          flex: 1;
        }

        .focus-content h3 {
          margin: 0 0 8px;
          font-size: 14px;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .focus-content h2 {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 600;
        }

        .focus-content p {
          margin: 0;
          opacity: 0.9;
          line-height: 1.5;
        }

        .focus-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .time-estimate {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: #fed7d7;
          color: #c53030;
        }

        .priority-badge.essential {
          background: #e9d8fd;
          color: #6b46c1;
        }

        .priority-badge.medium {
          background: #fbd38d;
          color: #c05621;
        }

        .start-focus-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .start-focus-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }

        .quick-actions-section {
          margin-bottom: 32px;
        }

        .quick-actions-section h3 {
          margin: 0 0 16px;
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .quick-action-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .quick-action-card.urgent {
          border-left: 4px solid #e53e3e;
          background: #fef5f5;
        }

        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .action-content h4 {
          margin: 0 0 4px;
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
        }

        .action-content p {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }

        .stats-overview {
          margin-bottom: 32px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .stat-card.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-card .stat-icon {
          background: #f7fafc;
          color: #4299e1;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stat-card.primary .stat-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .stat-content h3 {
          margin: 0 0 8px;
          color: #718096;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-card.primary .stat-content h3 {
          color: rgba(255, 255, 255, 0.9);
        }

        .stat-value {
          display: flex;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .stat-value .number,
        .stat-value .score {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
        }

        .stat-card.primary .stat-value .number,
        .stat-card.primary .stat-value .score {
          color: white;
        }

        .stat-value .unit,
        .stat-value .score-max {
          font-size: 16px;
          color: #718096;
          margin-left: 4px;
        }

        .stat-card.primary .stat-value .score-max {
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-description {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }

        .stat-card.primary .stat-description {
          color: rgba(255, 255, 255, 0.8);
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .activity-breakdown {
          background: white;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .activity-breakdown h3 {
          margin: 0 0 20px;
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 12px;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .activity-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }

        .activity-name {
          color: #2d3748;
          font-weight: 500;
          font-size: 14px;
        }

        .activity-count {
          color: #4299e1;
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .enhanced-dashboard {
            padding: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }

          .focus-header {
            flex-direction: column;
            gap: 16px;
          }

          .focus-meta {
            flex-direction: row;
            justify-content: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .stat-value .number,
          .stat-value .score {
            font-size: 24px;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
          }

          .activities-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedDashboard;