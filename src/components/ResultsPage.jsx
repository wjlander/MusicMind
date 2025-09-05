import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Target, 
  Clock, 
  Share2, 
  RotateCcw, 
  TrendingUp,
  Star,
  Award,
  CheckCircle,
  XCircle,
  Music,
  Copy,
  Twitter,
  Facebook
} from 'lucide-react';

const ResultsPage = ({ 
  score, 
  totalQuestions, 
  correctAnswers,
  gameMode,
  timeTaken,
  questions,
  onRestart,
  onBackToMenu,
  playerAnswers,
  gameSettings 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const accuracy = percentage;
  
  // Calculate performance metrics
  const averageTimePerQuestion = timeTaken ? Math.round(timeTaken / totalQuestions) : 0;
  const perfectScore = correctAnswers === totalQuestions;
  const excellentScore = percentage >= 80;
  const goodScore = percentage >= 60;

  // Determine trophy type and message
  const getTrophyInfo = () => {
    if (perfectScore) {
      return {
        icon: Trophy,
        color: '#ffd700',
        title: 'Perfect Score!',
        message: 'Outstanding! You got every question right!',
        rank: 'Platinum'
      };
    } else if (excellentScore) {
      return {
        icon: Medal,
        color: '#c0c0c0',
        title: 'Excellent!',
        message: 'Great job! You really know your music!',
        rank: 'Gold'
      };
    } else if (goodScore) {
      return {
        icon: Award,
        color: '#cd7f32',
        title: 'Well Done!',
        message: 'Good performance! Keep practicing!',
        rank: 'Silver'
      };
    } else {
      return {
        icon: Target,
        color: '#667eea',
        title: 'Keep Learning!',
        message: 'Every quiz makes you better. Try again!',
        rank: 'Bronze'
      };
    }
  };

  const trophyInfo = getTrophyInfo();
  const TrophyIcon = trophyInfo.icon;

  // Generate share text
  const generateShareText = () => {
    const gameModeText = {
      'classic': 'Classic Quiz',
      'quick': 'Quick Round',
      'timed': 'Timed Challenge',
      'daily': 'Daily Challenge',
      'expert': 'Expert Mode',
      'multiplayer': 'Challenge'
    };

    return `🎵 Just scored ${score} points (${percentage}%) in ${gameModeText[gameMode] || 'Music Quiz'}! 
${correctAnswers}/${totalQuestions} correct answers 
${trophyInfo.rank} performance! 🏆

Think you can beat me? Try the quiz!`;
  };

  const handleShare = async (platform) => {
    const text = generateShareText();
    const url = window.location.origin;

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareMessage('Copied to clipboard!');
        setTimeout(() => setShareMessage(''), 3000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    } else if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank', 'width=500,height=400');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      window.open(facebookUrl, '_blank', 'width=500,height=400');
    }
  };

  return (
    <motion.div 
      className="results-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="results-container">
        {/* Main Results Card */}
        <motion.div 
          className="results-card main-results"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Trophy Section */}
          <div className="trophy-section">
            <motion.div
              className="trophy-icon"
              style={{ color: trophyInfo.color }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            >
              <TrophyIcon size={80} />
            </motion.div>
            
            <motion.h1
              className="result-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {trophyInfo.title}
            </motion.h1>
            
            <motion.p
              className="result-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {trophyInfo.message}
            </motion.p>
          </div>

          {/* Score Display */}
          <motion.div 
            className="score-display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="main-score">
              <span className="score-number">{score}</span>
              <span className="score-label">Points</span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="stat-item">
              <CheckCircle className="stat-icon" style={{ color: '#48bb78' }} />
              <span className="stat-value">{correctAnswers}</span>
              <span className="stat-label">Correct</span>
            </div>
            
            <div className="stat-item">
              <Target className="stat-icon" style={{ color: '#667eea' }} />
              <span className="stat-value">{percentage}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            
            {timeTaken && (
              <div className="stat-item">
                <Clock className="stat-icon" style={{ color: '#ed8936' }} />
                <span className="stat-value">{Math.round(timeTaken)}s</span>
                <span className="stat-label">Time</span>
              </div>
            )}
            
            <div className="stat-item">
              <Star className="stat-icon" style={{ color: trophyInfo.color }} />
              <span className="stat-value">{trophyInfo.rank}</span>
              <span className="stat-label">Rank</span>
            </div>
          </motion.div>

          {/* Accuracy Bar */}
          <motion.div 
            className="accuracy-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="accuracy-header">
              <span>Accuracy</span>
              <span>{percentage}%</span>
            </div>
            <div className="accuracy-bar">
              <motion.div 
                className="accuracy-fill"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                style={{
                  background: `linear-gradient(90deg, 
                    ${percentage >= 80 ? '#48bb78' : percentage >= 60 ? '#ed8936' : '#f56565'} 0%, 
                    ${percentage >= 80 ? '#38a169' : percentage >= 60 ? '#dd6b20' : '#e53e3e'} 100%)`
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="results-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button onClick={onRestart} className="action-btn primary">
            <RotateCcw size={20} />
            Play Again
          </button>
          
          <button 
            onClick={() => setShowDetails(!showDetails)} 
            className="action-btn secondary"
          >
            <TrendingUp size={20} />
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          
          <div className="share-section">
            <button 
              onClick={() => handleShare('copy')} 
              className="share-btn"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
            <button 
              onClick={() => handleShare('twitter')} 
              className="share-btn twitter"
              title="Share on Twitter"
            >
              <Twitter size={18} />
            </button>
            <button 
              onClick={() => handleShare('facebook')} 
              className="share-btn facebook"
              title="Share on Facebook"
            >
              <Facebook size={18} />
            </button>
          </div>
        </motion.div>

        {shareMessage && (
          <motion.div 
            className="share-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {shareMessage}
          </motion.div>
        )}

        {/* Detailed Results */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              className="detailed-results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Question Breakdown</h3>
              <div className="questions-review">
                {questions.map((question, index) => {
                  const userAnswer = playerAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div 
                      key={index}
                      className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}
                    >
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        {isCorrect ? 
                          <CheckCircle size={20} className="result-icon correct" /> :
                          <XCircle size={20} className="result-icon incorrect" />
                        }
                      </div>
                      
                      <div className="question-content">
                        <div className="track-info">
                          <Music size={16} />
                          <span>"{question.track.name}" by {question.track.artists[0].name}</span>
                        </div>
                        
                        <div className="answer-info">
                          <p><strong>Question:</strong> {question.question}</p>
                          <p><strong>Your Answer:</strong> 
                            <span className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                              {userAnswer || 'No answer'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p><strong>Correct Answer:</strong> 
                              <span className="correct-text">{question.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Menu */}
        <motion.button 
          onClick={onBackToMenu}
          className="back-to-menu-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Back to Menu
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsPage;