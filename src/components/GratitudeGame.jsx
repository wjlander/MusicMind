import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Save, RotateCcw } from 'lucide-react';

const GratitudeGame = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [completedToday, setCompletedToday] = useState(false);

  const prompts = [
    "What made you smile today?",
    "Who are you grateful to have in your life?",
    "What small pleasure did you enjoy today?",
    "What challenge helped you grow recently?",
    "What in nature brings you peace?",
    "What skill or ability are you thankful for?",
    "What made you feel loved or cared for?",
    "What simple comfort makes your day better?",
    "What memory brings you joy?",
    "What opportunity are you grateful for?",
    "What act of kindness did you witness or receive?",
    "What about your health are you thankful for?",
    "What place makes you feel happy?",
    "What lesson learned are you grateful for?",
    "What tradition or routine do you appreciate?"
  ];

  useEffect(() => {
    // Load saved entries from localStorage
    const saved = localStorage.getItem('gratitude-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    
    // Check if completed today
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('gratitude-last-date');
    setCompletedToday(savedDate === today);
    
    // Set random prompt
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const saveEntry = () => {
    if (!currentEntry.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      text: currentEntry.trim(),
      date: new Date().toLocaleDateString(),
      prompt: currentPrompt
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    
    // Save to localStorage
    localStorage.setItem('gratitude-entries', JSON.stringify(updatedEntries));
    localStorage.setItem('gratitude-last-date', new Date().toDateString());
    
    setCurrentEntry('');
    setCompletedToday(true);
    
    // Get new prompt for next time
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const newEntry = () => {
    setCompletedToday(false);
    setCurrentEntry('');
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('gratitude-entries', JSON.stringify(updatedEntries));
  };

  if (completedToday && entries.length > 0) {
    return (
      <div className="gratitude-container">
        <motion.div className="gratitude-complete">
          <Heart size={64} color="#48bb78" />
          <h2>Today's Gratitude Recorded!</h2>
          <p>You've taken a moment to appreciate the good in your life today.</p>
          
          <div className="recent-entry">
            <h3>Your most recent entry:</h3>
            <div className="entry-card">
              <p className="entry-prompt">"{entries[0].prompt}"</p>
              <p className="entry-text">{entries[0].text}</p>
              <p className="entry-date">{entries[0].date}</p>
            </div>
          </div>

          <div className="gratitude-benefits">
            <h4>Benefits of Gratitude Practice:</h4>
            <ul>
              <li>🧠 Improves mental well-being</li>
              <li>😊 Increases happiness and life satisfaction</li>
              <li>💤 Promotes better sleep</li>
              <li>❤️ Strengthens relationships</li>
              <li>🌱 Builds resilience and optimism</li>
            </ul>
          </div>

          <motion.button
            onClick={newEntry}
            className="new-entry-button"
            whileHover={{ scale: 1.05 }}
          >
            Write Another Entry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="gratitude-container">
      <motion.div className="gratitude-journal">
        <div className="journal-header">
          <Leaf size={48} className="gratitude-icon" />
          <h2>Gratitude Journal</h2>
          <p>Take a moment to reflect on the positive aspects of your life</p>
        </div>

        <div className="current-prompt">
          <h3>Today's Reflection:</h3>
          <div className="prompt-card">
            <p>{currentPrompt}</p>
          </div>
        </div>

        <div className="entry-input">
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Take your time to really think about this... What comes to mind?"
            className="gratitude-textarea"
            rows={6}
          />
          
          <motion.button
            onClick={saveEntry}
            className="save-button"
            disabled={!currentEntry.trim()}
            whileHover={{ scale: currentEntry.trim() ? 1.05 : 1 }}
            whileTap={{ scale: currentEntry.trim() ? 0.95 : 1 }}
          >
            <Save size={20} />
            Save Gratitude Entry
          </motion.button>
        </div>

        {entries.length > 0 && (
          <div className="previous-entries">
            <h3>Previous Entries ({entries.length})</h3>
            <div className="entries-list">
              {entries.slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  className="entry-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="entry-prompt-small">"{entry.prompt}"</p>
                  <p className="entry-text-small">{entry.text}</p>
                  <div className="entry-meta">
                    <span className="entry-date-small">{entry.date}</span>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="delete-entry"
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="gratitude-tip">
          <h4>💡 Tip:</h4>
          <p>Try to be specific in your gratitude. Instead of "I'm grateful for my family," 
             try "I'm grateful for the way my partner made me laugh at dinner tonight."</p>
        </div>
      </motion.div>
    </div>
  );
};

export default GratitudeGame;