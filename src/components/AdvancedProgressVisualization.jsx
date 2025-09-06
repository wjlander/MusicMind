import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Activity,
  Brain,
  Heart,
  Zap,
  Moon,
  Target,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import wellnessDataService from '../services/wellnessDataService';

const AdvancedProgressVisualization = ({ selectedPeriod = 30 }) => {
  const [insights, setInsights] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedCorrelation, setSelectedCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisualizationData();
  }, [selectedPeriod]);

  const loadVisualizationData = () => {
    try {
      setLoading(true);
      const data = wellnessDataService.getWellnessInsights(selectedPeriod);
      setInsights(data);
    } catch (error) {
      console.error('Error loading visualization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'correlations', label: 'Patterns', icon: Activity },
    { id: 'activities', label: 'Activities', icon: PieChart }
  ];

  if (loading) {
    return (
      <div className="progress-visualization loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Analyzing your progress...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="progress-visualization no-data">
        <div className="no-data-content">
          <BarChart3 size={48} />
          <h3>Not enough data yet</h3>
          <p>Complete more wellness activities to see detailed progress insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-visualization">
      <div className="visualization-header">
        <h2>Your Progress Insights</h2>
        <div className="view-selector">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                className={`view-btn ${selectedView === view.id ? 'active' : ''}`}
                onClick={() => setSelectedView(view.id)}
              >
                <Icon size={16} />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="visualization-content"
        >
          {selectedView === 'overview' && (
            <OverviewVisualization insights={insights} />
          )}
          {selectedView === 'trends' && (
            <TrendsVisualization insights={insights} />
          )}
          {selectedView === 'correlations' && (
            <CorrelationsVisualization 
              insights={insights}
              selectedCorrelation={selectedCorrelation}
              setSelectedCorrelation={setSelectedCorrelation}
            />
          )}
          {selectedView === 'activities' && (
            <ActivitiesVisualization insights={insights} />
          )}
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .progress-visualization {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .loading, .no-data {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-content, .no-data-content {
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data-content svg {
          color: #cbd5e0;
          margin-bottom: 16px;
        }

        .no-data-content h3 {
          color: #4a5568;
          margin: 0 0 8px;
          font-size: 20px;
        }

        .no-data-content p {
          color: #718096;
          margin: 0;
        }

        .visualization-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 2px solid #f7fafc;
        }

        .visualization-header h2 {
          margin: 0;
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
        }

        .view-selector {
          display: flex;
          background: #f7fafc;
          border-radius: 12px;
          padding: 4px;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 8px;
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

        .view-btn.active {
          background: white;
          color: #2d3748;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .view-btn:hover:not(.active) {
          background: #edf2f7;
        }

        .visualization-content {
          padding: 24px;
        }

        @media (max-width: 768px) {
          .visualization-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .view-selector {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
          }

          .visualization-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

const OverviewVisualization = ({ insights }) => (
  <div className="overview-visualization">
    <div className="overview-grid">
      <div className="overview-card primary">
        <h3>Wellness Score Breakdown</h3>
        <div className="score-breakdown">
          <div className="score-circle">
            <svg viewBox="0 0 100 100" className="score-svg">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#4299e1"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${insights.overview.wellnessScore * 2.51}, 251.2`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-text">
              <span className="score-value">{insights.overview.wellnessScore}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
          <div className="score-details">
            <div className="score-item">
              <span className="score-label">Current Streak</span>
              <span className="score-number">{insights.overview.currentStreak} days</span>
            </div>
            <div className="score-item">
              <span className="score-label">Best Streak</span>
              <span className="score-number">{insights.overview.bestStreak} days</span>
            </div>
            <div className="score-item">
              <span className="score-label">Active Days</span>
              <span className="score-number">{insights.overview.activeDays}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-card">
        <h3>Weekly Pattern</h3>
        <div className="pattern-chart">
          {Object.entries(insights.patterns.dailyActivity).map(([day, count]) => {
            const maxCount = Math.max(...Object.values(insights.patterns.dailyActivity));
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={day} className="pattern-bar">
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ height: `${percentage}%` }}
                  />
                </div>
                <span className="bar-label">{day.slice(0, 3)}</span>
                <span className="bar-value">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overview-card">
        <h3>Mood by Time of Day</h3>
        <div className="mood-times">
          {Object.entries(insights.patterns.moodByTimeOfDay).map(([time, mood]) => {
            const moodValue = parseFloat(mood) || 0;
            const moodColor = moodValue >= 7 ? '#48bb78' : moodValue >= 5 ? '#ed8936' : '#e53e3e';
            
            return (
              <div key={time} className="mood-time">
                <div className="mood-time-header">
                  <span className="time-label">{time.charAt(0).toUpperCase() + time.slice(1)}</span>
                  <span className="mood-value" style={{ color: moodColor }}>
                    {moodValue.toFixed(1)}/10
                  </span>
                </div>
                <div className="mood-bar">
                  <div 
                    className="mood-fill"
                    style={{ 
                      width: `${(moodValue / 10) * 100}%`,
                      backgroundColor: moodColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <style jsx>{`
      .overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      .overview-card {
        background: #f8f9fa;
        border-radius: 16px;
        padding: 24px;
      }

      .overview-card.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .overview-card h3 {
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: 600;
        color: #2d3748;
      }

      .overview-card.primary h3 {
        color: white;
      }

      .score-breakdown {
        display: flex;
        gap: 24px;
        align-items: center;
      }

      .score-circle {
        position: relative;
        width: 120px;
        height: 120px;
        flex-shrink: 0;
      }

      .score-svg {
        width: 100%;
        height: 100%;
      }

      .score-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .score-value {
        display: block;
        font-size: 32px;
        font-weight: 700;
        color: white;
      }

      .score-max {
        font-size: 16px;
        opacity: 0.8;
      }

      .score-details {
        flex: 1;
      }

      .score-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .score-item:last-child {
        border-bottom: none;
      }

      .score-label {
        opacity: 0.9;
        font-size: 14px;
      }

      .score-number {
        font-weight: 600;
        font-size: 16px;
      }

      .pattern-chart {
        display: flex;
        justify-content: space-between;
        align-items: end;
        height: 120px;
        gap: 8px;
      }

      .pattern-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        gap: 8px;
      }

      .bar-container {
        height: 80px;
        width: 100%;
        background: #e2e8f0;
        border-radius: 4px;
        display: flex;
        align-items: end;
        overflow: hidden;
      }

      .bar-fill {
        width: 100%;
        background: #4299e1;
        border-radius: 4px 4px 0 0;
        transition: height 0.3s ease;
        min-height: 2px;
      }

      .bar-label {
        font-size: 12px;
        color: #718096;
        font-weight: 500;
      }

      .bar-value {
        font-size: 14px;
        color: #2d3748;
        font-weight: 600;
      }

      .mood-times {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .mood-time-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .time-label {
        font-weight: 500;
        color: #2d3748;
      }

      .mood-value {
        font-weight: 600;
        font-size: 14px;
      }

      .mood-bar {
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }

      .mood-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      @media (max-width: 768px) {
        .overview-grid {
          grid-template-columns: 1fr;
        }

        .score-breakdown {
          flex-direction: column;
          align-items: center;
        }

        .score-circle {
          width: 100px;
          height: 100px;
        }

        .score-value {
          font-size: 24px;
        }
      }
    `}</style>
  </div>
);

const TrendsVisualization = ({ insights }) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
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

  return (
    <div className="trends-visualization">
      <div className="trends-grid">
        <div className="trend-card main">
          <div className="trend-header">
            <h3>Overall Wellness Trend</h3>
            <div className="trend-indicator">
              {React.createElement(getTrendIcon(insights.trends.wellnessScore), {
                size: 24,
                color: getTrendColor(insights.trends.wellnessScore)
              })}
              <span style={{ color: getTrendColor(insights.trends.wellnessScore) }}>
                {insights.trends.wellnessScore || 'stable'}
              </span>
            </div>
          </div>
          <div className="trend-description">
            Your overall wellness score is {insights.trends.wellnessScore || 'stable'} compared to previous periods.
          </div>
        </div>

        <div className="trend-card">
          <div className="trend-header">
            <h3>Mood Trend</h3>
            <div className="trend-indicator">
              {React.createElement(getTrendIcon(insights.trends.mood), {
                size: 20,
                color: getTrendColor(insights.trends.mood)
              })}
              <span style={{ color: getTrendColor(insights.trends.mood) }}>
                {insights.trends.mood || 'stable'}
              </span>
            </div>
          </div>
          <div className="mood-average">
            Average: {insights.overview.avgMood}/10
          </div>
        </div>

        {Object.entries(insights.trends.activityFrequency).map(([activity, trend]) => {
          const icons = {
            mood: Heart,
            gratitude: Target,
            breathing: Moon,
            meditation: Brain,
            exercise: Activity,
            journal: BarChart3
          };
          
          const Icon = icons[activity] || Activity;
          
          return (
            <div key={activity} className="trend-card activity">
              <div className="activity-header">
                <div className="activity-icon">
                  <Icon size={20} />
                </div>
                <h4>{activity.charAt(0).toUpperCase() + activity.slice(1)}</h4>
              </div>
              <div className="activity-trend">
                {React.createElement(getTrendIcon(trend), {
                  size: 16,
                  color: getTrendColor(trend)
                })}
                <span style={{ color: getTrendColor(trend) }}>
                  {trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .trends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .trend-card {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
        }

        .trend-card.main {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
          color: white;
        }

        .trend-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .trend-card h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
        }

        .trend-card.main h3 {
          color: white;
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .trend-description {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
        }

        .mood-average {
          color: #4a5568;
          font-size: 14px;
          font-weight: 500;
        }

        .activity-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background: #4299e1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .activity-header h4 {
          margin: 0;
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
        }

        .activity-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .trends-grid {
            grid-template-columns: 1fr;
          }

          .trend-card.main {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
};

const CorrelationsVisualization = ({ insights, selectedCorrelation, setSelectedCorrelation }) => {
  if (insights.correlations.length === 0) {
    return (
      <div className="no-correlations">
        <Activity size={48} />
        <h3>No patterns detected yet</h3>
        <p>Continue using different wellness activities to discover meaningful patterns and correlations</p>
      </div>
    );
  }

  return (
    <div className="correlations-visualization">
      <div className="correlations-grid">
        {insights.correlations.map((correlation, index) => (
          <motion.div
            key={index}
            className={`correlation-card ${selectedCorrelation === index ? 'selected' : ''}`}
            onClick={() => setSelectedCorrelation(selectedCorrelation === index ? null : index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="correlation-header">
              <div className="correlation-strength">
                <div className="strength-circle">
                  <div 
                    className="strength-fill"
                    style={{ 
                      background: `conic-gradient(${correlation.correlation > 0 ? '#48bb78' : '#ed8936'} ${Math.abs(correlation.correlation) * 360}deg, #e2e8f0 0deg)`
                    }}
                  />
                  <span className="strength-value">
                    {Math.abs(correlation.correlation).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="correlation-info">
                <h4>{correlation.type.replace('-', ' & ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                <span className={`strength-badge ${correlation.strength}`}>
                  {correlation.strength} correlation
                </span>
              </div>
            </div>
            
            <p className="correlation-message">{correlation.message}</p>
            
            {selectedCorrelation === index && (
              <motion.div
                className="correlation-details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="detail-item">
                  <span className="detail-label">Correlation strength:</span>
                  <span className="detail-value">{Math.abs(correlation.correlation).toFixed(3)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Relationship type:</span>
                  <span className="detail-value">
                    {correlation.correlation > 0 ? 'Positive' : 'Negative'}
                  </span>
                </div>
                <div className="insight-box">
                  <Info size={16} />
                  <span>
                    {correlation.correlation > 0 
                      ? 'These activities tend to improve together'
                      : 'One activity may help improve the other'
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .no-correlations {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .no-correlations svg {
          color: #cbd5e0;
          margin-bottom: 16px;
        }

        .no-correlations h3 {
          color: #4a5568;
          margin: 0 0 8px;
        }

        .correlations-grid {
          display: grid;
          gap: 20px;
        }

        .correlation-card {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .correlation-card:hover {
          background: #edf2f7;
        }

        .correlation-card.selected {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .correlation-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .correlation-strength {
          flex-shrink: 0;
        }

        .strength-circle {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .strength-fill {
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }

        .strength-value {
          position: relative;
          font-weight: 700;
          font-size: 14px;
          color: #2d3748;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .correlation-info h4 {
          margin: 0 0 4px;
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
        }

        .strength-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .strength-badge.strong {
          background: #c6f6d5;
          color: #276749;
        }

        .strength-badge.moderate {
          background: #fed7cc;
          color: #c05621;
        }

        .correlation-message {
          color: #4a5568;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .correlation-details {
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
          margin-top: 16px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .detail-label {
          color: #718096;
          font-size: 14px;
        }

        .detail-value {
          color: #2d3748;
          font-weight: 500;
          font-size: 14px;
        }

        .insight-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #e6fffa;
          border: 1px solid #b2f5ea;
          border-radius: 8px;
          padding: 12px;
          margin-top: 12px;
          color: #234e52;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

const ActivitiesVisualization = ({ insights }) => {
  const activityData = Object.entries(insights.overview.activityCounts);
  const total = activityData.reduce((sum, [, count]) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className="no-activities">
        <PieChart size={48} />
        <h3>No activities yet</h3>
        <p>Start using wellness tools to see your activity breakdown</p>
      </div>
    );
  }

  const colors = {
    mood: '#ed64a6',
    gratitude: '#38b2ac',
    breathing: '#4299e1',
    meditation: '#9f7aea',
    exercise: '#48bb78',
    journal: '#ed8936'
  };

  return (
    <div className="activities-visualization">
      <div className="activities-chart">
        <div className="pie-chart">
          <svg viewBox="0 0 100 100" className="pie-svg">
            {(() => {
              let cumulativeAngle = 0;
              return activityData.map(([activity, count]) => {
                const percentage = (count / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = cumulativeAngle;
                const endAngle = cumulativeAngle + angle;
                
                const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
                const x2 = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
                const y2 = 50 + 40 * Math.sin(endAngle * Math.PI / 180);
                
                const largeArc = angle > 180 ? 1 : 0;
                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                cumulativeAngle += angle;
                
                return (
                  <path
                    key={activity}
                    d={pathData}
                    fill={colors[activity] || '#718096'}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              });
            })()}
          </svg>
        </div>
        
        <div className="chart-legend">
          {activityData.map(([activity, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            
            return (
              <div key={activity} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: colors[activity] || '#718096' }}
                />
                <div className="legend-info">
                  <span className="legend-name">
                    {activity.charAt(0).toUpperCase() + activity.slice(1)}
                  </span>
                  <div className="legend-stats">
                    <span className="legend-count">{count} activities</span>
                    <span className="legend-percent">{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="effectiveness-section">
        <h3>Activity Effectiveness</h3>
        <div className="effectiveness-grid">
          {Object.entries(insights.patterns.activityEffectiveness || {}).map(([activity, effectiveness]) => {
            const effectivenessValue = parseFloat(effectiveness) || 0;
            const effectivenessColor = effectivenessValue >= 70 ? '#48bb78' : 
                                     effectivenessValue >= 50 ? '#ed8936' : '#e53e3e';
            
            return (
              <div key={activity} className="effectiveness-card">
                <div className="effectiveness-header">
                  <span className="activity-name">
                    {activity.charAt(0).toUpperCase() + activity.slice(1)}
                  </span>
                  <span 
                    className="effectiveness-score"
                    style={{ color: effectivenessColor }}
                  >
                    {effectivenessValue.toFixed(0)}%
                  </span>
                </div>
                <div className="effectiveness-bar">
                  <div 
                    className="effectiveness-fill"
                    style={{ 
                      width: `${effectivenessValue}%`,
                      backgroundColor: effectivenessColor
                    }}
                  />
                </div>
                <p className="effectiveness-description">
                  Mood improvement rate after this activity
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .no-activities {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .no-activities svg {
          color: #cbd5e0;
          margin-bottom: 16px;
        }

        .no-activities h3 {
          color: #4a5568;
          margin: 0 0 8px;
        }

        .activities-chart {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 40px;
        }

        .pie-chart {
          width: 300px;
          height: 300px;
        }

        .pie-svg {
          width: 100%;
          height: 100%;
        }

        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .legend-info {
          flex: 1;
        }

        .legend-name {
          font-weight: 500;
          color: #2d3748;
          display: block;
          margin-bottom: 4px;
        }

        .legend-stats {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #718096;
        }

        .effectiveness-section h3 {
          margin: 0 0 20px;
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
        }

        .effectiveness-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .effectiveness-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 16px;
        }

        .effectiveness-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .activity-name {
          font-weight: 500;
          color: #2d3748;
        }

        .effectiveness-score {
          font-weight: 600;
          font-size: 16px;
        }

        .effectiveness-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .effectiveness-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .effectiveness-description {
          margin: 0;
          font-size: 12px;
          color: #718096;
        }

        @media (max-width: 768px) {
          .activities-chart {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .pie-chart {
            width: 250px;
            height: 250px;
            margin: 0 auto;
          }

          .effectiveness-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedProgressVisualization;