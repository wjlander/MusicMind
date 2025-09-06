import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Star, Award } from 'lucide-react';

const ScoreBoard = ({ score, totalQuestions, onRestart, playerCount = 1, playerNames = [], playerScores = [], roundType = 'standard' }) => {
  const isMultiplayer = playerCount > 1;
  
  // Single player stats
  const correctAnswers = Math.floor(score / 100);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Multiplayer stats
  const multiplayerResults = isMultiplayer ? playerNames.map((name, index) => ({
    name,
    score: playerScores[index],
    correctAnswers: Math.floor(playerScores[index] / 100),
    questionsPerPlayer: Math.floor(totalQuestions / playerCount)
  })).sort((a, b) => b.score - a.score) : [];
  
  const winner = isMultiplayer ? multiplayerResults[0] : null;
  
  const getScoreMessage = () => {
    if (isMultiplayer) {
      if (multiplayerResults[0].score === multiplayerResults[1]?.score) {
        return { message: "It's a tie! Great game everyone!", icon: Trophy, color: "gold" };
      }
      return { message: `${winner.name} wins! Amazing performance!`, icon: Trophy, color: "gold" };
    }
    
    if (percentage >= 90) return { message: "Outstanding! You're a music legend!", icon: Trophy, color: "gold" };
    if (percentage >= 70) return { message: "Great job! You really know your music!", icon: Award, color: "silver" };
    if (percentage >= 50) return { message: "Not bad! Keep listening and learning!", icon: Star, color: "bronze" };
    return { message: "Keep practicing! Music knowledge takes time!", icon: Star, color: "participation" };
  };

  const scoreData = getScoreMessage();
  const IconComponent = scoreData.icon;

  return (
    <motion.div 
      className="score-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="score-header">
        <motion.div
          className={`score-icon ${scoreData.color}`}
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <IconComponent size={64} />
        </motion.div>
        
        <motion.h2 
          className="score-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isMultiplayer ? `${roundType.charAt(0).toUpperCase() + roundType.slice(1)} Round Complete!` : 'Quiz Complete!'}
        </motion.h2>
        
        <motion.p 
          className="score-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {scoreData.message}
        </motion.p>
      </div>

      {isMultiplayer ? (
        <div className="multiplayer-results">
          <h3>Final Results</h3>
          {multiplayerResults.map((player, index) => (
            <motion.div 
              key={player.name}
              className={`player-result ${index === 0 ? 'winner' : ''}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <div className="result-position">#{index + 1}</div>
              <div className="result-info">
                <span className="result-name">{player.name}</span>
                <span className="result-score">{player.score} points</span>
                <span className="result-correct">{player.correctAnswers} correct</span>
              </div>
              {index === 0 && <Trophy className="winner-trophy" size={24} />}
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          <div className="score-details">
            <motion.div 
              className="score-stat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span className="stat-label">Final Score</span>
              <span className="stat-value">{score.toLocaleString()}</span>
            </motion.div>
            
            <motion.div 
              className="score-stat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{correctAnswers} / {totalQuestions}</span>
            </motion.div>
            
            <motion.div 
              className="score-stat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{percentage}%</span>
            </motion.div>
          </div>

          <div className="score-breakdown">
            <div className="accuracy-bar">
              <motion.div 
                className="accuracy-fill"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, delay: 1.3 }}
              />
            </div>
            <span className="accuracy-text">{percentage}% Accuracy</span>
          </div>
        </>
      )}

      <motion.button
        className="restart-button"
        onClick={onRestart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw size={20} />
        Play Again
      </motion.button>
    </motion.div>
  );
};

export default ScoreBoard;