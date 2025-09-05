import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioPlayer = ({ 
  previewUrl, 
  onSkip, 
  volume = 0.7, 
  onVolumeChange,
  autoplay = false,
  showSkip = true,
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Spotify/iTunes previews are typically 30 seconds
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    audio.src = previewUrl;
    audio.volume = isMuted ? 0 : volume;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 30);
    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    if (autoplay && previewUrl) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
      audio.pause();
    };
  }, [previewUrl, autoplay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setCurrentTime(0);
    if (previewUrl) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!previewUrl) {
    return (
      <div className={`audio-player no-preview ${className}`}>
        <div className="no-audio-message">
          <VolumeX size={24} />
          <span>No audio preview available</span>
          {showSkip && (
            <button onClick={onSkip} className="skip-button">
              <SkipForward size={20} />
              Skip
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`audio-player ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <audio ref={audioRef} preload="metadata" />
      
      <div className="audio-controls">
        <button
          onClick={togglePlayPause}
          className="play-pause-btn"
          disabled={!previewUrl}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button onClick={restart} className="restart-btn" title="Restart">
          <RotateCcw size={20} />
        </button>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="volume-controls">
          <button onClick={toggleMute} className="mute-btn">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>

        {showSkip && (
          <button onClick={onSkip} className="skip-btn" title="Skip Question">
            <SkipForward size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AudioPlayer;