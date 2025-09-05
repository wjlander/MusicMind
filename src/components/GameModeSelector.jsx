import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Calendar, 
  Zap, 
  Trophy,
  Users,
  Brain,
  Gamepad2
} from 'lucide-react';

const GameModeSelector = ({ selectedMode, onModeSelect, className = "" }) => {
  const gameModes = [
    {
      id: 'classic',
      name: 'Classic Quiz',
      icon: Gamepad2,
      description: 'Traditional 10-question quiz with 3 lives',
      duration: '5-8 minutes',
      difficulty: 'Medium',
      color: '#667eea'
    },
    {
      id: 'quick',
      name: 'Quick Round',
      icon: Zap,
      description: 'Fast 5-question sprint for busy moments',
      duration: '2-3 minutes',
      difficulty: 'Easy',
      color: '#48bb78'
    },
    {
      id: 'timed',
      name: 'Timed Challenge',
      icon: Clock,
      description: 'Race against time! 30 seconds per question',
      duration: '5 minutes',
      difficulty: 'Hard',
      color: '#f56565'
    },
    {
      id: 'daily',
      name: 'Daily Challenge',
      icon: Calendar,
      description: 'Special daily quiz with unique tracks',
      duration: '3-5 minutes',
      difficulty: 'Variable',
      color: '#ed8936'
    },
    {
      id: 'expert',
      name: 'Expert Mode',
      icon: Brain,
      description: 'Type your answers instead of multiple choice',
      duration: '8-12 minutes',
      difficulty: 'Expert',
      color: '#9f7aea'
    },
    {
      id: 'multiplayer',
      name: 'Share & Challenge',
      icon: Users,
      description: 'Generate a challenge to share with friends',
      duration: '5-8 minutes',
      difficulty: 'Medium',
      color: '#38b2ac'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#48bb78',
      'Medium': '#ed8936',
      'Hard': '#f56565',
      'Expert': '#9f7aea',
      'Variable': '#667eea'
    };
    return colors[difficulty] || '#667eea';
  };

  return (
    <div className={`game-mode-selector ${className}`}>
      <div className="modes-grid">
        {gameModes.map((mode, index) => {
          const IconComponent = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <motion.div
              key={mode.id}
              className={`mode-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onModeSelect(mode.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              style={{
                '--mode-color': mode.color,
                borderColor: isSelected ? mode.color : 'var(--border-color)'
              }}
            >
              <div className="mode-header" style={{ backgroundColor: `${mode.color}15` }}>
                <IconComponent 
                  size={32} 
                  style={{ color: mode.color }}
                />
                <div className="mode-title">
                  <h3>{mode.name}</h3>
                  <span className="mode-duration">{mode.duration}</span>
                </div>
              </div>
              
              <div className="mode-content">
                <p className="mode-description">{mode.description}</p>
                
                <div className="mode-meta">
                  <span 
                    className="difficulty-badge"
                    style={{ 
                      backgroundColor: `${getDifficultyColor(mode.difficulty)}20`,
                      color: getDifficultyColor(mode.difficulty)
                    }}
                  >
                    {mode.difficulty}
                  </span>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  className="selection-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ backgroundColor: mode.color }}
                >
                  <Trophy size={16} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GameModeSelector;