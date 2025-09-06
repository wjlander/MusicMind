import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Trophy, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import spotifyService from '../services/spotifyService';
import itunesService from '../services/itunesService';
import QuestionCard from './QuestionCard';
import ScoreBoard from './ScoreBoard';
import GameSettings from './GameSettings';

const QuizGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameMode, setGameMode] = useState('artist'); // artist, song, album
  const [genre, setGenre] = useState('pop');
  const [decade, setDecade] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Multiplayer state
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(['Player 1']);
  const [playerScores, setPlayerScores] = useState([0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roundType, setRoundType] = useState('standard');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    // Load available genres on component mount
    loadGenres();
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  // Timer effect for timed rounds
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time's up! Move to next player or question
      setTimerActive(false);
      // Call timeout handler with current values
      handleTimeOut();
    }
    
    return () => clearTimeout(timer);
  }, [timerActive, timeLeft]);

  const handleTimeOut = () => {
    // Handle timeout with current state values
    handleAnswer(null);
  };

  const loadGenres = async () => {
    try {
      // Use iTunes available genres (no API call needed)
      const genres = itunesService.getAvailableGenres();
      setAvailableGenres(genres);
    } catch (error) {
      console.error('Failed to load genres:', error);
      // Use fallback genres if something goes wrong
      setAvailableGenres(['pop', 'rock', 'hip-hop', 'electronic', 'country', 'jazz', 'classical', 'r-n-b']);
    }
  };

  const generateQuestions = async (settings) => {
    setIsLoading(true);
    try {
      let tracks = [];
      
      // Try iTunes first (more reliable previews), then fallback to Spotify
      console.log('Trying iTunes Search API first...');
      
      if (settings.decade) {
        tracks = await itunesService.getTracksByDecade(parseInt(settings.decade), 50);
      } else if (settings.genre) {
        tracks = await itunesService.getTracksByGenre(settings.genre, 50);
      } else {
        tracks = await itunesService.getPopularTracks(50);
      }
      
      // If iTunes doesn't return enough tracks, fallback to Spotify
      if (tracks.length < 10) {
        console.log(`iTunes returned ${tracks.length} tracks, trying Spotify as fallback...`);
        let spotifyTracks = [];
        
        if (settings.decade) {
          spotifyTracks = await spotifyService.getTracksByDecade(parseInt(settings.decade), 50);
        } else if (settings.genre) {
          spotifyTracks = await spotifyService.getRecommendations([settings.genre], 50);
        } else {
          spotifyTracks = await spotifyService.searchTracks('top hits 2023 2024', 50);
        }
        
        // Combine iTunes and Spotify results
        tracks = [...tracks, ...spotifyTracks];
      }

      if (tracks.length === 0) {
        throw new Error('No tracks found for the selected criteria');
      }

      // Filter tracks with preview URLs, but also allow tracks without previews as fallback
      const tracksWithPreviews = tracks.filter(track => track && track.preview_url);
      const allValidTracks = tracks.filter(track => track && track.name && track.artists && track.artists.length > 0);
      
      console.log(`Found ${tracks.length} total tracks, ${tracksWithPreviews.length} with previews, ${allValidTracks.length} valid tracks`);
      
      // Prefer tracks with previews, but allow quiz without audio if needed
      let finalTracks = tracksWithPreviews.length >= 5 ? tracksWithPreviews : allValidTracks;
      
      if (finalTracks.length === 0) {
        throw new Error('No valid tracks found for the selected criteria');
      }

      // Take tracks based on round type
      const numQuestions = Math.min(questionCount, finalTracks.length);
      const shuffledTracks = finalTracks.sort(() => Math.random() - 0.5).slice(0, numQuestions);
      
      // Let user know if playing without audio
      if (tracksWithPreviews.length < 5 && allValidTracks.length >= 5) {
        console.log('Playing quiz in text-only mode (no audio previews available)');
      }
      
      const generatedQuestions = shuffledTracks.map((track, index) => {
        const correctAnswer = getCorrectAnswer(track, settings.gameMode);
        const wrongAnswers = generateWrongAnswers(tracks, track, settings.gameMode);
        const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        return {
          id: index + 1,
          track,
          question: getQuestionText(settings.gameMode),
          answers: allAnswers,
          correctAnswer,
          gameMode: settings.gameMode
        };
      });

      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to load quiz questions. Please try again with different settings.');
      setGameState('menu');
    }
    setIsLoading(false);
  };

  const getCorrectAnswer = (track, mode) => {
    switch (mode) {
      case 'artist':
        return track.artists[0].name;
      case 'song':
        return track.name;
      case 'album':
        return track.album.name;
      default:
        return track.artists[0].name;
    }
  };

  const generateWrongAnswers = (allTracks, correctTrack, mode) => {
    const wrongAnswers = [];
    const usedAnswers = new Set([getCorrectAnswer(correctTrack, mode)]);
    
    while (wrongAnswers.length < 3 && allTracks.length > wrongAnswers.length + 1) {
      const randomTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
      const answer = getCorrectAnswer(randomTrack, mode);
      
      if (!usedAnswers.has(answer)) {
        wrongAnswers.push(answer);
        usedAnswers.add(answer);
      }
    }
    
    return wrongAnswers;
  };

  const getQuestionText = (mode) => {
    switch (mode) {
      case 'artist':
        return 'Who is the artist?';
      case 'song':
        return 'What is the song title?';
      case 'album':
        return 'What album is this from?';
      default:
        return 'Who is the artist?';
    }
  };

  const startGame = async (settings) => {
    setGameMode(settings.gameMode);
    setGenre(settings.genre);
    setDecade(settings.decade);
    setPlayerCount(settings.playerCount);
    setPlayerNames(settings.playerNames);
    setRoundType(settings.roundType);
    setQuestionCount(settings.questionCount);
    setTimeLimit(settings.timeLimit);
    setTimeLeft(settings.timeLimit);
    
    // Initialize player scores
    setPlayerScores(new Array(settings.playerCount).fill(0));
    setCurrentPlayer(0);
    
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    
    // Start timer for timed rounds
    if (settings.roundType === 'lightning') {
      setTimerActive(true);
    }
    
    await generateQuestions(settings);
  };

  const handleAnswer = (selectedAnswer) => {
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer && selectedAnswer === question.correctAnswer;
    
    // Stop timer
    setTimerActive(false);
    
    // Update current player's score
    if (isCorrect) {
      const newScores = [...playerScores];
      newScores[currentPlayer] += 100;
      setPlayerScores(newScores);
      
      // For single player, also update main score
      if (playerCount === 1) {
        setScore(prev => prev + 100);
      }
    } else if (playerCount === 1) {
      // Only use lives system in single player
      setLives(prev => prev - 1);
    }

    // Stop current audio
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }

    // Move to next question/player after a short delay
    setTimeout(() => {
      if (playerCount > 1) {
        // Multiplayer: each player gets a different question
        const nextPlayer = (currentPlayer + 1) % playerCount;
        console.log(`Switching from player ${currentPlayer} (${playerNames[currentPlayer]}) to player ${nextPlayer} (${playerNames[nextPlayer]})`);
        setCurrentPlayer(nextPlayer);
        
        // Always move to the next question in multiplayer (each player gets different questions)
        if (currentQuestion + 1 >= questions.length) {
          setGameState('finished');
          return;
        } else {
          setCurrentQuestion(prev => prev + 1);
          console.log(`Moving to question ${currentQuestion + 2} for ${playerNames[nextPlayer]}`);
        }
        
        // Reset timer for next player 
        setTimeLeft(timeLimit);
        if (roundType === 'lightning') {
          setTimerActive(true);
        }
        
        // Reset audio for the new player
        if (audio) {
          audio.pause();
          setIsPlaying(false);
          setAudio(null);
        }
      } else {
        // Single player: check for game end
        if (currentQuestion + 1 >= questions.length || lives - (isCorrect ? 0 : 1) <= 0) {
          setGameState('finished');
        } else {
          setCurrentQuestion(prev => prev + 1);
          // Reset timer for next question
          setTimeLeft(timeLimit);
          if (roundType === 'lightning') {
            setTimerActive(true);
          }
        }
      }
    }, 1500);
  };

  const playPreview = (previewUrl) => {
    if (audio) {
      audio.pause();
    }

    if (previewUrl) {
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
      
      newAudio.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const resetGame = () => {
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setGameState('menu');
    setCurrentQuestion(0);
    setQuestions([]);
    setScore(0);
    setLives(3);
    setIsPlaying(false);
    setAudio(null);
    setTimerActive(false);
    setCurrentPlayer(0);
    setPlayerScores([0]);
    setTimeLeft(30);
  };

  if (gameState === 'menu') {
    return (
      <div className="quiz-container">
        <motion.div 
          className="menu-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="menu-header">
            <Music size={48} className="menu-icon" />
            <h2>Choose Your Challenge</h2>
          </div>
          
          <GameSettings 
            onStartGame={startGame}
            availableGenres={availableGenres}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="quiz-container">
        <ScoreBoard 
          score={score}
          totalQuestions={questions.length}
          onRestart={resetGame}
          playerCount={playerCount}
          playerNames={playerNames}
          playerScores={playerScores}
          roundType={roundType}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="loading-card">
          <Music size={48} className="loading-icon" />
          <h3>Loading your music quiz...</h3>
          <p>Finding the perfect tracks for you!</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="game-header">
        <div className="game-info">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          {playerCount === 1 && (
            <div className="lives">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className={`life ${i < lives ? 'active' : ''}`}>❤️</div>
              ))}
            </div>
          )}
          {playerCount > 1 && (
            <div className="current-player">
              <span>👤 {playerNames[currentPlayer]}'s Turn</span>
            </div>
          )}
          {roundType === 'lightning' && (
            <div className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>
              ⏱️ {timeLeft}s
            </div>
          )}
        </div>
        
        {playerCount === 1 ? (
          <div className="score">Score: {score}</div>
        ) : (
          <div className="multiplayer-scores">
            {playerNames.map((name, index) => (
              <div key={index} className={`player-score ${index === currentPlayer ? 'active' : ''}`}>
                <span className="player-name">{name}</span>
                <span className="player-points">{playerScores[index]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {question && (
        <QuestionCard
          key={`${currentQuestion}-${currentPlayer}`}
          question={question}
          onAnswer={handleAnswer}
          onPlayPreview={playPreview}
          isPlaying={isPlaying}
          onTogglePlayPause={togglePlayPause}
          currentPlayer={playerCount > 1 ? playerNames[currentPlayer] : null}
        />
      )}
    </div>
  );
};

export default QuizGame;