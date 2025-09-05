import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Score management hooks
export const useScoreHistory = () => {
  const [scores, setScores] = useLocalStorage('quiz-scores', []);

  const addScore = (scoreData) => {
    const newScore = {
      ...scoreData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    setScores(prev => [newScore, ...prev].slice(0, 50)); // Keep only last 50 scores
  };

  const getTopScores = (limit = 10) => {
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  const getScoresByGameMode = (gameMode) => {
    return scores.filter(score => score.gameMode === gameMode);
  };

  return { scores, addScore, getTopScores, getScoresByGameMode };
};

// User preferences hook
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('quiz-preferences', {
    theme: 'light',
    volume: 0.7,
    difficulty: 'easy',
    preferredGenres: ['pop', 'rock'],
    autoplay: true,
    showHints: true
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return { preferences, updatePreference };
};

// Daily challenge hook
export const useDailyChallenge = () => {
  const [dailyData, setDailyData] = useLocalStorage('daily-challenge', {
    lastAttempt: null,
    streak: 0,
    completedToday: false,
    bestScore: 0
  });

  const isNewDay = () => {
    const today = new Date().toDateString();
    const lastAttempt = dailyData.lastAttempt ? new Date(dailyData.lastAttempt).toDateString() : null;
    return today !== lastAttempt;
  };

  const completeDailyChallenge = (score) => {
    const today = new Date().toISOString();
    const isNew = isNewDay();
    
    setDailyData(prev => ({
      lastAttempt: today,
      streak: isNew ? prev.streak + 1 : prev.streak,
      completedToday: true,
      bestScore: Math.max(prev.bestScore, score)
    }));
  };

  const canPlayDaily = () => {
    return isNewDay() || !dailyData.completedToday;
  };

  return { dailyData, completeDailyChallenge, canPlayDaily, isNewDay };
};