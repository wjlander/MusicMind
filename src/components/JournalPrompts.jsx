import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Save, Calendar, Search, Filter, Heart, Brain, Star, Lightbulb } from 'lucide-react';

const JournalPrompts = () => {
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(false);

  const promptCategories = {
    gratitude: {
      name: 'Gratitude & Positivity',
      color: '#48bb78',
      icon: '🙏',
      prompts: [
        'What are three things that made you smile today?',
        'Describe a person who has positively impacted your life and why.',
        'What is something beautiful you noticed in nature recently?',
        'Write about a skill or talent you have that you are grateful for.',
        'What is a simple pleasure that always brings you joy?',
        'Describe a moment when you felt truly appreciated.',
        'What is something about your body that you are thankful for?',
        'Write about a place that makes you feel peaceful.'
      ]
    },
    emotional: {
      name: 'Emotional Processing',
      color: '#ed64a6',
      icon: '💝',
      prompts: [
        'How are you feeling right now, and what might be causing these feelings?',
        'Describe a challenging emotion you experienced recently and how you handled it.',
        'What would you say to comfort a friend feeling the way you do right now?',
        'Write about a time when you overcame a difficult situation.',
        'What emotions do you find hardest to express and why?',
        'Describe how you show love and care for yourself.',
        'What would your ideal emotional state feel like?',
        'Write about a memory that always makes you feel better.'
      ]
    },
    growth: {
      name: 'Personal Growth',
      color: '#9f7aea',
      icon: '🌱',
      prompts: [
        'What is one thing you learned about yourself this week?',
        'Describe a mistake you made and what you learned from it.',
        'What is a goal you are working toward and why it matters to you?',
        'Write about a fear you would like to overcome.',
        'What is a habit you want to develop or change?',
        'Describe how you have grown in the past year.',
        'What advice would you give your younger self?',
        'What is something you are proud of accomplishing recently?'
      ]
    },
    relationships: {
      name: 'Relationships',
      color: '#38b2ac',
      icon: '👥',
      prompts: [
        'Write about someone who makes you feel understood and valued.',
        'Describe a relationship you would like to improve and how you might do that.',
        'What qualities do you appreciate most in your friends?',
        'Write about a time when someone showed you kindness.',
        'How do you show appreciation for the people in your life?',
        'Describe your ideal supportive relationship.',
        'What boundaries are important to you in relationships?',
        'Write about a conversation that changed your perspective.'
      ]
    },
    mindfulness: {
      name: 'Mindfulness & Present Moment',
      color: '#4299e1',
      icon: '🧘',
      prompts: [
        'Describe your surroundings right now using all five senses.',
        'What thoughts keep circling in your mind, and how can you acknowledge them without judgment?',
        'Write about a moment today when you felt fully present.',
        'Describe your breathing right now and how it makes you feel.',
        'What sensations do you notice in your body at this moment?',
        'Write about something you often do on autopilot and how you could do it more mindfully.',
        'Describe a simple activity that helps you feel grounded.',
        'What does being present mean to you?'
      ]
    },
    cbt: {
      name: 'CBT & Thought Patterns',
      color: '#f56565',
      icon: '🧠',
      prompts: [
        'What negative thought pattern do you notice most often?',
        'Describe a situation where you jumped to conclusions. What evidence supports or contradicts your initial thought?',
        'Write about a worry you have. Is it something you can control or influence?',
        'What would you tell a friend who was having the same negative thoughts you are having?',
        'Describe a situation from three different perspectives: yours, the other person\'s, and a neutral observer\'s.',
        'What is a more balanced way to think about a situation that has been bothering you?',
        'Write about a time when your initial reaction to something turned out to be wrong.',
        'What evidence contradicts a negative belief you have about yourself?'
      ]
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('journal-entries');
    if (saved) {
      setJournalEntries(JSON.parse(saved));
    }
  }, []);

  const getRandomPrompt = (category = 'all') => {
    if (category === 'all') {
      const allPrompts = Object.values(promptCategories).flatMap(cat => 
        cat.prompts.map(prompt => ({ ...cat, prompt }))
      );
      return allPrompts[Math.floor(Math.random() * allPrompts.length)];
    } else {
      const categoryData = promptCategories[category];
      const prompt = categoryData.prompts[Math.floor(Math.random() * categoryData.prompts.length)];
      return { ...categoryData, prompt };
    }
  };

  const startJournaling = (category = 'all') => {
    const prompt = getRandomPrompt(category);
    setCurrentPrompt(prompt);
    setJournalEntry('');
    setShowEntries(false);
  };

  const saveEntry = () => {
    if (!journalEntry.trim()) return;

    const entry = {
      id: Date.now(),
      prompt: currentPrompt.prompt,
      content: journalEntry.trim(),
      category: Object.keys(promptCategories).find(key => 
        promptCategories[key].name === currentPrompt.name
      ),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };

    const updatedEntries = [entry, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));
    
    setCurrentPrompt(null);
    setJournalEntry('');
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (currentPrompt) {
    return (
      <div className="journal-container">
        <motion.div 
          className="journal-writing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="journal-header">
            <div className="prompt-category" style={{ backgroundColor: currentPrompt.color }}>
              <span className="category-icon">{currentPrompt.icon}</span>
              <span className="category-name">{currentPrompt.name}</span>
            </div>
            <motion.button
              className="back-to-prompts"
              onClick={() => setCurrentPrompt(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Prompts
            </motion.button>
          </div>

          <div className="journal-prompt">
            <h3>Today's Prompt</h3>
            <div className="prompt-text">{currentPrompt.prompt}</div>
          </div>

          <div className="journal-writing-area">
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Start writing your thoughts here... There's no right or wrong way to respond. Just let your thoughts flow naturally."
              className="journal-textarea"
              rows={15}
              autoFocus
            />
            
            <div className="journal-stats">
              <span>{journalEntry.length} characters</span>
              <span>{journalEntry.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
            </div>
          </div>

          <div className="journal-actions">
            <motion.button
              onClick={saveEntry}
              className="save-entry-btn"
              disabled={!journalEntry.trim()}
              whileHover={{ scale: journalEntry.trim() ? 1.05 : 1 }}
              whileTap={{ scale: journalEntry.trim() ? 0.95 : 1 }}
            >
              <Save size={20} />
              Save Entry
            </motion.button>
            
            <motion.button
              onClick={() => startJournaling()}
              className="new-prompt-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lightbulb size={20} />
              Get New Prompt
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showEntries) {
    return (
      <div className="journal-container">
        <motion.div 
          className="journal-entries"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="entries-header">
            <h3>Your Journal Entries ({filteredEntries.length} total)</h3>
            <motion.button
              className="back-to-prompts"
              onClick={() => setShowEntries(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Prompts
            </motion.button>
          </div>

          <div className="entries-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filter">
              <Filter size={20} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {Object.entries(promptCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="entries-list">
            <AnimatePresence>
              {filteredEntries.map((entry, index) => {
                const category = promptCategories[entry.category];
                return (
                  <motion.div
                    key={entry.id}
                    className="entry-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="entry-header">
                      <div className="entry-category" style={{ backgroundColor: category?.color || 'gray' }}>
                        <span>{category?.icon || '📝'}</span>
                        <span>{category?.name || 'General'}</span>
                      </div>
                      <div className="entry-date">
                        <Calendar size={16} />
                        <span>{entry.date}</span>
                      </div>
                    </div>
                    
                    <div className="entry-prompt">
                      <strong>Prompt:</strong> {entry.prompt}
                    </div>
                    
                    <div className="entry-content">
                      {entry.content}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredEntries.length === 0 && (
              <div className="no-entries">
                <BookOpen size={48} />
                <h3>No entries found</h3>
                <p>Try adjusting your search or filter, or start writing your first entry!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <motion.div 
        className="journal-prompts"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="journal-header">
          <BookOpen size={48} className="journal-icon" />
          <h2>Therapeutic Journaling</h2>
          <p>Express your thoughts, process emotions, and gain insights through guided writing prompts</p>
        </div>

        <div className="journal-actions-top">
          <motion.button
            onClick={() => startJournaling()}
            className="quick-start-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star size={20} />
            Quick Start - Random Prompt
          </motion.button>

          {journalEntries.length > 0 && (
            <motion.button
              onClick={() => setShowEntries(true)}
              className="view-entries-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar size={20} />
              View Your Entries ({journalEntries.length})
            </motion.button>
          )}
        </div>

        <div className="categories-section">
          <h3>Choose a Focus Area</h3>
          <div className="categories-grid">
            {Object.entries(promptCategories).map(([key, category]) => (
              <motion.div
                key={key}
                className="category-card"
                onClick={() => startJournaling(key)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ borderColor: category.color }}
              >
                <div className="category-header" style={{ backgroundColor: category.color }}>
                  <span className="category-icon">{category.icon}</span>
                </div>
                <div className="category-content">
                  <h4>{category.name}</h4>
                  <p>{category.prompts.length} prompts available</p>
                  <div className="sample-prompt">
                    <em>"{category.prompts[0].substring(0, 60)}..."</em>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="journaling-benefits">
          <h3>Benefits of Therapeutic Journaling</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <Brain size={24} />
              <span>Process complex emotions and thoughts</span>
            </div>
            <div className="benefit-item">
              <Heart size={24} />
              <span>Reduce stress and anxiety</span>
            </div>
            <div className="benefit-item">
              <Lightbulb size={24} />
              <span>Gain insights and self-awareness</span>
            </div>
            <div className="benefit-item">
              <Star size={24} />
              <span>Track personal growth over time</span>
            </div>
          </div>
        </div>

        <div className="journaling-tips">
          <h3>💡 Journaling Tips</h3>
          <ul>
            <li>🕐 Set aside 10-15 minutes for each session</li>
            <li>✍️ Write without worrying about grammar or spelling</li>
            <li>🎯 Be honest and authentic with yourself</li>
            <li>🌱 Don't judge your thoughts - just observe them</li>
            <li>📅 Try to journal regularly, even if briefly</li>
            <li>💝 Be kind and compassionate to yourself</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default JournalPrompts;