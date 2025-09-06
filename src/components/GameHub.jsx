import { useState } from 'react';
import { Music, Heart, Brain, Palette, Users, Leaf, BookOpen, TrendingUp, Clock, Brush, BarChart3, Moon, Star, Zap, Shield, Target, PenTool, MessageCircle, Activity, Anchor, Flame, Sprout, Trophy, Award, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizGame from './QuizGame';
import BreathingGame from './BreathingGame';
import MemoryGame from './MemoryGame';
import WordGame from './WordGame';
import GratitudeGame from './GratitudeGame';
import RelaxationGame from './RelaxationGame';
import MoodTracker from './MoodTracker';
import MeditationTimer from './MeditationTimer';
import ColorTherapy from './ColorTherapy';
import CouplesActivity from './CouplesActivity';
import WellnessDashboard from './WellnessDashboard';
import ProgressiveMuscleRelaxation from './ProgressiveMuscleRelaxation';
import SleepPreparation from './SleepPreparation';
import AffirmationsGame from './AffirmationsGame';
import CrisisSupport from './CrisisSupport';
import JournalPrompts from './JournalPrompts';
import HabitTracker from './HabitTracker';
// CBT Tools
import ThoughtRecord from './ThoughtRecord';
import CognitiveDistortions from './CognitiveDistortions';
import BehavioralActivation from './BehavioralActivation';
// Physical Wellness
import MindfulMovement from './MindfulMovement';
import ExerciseMoodTracker from './ExerciseMoodTracker';
import GroundingTechniques from './GroundingTechniques';
// Social Features
import EncouragementWall from './EncouragementWall';
import WellnessBuddySystem from './WellnessBuddySystem';
import CommunityChallenge from './CommunityChallenge';
// Emergency Coping
import EmergencyCopingToolkit from './EmergencyCopingToolkit';
// Gamification
import AchievementSystem from './AchievementSystem';
import WellnessStreaks from './WellnessStreaks';
import PersonalGrowthChallenges from './PersonalGrowthChallenges';
// Educational Modules
import MentalHealthMyths from './MentalHealthMyths';
import EmotionRegulationSkills from './EmotionRegulationSkills';
import StressScience from './StressScience';

const GameHub = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'dashboard',
      title: 'Wellness Dashboard',
      subtitle: 'Track your wellness journey',
      icon: BarChart3,
      color: '#4299e1',
      description: 'View your progress, achievements, and insights across all wellness activities.',
      benefits: ['Progress tracking', 'Motivation boost', 'Self-awareness'],
      component: WellnessDashboard
    },
    {
      id: 'music-quiz',
      title: 'Music Quiz',
      subtitle: 'Test your music knowledge',
      icon: Music,
      color: '#667eea',
      description: 'Listen to song previews and guess the artist, song title, or album. Great for cognitive stimulation and fun!',
      benefits: ['Cognitive stimulation', 'Memory enhancement', 'Mood lifting'],
      component: QuizGame
    },
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      subtitle: 'Guided breathing exercises',
      icon: Heart,
      color: '#48bb78',
      description: 'Calming breathing exercises with visual guides. Perfect for reducing anxiety and stress.',
      benefits: ['Stress reduction', 'Anxiety relief', 'Better focus'],
      component: BreathingGame
    },
    {
      id: 'memory',
      title: 'Memory Patterns',
      subtitle: 'Simon-style memory challenge',
      icon: Brain,
      color: '#ed8936',
      description: 'Follow and repeat increasingly complex patterns. Excellent for cognitive training and focus.',
      benefits: ['Memory improvement', 'Concentration', 'Cognitive fitness'],
      component: MemoryGame
    },
    {
      id: 'words',
      title: 'Word Connection',
      subtitle: 'Creative word associations',
      icon: BookOpen,
      color: '#9f7aea',
      description: 'Connect words and explore creative thinking. Stimulates language centers and creativity.',
      benefits: ['Language skills', 'Creative thinking', 'Mental flexibility'],
      component: WordGame
    },
    {
      id: 'gratitude',
      title: 'Gratitude Journal',
      subtitle: 'Daily gratitude practice',
      icon: Leaf,
      color: '#38b2ac',
      description: 'Guided gratitude exercises with prompts. Research shows gratitude improves mental wellbeing.',
      benefits: ['Mood improvement', 'Positive thinking', 'Emotional balance'],
      component: GratitudeGame
    },
    {
      id: 'relaxation',
      title: 'Nature Sounds',
      subtitle: 'Relaxing ambient sounds',
      icon: Leaf,
      color: '#68d391',
      description: 'Immerse yourself in calming nature sounds. Perfect for relaxation and meditation.',
      benefits: ['Deep relaxation', 'Stress relief', 'Better sleep'],
      component: RelaxationGame
    },
    {
      id: 'mood-tracker',
      title: 'Mood Tracker',
      subtitle: 'Daily emotional check-ins',
      icon: TrendingUp,
      color: '#f56565',
      description: 'Track your daily mood and emotions to identify patterns and support your mental wellbeing.',
      benefits: ['Self-awareness', 'Pattern recognition', 'Emotional wellness'],
      component: MoodTracker
    },
    {
      id: 'meditation',
      title: 'Meditation Timer',
      subtitle: 'Guided mindfulness sessions',
      icon: Clock,
      color: '#9f7aea',
      description: 'Practice different types of meditation with guided sessions and peaceful timers.',
      benefits: ['Mindfulness', 'Stress reduction', 'Inner peace'],
      component: MeditationTimer
    },
    {
      id: 'color-therapy',
      title: 'Color Therapy',
      subtitle: 'Art and color healing',
      icon: Brush,
      color: '#ed8936',
      description: 'Explore color psychology and express yourself through therapeutic art activities.',
      benefits: ['Creative expression', 'Emotional release', 'Color healing'],
      component: ColorTherapy
    },
    {
      id: 'couples',
      title: 'Couples Activities',
      subtitle: 'Relationship wellness together',
      icon: Users,
      color: '#ed64a6',
      description: 'Strengthen your relationship with guided activities for communication and connection.',
      benefits: ['Better communication', 'Stronger bond', 'Shared wellness'],
      component: CouplesActivity
    },
    {
      id: 'progressive-relaxation',
      title: 'Progressive Muscle Relaxation',
      subtitle: 'Release physical tension',
      icon: Zap,
      color: '#48bb78',
      description: 'Guided muscle relaxation technique to release tension and achieve deep physical relaxation.',
      benefits: ['Physical tension release', 'Deep relaxation', 'Better sleep'],
      component: ProgressiveMuscleRelaxation
    },
    {
      id: 'sleep-preparation',
      title: 'Sleep Preparation',
      subtitle: 'Bedtime routine guide',
      icon: Moon,
      color: '#805ad5',
      description: 'Step-by-step bedtime routine to prepare your mind and body for restful sleep.',
      benefits: ['Better sleep quality', 'Relaxation routine', 'Sleep hygiene'],
      component: SleepPreparation
    },
    {
      id: 'affirmations',
      title: 'Daily Affirmations',
      subtitle: 'Positive mindset training',
      icon: Star,
      color: '#ffd93d',
      description: 'Practice positive affirmations to rewire your mind and build self-confidence.',
      benefits: ['Positive thinking', 'Self-confidence', 'Mindset shift'],
      component: AffirmationsGame
    },
    {
      id: 'crisis-support',
      title: 'Crisis Support',
      subtitle: 'Emergency mental health resources',
      icon: Shield,
      color: '#e53e3e',
      description: 'Access crisis hotlines, immediate coping strategies, and safety resources when you need help most.',
      benefits: ['Immediate help', 'Crisis resources', 'Safety planning'],
      component: CrisisSupport
    },
    {
      id: 'journaling',
      title: 'Therapeutic Journaling',
      subtitle: 'Guided writing prompts',
      icon: PenTool,
      color: '#805ad5',
      description: 'Express your thoughts and process emotions through guided therapeutic writing exercises.',
      benefits: ['Emotional processing', 'Self-reflection', 'CBT techniques'],
      component: JournalPrompts
    },
    {
      id: 'habit-tracker',
      title: 'Habit Tracker',
      subtitle: 'Daily wellness routines',
      icon: Target,
      color: '#38a169',
      description: 'Build and track positive habits that support your mental health and overall wellbeing.',
      benefits: ['Routine building', 'Progress tracking', 'Goal achievement'],
      component: HabitTracker
    },
    // CBT Tools
    {
      id: 'thought-record',
      title: 'Thought Record',
      subtitle: 'Challenge negative thinking',
      icon: Brain,
      color: '#4299e1',
      description: 'Examine and challenge negative thought patterns using evidence-based CBT techniques.',
      benefits: ['Cognitive restructuring', 'Mood improvement', 'Self-awareness'],
      component: ThoughtRecord
    },
    {
      id: 'cognitive-distortions',
      title: 'Cognitive Distortion Detective',
      subtitle: 'Identify thinking traps',
      icon: Brain,
      color: '#9f7aea',
      description: 'Learn to recognize and correct common cognitive distortions that impact mood and behavior.',
      benefits: ['Better thinking patterns', 'Reduced anxiety', 'Clearer perspective'],
      component: CognitiveDistortions
    },
    {
      id: 'behavioral-activation',
      title: 'Behavioral Activation',
      subtitle: 'Action-based mood lifting',
      icon: Zap,
      color: '#48bb78',
      description: 'Plan meaningful activities to combat depression and improve mood through positive action.',
      benefits: ['Increased motivation', 'Mood enhancement', 'Activity planning'],
      component: BehavioralActivation
    },
    // Physical Wellness
    {
      id: 'mindful-movement',
      title: 'Mindful Movement',
      subtitle: 'Gentle exercise routines',
      icon: Activity,
      color: '#ed8936',
      description: 'Combine physical movement with mindfulness for stress relief and body awareness.',
      benefits: ['Stress relief', 'Body awareness', 'Gentle exercise'],
      component: MindfulMovement
    },
    {
      id: 'exercise-mood',
      title: 'Exercise-Mood Tracker',
      subtitle: 'Track activity and feelings',
      icon: Activity,
      color: '#38a169',
      description: 'Discover how physical activity affects your mood and build motivation for movement.',
      benefits: ['Exercise motivation', 'Mood tracking', 'Pattern recognition'],
      component: ExerciseMoodTracker
    },
    {
      id: 'grounding',
      title: 'Grounding Techniques',
      subtitle: 'Present moment awareness',
      icon: Anchor,
      color: '#805ad5',
      description: 'Use your senses to anchor yourself in the present moment during anxiety or overwhelm.',
      benefits: ['Anxiety relief', 'Present awareness', 'Emotional grounding'],
      component: GroundingTechniques
    },
    // Social Features
    {
      id: 'encouragement-wall',
      title: 'Encouragement Wall',
      subtitle: 'Community support messages',
      icon: MessageCircle,
      color: '#ed64a6',
      description: 'Share and receive anonymous encouragement messages from the wellness community.',
      benefits: ['Community support', 'Positive messaging', 'Connection'],
      component: EncouragementWall
    },
    {
      id: 'wellness-buddy',
      title: 'Wellness Buddy System',
      subtitle: 'Accountability partnership',
      icon: Users,
      color: '#4299e1',
      description: 'Partner with someone for mutual support and accountability in your wellness journey.',
      benefits: ['Accountability', 'Motivation', 'Shared goals'],
      component: WellnessBuddySystem
    },
    {
      id: 'community-challenge',
      title: 'Community Challenges',
      subtitle: 'Group wellness goals',
      icon: Trophy,
      color: '#d69e2e',
      description: 'Join wellness challenges with the community to build healthy habits together.',
      benefits: ['Group motivation', 'Habit building', 'Achievement'],
      component: CommunityChallenge
    },
    // Emergency Coping
    {
      id: 'emergency-coping',
      title: 'Emergency Coping Toolkit',
      subtitle: 'Crisis intervention tools',
      icon: Shield,
      color: '#e53e3e',
      description: 'Quick relief techniques for intense emotions, panic attacks, and overwhelming moments.',
      benefits: ['Crisis management', 'Immediate relief', 'Emotional regulation'],
      component: EmergencyCopingToolkit
    },
    // Gamification
    {
      id: 'achievements',
      title: 'Achievement System',
      subtitle: 'Track your progress',
      icon: Award,
      color: '#ffd93d',
      description: 'Earn achievements and celebrate milestones in your wellness journey.',
      benefits: ['Motivation', 'Progress tracking', 'Goal celebration'],
      component: AchievementSystem
    },
    {
      id: 'wellness-streaks',
      title: 'Wellness Streaks',
      subtitle: 'Build consistency',
      icon: Flame,
      color: '#ff6b6b',
      description: 'Build and maintain wellness streaks to develop consistent healthy habits.',
      benefits: ['Habit consistency', 'Motivation', 'Progress visualization'],
      component: WellnessStreaks
    },
    {
      id: 'growth-challenges',
      title: 'Personal Growth Challenges',
      subtitle: 'Transform through practice',
      icon: Sprout,
      color: '#51cf66',
      description: 'Take on structured challenges designed to promote personal growth and self-discovery.',
      benefits: ['Personal growth', 'Self-discovery', 'Skill building'],
      component: PersonalGrowthChallenges
    },
    // Educational Modules
    {
      id: 'mental-health-myths',
      title: 'Mental Health: Myths vs Facts',
      subtitle: 'Learn the truth',
      icon: Brain,
      color: '#339af0',
      description: 'Challenge misconceptions and learn evidence-based facts about mental health.',
      benefits: ['Education', 'Stigma reduction', 'Awareness'],
      component: MentalHealthMyths
    },
    {
      id: 'emotion-regulation',
      title: 'Emotion Regulation Skills',
      subtitle: 'Master your emotions',
      icon: Heart,
      color: '#f06595',
      description: 'Learn evidence-based techniques to understand and manage intense emotions effectively.',
      benefits: ['Emotional control', 'Coping skills', 'Self-regulation'],
      component: EmotionRegulationSkills
    },
    {
      id: 'stress-science',
      title: 'The Science of Stress',
      subtitle: 'Understand stress responses',
      icon: Zap,
      color: '#fd7e14',
      description: 'Learn how stress works in your body and brain, plus evidence-based management strategies.',
      benefits: ['Stress understanding', 'Science education', 'Management strategies'],
      component: StressScience
    }
  ];

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="game-container">
        <div className="game-header-nav">
          <motion.button
            className="back-button"
            onClick={() => setActiveGame(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Games
          </motion.button>
          <h2>{activeGame.title}</h2>
        </div>
        <GameComponent />
      </div>
    );
  }

  return (
    <div className="game-hub">
      <motion.div 
        className="hub-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Comprehensive Wellness Platform</h1>
        <p>Explore 30+ evidence-based tools for mental health, physical wellness, and personal growth</p>
      </motion.div>

      <motion.div 
        className="games-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {games.map((game, index) => {
          const IconComponent = game.icon;
          return (
            <motion.div
              key={game.id}
              className="game-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame(game)}
            >
              <div className="card-header" style={{ backgroundColor: game.color }}>
                <IconComponent size={32} color="white" />
                <div className="card-title">
                  <h3>{game.title}</h3>
                  <p>{game.subtitle}</p>
                </div>
              </div>
              
              <div className="card-content">
                <p className="game-description">{game.description}</p>
                
                <div className="benefits-list">
                  <h4>Benefits:</h4>
                  <ul>
                    {game.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="card-footer">
                  <span className="play-text">Click to Play</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default GameHub;