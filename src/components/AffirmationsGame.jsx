import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Plus, Trash2, RotateCcw, Play, Pause, Volume2 } from 'lucide-react';

const AffirmationsGame = () => {
  const [mode, setMode] = useState('daily'); // daily, custom, session
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [customAffirmations, setCustomAffirmations] = useState([]);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('self-love');

  const affirmationCategories = {
    'self-love': {
      name: 'Self-Love & Acceptance',
      color: '#ed64a6',
      icon: '💝',
      affirmations: [
        "I am worthy of love and respect exactly as I am",
        "I choose to be kind and patient with myself today",
        "My feelings are valid and I honor them",
        "I am enough, just as I am in this moment",
        "I celebrate my unique qualities and strengths",
        "I deserve happiness and inner peace",
        "I am learning and growing every day",
        "I forgive myself for past mistakes and embrace growth"
      ]
    },
    'confidence': {
      name: 'Confidence & Strength',
      color: '#f56565',
      icon: '💪',
      affirmations: [
        "I believe in my abilities and trust my decisions",
        "I am capable of handling whatever comes my way",
        "My confidence grows stronger every day",
        "I speak up for myself with clarity and kindness",
        "I am brave and face challenges with courage",
        "I trust my inner wisdom and intuition",
        "I am powerful and in control of my life",
        "I embrace new opportunities with confidence"
      ]
    },
    'peace': {
      name: 'Peace & Calm',
      color: '#48bb78',
      icon: '🕊️',
      affirmations: [
        "I am at peace with where I am in my journey",
        "I breathe in calm and breathe out tension",
        "I choose peace over worry in this moment",
        "My mind is clear and my heart is light",
        "I release what I cannot control",
        "Serenity flows through me naturally",
        "I am centered and grounded in the present",
        "Peace is my natural state of being"
      ]
    },
    'gratitude': {
      name: 'Gratitude & Joy',
      color: '#ffd93d',
      icon: '🌟',
      affirmations: [
        "I am grateful for all the good in my life",
        "Joy flows freely through me today",
        "I notice and appreciate the beauty around me",
        "My heart is full of gratitude and love",
        "I attract positivity and abundance",
        "Every day brings new reasons to be thankful",
        "I choose to focus on what's going well",
        "Happiness is my birthright and I claim it"
      ]
    },
    'healing': {
      name: 'Healing & Recovery',
      color: '#38b2ac',
      icon: '🌿',
      affirmations: [
        "I am healing more each day, in every way",
        "My body and mind know how to restore themselves",
        "I give myself permission to heal at my own pace",
        "Each breath brings me closer to wholeness",
        "I am patient and gentle with my healing process",
        "I trust my body's wisdom to guide my recovery",
        "Healing energy flows through me naturally",
        "I am becoming stronger and more resilient"
      ]
    },
    'success': {
      name: 'Success & Achievement',
      color: '#9f7aea',
      icon: '🎯',
      affirmations: [
        "I am creating the life I truly want",
        "Success flows to me naturally and easily",
        "I am worthy of achieving my dreams",
        "Every step I take moves me closer to my goals",
        "I have everything I need to succeed",
        "I celebrate my progress, no matter how small",
        "Opportunities are everywhere and I see them",
        "I am destined for greatness and positive impact"
      ]
    }
  };

  useEffect(() => {
    // Load custom affirmations from localStorage
    const saved = localStorage.getItem('custom-affirmations');
    if (saved) {
      setCustomAffirmations(JSON.parse(saved));
    }
    
    // Set initial daily affirmation
    setDailyAffirmation();
  }, []);

  useEffect(() => {
    let interval;
    if (sessionActive && autoPlay) {
      interval = setInterval(() => {
        nextAffirmation();
      }, 8000); // Change every 8 seconds
    }
    return () => clearInterval(interval);
  }, [sessionActive, autoPlay, sessionIndex]);

  const setDailyAffirmation = () => {
    const today = new Date().getDate();
    const allAffirmations = Object.values(affirmationCategories).flatMap(cat => cat.affirmations);
    const dailyAffirmation = allAffirmations[today % allAffirmations.length];
    setCurrentAffirmation(dailyAffirmation);
  };

  const getRandomAffirmation = (category) => {
    const affirmations = affirmationCategories[category].affirmations;
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  };

  const addCustomAffirmation = () => {
    if (newAffirmation.trim()) {
      const updated = [...customAffirmations, {
        id: Date.now(),
        text: newAffirmation.trim(),
        created: new Date().toISOString()
      }];
      setCustomAffirmations(updated);
      localStorage.setItem('custom-affirmations', JSON.stringify(updated));
      setNewAffirmation('');
    }
  };

  const deleteAffirmation = (id) => {
    const updated = customAffirmations.filter(aff => aff.id !== id);
    setCustomAffirmations(updated);
    localStorage.setItem('custom-affirmations', JSON.stringify(updated));
  };

  const startSession = () => {
    const allAffirmations = [
      ...affirmationCategories[selectedCategory].affirmations,
      ...customAffirmations.map(aff => aff.text)
    ];
    
    if (allAffirmations.length > 0) {
      setSessionActive(true);
      setSessionIndex(0);
      setCurrentAffirmation(allAffirmations[0]);
    }
  };

  const nextAffirmation = () => {
    const allAffirmations = [
      ...affirmationCategories[selectedCategory].affirmations,
      ...customAffirmations.map(aff => aff.text)
    ];
    
    const nextIndex = (sessionIndex + 1) % allAffirmations.length;
    setSessionIndex(nextIndex);
    setCurrentAffirmation(allAffirmations[nextIndex]);
  };

  const endSession = () => {
    setSessionActive(false);
    setSessionIndex(0);
    setAutoPlay(false);
  };

  if (mode === 'session') {
    return (
      <div className="affirmations-container">
        <motion.div className="affirmation-session">
          <div className="session-header">
            <div className="category-info" style={{ color: affirmationCategories[selectedCategory].color }}>
              <span className="category-icon">{affirmationCategories[selectedCategory].icon}</span>
              <span className="category-name">{affirmationCategories[selectedCategory].name}</span>
            </div>
            <button onClick={endSession} className="end-session-btn">End Session</button>
          </div>

          <div className="affirmation-display">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAffirmation}
                className="affirmation-card"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ borderColor: affirmationCategories[selectedCategory].color }}
              >
                <motion.div
                  className="affirmation-text"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  "{currentAffirmation}"
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="session-controls">
            <motion.button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`control-btn ${autoPlay ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {autoPlay ? <Pause size={20} /> : <Play size={20} />}
              {autoPlay ? 'Pause Auto' : 'Auto Play'}
            </motion.button>

            <motion.button
              onClick={nextAffirmation}
              className="control-btn next"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              Next Affirmation
            </motion.button>
          </div>

          <div className="breathing-guide">
            <motion.div
              className="breathing-circle"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ backgroundColor: `${affirmationCategories[selectedCategory].color}20` }}
            >
              <span>Breathe & Believe</span>
            </motion.div>
          </div>

          <div className="session-tips">
            <h4>💫 Session Tips</h4>
            <ul>
              <li>🫁 Take deep breaths as you read each affirmation</li>
              <li>💝 Feel the words in your heart, not just your mind</li>
              <li>🔄 Repeat affirmations that resonate with you</li>
              <li>✨ Visualize the affirmation being true in your life</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="affirmations-container">
      <motion.div className="affirmations-main">
        <div className="affirmations-header">
          <Star size={48} className="affirmations-icon" />
          <h2>Daily Affirmations</h2>
          <p>Reprogram your mind with positive, powerful statements that support your wellbeing and growth</p>
        </div>

        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'daily' ? 'active' : ''}`}
            onClick={() => setMode('daily')}
          >
            Daily Affirmation
          </button>
          <button 
            className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
            onClick={() => setMode('custom')}
          >
            My Affirmations
          </button>
        </div>

        {mode === 'daily' && (
          <div className="daily-affirmation">
            <div className="today-card">
              <h3>Today's Affirmation</h3>
              <div className="daily-affirmation-display">
                <motion.p 
                  className="affirmation-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  "{currentAffirmation}"
                </motion.p>
              </div>
              <button 
                onClick={setDailyAffirmation}
                className="refresh-btn"
              >
                <RotateCcw size={16} />
                New Affirmation
              </button>
            </div>

            <div className="category-selection">
              <h3>Choose a Category</h3>
              <div className="categories-grid">
                {Object.entries(affirmationCategories).map(([key, category]) => (
                  <motion.button
                    key={key}
                    className={`category-card ${selectedCategory === key ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(key);
                      setCurrentAffirmation(getRandomAffirmation(key));
                    }}
                    style={{ 
                      borderColor: category.color,
                      backgroundColor: selectedCategory === key ? `${category.color}15` : 'white'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <h4 style={{ color: category.color }}>{category.name}</h4>
                    <p>{category.affirmations.length} affirmations</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => setMode('session')}
              className="start-session-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Start Guided Session
            </motion.button>
          </div>
        )}

        {mode === 'custom' && (
          <div className="custom-affirmations">
            <div className="add-affirmation">
              <h3>Create Your Personal Affirmations</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={newAffirmation}
                  onChange={(e) => setNewAffirmation(e.target.value)}
                  placeholder="I am..."
                  className="affirmation-input"
                  maxLength={150}
                />
                <motion.button
                  onClick={addCustomAffirmation}
                  className="add-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!newAffirmation.trim()}
                >
                  <Plus size={20} />
                  Add
                </motion.button>
              </div>
              <div className="character-count">
                {newAffirmation.length}/150 characters
              </div>
            </div>

            <div className="affirmation-tips">
              <h4>💡 Tips for Writing Effective Affirmations</h4>
              <ul>
                <li>✅ Use present tense: "I am..." instead of "I will be..."</li>
                <li>💝 Make it personal and meaningful to you</li>
                <li>🌟 Keep it positive - focus on what you want, not what you don't want</li>
                <li>💪 Use empowering language that makes you feel strong</li>
                <li>🎯 Be specific about the qualities or outcomes you desire</li>
              </ul>
            </div>

            {customAffirmations.length > 0 && (
              <div className="custom-list">
                <h3>Your Affirmations ({customAffirmations.length})</h3>
                <div className="affirmations-list">
                  {customAffirmations.map((affirmation) => (
                    <motion.div
                      key={affirmation.id}
                      className="affirmation-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p>"{affirmation.text}"</p>
                      <button
                        onClick={() => deleteAffirmation(affirmation.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {(customAffirmations.length > 0 || affirmationCategories[selectedCategory].affirmations.length > 0) && (
              <motion.button
                onClick={() => setMode('session')}
                className="start-session-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                Practice My Affirmations
              </motion.button>
            )}
          </div>
        )}

        <div className="affirmations-science">
          <h4>🧠 The Science of Affirmations</h4>
          <p>
            Research shows that positive affirmations can rewire your brain through neuroplasticity, 
            reduce stress, improve performance, and increase overall life satisfaction. Regular practice 
            helps build new neural pathways that support positive thinking patterns.
          </p>
          <div className="benefits-list">
            <span className="benefit">🧘 Reduced Anxiety</span>
            <span className="benefit">💪 Increased Confidence</span>
            <span className="benefit">🎯 Better Focus</span>
            <span className="benefit">❤️ Improved Self-Worth</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AffirmationsGame;