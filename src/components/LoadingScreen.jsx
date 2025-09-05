import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const LoadingScreen = ({ 
  isVisible, 
  text = "Loading music...", 
  subtext = "Finding the perfect tracks for your quiz",
  progress = null 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div 
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="loading-text">{text}</div>
          <div className="loading-subtext">{subtext}</div>
          
          {progress && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {progress}% complete
              </div>
              <div style={{
                width: '200px',
                height: '4px',
                background: 'var(--border-color)',
                borderRadius: '2px',
                margin: '0.5rem auto',
                overflow: 'hidden'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    borderRadius: '2px'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          <div className="progress-dots">
            <div className="progress-dot"></div>
            <div className="progress-dot"></div>
            <div className="progress-dot"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;