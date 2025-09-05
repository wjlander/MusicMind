import { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionCard = ({ question, onAnswer, onPlayPreview, isPlaying, onTogglePlayPause }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hasPlayedPreview, setHasPlayedPreview] = useState(false);

  useEffect(() => {
    // Auto-play preview when question loads
    if (question.track.preview_url && !hasPlayedPreview) {
      setTimeout(() => {
        onPlayPreview(question.track.preview_url);
        setHasPlayedPreview(true);
      }, 500);
    }
  }, [question, onPlayPreview, hasPlayedPreview]);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setShowResult(false);
    setHasPlayedPreview(false);
  }, [question.id]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(answer);
    }, 1500);
  };

  const getAnswerClassName = (answer) => {
    if (!showResult) return 'answer-button';
    
    if (answer === question.correctAnswer) {
      return 'answer-button correct';
    }
    
    if (answer === selectedAnswer && answer !== question.correctAnswer) {
      return 'answer-button incorrect';
    }
    
    return 'answer-button';
  };

  return (
    <motion.div 
      className="question-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Album Art */}
      <div className="album-art-container">
        <img 
          src={question.track.album.images[1]?.url || question.track.album.images[0]?.url}
          alt={`${question.track.album.name} cover`}
          className="album-art"
        />
        
        {/* Audio Controls */}
        <div className="audio-controls">
          <button 
            onClick={onTogglePlayPause}
            className="play-button"
            disabled={!question.track.preview_url}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          {!question.track.preview_url && (
            <span className="no-preview">No preview available</span>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="question-content">
        <h3 className="question-title">{question.question}</h3>
        
        {/* Track Info (for context) */}
        <div className="track-info">
          {question.gameMode !== 'song' && (
            <p className="track-name">"{question.track.name}"</p>
          )}
          {question.gameMode !== 'artist' && (
            <p className="artist-name">by {question.track.artists[0].name}</p>
          )}
        </div>

        {/* Answers */}
        <div className="answers-grid">
          <AnimatePresence>
            {question.answers.map((answer, index) => (
              <motion.button
                key={answer}
                className={getAnswerClassName(answer)}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                <span className="answer-text">{answer}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Result feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div 
              className="result-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {selectedAnswer === question.correctAnswer ? (
                <div className="feedback correct-feedback">
                  <span className="feedback-icon">🎉</span>
                  <span>Correct! Great job!</span>
                </div>
              ) : (
                <div className="feedback incorrect-feedback">
                  <span className="feedback-icon">❌</span>
                  <span>Incorrect. The answer was: {question.correctAnswer}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionCard;