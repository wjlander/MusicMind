import { useState } from 'react';
import { Play, Music, Calendar, Disc, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const GameSettings = ({ onStartGame, availableGenres, isLoading }) => {
  const [gameMode, setGameMode] = useState('artist');
  const [genre, setGenre] = useState('pop');
  const [decade, setDecade] = useState('');
  const [playerCount, setPlayerCount] = useState(1);
  const [roundType, setRoundType] = useState('standard');
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);

  const decades = [
    { value: '', label: 'All Time' },
    { value: '2020', label: '2020s' },
    { value: '2010', label: '2010s' },
    { value: '2000', label: '2000s' },
    { value: '1990', label: '1990s' },
    { value: '1980', label: '1980s' },
    { value: '1970', label: '1970s' },
    { value: '1960', label: '1960s' }
  ];

  const roundTypes = [
    { value: 'standard', label: 'Standard (10 questions)', questions: 10 },
    { value: 'quick', label: 'Quick Fire (5 questions)', questions: 5 },
    { value: 'marathon', label: 'Marathon (20 questions)', questions: 20 },
    { value: 'lightning', label: 'Lightning Round (15 seconds each)', questions: 8 }
  ];

  const gameModes = [
    { 
      value: 'artist', 
      label: 'Guess the Artist', 
      icon: Music,
      description: 'Listen and identify who performed the song'
    },
    { 
      value: 'song', 
      label: 'Guess the Song', 
      icon: Disc,
      description: 'Listen and identify the song title'
    },
    { 
      value: 'album', 
      label: 'Guess the Album', 
      icon: Calendar,
      description: 'Listen and identify which album the song is from'
    }
  ];

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name || `Player ${index + 1}`;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const selectedRoundType = roundTypes.find(rt => rt.value === roundType);
    onStartGame({
      gameMode,
      genre: genre || null,
      decade: decade || null,
      playerCount,
      roundType,
      questionCount: selectedRoundType.questions,
      playerNames: playerNames.slice(0, playerCount),
      timeLimit: roundType === 'lightning' ? 15 : 30
    });
  };

  return (
    <div className="game-settings">
      <motion.div 
        className="settings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3>Game Mode</h3>
        <div className="game-modes">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <motion.button
                key={mode.value}
                className={`mode-button ${gameMode === mode.value ? 'active' : ''}`}
                onClick={() => setGameMode(mode.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent size={24} />
                <div className="mode-info">
                  <span className="mode-title">{mode.label}</span>
                  <span className="mode-description">{mode.description}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div 
        className="settings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3>
          <Users size={20} style={{ marginRight: '8px' }} />
          Players
        </h3>
        <div className="player-selector">
          {[1, 2, 3, 4].map(num => (
            <motion.button
              key={num}
              className={`player-button ${playerCount === num ? 'active' : ''}`}
              onClick={() => setPlayerCount(num)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {num}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="settings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.17 }}
      >
        <h3>Round Type</h3>
        <select 
          value={roundType} 
          onChange={(e) => setRoundType(e.target.value)}
          className="settings-select"
        >
          {roundTypes.map(rt => (
            <option key={rt.value} value={rt.value}>{rt.label}</option>
          ))}
        </select>
      </motion.div>

      {playerCount > 1 && (
        <motion.div 
          className="settings-section"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Player Names</h3>
          <div className="player-names-grid">
            {Array.from({ length: playerCount }, (_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Player ${i + 1}`}
                value={playerNames[i]}
                onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                className="player-name-input"
                maxLength={15}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="settings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Music Genre</h3>
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
          className="settings-select"
        >
          {availableGenres.map(genreOption => (
            <option key={genreOption} value={genreOption}>
              {genreOption.charAt(0).toUpperCase() + genreOption.slice(1).replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div 
        className="settings-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3>Era</h3>
        <select 
          value={decade} 
          onChange={(e) => setDecade(e.target.value)}
          className="settings-select"
        >
          {decades.map(dec => (
            <option key={dec.value} value={dec.value}>
              {dec.label}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.button
        className="start-button"
        onClick={handleStart}
        disabled={isLoading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: isLoading ? 1 : 1.05 }}
        whileTap={{ scale: isLoading ? 1 : 0.95 }}
      >
        <Play size={20} />
        {isLoading ? 'Loading...' : `Start ${playerCount === 1 ? 'Game' : 'Multiplayer Game'}`}
      </motion.button>
    </div>
  );
};

export default GameSettings;