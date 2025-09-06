import { useState } from 'react';
import { Music, Heart, Brain, Palette, Users, Leaf, BookOpen, TrendingUp, Clock, Brush, BarChart3, Moon, Star, Zap, Shield, Target, PenTool, MessageCircle, Activity, Anchor, Flame, Sprout, Trophy, Award, Wind, Coffee, Smile, Eye, Hand } from 'lucide-react';
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
import EnhancedDashboard from './EnhancedDashboard';
import AdvancedProgressVisualization from './AdvancedProgressVisualization';
import DataExportTools from './DataExportTools';

const GameHub = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'dashboard',
      title: 'Enhanced Dashboard',
      subtitle: 'Comprehensive progress tracking',
      icon: BarChart3,
      color: '#4299e1',
      description: 'Advanced dashboard with personalized recommendations, today\'s focus, and comprehensive wellness insights.',
      benefits: ['Personalized recommendations', 'Progress insights', 'Goal tracking'],
      instructions: [
        'View your wellness score and current streak',
        'Check today\'s recommended focus activity',
        'See quick actions based on your patterns',
        'Track progress across all wellness activities'
      ],
      component: EnhancedDashboard
    },
    {
      id: 'music-quiz',
      title: 'Music Quiz',
      subtitle: 'Test your music knowledge',
      icon: Music,
      color: '#667eea',
      description: 'Interactive music trivia with Spotify integration. Choose from multiple game modes and difficulty levels.',
      benefits: ['Cognitive stimulation', 'Memory enhancement', 'Mood lifting'],
      instructions: [
        'Select game mode (artist, song, or album)',
        'Choose your preferred genre and era',
        'Listen to 30-second song previews',
        'Answer questions to earn points and build streaks'
      ],
      component: QuizGame
    },
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      subtitle: 'Guided breathing exercises',
      icon: Heart,
      color: '#48bb78',
      description: 'Evidence-based breathing techniques with visual guidance. Choose from 4-7-8, box breathing, or simple patterns.',
      benefits: ['Stress reduction', 'Anxiety relief', 'Better focus'],
      instructions: [
        'Choose a breathing technique (4-7-8, box, or simple)',
        'Set your session duration (2-15 minutes)',
        'Follow the visual breathing guide',
        'Focus on the rhythm and let thoughts pass by'
      ],
      component: BreathingGame
    },
    {
      id: 'memory',
      title: 'Memory Patterns',
      subtitle: 'Simon-style memory challenge',
      icon: Brain,
      color: '#ed8936',
      description: 'Classic memory game with colorful patterns. Watch the sequence, then repeat it back to advance levels.',
      benefits: ['Memory improvement', 'Concentration', 'Cognitive fitness'],
      instructions: [
        'Watch the sequence of colored buttons light up',
        'Click the buttons in the same order',
        'Each level adds one more step to remember',
        'Challenge yourself with different difficulty levels'
      ],
      component: MemoryGame
    },
    {
      id: 'words',
      title: 'Word Connection',
      subtitle: 'Creative word associations',
      icon: BookOpen,
      color: '#9f7aea',
      description: 'Build chains of connected words to boost creativity. Start with a word and create meaningful associations.',
      benefits: ['Language skills', 'Creative thinking', 'Mental flexibility'],
      instructions: [
        'Start with the given word',
        'Type a word that connects to it somehow',
        'Your word becomes the new starting word',
        'Build the longest chain possible in 60 seconds'
      ],
      component: WordGame
    },
    {
      id: 'gratitude',
      title: 'Gratitude Journal',
      subtitle: 'Daily gratitude practice',
      icon: Leaf,
      color: '#38b2ac',
      description: 'Daily gratitude practice with thoughtful prompts. Build a habit of noticing and appreciating positive moments.',
      benefits: ['Mood improvement', 'Positive thinking', 'Emotional balance'],
      instructions: [
        'Read the daily gratitude prompt carefully',
        'Take time to really think about your response',
        'Write from the heart - there are no wrong answers',
        'Review past entries to see your growth'
      ],
      component: GratitudeGame
    },
    {
      id: 'relaxation',
      title: 'Nature Sounds',
      subtitle: 'Relaxing ambient sounds',
      icon: Leaf,
      color: '#68d391',
      description: 'High-quality nature soundscapes for relaxation. Choose from forest, ocean, rain, or meadow environments.',
      benefits: ['Deep relaxation', 'Stress relief', 'Better sleep'],
      instructions: [
        'Choose your preferred natural environment',
        'Adjust volume to a comfortable level',
        'Find a comfortable position and close your eyes',
        'Let the sounds wash over you for as long as needed'
      ],
      component: RelaxationGame
    },
    {
      id: 'mood-tracker',
      title: 'Mood Tracker',
      subtitle: 'Daily emotional check-ins',
      icon: TrendingUp,
      color: '#f56565',
      description: 'Daily emotional wellness tracking with insights. Rate your mood, note influences, and track patterns over time.',
      benefits: ['Self-awareness', 'Pattern recognition', 'Emotional wellness'],
      instructions: [
        'Rate your current mood on a scale of 1-10',
        'Select factors that influenced your mood today',
        'Add optional notes about your feelings',
        'Review your mood history to identify patterns'
      ],
      component: MoodTracker
    },
    {
      id: 'meditation',
      title: 'Meditation Timer',
      subtitle: 'Guided mindfulness sessions',
      icon: Clock,
      color: '#9f7aea',
      description: 'Guided meditation sessions with multiple techniques. Choose from mindfulness, loving-kindness, body scan, or gratitude.',
      benefits: ['Mindfulness', 'Stress reduction', 'Inner peace'],
      instructions: [
        'Select your meditation type and duration',
        'Find a quiet, comfortable space',
        'Follow the guided instructions',
        'Return attention to the practice when mind wanders'
      ],
      component: MeditationTimer
    },
    {
      id: 'color-therapy',
      title: 'Color Therapy',
      subtitle: 'Art and color healing',
      icon: Brush,
      color: '#ed8936',
      description: 'Therapeutic color selection and creative expression. Choose colors that resonate with your current emotional state.',
      benefits: ['Creative expression', 'Emotional release', 'Color healing'],
      instructions: [
        'Choose colors that speak to you today',
        'Select at least 3 colors for analysis',
        'Read your personalized color interpretation',
        'Try the creative canvas for artistic expression'
      ],
      component: ColorTherapy
    },
    {
      id: 'couples',
      title: 'Couples Activities',
      subtitle: 'Relationship wellness together',
      icon: Users,
      color: '#ed64a6',
      description: 'Relationship-strengthening exercises for couples. Improve communication, deepen connection, and have fun together.',
      benefits: ['Better communication', 'Stronger bond', 'Shared wellness'],
      instructions: [
        'Choose activity type: communication, connection, or playful',
        'Read the instructions together before starting',
        'Follow the guided steps at your own pace',
        'Share reflections after completing the activity'
      ],
      component: CouplesActivity
    },
    {
      id: 'progressive-relaxation',
      title: 'Progressive Muscle Relaxation',
      subtitle: 'Release physical tension',
      icon: Zap,
      color: '#48bb78',
      description: 'Systematic muscle tension and release technique. Work through 10 muscle groups for complete physical relaxation.',
      benefits: ['Physical tension release', 'Deep relaxation', 'Better sleep'],
      instructions: [
        'Find a comfortable lying or reclining position',
        'Follow prompts to tense each muscle group for 5-7 seconds',
        'Release tension and notice the contrast',
        'Move through all 10 muscle groups systematically'
      ],
      component: ProgressiveMuscleRelaxation
    },
    {
      id: 'sleep-preparation',
      title: 'Sleep Preparation',
      subtitle: 'Bedtime routine guide',
      icon: Moon,
      color: '#805ad5',
      description: 'Comprehensive bedtime routine with 6 calming activities. Prepare your environment, mind, and body for quality sleep.',
      benefits: ['Better sleep quality', 'Relaxation routine', 'Sleep hygiene'],
      instructions: [
        'Start 1-2 hours before desired bedtime',
        'Complete each step in the guided routine',
        'Focus on creating a calm environment',
        'End with relaxation techniques in bed'
      ],
      component: SleepPreparation
    },
    {
      id: 'affirmations',
      title: 'Daily Affirmations',
      subtitle: 'Positive mindset training',
      icon: Star,
      color: '#ffd93d',
      description: 'Positive affirmation practice with 6 categories. Choose daily affirmations or create personalized ones.',
      benefits: ['Positive thinking', 'Self-confidence', 'Mindset shift'],
      instructions: [
        'Choose an affirmation category that resonates today',
        'Read affirmations slowly and meaningfully',
        'Start a guided session for deeper practice',
        'Create custom affirmations for personal growth'
      ],
      component: AffirmationsGame
    },
    {
      id: 'crisis-support',
      title: 'Crisis Support',
      subtitle: 'Emergency mental health resources',
      icon: Shield,
      color: '#e53e3e',
      description: 'Immediate crisis support resources and coping strategies. Access hotlines, safety planning, and emergency techniques.',
      benefits: ['Immediate help', 'Crisis resources', 'Safety planning'],
      instructions: [
        'For immediate danger, call emergency services (911)',
        'Use crisis hotlines for emotional support',
        'Try immediate coping strategies for relief',
        'Create a personal safety plan for future crises'
      ],
      component: CrisisSupport
    },
    {
      id: 'journaling',
      title: 'Therapeutic Journaling',
      subtitle: 'Guided writing prompts',
      icon: PenTool,
      color: '#805ad5',
      description: 'Structured journaling with therapeutic prompts across 6 categories. Process emotions and gain insights through writing.',
      benefits: ['Emotional processing', 'Self-reflection', 'CBT techniques'],
      instructions: [
        'Choose a journaling category or get a random prompt',
        'Take 10-15 minutes to write thoughtfully',
        'Be honest and authentic with yourself',
        'Review past entries to track your growth'
      ],
      component: JournalPrompts
    },
    {
      id: 'habit-tracker',
      title: 'Habit Tracker',
      subtitle: 'Daily wellness routines',
      icon: Target,
      color: '#38a169',
      description: 'Daily habit tracking with streak counters. Build positive routines and track consistency across multiple wellness areas.',
      benefits: ['Routine building', 'Progress tracking', 'Goal achievement'],
      instructions: [
        'Add habits you want to build (or choose from templates)',
        'Check off completed habits each day',
        'View weekly and monthly progress patterns',
        'Celebrate streaks and consistency milestones'
      ],
      component: HabitTracker
    },
    // CBT Tools
    {
      id: 'thought-record',
      title: 'Thought Record',
      subtitle: 'Challenge negative thinking',
      icon: Brain,
      color: '#4299e1',
      description: 'Cognitive Behavioral Therapy tool for examining thoughts. Work through 6 steps to challenge negative thinking patterns.',
      benefits: ['Cognitive restructuring', 'Mood improvement', 'Self-awareness'],
      instructions: [
        'Identify the triggering situation',
        'Name your emotions and rate intensity',
        'Write down your automatic thoughts',
        'Examine evidence for and against the thought',
        'Generate alternative perspectives',
        'Create a balanced, realistic thought'
      ],
      component: ThoughtRecord
    },
    {
      id: 'cognitive-distortions',
      title: 'Cognitive Distortion Detective',
      subtitle: 'Identify thinking traps',
      icon: Brain,
      color: '#9f7aea',
      description: 'Educational game about thinking patterns. Learn 10 common cognitive distortions and practice identifying them.',
      benefits: ['Better thinking patterns', 'Reduced anxiety', 'Clearer perspective'],
      instructions: [
        'Study the 10 common cognitive distortions',
        'Take the quiz to test your knowledge',
        'Read scenarios and identify the thinking trap',
        'Learn why each distortion is harmful and how to counter it'
      ],
      component: CognitiveDistortions
    },
    {
      id: 'behavioral-activation',
      title: 'Behavioral Activation',
      subtitle: 'Action-based mood lifting',
      icon: Zap,
      color: '#48bb78',
      description: 'Schedule pleasant activities to improve mood. Plan, track, and analyze how different activities affect your wellbeing.',
      benefits: ['Increased motivation', 'Mood enhancement', 'Activity planning'],
      instructions: [
        'Schedule pleasant activities for specific days',
        'Rate your expected mood before the activity',
        'Complete the activity and rate your actual mood',
        'Track which activities give you the biggest mood boost'
      ],
      component: BehavioralActivation
    },
    // Physical Wellness
    {
      id: 'mindful-movement',
      title: 'Mindful Movement',
      subtitle: 'Gentle exercise routines',
      icon: Activity,
      color: '#ed8936',
      description: 'Gentle movement exercises with mindfulness. Choose from desk stretches, anxiety release, energy boosting, or bedtime routines.',
      benefits: ['Stress relief', 'Body awareness', 'Gentle exercise'],
      instructions: [
        'Choose an exercise routine based on your needs',
        'Follow the step-by-step movement instructions',
        'Focus on how your body feels during each movement',
        'Use the timer to pace yourself through each step'
      ],
      component: MindfulMovement
    },
    {
      id: 'exercise-mood',
      title: 'Exercise-Mood Tracker',
      subtitle: 'Track activity and feelings',
      icon: Activity,
      color: '#38a169',
      description: 'Track the relationship between exercise and mood. Log workouts and see how physical activity impacts your emotional wellbeing.',
      benefits: ['Exercise motivation', 'Mood tracking', 'Pattern recognition'],
      instructions: [
        'Log your exercise sessions with details',
        'Rate your mood before and after exercise',
        'Track duration, intensity, and activity type',
        'View insights about which activities boost your mood most'
      ],
      component: ExerciseMoodTracker
    },
    {
      id: 'grounding',
      title: 'Grounding Techniques',
      subtitle: 'Present moment awareness',
      icon: Anchor,
      color: '#805ad5',
      description: 'Sensory grounding exercises for anxiety and overwhelm. Use the 5-4-3-2-1 technique and other grounding methods.',
      benefits: ['Anxiety relief', 'Present awareness', 'Emotional grounding'],
      instructions: [
        'Choose a grounding exercise based on your needs',
        'Follow the step-by-step sensory instructions',
        'Take your time with each step',
        'Use these techniques whenever you feel overwhelmed'
      ],
      component: GroundingTechniques
    },
    // Social Features
    {
      id: 'encouragement-wall',
      title: 'Encouragement Wall',
      subtitle: 'Community support messages',
      icon: MessageCircle,
      color: '#ed64a6',
      description: 'Anonymous community support platform. Share uplifting messages and receive encouragement from others on their wellness journey.',
      benefits: ['Community support', 'Positive messaging', 'Connection'],
      instructions: [
        'Read encouraging messages from the community',
        'Like messages that resonate with you',
        'Share your own anonymous encouragement',
        'Choose message categories that match your needs'
      ],
      component: EncouragementWall
    },
    {
      id: 'wellness-buddy',
      title: 'Wellness Buddy System',
      subtitle: 'Accountability partnership',
      icon: Users,
      color: '#4299e1',
      description: 'Accountability partnership system. Set shared goals, do daily check-ins, and support each other\'s wellness journey.',
      benefits: ['Accountability', 'Motivation', 'Shared goals'],
      instructions: [
        'Connect with a wellness buddy (demo version)',
        'Set shared wellness goals together',
        'Complete daily check-ins with mood and progress',
        'Support and motivate each other'
      ],
      component: WellnessBuddySystem
    },
    {
      id: 'community-challenge',
      title: 'Community Challenges',
      subtitle: 'Group wellness goals',
      icon: Trophy,
      color: '#d69e2e',
      description: 'Group wellness challenges with community participation. Join 7-30 day challenges to build habits with others.',
      benefits: ['Group motivation', 'Habit building', 'Achievement'],
      instructions: [
        'Browse available community challenges',
        'Join challenges that align with your goals',
        'Complete daily tasks and track progress',
        'View your progress calendar and celebrate milestones'
      ],
      component: CommunityChallenge
    },
    // Emergency Coping
    {
      id: 'emergency-coping',
      title: 'Emergency Coping Toolkit',
      subtitle: 'Crisis intervention tools',
      icon: Shield,
      color: '#e53e3e',
      description: 'Immediate relief for emotional crises. Step-by-step guides for panic attacks, overwhelm, anxiety spirals, and emotional storms.',
      benefits: ['Crisis management', 'Immediate relief', 'Emotional regulation'],
      instructions: [
        'Choose the situation that matches your current state',
        'Follow the step-by-step guided instructions',
        'Use timers to pace yourself through each step',
        'Practice techniques when calm to build familiarity'
      ],
      component: EmergencyCopingToolkit
    },
    // Gamification
    {
      id: 'achievements',
      title: 'Achievement System',
      subtitle: 'Track your progress',
      icon: Award,
      color: '#ffd93d',
      description: 'Comprehensive achievement system with 5 categories. Earn points, unlock badges, and celebrate wellness milestones.',
      benefits: ['Motivation', 'Progress tracking', 'Goal celebration'],
      instructions: [
        'Complete wellness activities to earn achievements',
        'View progress toward next milestones',
        'Explore different achievement categories',
        'Simulate progress to see how the system works'
      ],
      component: AchievementSystem
    },
    {
      id: 'wellness-streaks',
      title: 'Wellness Streaks',
      subtitle: 'Build consistency',
      icon: Flame,
      color: '#ff6b6b',
      description: 'Streak tracking across all wellness activities. Build daily consistency and unlock milestone rewards.',
      benefits: ['Habit consistency', 'Motivation', 'Progress visualization'],
      instructions: [
        'Complete any wellness activity to continue your streak',
        'View your weekly progress calendar',
        'Track category-specific streaks',
        'Work toward milestone achievements'
      ],
      component: WellnessStreaks
    },
    {
      id: 'growth-challenges',
      title: 'Personal Growth Challenges',
      subtitle: 'Transform through practice',
      icon: Sprout,
      color: '#51cf66',
      description: 'Structured personal development challenges. Choose from comfort zone expansion, gratitude mastery, fear facing, and more.',
      benefits: ['Personal growth', 'Self-discovery', 'Skill building'],
      instructions: [
        'Choose a challenge that matches your growth goals',
        'Complete daily prompts and reflection questions',
        'Track your progress through the challenge calendar',
        'Reflect on insights and growth at the end'
      ],
      component: PersonalGrowthChallenges
    },
    // Educational Modules
    {
      id: 'mental-health-myths',
      title: 'Mental Health: Myths vs Facts',
      subtitle: 'Learn the truth',
      icon: Brain,
      color: '#339af0',
      description: 'Educational quiz about mental health misconceptions. Learn facts, challenge myths, and reduce stigma.',
      benefits: ['Education', 'Stigma reduction', 'Awareness'],
      instructions: [
        'Read about common mental health myths and facts',
        'Take the quiz to test your knowledge',
        'Learn detailed explanations for each topic',
        'Share accurate information to help reduce stigma'
      ],
      component: MentalHealthMyths
    },
    {
      id: 'emotion-regulation',
      title: 'Emotion Regulation Skills',
      subtitle: 'Master your emotions',
      icon: Heart,
      color: '#f06595',
      description: 'Evidence-based emotion regulation techniques. Learn opposite action, TIPP skills, wise mind, and PLEASE techniques.',
      benefits: ['Emotional control', 'Coping skills', 'Self-regulation'],
      instructions: [
        'Identify your current emotion and intensity',
        'Choose the appropriate regulation skill',
        'Follow the guided practice steps',
        'Apply techniques in real-life situations'
      ],
      component: EmotionRegulationSkills
    },
    {
      id: 'stress-science',
      title: 'The Science of Stress',
      subtitle: 'Understand stress responses',
      icon: Zap,
      color: '#fd7e14',
      description: 'Educational modules about stress physiology and psychology. Understand your stress response and learn management strategies.',
      benefits: ['Stress understanding', 'Science education', 'Management strategies'],
      instructions: [
        'Read through the educational modules',
        'Learn about stress physiology and psychology',
        'Mark modules complete as you finish them',
        'Apply practical tips in your daily life'
      ],
      component: StressScience
    },
    // Advanced Features
    {
      id: 'progress-visualization',
      title: 'Advanced Progress Visualization',
      subtitle: 'Deep insights and analytics',
      icon: BarChart3,
      color: '#6366f1',
      description: 'Comprehensive progress analytics with trends, correlations, and detailed insights across all wellness activities.',
      benefits: ['Deep insights', 'Pattern recognition', 'Data-driven decisions'],
      instructions: [
        'View overview of your wellness metrics',
        'Explore trends in mood and activity patterns',
        'Discover correlations between different activities',
        'Analyze activity effectiveness and distribution'
      ],
      component: AdvancedProgressVisualization
    },
    {
      id: 'data-export',
      title: 'Data Export Tools',
      subtitle: 'Export your wellness data',
      icon: Coffee,
      color: '#8b5cf6',
      description: 'Export your wellness data for healthcare providers, research contribution, or personal backup.',
      benefits: ['Healthcare sharing', 'Research contribution', 'Data backup'],
      instructions: [
        'Choose export type: healthcare, research, or personal',
        'Review what data will be included',
        'Provide consent for data usage',
        'Download your formatted wellness report'
      ],
      component: DataExportTools
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
        <GameComponent onNavigateToActivity={(componentName) => {
          const game = games.find(g => g.component.name === componentName);
          if (game) setActiveGame(game);
        }} />
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
        <div className="platform-stats">
          <div className="stat-item">
            <span className="stat-number">{games.length}</span>
            <span className="stat-label">Wellness Tools</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">6</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Evidence-Based</span>
          </div>
        </div>
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
                
                {game.instructions && (
                  <div className="instructions-list">
                    <h4>How to use:</h4>
                    <ol>
                      {game.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
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