import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, MessageCircle, Target, Star, RefreshCw } from 'lucide-react';

const CouplesActivity = () => {
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityType, setActivityType] = useState('communication');
  const [completedActivities, setCompletedActivities] = useState([]);
  const [responses, setResponses] = useState({ partner1: '', partner2: '' });

  const activities = {
    communication: [
      {
        id: 'gratitude_share',
        title: 'Gratitude Sharing',
        description: 'Share three things you appreciate about each other',
        instructions: [
          'Sit facing each other comfortably',
          'Partner 1: Share three specific things you appreciate about your partner',
          'Partner 2: Listen without interrupting, then say "thank you"',
          'Switch roles and repeat',
          'End with a hug or gentle touch'
        ],
        duration: '10 minutes',
        benefits: ['Increases appreciation', 'Builds positive connection', 'Strengthens bond']
      },
      {
        id: 'feeling_check',
        title: 'Daily Feeling Check-in',
        description: 'Share your emotional state and listen with empathy',
        instructions: [
          'Set aside distractions (phones, TV, etc.)',
          'Partner 1: Share how you\'re feeling today and why',
          'Partner 2: Reflect back what you heard without trying to fix',
          'Partner 2: Share their feelings',
          'Partner 1: Reflect back with empathy',
          'Offer support or comfort as needed'
        ],
        duration: '15 minutes',
        benefits: ['Improves emotional intimacy', 'Builds empathy', 'Prevents buildup of stress']
      },
      {
        id: 'dream_sharing',
        title: 'Dream and Goal Sharing',
        description: 'Share your hopes and dreams for the future',
        instructions: [
          'Each person shares one dream or goal they have',
          'Listen actively without judgment',
          'Ask clarifying questions to understand better',
          'Discuss how you can support each other\'s dreams',
          'Identify any shared goals you want to work on together'
        ],
        duration: '20 minutes',
        benefits: ['Aligns future vision', 'Shows mutual support', 'Deepens understanding']
      }
    ],
    connection: [
      {
        id: 'synchronized_breathing',
        title: 'Synchronized Breathing',
        description: 'Breathe together to create calm connection',
        instructions: [
          'Sit or lie down facing each other',
          'Start breathing naturally, observing each other\'s rhythm',
          'Gradually sync your breathing patterns',
          'Maintain eye contact if comfortable',
          'Continue for 5-10 breath cycles',
          'Notice the sense of connection this creates'
        ],
        duration: '5-10 minutes',
        benefits: ['Reduces stress together', 'Creates intimacy', 'Promotes calm']
      },
      {
        id: 'appreciation_meditation',
        title: 'Appreciation Meditation',
        description: 'Meditate together while focusing on gratitude for your partner',
        instructions: [
          'Sit comfortably with eyes closed',
          'Begin with 3 deep breaths together',
          'Silently think of things you love about your partner',
          'Send loving thoughts and appreciation to them',
          'After 5 minutes, open eyes and share one appreciation',
          'End with a gentle hug'
        ],
        duration: '10 minutes',
        benefits: ['Deepens love', 'Creates peaceful connection', 'Builds gratitude']
      },
      {
        id: 'memory_lane',
        title: 'Memory Lane Walk',
        description: 'Reminisce about positive shared memories',
        instructions: [
          'Take turns sharing a favorite memory together',
          'Describe what made that moment special',
          'Talk about how you felt during that time',
          'Share what you love about creating memories together',
          'Plan a new memory you\'d like to create soon'
        ],
        duration: '15 minutes',
        benefits: ['Reinforces positive history', 'Creates warm feelings', 'Plans future joy']
      }
    ],
    playful: [
      {
        id: 'compliment_game',
        title: 'Compliment Tennis',
        description: 'Take turns giving each other genuine compliments',
        instructions: [
          'Sit facing each other',
          'Partner 1 gives a specific, genuine compliment',
          'Partner 2 says "thank you" then gives a compliment back',
          'Continue back and forth like tennis',
          'Try to be specific and focus on character, not just appearance',
          'Play for 5-10 rounds'
        ],
        duration: '10 minutes',
        benefits: ['Boosts self-esteem', 'Creates playfulness', 'Builds positivity']
      },
      {
        id: 'dance_moment',
        title: 'Dance Like No One\'s Watching',
        description: 'Put on music and dance together freely',
        instructions: [
          'Choose 2-3 songs you both enjoy',
          'Start dancing however feels natural',
          'Let go of looking perfect or cool',
          'Laugh, be silly, have fun together',
          'Try mirroring each other\'s movements',
          'End with a dip or dramatic pose'
        ],
        duration: '10-15 minutes',
        benefits: ['Releases endorphins', 'Creates laughter', 'Builds playful connection']
      },
      {
        id: 'story_building',
        title: 'Collaborative Story',
        description: 'Create a funny story together, taking turns',
        instructions: [
          'Partner 1 starts a story with "Once upon a time..."',
          'After 2-3 sentences, Partner 2 continues the story',
          'Keep alternating every few sentences',
          'Make it silly, romantic, or adventurous',
          'Try to build on each other\'s ideas',
          'End the story together'
        ],
        duration: '15 minutes',
        benefits: ['Sparks creativity', 'Creates shared laughter', 'Builds teamwork']
      }
    ]
  };

  const activityTypes = {
    communication: { name: 'Communication', icon: MessageCircle, color: '#4299e1' },
    connection: { name: 'Connection', icon: Heart, color: '#ed64a6' },
    playful: { name: 'Playful', icon: Star, color: '#ffd93d' }
  };

  useEffect(() => {
    // Load completed activities from localStorage
    const saved = localStorage.getItem('couples-activities');
    if (saved) {
      setCompletedActivities(JSON.parse(saved));
    }
  }, []);

  const startActivity = (activity) => {
    setCurrentActivity(activity);
    setResponses({ partner1: '', partner2: '' });
  };

  const completeActivity = () => {
    const newCompleted = [...completedActivities, {
      ...currentActivity,
      completedAt: new Date().toISOString(),
      responses: responses
    }];
    
    setCompletedActivities(newCompleted);
    localStorage.setItem('couples-activities', JSON.stringify(newCompleted));
    setCurrentActivity(null);
    setResponses({ partner1: '', partner2: '' });
  };

  const getRandomActivity = () => {
    const allActivities = Object.values(activities).flat();
    const randomActivity = allActivities[Math.floor(Math.random() * allActivities.length)];
    startActivity(randomActivity);
  };

  if (currentActivity) {
    return (
      <div className="couples-container">
        <motion.div 
          className="activity-session"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="activity-header">
            <div className="activity-title">
              <h2>{currentActivity.title}</h2>
              <p>{currentActivity.description}</p>
              <div className="activity-meta">
                <span className="duration">⏰ {currentActivity.duration}</span>
              </div>
            </div>
          </div>

          <div className="activity-instructions">
            <h3>Instructions</h3>
            <ol className="instructions-list">
              {currentActivity.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <div className="activity-benefits">
            <h4>Benefits of this activity:</h4>
            <ul className="benefits-list">
              {currentActivity.benefits.map((benefit, index) => (
                <li key={index}>💚 {benefit}</li>
              ))}
            </ul>
          </div>

          <div className="reflection-section">
            <h3>Reflection (Optional)</h3>
            <p>After completing the activity, you can share your thoughts here:</p>
            
            <div className="reflection-inputs">
              <div className="reflection-input">
                <label>Partner 1 Reflection:</label>
                <textarea
                  value={responses.partner1}
                  onChange={(e) => setResponses(prev => ({...prev, partner1: e.target.value}))}
                  placeholder="How did this activity feel? What did you learn or appreciate?"
                  rows={3}
                />
              </div>
              
              <div className="reflection-input">
                <label>Partner 2 Reflection:</label>
                <textarea
                  value={responses.partner2}
                  onChange={(e) => setResponses(prev => ({...prev, partner2: e.target.value}))}
                  placeholder="How did this activity feel? What did you learn or appreciate?"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="activity-controls">
            <motion.button
              onClick={completeActivity}
              className="complete-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={20} />
              Complete Activity
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentActivity(null)}
              className="back-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Activities
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="couples-container">
      <motion.div className="couples-main">
        <div className="couples-header">
          <Users size={48} className="couples-icon" />
          <h2>Couples Wellness Activities</h2>
          <p>Strengthen your relationship through mindful connection and communication</p>
        </div>

        <div className="activity-type-selector">
          <h3>Choose Activity Type</h3>
          <div className="type-buttons">
            {Object.entries(activityTypes).map(([key, type]) => {
              const IconComponent = type.icon;
              return (
                <motion.button
                  key={key}
                  className={`type-button ${activityType === key ? 'active' : ''}`}
                  onClick={() => setActivityType(key)}
                  style={{ 
                    borderColor: type.color,
                    backgroundColor: activityType === key ? type.color : 'white',
                    color: activityType === key ? 'white' : type.color
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent size={24} />
                  <span>{type.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="quick-start">
          <motion.button
            onClick={getRandomActivity}
            className="random-activity-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={20} />
            Surprise Me! (Random Activity)
          </motion.button>
        </div>

        <div className="activities-list">
          <h3>{activityTypes[activityType].name} Activities</h3>
          <div className="activities-grid">
            {activities[activityType].map((activity) => (
              <motion.div
                key={activity.id}
                className="activity-card"
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
              >
                <div className="card-content">
                  <h4>{activity.title}</h4>
                  <p className="activity-description">{activity.description}</p>
                  
                  <div className="activity-details">
                    <span className="duration">⏰ {activity.duration}</span>
                  </div>
                  
                  <div className="activity-benefits-preview">
                    <strong>Benefits:</strong>
                    <ul>
                      {activity.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                      {activity.benefits.length > 2 && <li>+ more...</li>}
                    </ul>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => startActivity(activity)}
                  className="start-activity-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Activity
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {completedActivities.length > 0 && (
          <div className="activity-history">
            <h3>Recent Activities ({completedActivities.length} completed)</h3>
            <div className="history-list">
              {completedActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="history-item">
                  <div className="history-info">
                    <strong>{activity.title}</strong>
                    <span className="completion-date">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {(activity.responses.partner1 || activity.responses.partner2) && (
                    <div className="history-reflections">
                      {activity.responses.partner1 && (
                        <p><em>Partner 1: "{activity.responses.partner1}"</em></p>
                      )}
                      {activity.responses.partner2 && (
                        <p><em>Partner 2: "{activity.responses.partner2}"</em></p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="couples-benefits">
          <h4>Benefits of Couples Wellness Activities</h4>
          <ul>
            <li>💕 Strengthens emotional intimacy and connection</li>
            <li>🗣️ Improves communication and understanding</li>
            <li>😊 Increases relationship satisfaction and happiness</li>
            <li>🌱 Builds trust and emotional safety</li>
            <li>🎯 Creates shared goals and experiences</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default CouplesActivity;