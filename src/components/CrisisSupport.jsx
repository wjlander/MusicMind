import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Heart, MessageCircle, Users, ExternalLink, Shield, Clock } from 'lucide-react';

const CrisisSupport = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [showCopingStrategies, setShowCopingStrategies] = useState(false);

  const crisisContacts = {
    US: [
      {
        name: '988 Suicide & Crisis Lifeline',
        number: '988',
        description: '24/7 free and confidential emotional support',
        type: 'call'
      },
      {
        name: 'Crisis Text Line',
        number: 'Text HOME to 741741',
        description: 'Free 24/7 crisis counseling via text',
        type: 'text'
      },
      {
        name: 'SAMHSA National Helpline',
        number: '1-800-662-4357',
        description: 'Mental health and substance abuse treatment referrals',
        type: 'call'
      }
    ],
    UK: [
      {
        name: 'Samaritans',
        number: '116 123',
        description: 'Free 24/7 emotional support for anyone in distress',
        type: 'call'
      },
      {
        name: 'Crisis Text Line UK',
        number: 'Text SHOUT to 85258',
        description: 'Free 24/7 crisis support via text',
        type: 'text'
      },
      {
        name: 'Mind Infoline',
        number: '0300 123 3393',
        description: 'Mental health information and support',
        type: 'call'
      }
    ],
    CA: [
      {
        name: 'Canada Suicide Prevention Service',
        number: '1-833-456-4566',
        description: '24/7 bilingual crisis support',
        type: 'call'
      },
      {
        name: 'Kids Help Phone',
        number: 'Text CONNECT to 686868',
        description: 'Free counseling and crisis support for youth',
        type: 'text'
      },
      {
        name: 'Crisis Services Canada',
        number: '1-833-456-4566',
        description: 'National network of crisis centers',
        type: 'call'
      }
    ]
  };

  const immediateCopingStrategies = [
    {
      title: '5-4-3-2-1 Grounding Technique',
      description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
      icon: '👁️',
      duration: '2-3 minutes'
    },
    {
      title: 'Box Breathing',
      description: 'Breathe in for 4, hold for 4, breathe out for 4, hold for 4. Repeat.',
      icon: '🫁',
      duration: '5-10 minutes'
    },
    {
      title: 'Cold Water on Wrists',
      description: 'Run cold water on your wrists or splash on your face to activate your vagus nerve',
      icon: '💧',
      duration: '1-2 minutes'
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release each muscle group from your toes to your head',
      icon: '💪',
      duration: '10-15 minutes'
    },
    {
      title: 'Safe Place Visualization',
      description: 'Close your eyes and imagine a place where you feel completely safe and calm',
      icon: '🏡',
      duration: '5-10 minutes'
    },
    {
      title: 'Call or Text Someone',
      description: 'Reach out to a trusted friend, family member, or crisis hotline',
      icon: '📞',
      duration: 'As needed'
    }
  ];

  const warningSignsToWatch = [
    'Feeling hopeless or trapped',
    'Talking about wanting to die',
    'Looking for ways to harm yourself',
    'Extreme mood swings',
    'Withdrawing from friends and activities',
    'Increasing alcohol or drug use',
    'Sleeping too little or too much',
    'Giving away possessions',
    'Saying goodbye to loved ones'
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' }
  ];

  return (
    <div className="crisis-support-container">
      <motion.div 
        className="crisis-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Shield size={48} className="crisis-icon" />
        <h2>Crisis Support & Safety Resources</h2>
        <p className="crisis-description">
          You are not alone. If you're having thoughts of self-harm or suicide, please reach out for help immediately.
        </p>
      </motion.div>

      <motion.div 
        className="emergency-banner"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="emergency-content">
          <div className="emergency-icon">🚨</div>
          <div className="emergency-text">
            <h3>Immediate Emergency</h3>
            <p>If you're in immediate danger, call emergency services: <strong>911 (US), 999 (UK), 911 (CA)</strong></p>
          </div>
        </div>
      </motion.div>

      <div className="crisis-content">
        <div className="crisis-contacts-section">
          <h3>Crisis Hotlines & Support</h3>
          
          <div className="country-selector">
            <label>Select your location:</label>
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="country-select"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="contacts-grid">
            {crisisContacts[selectedCountry].map((contact, index) => (
              <motion.div
                key={index}
                className="contact-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              >
                <div className="contact-header">
                  {contact.type === 'call' ? <Phone size={24} /> : <MessageCircle size={24} />}
                  <h4>{contact.name}</h4>
                </div>
                <div className="contact-number">{contact.number}</div>
                <p className="contact-description">{contact.description}</p>
                <div className="contact-availability">
                  <Clock size={16} />
                  <span>Available 24/7</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="coping-strategies-section">
          <div className="section-header">
            <h3>Immediate Coping Strategies</h3>
            <motion.button
              className="toggle-strategies-btn"
              onClick={() => setShowCopingStrategies(!showCopingStrategies)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showCopingStrategies ? 'Hide' : 'Show'} Strategies
            </motion.button>
          </div>

          {showCopingStrategies && (
            <motion.div 
              className="strategies-grid"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
            >
              {immediateCopingStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className="strategy-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="strategy-icon">{strategy.icon}</div>
                  <div className="strategy-content">
                    <h4>{strategy.title}</h4>
                    <p>{strategy.description}</p>
                    <div className="strategy-duration">
                      <Clock size={14} />
                      <span>{strategy.duration}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="warning-signs-section">
          <h3>Warning Signs to Watch For</h3>
          <div className="warning-signs-grid">
            {warningSignsToWatch.map((sign, index) => (
              <motion.div
                key={index}
                className="warning-sign"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.4, duration: 0.3 }}
              >
                <span className="warning-bullet">⚠️</span>
                <span>{sign}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="safety-plan-section">
          <h3>Create Your Safety Plan</h3>
          <div className="safety-plan-content">
            <p>A safety plan is a written, prioritized list of coping strategies and sources of support you can use during a crisis.</p>
            
            <div className="safety-plan-steps">
              <div className="step">
                <strong>1. Warning Signs:</strong> Recognize your personal warning signs
              </div>
              <div className="step">
                <strong>2. Coping Strategies:</strong> List things you can do on your own
              </div>
              <div className="step">
                <strong>3. Support People:</strong> List people who provide distraction or help
              </div>
              <div className="step">
                <strong>4. Professional Contacts:</strong> List mental health professionals and agencies
              </div>
              <div className="step">
                <strong>5. Environment Safety:</strong> Make your environment safe by removing means of harm
              </div>
              <div className="step">
                <strong>6. Emergency Contacts:</strong> Keep crisis hotline numbers easily accessible
              </div>
            </div>

            <motion.a
              href="https://suicidepreventionlifeline.org/my-3-step-safety-plan/"
              target="_blank"
              rel="noopener noreferrer"
              className="safety-plan-link"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink size={20} />
              Create Your Safety Plan Online
            </motion.a>
          </div>
        </div>

        <div className="resources-section">
          <h3>Additional Resources</h3>
          <div className="resources-grid">
            <div className="resource-card">
              <Users size={24} />
              <h4>Support Groups</h4>
              <p>Connect with others who understand what you're going through</p>
            </div>
            <div className="resource-card">
              <Heart size={24} />
              <h4>Mental Health Apps</h4>
              <p>Supplementary tools for daily mental health maintenance</p>
            </div>
            <div className="resource-card">
              <MessageCircle size={24} />
              <h4>Online Communities</h4>
              <p>Safe spaces for sharing experiences and finding support</p>
            </div>
          </div>
        </div>

        <div className="remember-section">
          <h3>Remember</h3>
          <div className="remember-content">
            <p>💙 Your life has value and meaning</p>
            <p>💪 You are stronger than you know</p>
            <p>🤝 Help is available and people want to support you</p>
            <p>🌈 Feelings and situations can change</p>
            <p>⭐ You deserve to be here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;