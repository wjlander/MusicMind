import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Brush, RotateCcw, Download, Heart } from 'lucide-react';

const ColorTherapy = () => {
  const [currentMode, setCurrentMode] = useState('mood'); // mood, create, mandala
  const [selectedColors, setSelectedColors] = useState([]);
  const [canvas, setCanvas] = useState(Array(64).fill(null)); // 8x8 grid
  const [currentColor, setCurrentColor] = useState('#48bb78');
  const [moodResults, setMoodResults] = useState(null);

  const moodColors = {
    energetic: { colors: ['#ff6b6b', '#ff8c42', '#ffd93d'], name: 'Energetic', description: 'Bold, vibrant colors that energize and motivate' },
    calm: { colors: ['#48bb78', '#4299e1', '#9f7aea'], name: 'Calm', description: 'Cool, soothing colors that promote peace and relaxation' },
    creative: { colors: ['#ed64a6', '#9f7aea', '#38b2ac'], name: 'Creative', description: 'Inspiring colors that stimulate imagination and artistic expression' },
    grounded: { colors: ['#68d391', '#c6f6d5', '#2f855a'], name: 'Grounded', description: 'Earth tones that provide stability and connection to nature' },
    joyful: { colors: ['#ffd93d', '#ff8c42', '#ff6b6b'], name: 'Joyful', description: 'Warm, bright colors that uplift mood and inspire happiness' },
    peaceful: { colors: ['#bee3f8', '#e6fffa', '#f0fff4'], name: 'Peaceful', description: 'Soft, gentle colors that promote tranquility and inner peace' }
  };

  const therapeuticColors = [
    { color: '#ff6b6b', name: 'Energizing Red', meaning: 'Passion, strength, vitality' },
    { color: '#ff8c42', name: 'Creative Orange', meaning: 'Enthusiasm, creativity, warmth' },
    { color: '#ffd93d', name: 'Joyful Yellow', meaning: 'Happiness, optimism, clarity' },
    { color: '#48bb78', name: 'Healing Green', meaning: 'Growth, harmony, balance' },
    { color: '#4299e1', name: 'Calming Blue', meaning: 'Peace, trust, communication' },
    { color: '#9f7aea', name: 'Intuitive Purple', meaning: 'Wisdom, spirituality, transformation' },
    { color: '#ed64a6', name: 'Loving Pink', meaning: 'Compassion, nurturing, self-love' },
    { color: '#38b2ac', name: 'Balancing Teal', meaning: 'Emotional balance, clarity, renewal' }
  ];

  const analyzeColorChoices = () => {
    if (selectedColors.length < 3) return;

    const colorMeanings = selectedColors.map(color => {
      const found = therapeuticColors.find(tc => tc.color === color);
      return found ? found.meaning : 'Balance and harmony';
    });

    const dominantMood = Object.keys(moodColors).find(mood => 
      moodColors[mood].colors.some(color => selectedColors.includes(color))
    ) || 'balanced';

    setMoodResults({
      dominantMood,
      meanings: colorMeanings,
      interpretation: getMoodInterpretation(dominantMood, selectedColors.length)
    });
  };

  const getMoodInterpretation = (mood, colorCount) => {
    const interpretations = {
      energetic: 'You\'re drawn to dynamic, stimulating energy. This suggests you may be ready for action, new challenges, or seeking motivation.',
      calm: 'You\'re seeking peace and tranquility. Your color choices reflect a need for relaxation and emotional balance.',
      creative: 'Your artistic and imaginative side is calling. These colors suggest you\'re open to new ideas and creative expression.',
      grounded: 'You\'re connecting with stability and natural harmony. This indicates a desire for security and rootedness.',
      joyful: 'You\'re embracing happiness and positivity. Your color choices reflect an optimistic and uplifting mindset.',
      peaceful: 'You\'re craving serenity and gentle energy. This suggests a need for rest, reflection, and inner peace.',
      balanced: 'You\'ve chosen a harmonious blend of colors, indicating emotional balance and adaptability.'
    };

    return interpretations[mood] || interpretations.balanced;
  };

  const paintPixel = (index) => {
    const newCanvas = [...canvas];
    newCanvas[index] = currentColor;
    setCanvas(newCanvas);
  };

  const clearCanvas = () => {
    setCanvas(Array(64).fill(null));
  };

  const resetMoodTest = () => {
    setSelectedColors([]);
    setMoodResults(null);
    setCurrentMode('mood');
  };

  if (currentMode === 'mood' && moodResults) {
    return (
      <div className="color-therapy-container">
        <motion.div 
          className="color-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="results-header">
            <Heart size={48} color="#ed64a6" />
            <h2>Your Color Therapy Results</h2>
          </div>

          <div className="mood-analysis">
            <div className="selected-colors-display">
              <h3>Your Color Palette</h3>
              <div className="color-row">
                {selectedColors.map((color, index) => (
                  <div
                    key={index}
                    className="selected-color-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mood-interpretation">
              <h3>Emotional Insight</h3>
              <div className="mood-card">
                <h4>{moodColors[moodResults.dominantMood]?.name || 'Balanced'} Energy</h4>
                <p>{moodResults.interpretation}</p>
              </div>
            </div>

            <div className="color-meanings">
              <h3>What Your Colors Mean</h3>
              <div className="meanings-list">
                {selectedColors.map((color, index) => {
                  const colorInfo = therapeuticColors.find(tc => tc.color === color);
                  if (!colorInfo) return null;
                  return (
                    <div key={index} className="meaning-item">
                      <div 
                        className="meaning-color"
                        style={{ backgroundColor: color }}
                      />
                      <div className="meaning-text">
                        <strong>{colorInfo.name}</strong>
                        <span>{colorInfo.meaning}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="therapy-suggestions">
              <h4>💡 Color Therapy Suggestions</h4>
              <ul>
                <li>🎨 Surround yourself with these colors in your living space</li>
                <li>👕 Wear clothing in these colors when you need their energy</li>
                <li>🧘 Visualize these colors during meditation or relaxation</li>
                <li>📝 Use these colors in your journaling or creative work</li>
              </ul>
            </div>
          </div>

          <motion.button
            className="try-again-button"
            onClick={resetMoodTest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (currentMode === 'create') {
    return (
      <div className="color-therapy-container">
        <motion.div className="color-canvas-mode">
          <div className="canvas-header">
            <Brush size={48} className="canvas-icon" />
            <h2>Creative Expression Canvas</h2>
            <p>Express your emotions through color and pattern</p>
          </div>

          <div className="canvas-tools">
            <div className="color-palette">
              {therapeuticColors.map((colorInfo) => (
                <motion.button
                  key={colorInfo.color}
                  className={`palette-color ${currentColor === colorInfo.color ? 'active' : ''}`}
                  style={{ backgroundColor: colorInfo.color }}
                  onClick={() => setCurrentColor(colorInfo.color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={colorInfo.name}
                />
              ))}
            </div>
          </div>

          <div className="pixel-canvas">
            {canvas.map((pixelColor, index) => (
              <motion.button
                key={index}
                className="canvas-pixel"
                style={{ 
                  backgroundColor: pixelColor || '#f7fafc',
                  borderColor: pixelColor ? pixelColor : '#e2e8f0'
                }}
                onClick={() => paintPixel(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>

          <div className="canvas-controls">
            <motion.button
              onClick={clearCanvas}
              className="control-button secondary"
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw size={20} />
              Clear Canvas
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentMode('mood')}
              className="control-button primary"
              whileHover={{ scale: 1.05 }}
            >
              Back to Mood Colors
            </motion.button>
          </div>

          <div className="creative-benefits">
            <h4>Benefits of Color Expression:</h4>
            <ul>
              <li>🎯 Helps process and release emotions</li>
              <li>🧘 Promotes mindfulness and presence</li>
              <li>💡 Stimulates creativity and self-discovery</li>
              <li>❤️ Provides a healthy outlet for feelings</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="color-therapy-container">
      <motion.div className="color-mood-test">
        <div className="therapy-header">
          <Palette size={48} className="therapy-icon" />
          <h2>Color Therapy & Mood Assessment</h2>
          <p>Colors have powerful effects on our emotions and wellbeing. Choose colors that resonate with you right now.</p>
        </div>

        <div className="mode-selector">
          <motion.button
            className={`mode-button ${currentMode === 'mood' ? 'active' : ''}`}
            onClick={() => setCurrentMode('mood')}
            whileHover={{ scale: 1.02 }}
          >
            Mood Colors
          </motion.button>
          <motion.button
            className={`mode-button ${currentMode === 'create' ? 'active' : ''}`}
            onClick={() => setCurrentMode('create')}
            whileHover={{ scale: 1.02 }}
          >
            Creative Canvas
          </motion.button>
        </div>

        <div className="color-selection">
          <h3>Choose colors that speak to you today ({selectedColors.length}/6)</h3>
          <div className="color-grid">
            {therapeuticColors.map((colorInfo) => (
              <motion.button
                key={colorInfo.color}
                className={`therapy-color ${selectedColors.includes(colorInfo.color) ? 'selected' : ''}`}
                style={{ backgroundColor: colorInfo.color }}
                onClick={() => {
                  if (selectedColors.includes(colorInfo.color)) {
                    setSelectedColors(prev => prev.filter(c => c !== colorInfo.color));
                  } else if (selectedColors.length < 6) {
                    setSelectedColors(prev => [...prev, colorInfo.color]);
                  }
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="color-info">
                  <span className="color-name">{colorInfo.name}</span>
                  <span className="color-meaning">{colorInfo.meaning}</span>
                </div>
                {selectedColors.includes(colorInfo.color) && (
                  <div className="selection-indicator">✓</div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedColors.length >= 3 && (
          <motion.button
            className="analyze-button"
            onClick={analyzeColorChoices}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={20} />
            Analyze My Color Choices
          </motion.button>
        )}

        <div className="color-therapy-info">
          <h4>About Color Therapy</h4>
          <p>Color therapy, also known as chromotherapy, uses colors to promote physical and emotional healing. Different colors are believed to have different therapeutic properties and can influence our mood, energy levels, and overall wellbeing.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ColorTherapy;