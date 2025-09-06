import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen } from 'lucide-react';

const CognitiveDistortions = () => {
  const [gameMode, setGameMode] = useState('learn'); // 'learn', 'quiz', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStats, setGameStats] = useState(() => {
    const saved = localStorage.getItem('distortionGameStats');
    return saved ? JSON.parse(saved) : { gamesPlayed: 0, bestScore: 0, totalCorrect: 0 };
  });

  const distortions = [
    {
      name: "All-or-Nothing Thinking",
      description: "Seeing things in black and white categories. If your performance falls short of perfect, you see yourself as a total failure.",
      example: "I made one mistake on the presentation, so I'm a terrible speaker.",
      keywords: ["always", "never", "completely", "totally", "perfect", "disaster"]
    },
    {
      name: "Overgeneralization",
      description: "Seeing a single negative event as a never-ending pattern of defeat.",
      example: "I didn't get this job, so I'll never find employment.",
      keywords: ["always", "never", "everyone", "nobody", "everything", "nothing"]
    },
    {
      name: "Mental Filter",
      description: "Picking out a single negative detail and dwelling on it exclusively.",
      example: "The boss praised my work but mentioned one small improvement, so she must hate my performance.",
      keywords: ["only", "just", "but", "except", "however"]
    },
    {
      name: "Discounting the Positive",
      description: "Rejecting positive experiences by insisting they don't count for some reason.",
      example: "She only said my presentation was good to be nice.",
      keywords: ["just being nice", "doesn't count", "anyone could", "lucky"]
    },
    {
      name: "Jumping to Conclusions",
      description: "Making negative interpretations without definite facts to support your conclusion.",
      example: "My friend didn't text back immediately, so she must be angry with me.",
      keywords: ["must be", "probably", "I bet", "surely"]
    },
    {
      name: "Catastrophizing",
      description: "Expecting disaster to strike, magnifying the importance of negative events.",
      example: "If I fail this test, I'll never graduate and my life will be ruined.",
      keywords: ["disaster", "terrible", "awful", "worst", "ruined", "doomed"]
    },
    {
      name: "Emotional Reasoning",
      description: "Assuming that your negative emotions necessarily reflect the way things really are.",
      example: "I feel guilty, so I must have done something bad.",
      keywords: ["I feel", "since I feel", "because I feel"]
    },
    {
      name: "Should Statements",
      description: "Trying to motivate yourself with shoulds and shouldn'ts, creating guilt and pressure.",
      example: "I should be able to handle this stress without help.",
      keywords: ["should", "must", "ought to", "have to", "supposed to"]
    },
    {
      name: "Labeling",
      description: "Attaching a negative label to yourself or others instead of describing the specific behavior.",
      example: "I made a mistake, so I'm an idiot.",
      keywords: ["I'm a", "he's a", "she's a", "they're all"]
    },
    {
      name: "Personalization",
      description: "Seeing yourself as the cause of some negative external event which you were not responsible for.",
      example: "My team lost the project because I wasn't good enough.",
      keywords: ["my fault", "because of me", "I caused", "if only I"]
    }
  ];

  const scenarios = [
    {
      situation: "Your friend doesn't respond to your text for several hours.",
      thought: "She must be angry with me about something I said.",
      correct: "Jumping to Conclusions",
      explanation: "You're making negative interpretations without definite facts. There could be many reasons she hasn't responded."
    },
    {
      situation: "You get a B+ on an important exam.",
      thought: "I'm a complete failure. I should have gotten an A.",
      correct: "All-or-Nothing Thinking",
      explanation: "You're seeing your performance in black and white terms. A B+ is actually a good grade, not a complete failure."
    },
    {
      situation: "You receive mostly positive feedback with one constructive criticism.",
      thought: "They must think I'm terrible at my job.",
      correct: "Mental Filter",
      explanation: "You're focusing exclusively on the one piece of constructive feedback while ignoring all the positive comments."
    },
    {
      situation: "Your presentation goes well but you stumble over one word.",
      thought: "The whole presentation was a disaster.",
      correct: "All-or-Nothing Thinking",
      explanation: "One small mistake doesn't make the entire presentation a disaster. You're thinking in black and white terms."
    },
    {
      situation: "You get a compliment on your work.",
      thought: "They're just being nice. Anyone could have done this.",
      correct: "Discounting the Positive",
      explanation: "You're rejecting the positive experience by insisting it doesn't count or matter."
    },
    {
      situation: "You feel nervous about an upcoming meeting.",
      thought: "I feel anxious, so something bad is definitely going to happen.",
      correct: "Emotional Reasoning",
      explanation: "You're assuming that your anxiety means something bad will actually happen, when feelings don't predict reality."
    },
    {
      situation: "You make a mistake at work.",
      thought: "I'm such an idiot. I can't do anything right.",
      correct: "Labeling",
      explanation: "You're attaching a negative label to yourself instead of just acknowledging you made a mistake."
    },
    {
      situation: "Your team project doesn't go as planned.",
      thought: "It's all my fault. If only I had worked harder.",
      correct: "Personalization",
      explanation: "You're taking responsibility for something that involved multiple people and factors beyond your control."
    },
    {
      situation: "You don't get a promotion you applied for.",
      thought: "I'll never advance in my career. I'm not cut out for success.",
      correct: "Overgeneralization",
      explanation: "You're seeing one negative event as a never-ending pattern of defeat and making broad conclusions."
    },
    {
      situation: "You're struggling with a difficult task.",
      thought: "I should be able to handle this easily. I must be incompetent.",
      correct: "Should Statements",
      explanation: "You're putting pressure on yourself with 'should' statements and then labeling yourself when you don't meet unrealistic expectations."
    }
  ];

  const shuffledScenarios = scenarios.sort(() => Math.random() - 0.5).slice(0, 5);

  const startQuiz = () => {
    setGameMode('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswer = (distortionName) => {
    setSelectedAnswer(distortionName);
    setShowExplanation(true);
    
    if (distortionName === shuffledScenarios[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledScenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Game finished
      const newStats = {
        gamesPlayed: gameStats.gamesPlayed + 1,
        bestScore: Math.max(gameStats.bestScore, score),
        totalCorrect: gameStats.totalCorrect + score
      };
      setGameStats(newStats);
      localStorage.setItem('distortionGameStats', JSON.stringify(newStats));
      setGameMode('results');
    }
  };

  const resetGame = () => {
    setGameMode('learn');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (gameMode === 'learn') {
    return (
      <div className="cognitive-distortions-container">
        <motion.div 
          className="distortions-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain size={32} className="header-icon" />
          <div>
            <h2>Cognitive Distortion Detective</h2>
            <p>Learn to identify thinking traps that affect your mood</p>
          </div>
        </motion.div>

        <div className="distortions-content">
          <motion.div 
            className="intro-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3>What are Cognitive Distortions?</h3>
            <p>Cognitive distortions are patterns of thinking that are inaccurate or biased, often in a negative way. Learning to recognize these patterns is the first step in changing them.</p>
          </motion.div>

          <div className="distortions-grid">
            {distortions.map((distortion, index) => (
              <motion.div
                key={distortion.name}
                className="distortion-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <h4>{distortion.name}</h4>
                <p className="distortion-description">{distortion.description}</p>
                <div className="distortion-example">
                  <strong>Example:</strong> <em>"{distortion.example}"</em>
                </div>
                <div className="distortion-keywords">
                  <strong>Common words:</strong> {distortion.keywords.join(', ')}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="start-quiz-button"
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Trophy size={20} />
            Test Your Skills
          </motion.button>
        </div>
      </div>
    );
  }

  if (gameMode === 'quiz') {
    const currentScenario = shuffledScenarios[currentQuestion];
    const options = [
      currentScenario.correct,
      ...distortions
        .filter(d => d.name !== currentScenario.correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(d => d.name)
    ].sort(() => Math.random() - 0.5);

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            Question {currentQuestion + 1} of {shuffledScenarios.length}
          </div>
          <div className="quiz-score">Score: {score}</div>
        </div>

        <motion.div 
          className="scenario-card"
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>Scenario</h3>
          <p className="scenario-situation">{currentScenario.situation}</p>
          <div className="thought-bubble">
            <strong>Thought:</strong> "{currentScenario.thought}"
          </div>

          <h4>Which cognitive distortion is this?</h4>
          <div className="options-grid">
            {options.map((option) => (
              <motion.button
                key={option}
                className={`option-button ${
                  selectedAnswer === option 
                    ? option === currentScenario.correct 
                      ? 'correct' 
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswer(option)}
                disabled={showExplanation}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
              >
                {option}
                {selectedAnswer === option && (
                  option === currentScenario.correct 
                    ? <CheckCircle size={20} />
                    : <XCircle size={20} />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                className="explanation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h4>Explanation</h4>
                <p>{currentScenario.explanation}</p>
                
                <motion.button
                  className="next-button"
                  onClick={nextQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentQuestion < shuffledScenarios.length - 1 ? 'Next Question' : 'See Results'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (gameMode === 'results') {
    return (
      <div className="results-container">
        <motion.div 
          className="results-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Trophy size={48} className="results-icon" />
          <h2>Quiz Complete!</h2>
          <div className="final-score">
            You scored {score} out of {shuffledScenarios.length}
          </div>
          
          <div className="performance-message">
            {score === shuffledScenarios.length && "Perfect! You're a cognitive distortion detective!"}
            {score >= shuffledScenarios.length * 0.8 && score < shuffledScenarios.length && "Excellent work! You've got a great understanding."}
            {score >= shuffledScenarios.length * 0.6 && score < shuffledScenarios.length * 0.8 && "Good job! Keep practicing to improve your skills."}
            {score < shuffledScenarios.length * 0.6 && "Keep learning! Review the distortions and try again."}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Games Played</h4>
              <div className="stat-number">{gameStats.gamesPlayed}</div>
            </div>
            <div className="stat-card">
              <h4>Best Score</h4>
              <div className="stat-number">{gameStats.bestScore}/{shuffledScenarios.length}</div>
            </div>
            <div className="stat-card">
              <h4>Accuracy</h4>
              <div className="stat-number">
                {gameStats.gamesPlayed > 0 
                  ? Math.round((gameStats.totalCorrect / (gameStats.gamesPlayed * shuffledScenarios.length)) * 100)
                  : 0}%
              </div>
            </div>
          </div>

          <div className="results-actions">
            <motion.button
              className="action-button primary"
              onClick={startQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              Play Again
            </motion.button>
            
            <motion.button
              className="action-button secondary"
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen size={20} />
              Review Distortions
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
};

export default CognitiveDistortions;