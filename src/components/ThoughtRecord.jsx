import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const ThoughtRecord = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    emotion: '',
    intensity: 5,
    automaticThought: '',
    evidence: '',
    alternatives: '',
    balancedThought: '',
    newIntensity: 5
  });

  const [savedRecords, setSavedRecords] = useState(() => {
    const saved = localStorage.getItem('thoughtRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const cognitiveDistortions = [
    'All-or-Nothing Thinking',
    'Overgeneralization', 
    'Mental Filter',
    'Discounting the Positive',
    'Jumping to Conclusions',
    'Catastrophizing',
    'Emotional Reasoning',
    'Should Statements',
    'Labeling',
    'Personalization'
  ];

  const handleInputChange = (field, value) => {
    setThoughtRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveRecord = () => {
    const newRecord = {
      ...thoughtRecord,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };
    
    const updatedRecords = [newRecord, ...savedRecords].slice(0, 50); // Keep last 50
    setSavedRecords(updatedRecords);
    localStorage.setItem('thoughtRecords', JSON.stringify(updatedRecords));
    
    // Reset form
    setThoughtRecord({
      situation: '',
      emotion: '',
      intensity: 5,
      automaticThought: '',
      evidence: '',
      alternatives: '',
      balancedThought: '',
      newIntensity: 5
    });
    setCurrentStep(1);
  };

  const steps = [
    {
      title: "Identify the Situation",
      description: "What happened? Describe the specific situation that triggered your emotions.",
      field: "situation"
    },
    {
      title: "Name Your Emotions",
      description: "What are you feeling? Name the specific emotions and rate their intensity.",
      fields: ["emotion", "intensity"]
    },
    {
      title: "Catch Your Thoughts",
      description: "What thoughts went through your mind? What did you tell yourself?",
      field: "automaticThought"
    },
    {
      title: "Examine the Evidence",
      description: "What evidence supports this thought? What evidence contradicts it?",
      field: "evidence"
    },
    {
      title: "Generate Alternatives",
      description: "What are other ways to think about this situation? What would you tell a friend?",
      field: "alternatives"
    },
    {
      title: "Create a Balanced Thought",
      description: "Based on the evidence, what's a more balanced, realistic thought?",
      fields: ["balancedThought", "newIntensity"]
    }
  ];

  return (
    <div className="thought-record-container">
      <motion.div 
        className="thought-record-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Brain size={32} className="header-icon" />
        <div>
          <h2>Thought Record Exercise</h2>
          <p>Challenge negative thinking patterns with this CBT technique</p>
        </div>
      </motion.div>

      <div className="thought-record-content">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <motion.div 
          key={currentStep}
          className="step-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Step {currentStep}: {steps[currentStep - 1].title}</h3>
          <p className="step-description">{steps[currentStep - 1].description}</p>

          {currentStep === 1 && (
            <textarea
              value={thoughtRecord.situation}
              onChange={(e) => handleInputChange('situation', e.target.value)}
              placeholder="Describe what happened in specific detail..."
              className="thought-textarea"
              rows="4"
            />
          )}

          {currentStep === 2 && (
            <div className="emotion-section">
              <input
                type="text"
                value={thoughtRecord.emotion}
                onChange={(e) => handleInputChange('emotion', e.target.value)}
                placeholder="angry, sad, anxious, frustrated..."
                className="emotion-input"
              />
              <div className="intensity-slider">
                <label>Intensity (1-10): {thoughtRecord.intensity}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={thoughtRecord.intensity}
                  onChange={(e) => handleInputChange('intensity', parseInt(e.target.value))}
                  className="slider"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <textarea
              value={thoughtRecord.automaticThought}
              onChange={(e) => handleInputChange('automaticThought', e.target.value)}
              placeholder="What thoughts automatically came to mind? What did you tell yourself?"
              className="thought-textarea"
              rows="4"
            />
          )}

          {currentStep === 4 && (
            <textarea
              value={thoughtRecord.evidence}
              onChange={(e) => handleInputChange('evidence', e.target.value)}
              placeholder="Evidence FOR this thought:&#10;&#10;Evidence AGAINST this thought:"
              className="thought-textarea"
              rows="6"
            />
          )}

          {currentStep === 5 && (
            <textarea
              value={thoughtRecord.alternatives}
              onChange={(e) => handleInputChange('alternatives', e.target.value)}
              placeholder="Other ways to think about this:&#10;&#10;What would I tell a friend in this situation?"
              className="thought-textarea"
              rows="5"
            />
          )}

          {currentStep === 6 && (
            <div className="balanced-thought-section">
              <textarea
                value={thoughtRecord.balancedThought}
                onChange={(e) => handleInputChange('balancedThought', e.target.value)}
                placeholder="A more balanced, realistic thought based on the evidence..."
                className="thought-textarea"
                rows="4"
              />
              <div className="intensity-slider">
                <label>New Emotional Intensity (1-10): {thoughtRecord.newIntensity}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={thoughtRecord.newIntensity}
                  onChange={(e) => handleInputChange('newIntensity', parseInt(e.target.value))}
                  className="slider"
                />
              </div>
            </div>
          )}

          <div className="step-navigation">
            {currentStep > 1 && (
              <motion.button
                className="nav-button prev"
                onClick={() => setCurrentStep(currentStep - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
            )}

            {currentStep < steps.length ? (
              <motion.button
                className="nav-button next"
                onClick={() => setCurrentStep(currentStep + 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                className="save-button"
                onClick={saveRecord}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={16} />
                Save Record
              </motion.button>
            )}
          </div>
        </motion.div>

        {savedRecords.length > 0 && (
          <motion.div 
            className="saved-records"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Your Thought Records</h3>
            <div className="records-list">
              {savedRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <span className="record-date">{record.date}</span>
                    <span className="intensity-change">
                      {record.intensity} → {record.newIntensity}
                      {record.newIntensity < record.intensity && (
                        <CheckCircle size={16} className="improvement-icon" />
                      )}
                    </span>
                  </div>
                  <p className="record-situation">{record.situation.slice(0, 100)}...</p>
                  <p className="record-balanced">{record.balancedThought.slice(0, 150)}...</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ThoughtRecord;