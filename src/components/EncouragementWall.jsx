import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Flag, RefreshCw, Star, Send, MessageCircle } from 'lucide-react';

const EncouragementWall = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('encouragementMessages');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        text: "You are stronger than you think. Every small step forward matters! 💪",
        likes: 8,
        timestamp: Date.now() - 86400000,
        category: 'strength',
        liked: false
      },
      {
        id: 2,
        text: "Taking care of your mental health is not selfish - it's necessary. You deserve peace and happiness. 🌸",
        likes: 12,
        timestamp: Date.now() - 172800000,
        category: 'self-care',
        liked: false
      },
      {
        id: 3,
        text: "Progress isn't always linear. It's okay to have tough days. Tomorrow is a new opportunity. 🌅",
        likes: 15,
        timestamp: Date.now() - 259200000,
        category: 'progress',
        liked: false
      },
      {
        id: 4,
        text: "Your feelings are valid. It's okay to not be okay sometimes. Healing takes time. 💙",
        likes: 20,
        timestamp: Date.now() - 345600000,
        category: 'validation',
        liked: false
      }
    ];
  });

  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { id: 'strength', label: 'Strength & Courage', emoji: '💪', color: '#e53e3e' },
    { id: 'self-care', label: 'Self-Care', emoji: '🌸', color: '#d53f8c' },
    { id: 'progress', label: 'Progress & Growth', emoji: '🌱', color: '#38a169' },
    { id: 'validation', label: 'Validation & Support', emoji: '💙', color: '#3182ce' },
    { id: 'hope', label: 'Hope & Positivity', emoji: '✨', color: '#d69e2e' },
    { id: 'gratitude', label: 'Gratitude', emoji: '🙏', color: '#805ad5' }
  ];

  const encouragementPrompts = [
    "Share a message that helped you through a difficult time",
    "What would you tell someone who's struggling today?",
    "Share a reminder about self-compassion",
    "What does recovery or healing mean to you?",
    "Share words of hope for someone starting their wellness journey",
    "What reminder helps you on tough days?",
    "Share something you wish someone had told you earlier",
    "What message would lift someone's spirits today?"
  ];

  useEffect(() => {
    localStorage.setItem('encouragementMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = () => {
    if (!newMessage.trim() || !selectedCategory) return;

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      likes: 0,
      timestamp: Date.now(),
      category: selectedCategory,
      liked: false
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setSelectedCategory('');
    setShowAddForm(false);
  };

  const toggleLike = (id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id 
        ? { 
            ...msg, 
            likes: msg.liked ? msg.likes - 1 : msg.likes + 1,
            liked: !msg.liked 
          }
        : msg
    ));
  };

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (filter !== 'all') {
      filtered = messages.filter(msg => msg.category === filter);
    }

    return filtered.sort((a, b) => {
      if (filter === 'popular') {
        return b.likes - a.likes;
      }
      return b.timestamp - a.timestamp;
    });
  };

  const getRandomPrompt = () => {
    return encouragementPrompts[Math.floor(Math.random() * encouragementPrompts.length)];
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="encouragement-wall-container">
      <motion.div 
        className="wall-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MessageCircle size={32} className="header-icon" />
        <div>
          <h2>Anonymous Encouragement Wall</h2>
          <p>Share and receive uplifting messages from the community</p>
        </div>
      </motion.div>

      <div className="wall-stats">
        <div className="stat-item">
          <Star size={20} />
          <span>{messages.reduce((sum, msg) => sum + msg.likes, 0)} hearts given</span>
        </div>
        <div className="stat-item">
          <MessageCircle size={20} />
          <span>{messages.length} messages shared</span>
        </div>
      </div>

      <div className="wall-controls">
        <motion.button
          className="add-message-button"
          onClick={() => setShowAddForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Share Encouragement
        </motion.button>

        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Messages</option>
            <option value="popular">Most Liked</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="add-message-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div 
              className="add-message-form"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Share an Encouraging Message</h3>
              <p className="form-prompt">{getRandomPrompt()}</p>

              <div className="category-selector">
                <label>Choose a category:</label>
                <div className="categories-grid">
                  {categories.map(category => (
                    <motion.button
                      key={category.id}
                      className={`category-option ${selectedCategory === category.id ? 'selected' : ''}`}
                      style={{ borderColor: category.color }}
                      onClick={() => setSelectedCategory(category.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="category-emoji">{category.emoji}</span>
                      <span className="category-label">{category.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share a message of hope, encouragement, or support..."
                className="message-textarea"
                rows="4"
                maxLength="280"
              />
              
              <div className="character-count">
                {newMessage.length}/280 characters
              </div>

              <div className="form-actions">
                <motion.button
                  className="action-button secondary"
                  onClick={() => setShowAddForm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="action-button primary"
                  onClick={addMessage}
                  disabled={!newMessage.trim() || !selectedCategory}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                  Share Message
                </motion.button>
              </div>

              <div className="privacy-note">
                <p>💡 Your message will be shared anonymously. Be kind and supportive.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="messages-feed">
        <AnimatePresence>
          {getFilteredMessages().map((message, index) => {
            const categoryInfo = getCategoryInfo(message.category);
            return (
              <motion.div
                key={message.id}
                className="message-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="message-header">
                  <div className="message-category">
                    <span className="category-emoji">{categoryInfo?.emoji}</span>
                    <span className="category-name">{categoryInfo?.label}</span>
                  </div>
                  <span className="message-time">{formatTimeAgo(message.timestamp)}</span>
                </div>

                <div className="message-content">
                  <p>{message.text}</p>
                </div>

                <div className="message-footer">
                  <motion.button
                    className={`like-button ${message.liked ? 'liked' : ''}`}
                    onClick={() => toggleLike(message.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={16} fill={message.liked ? '#e53e3e' : 'none'} />
                    <span>{message.likes}</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {getFilteredMessages().length === 0 && (
        <div className="empty-state">
          <MessageCircle size={48} className="empty-icon" />
          <h3>No messages yet</h3>
          <p>Be the first to share an encouraging message!</p>
          <motion.button
            className="action-button primary"
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Share First Message
          </motion.button>
        </div>
      )}

      <div className="community-guidelines">
        <h4>Community Guidelines</h4>
        <ul>
          <li>Be kind, supportive, and encouraging</li>
          <li>Respect everyone's journey and experiences</li>
          <li>No harmful, discriminatory, or inappropriate content</li>
          <li>Focus on hope, healing, and positive growth</li>
          <li>Remember that someone struggling might read your words</li>
        </ul>
      </div>
    </div>
  );
};

export default EncouragementWall;