import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Trophy, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import spotifyService from '../services/spotifyService';
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

  const loadGenres = async () => {
    try {
      const genres = await spotifyService.getGenreSeeds();
      setAvailableGenres(genres);
    } catch (error) {
      console.error('Failed to load genres:', error);
      // Use fallback genres if API fails
      setAvailableGenres(['pop', 'rock', 'hip-hop', 'electronic', 'country', 'jazz', 'classical', 'r-n-b']);
    }
  };

  const generateQuestions = async (settings) => {
    setIsLoading(true);
    try {
      let tracks = [];
      
      // Try multiple search strategies to find tracks with previews
      const searchStrategies = [];
      
      if (settings.decade) {
        searchStrategies.push(
          () => spotifyService.searchTracks(`${settings.decade}s top hits popular`, 50),
          () => spotifyService.searchTracks(`${settings.decade}s classic rock pop`, 50),
          () => spotifyService.searchTracks(`${settings.decade}s greatest hits`, 50)
        );
      } else if (settings.genre) {
        searchStrategies.push(
          () => spotifyService.searchTracks(`${settings.genre} top hits popular`, 50),
          () => spotifyService.searchTracks(`${settings.genre} greatest hits`, 50),
          () => spotifyService.getRecommendations([settings.genre], 50)
        );
      } else {
        searchStrategies.push(
          () => spotifyService.searchTracks('top hits 2023 2024', 50),
          () => spotifyService.searchTracks('popular songs charts', 50),
          () => spotifyService.searchTracks('greatest hits all time', 50)
        );
      }

      // Try each strategy until we find tracks with previews
      for (const strategy of searchStrategies) {
        tracks = await strategy();
        const tracksWithPreviews = tracks.filter(track => track && track.preview_url);
        if (tracksWithPreviews.length >= 5) {
          console.log(`Found ${tracksWithPreviews.length} tracks with previews using this search strategy`);
          break;
        }
        console.log(`Search strategy yielded ${tracks.length} tracks, ${tracksWithPreviews.length} with previews - trying next strategy`);
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

      // Take up to 10 tracks for the quiz
      const numQuestions = Math.min(10, finalTracks.length);
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
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    
    await generateQuestions(settings);
  };

  const handleAnswer = (selectedAnswer) => {
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
    } else {
      setLives(prev => prev - 1);
    }

    // Stop current audio
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion + 1 >= questions.length || lives - (isCorrect ? 0 : 1) <= 0) {
        setGameState('finished');
      } else {
        setCurrentQuestion(prev => prev + 1);
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
          <div className="lives">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={`life ${i < lives ? 'active' : ''}`}>❤️</div>
            ))}
          </div>
        </div>
        <div className="score">Score: {score}</div>
      </div>

      {question && (
        <QuestionCard
          question={question}
          onAnswer={handleAnswer}
          onPlayPreview={playPreview}
          isPlaying={isPlaying}
          onTogglePlayPause={togglePlayPause}
        />
      )}
    </div>
  );
};

export default QuizGame;