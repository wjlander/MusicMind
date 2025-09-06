import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Target, 
  Clock, 
  ArrowRight,
  Lightbulb,
  Activity,
  CheckCircle
} from 'lucide-react';
import wellnessDataService from '../services/wellnessDataService';

const PersonalizedRecommendations = ({ onSelectActivity }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedRecs, setCompletedRecs] = useState(new Set());

  useEffect(() => {
    loadRecommendations();
    
    // Reload recommendations every hour
    const interval = setInterval(loadRecommendations, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadRecommendations = () => {
    try {
      setLoading(true);
      const wellnessInsights = wellnessDataService.getWellnessInsights(30);
      const todaysFocus = wellnessDataService.getTodaysFocus();
      
      setInsights(wellnessInsights);
      
      // Combine today's focus with other recommendations
      const allRecommendations = [
        {
          ...todaysFocus,
          id: 'todays-focus',
          category: 'focus'
        },
        ...wellnessInsights.recommendations.map((rec, index) => ({
          ...rec,
          id: `rec-${index}`,
          category: 'insight'
        }))
      ];
      
      setRecommendations(allRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRecommendation = (recId) => {
    setCompletedRecs(prev => new Set([...prev, recId]));
    
    // Auto-refresh recommendations after completing one
    setTimeout(loadRecommendations, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e53e3e';
      case 'essential': return '#9f7aea';
      case 'medium': return '#ed8936';
      default: return '#38b2ac';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return Brain;
      case 'essential': return Target;
      case 'medium': return Heart;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <div className="personalized-recommendations loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing your wellness patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-recommendations">
      <div className="recommendations-header">
        <div className="header-content">
          <Lightbulb className="header-icon" />
          <div>
            <h2>Personalized for You</h2>
            <p>Based on your wellness patterns and current needs</p>
          </div>
        </div>
        
        {insights && (
          <div className="quick-insights">
            <div className="insight-item">
              <TrendingUp size={16} />
              <span>Wellness Score: {insights.overview.wellnessScore}/100</span>
            </div>
            <div className="insight-item">
              <CheckCircle size={16} />
              <span>{insights.overview.currentStreak} day streak</span>
            </div>
          </div>
        )}
      </div>

      <div className="recommendations-list">
        <AnimatePresence>
          {recommendations.map((rec) => {
            const PriorityIcon = getPriorityIcon(rec.priority);
            const isCompleted = completedRecs.has(rec.id);
            
            return (
              <motion.div
                key={rec.id}
                className={`recommendation-card ${rec.category} ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                layout
              >
                <div className="rec-header">
                  <div className="rec-icon" style={{ backgroundColor: getPriorityColor(rec.priority) }}>
                    <PriorityIcon size={20} />
                  </div>
                  <div className="rec-meta">
                    <h3>{rec.title}</h3>
                    <div className="rec-details">
                      <span className="priority" style={{ color: getPriorityColor(rec.priority) }}>
                        {rec.priority} priority
                      </span>
                      {rec.estimatedTime && (
                        <>
                          <span className="separator">•</span>
                          <span className="time">
                            <Clock size={12} />
                            {rec.estimatedTime} min
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {rec.category === 'focus' && (
                    <div className="focus-badge">
                      Today's Focus
                    </div>
                  )}
                </div>

                <p className="rec-description">{rec.description}</p>

                {rec.actions && (
                  <div className="rec-actions-list">
                    <h4>Suggested Actions:</h4>
                    <ul>
                      {rec.actions.slice(0, 3).map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rec-footer">
                  <motion.button
                    className="start-activity-btn"
                    onClick={() => {
                      onSelectActivity(rec.component);
                      handleCompleteRecommendation(rec.id);
                    }}
                    disabled={isCompleted}
                    whileHover={{ scale: isCompleted ? 1 : 1.05 }}
                    whileTap={{ scale: isCompleted ? 1 : 0.95 }}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle size={16} />
                        Completed
                      </>
                    ) : (
                      <>
                        Start Activity
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                  
                  {rec.category === 'insight' && (
                    <button
                      className="learn-more-btn"
                      onClick={() => {/* Could show more details */}}
                    >
                      Why this helps
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {insights && insights.correlations.length > 0 && (
        <div className="insights-section">
          <h3>Your Wellness Patterns</h3>
          <div className="correlations-grid">
            {insights.correlations.map((corr, index) => (
              <div key={index} className="correlation-card">
                <div className="correlation-strength">
                  <div 
                    className="strength-bar" 
                    style={{ 
                      width: `${Math.abs(corr.correlation) * 100}%`,
                      backgroundColor: corr.correlation > 0 ? '#48bb78' : '#ed8936'
                    }}
                  />
                </div>
                <p>{corr.message}</p>
                <small className="strength-label">{corr.strength} correlation</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .personalized-recommendations {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .loading-spinner {
          text-align: center;
        }

        .spinner {
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

        .recommendations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          color: #ed8936;
          background: #fef5e7;
          padding: 12px;
          border-radius: 12px;
        }

        .header-content h2 {
          margin: 0;
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
        }

        .header-content p {
          margin: 4px 0 0;
          color: #718096;
          font-size: 14px;
        }

        .quick-insights {
          display: flex;
          gap: 16px;
        }

        .insight-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4a5568;
          font-size: 14px;
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .recommendations-list {
          display: grid;
          gap: 16px;
        }

        .recommendation-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .recommendation-card.focus {
          border-color: #9f7aea;
          background: linear-gradient(135deg, #faf5ff 0%, white 100%);
        }

        .recommendation-card.completed {
          opacity: 0.7;
          background: #f7fafc;
        }

        .rec-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .rec-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .rec-meta {
          flex: 1;
        }

        .rec-meta h3 {
          margin: 0 0 8px;
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
        }

        .rec-details {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .priority {
          font-weight: 500;
          text-transform: capitalize;
        }

        .separator {
          color: #a0aec0;
        }

        .time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #718096;
        }

        .focus-badge {
          background: #9f7aea;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .rec-description {
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .rec-actions-list h4 {
          color: #2d3748;
          font-size: 14px;
          margin: 0 0 8px;
          font-weight: 500;
        }

        .rec-actions-list ul {
          margin: 0 0 16px;
          padding-left: 16px;
          color: #4a5568;
        }

        .rec-actions-list li {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .rec-footer {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .start-activity-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #4299e1;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .start-activity-btn:hover:not(:disabled) {
          background: #3182ce;
        }

        .start-activity-btn:disabled {
          background: #48bb78;
          cursor: default;
        }

        .learn-more-btn {
          background: none;
          border: 2px solid #e2e8f0;
          color: #718096;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .learn-more-btn:hover {
          border-color: #cbd5e0;
          color: #4a5568;
        }

        .insights-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e2e8f0;
        }

        .insights-section h3 {
          color: #2d3748;
          margin: 0 0 16px;
          font-size: 18px;
          font-weight: 600;
        }

        .correlations-grid {
          display: grid;
          gap: 16px;
        }

        .correlation-card {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .correlation-strength {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .correlation-card p {
          margin: 0 0 8px;
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
        }

        .strength-label {
          color: #718096;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .recommendations-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .quick-insights {
            flex-direction: column;
            gap: 8px;
            align-self: stretch;
          }

          .rec-header {
            flex-direction: column;
            gap: 12px;
          }

          .focus-badge {
            align-self: flex-start;
          }

          .rec-footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalizedRecommendations;