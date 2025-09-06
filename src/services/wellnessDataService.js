// Comprehensive wellness data integration and analytics service
class WellnessDataService {
  constructor() {
    this.dataKeys = {
      mood: 'mood-history',
      gratitude: 'gratitude-entries',
      breathing: 'breathing-sessions',
      meditation: 'meditation-sessions',
      couples: 'couples-activities',
      habits: 'habit-tracker',
      journal: 'journal-entries',
      exercise: 'exerciseMoodEntries',
      grounding: 'groundingSessions',
      mindfulMovement: 'mindfulMovementSessions',
      achievements: 'userAchievements',
      stats: 'userWellnessStats',
      affirmations: 'custom-affirmations',
      copingToolkit: 'copingToolkitUsage',
      emotionRegulation: 'emotionRegulationSessions'
    };
  }

  // Get all wellness data from localStorage
  getAllData() {
    const data = {};
    Object.entries(this.dataKeys).forEach(([key, storageKey]) => {
      try {
        data[key] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      } catch (error) {
        console.error(`Error loading ${key} data:`, error);
        data[key] = [];
      }
    });
    return data;
  }

  // Calculate comprehensive wellness insights
  getWellnessInsights(days = 30) {
    const data = this.getAllData();
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    // Filter recent data
    const recentData = {};
    Object.entries(data).forEach(([key, entries]) => {
      recentData[key] = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp || entry.completedAt || entry.date);
        return entryDate > cutoffDate;
      });
    });

    return {
      overview: this.calculateOverviewStats(recentData),
      patterns: this.analyzePatterns(recentData),
      correlations: this.findCorrelations(recentData),
      trends: this.analyzeTrends(recentData),
      recommendations: this.generateRecommendations(recentData)
    };
  }

  calculateOverviewStats(data) {
    const totalActivities = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
    const activeDays = this.getActiveDays(data);
    const currentStreak = this.calculateCurrentStreak(data.mood);
    const bestStreak = this.calculateBestStreak(data.mood);
    
    // Mood statistics
    const moodData = data.mood.filter(entry => entry.mood !== undefined);
    const avgMood = moodData.length > 0 
      ? (moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length).toFixed(1)
      : 0;

    // Activity distribution
    const activityCounts = {
      mood: data.mood.length,
      gratitude: data.gratitude.length,
      breathing: data.breathing.length,
      meditation: data.meditation.length,
      exercise: data.exercise.length,
      journal: data.journal.length
    };

    return {
      totalActivities,
      activeDays,
      currentStreak,
      bestStreak,
      avgMood: parseFloat(avgMood),
      activityCounts,
      wellnessScore: this.calculateWellnessScore(data)
    };
  }

  analyzePatterns(data) {
    const patterns = {};

    // Daily activity patterns
    patterns.dailyActivity = this.getDailyActivityPattern(data);
    
    // Mood patterns
    patterns.moodByDayOfWeek = this.getMoodByDayOfWeek(data.mood);
    patterns.moodByTimeOfDay = this.getMoodByTimeOfDay(data.mood);
    
    // Activity effectiveness patterns
    patterns.activityEffectiveness = this.getActivityEffectiveness(data);

    return patterns;
  }

  findCorrelations(data) {
    const correlations = [];

    // Exercise and mood correlation
    const exerciseMoodCorr = this.calculateExerciseMoodCorrelation(data.exercise, data.mood);
    if (Math.abs(exerciseMoodCorr) > 0.3) {
      correlations.push({
        type: 'exercise-mood',
        correlation: exerciseMoodCorr,
        strength: Math.abs(exerciseMoodCorr) > 0.7 ? 'strong' : 'moderate',
        message: exerciseMoodCorr > 0 
          ? 'Exercise sessions are positively correlated with better mood'
          : 'More exercise might help improve your mood'
      });
    }

    // Meditation and mood correlation
    const meditationMoodCorr = this.calculateMeditationMoodCorrelation(data.meditation, data.mood);
    if (Math.abs(meditationMoodCorr) > 0.3) {
      correlations.push({
        type: 'meditation-mood',
        correlation: meditationMoodCorr,
        strength: Math.abs(meditationMoodCorr) > 0.7 ? 'strong' : 'moderate',
        message: meditationMoodCorr > 0 
          ? 'Meditation practice correlates with improved mood'
          : 'Regular meditation might help stabilize your mood'
      });
    }

    // Breathing exercises and stress correlation
    const breathingStressCorr = this.calculateBreathingStressCorrelation(data.breathing, data.mood);
    if (Math.abs(breathingStressCorr) > 0.3) {
      correlations.push({
        type: 'breathing-stress',
        correlation: breathingStressCorr,
        strength: Math.abs(breathingStressCorr) > 0.7 ? 'strong' : 'moderate',
        message: 'Breathing exercises help reduce stress levels'
      });
    }

    return correlations;
  }

  analyzeTrends(data) {
    const trends = {};

    // Mood trend over time
    trends.mood = this.calculateMoodTrend(data.mood);
    
    // Activity frequency trends
    trends.activityFrequency = this.calculateActivityTrends(data);
    
    // Wellness score trend
    trends.wellnessScore = this.calculateWellnessScoreTrend(data);

    return trends;
  }

  generateRecommendations(data) {
    const recommendations = [];
    const overview = this.calculateOverviewStats(data);
    const patterns = this.analyzePatterns(data);

    // Mood-based recommendations
    if (overview.avgMood < 6) {
      recommendations.push({
        type: 'mood-improvement',
        priority: 'high',
        title: 'Focus on Mood Enhancement',
        description: 'Your recent mood scores suggest focusing on mood-boosting activities',
        actions: [
          'Try gratitude journaling daily',
          'Increase physical activity',
          'Practice breathing exercises when stressed',
          'Consider talking to someone you trust'
        ],
        components: ['GratitudeGame', 'ExerciseMoodTracker', 'BreathingGame']
      });
    }

    // Activity consistency recommendations
    if (overview.currentStreak < 3) {
      recommendations.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Build Daily Habits',
        description: 'Establishing consistent daily wellness practices can improve overall wellbeing',
        actions: [
          'Set a specific time each day for mood check-ins',
          'Start with just 5 minutes of daily meditation',
          'Use habit tracking to monitor progress'
        ],
        components: ['MoodTracker', 'MeditationTimer', 'HabitTracker']
      });
    }

    // Stress management recommendations
    const recentStressfulMoods = data.mood.filter(m => m.mood < 5 && m.anxiety > 6);
    if (recentStressfulMoods.length > 3) {
      recommendations.push({
        type: 'stress-management',
        priority: 'high',
        title: 'Stress Management Focus',
        description: 'Recent entries show elevated stress levels',
        actions: [
          'Practice grounding techniques daily',
          'Use progressive muscle relaxation',
          'Try the emergency coping toolkit when overwhelmed'
        ],
        components: ['GroundingTechniques', 'ProgressiveMuscleRelaxation', 'EmergencyCopingToolkit']
      });
    }

    // Social connection recommendations
    if (data.couples.length === 0 && data.exercise.length === 0) {
      recommendations.push({
        type: 'social-connection',
        priority: 'medium',
        title: 'Enhance Social Connections',
        description: 'Social activities and shared experiences can boost wellbeing',
        actions: [
          'Try couples activities if in a relationship',
          'Join the wellness buddy system',
          'Participate in community challenges'
        ],
        components: ['CouplesActivity', 'WellnessBuddySystem', 'CommunityChallenge']
      });
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  // Helper methods for calculations
  getActiveDays(data) {
    const allDates = new Set();
    Object.values(data).forEach(entries => {
      entries.forEach(entry => {
        const date = new Date(entry.timestamp || entry.completedAt || entry.date);
        allDates.add(date.toDateString());
      });
    });
    return allDates.size;
  }

  calculateCurrentStreak(moodData) {
    if (!moodData.length) return 0;
    
    let streak = 0;
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today - (i * oneDay));
      const hasEntry = moodData.some(entry => 
        new Date(entry.timestamp).toDateString() === checkDate.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }

  calculateBestStreak(moodData) {
    if (!moodData.length) return 0;
    
    let bestStreak = 0;
    let currentStreak = 0;
    const sortedData = moodData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    for (let i = 0; i < sortedData.length; i++) {
      const currentDate = new Date(sortedData[i].timestamp);
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(sortedData[i - 1].timestamp);
        const dayDiff = (currentDate - prevDate) / (24 * 60 * 60 * 1000);
        
        if (dayDiff <= 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      
      bestStreak = Math.max(bestStreak, currentStreak);
    }
    
    return bestStreak;
  }

  calculateWellnessScore(data) {
    const weights = {
      mood: 0.25,
      gratitude: 0.15,
      breathing: 0.15,
      meditation: 0.15,
      exercise: 0.15,
      journal: 0.1,
      habits: 0.05
    };
    
    let score = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      if (data[key] && data[key].length > 0) {
        score += weight * Math.min(data[key].length * 10, 100);
      }
    });
    
    return Math.round(score);
  }

  getDailyActivityPattern(data) {
    const pattern = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    daysOfWeek.forEach(day => pattern[day] = 0);
    
    Object.values(data).forEach(entries => {
      entries.forEach(entry => {
        const date = new Date(entry.timestamp || entry.completedAt || entry.date);
        const dayName = daysOfWeek[date.getDay()];
        pattern[dayName]++;
      });
    });
    
    return pattern;
  }

  getMoodByDayOfWeek(moodData) {
    const pattern = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    daysOfWeek.forEach(day => pattern[day] = []);
    
    moodData.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dayName = daysOfWeek[date.getDay()];
      pattern[dayName].push(entry.mood);
    });
    
    // Calculate averages
    Object.keys(pattern).forEach(day => {
      const moods = pattern[day];
      pattern[day] = moods.length > 0 
        ? (moods.reduce((sum, mood) => sum + mood, 0) / moods.length).toFixed(1)
        : 0;
    });
    
    return pattern;
  }

  getMoodByTimeOfDay(moodData) {
    const pattern = { morning: [], afternoon: [], evening: [] };
    
    moodData.forEach(entry => {
      const date = new Date(entry.timestamp);
      const hour = date.getHours();
      
      if (hour < 12) pattern.morning.push(entry.mood);
      else if (hour < 18) pattern.afternoon.push(entry.mood);
      else pattern.evening.push(entry.mood);
    });
    
    // Calculate averages
    Object.keys(pattern).forEach(time => {
      const moods = pattern[time];
      pattern[time] = moods.length > 0 
        ? (moods.reduce((sum, mood) => sum + mood, 0) / moods.length).toFixed(1)
        : 0;
    });
    
    return pattern;
  }

  getActivityEffectiveness(data) {
    const effectiveness = {};
    
    // Calculate mood improvement after activities
    ['breathing', 'meditation', 'exercise', 'gratitude'].forEach(activity => {
      if (data[activity] && data[activity].length > 0) {
        effectiveness[activity] = this.calculateActivityMoodImpact(data[activity], data.mood);
      }
    });
    
    return effectiveness;
  }

  calculateActivityMoodImpact(activities, moodData) {
    let improvements = 0;
    let total = 0;
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.timestamp || activity.completedAt);
      
      // Find mood entries within 24 hours after the activity
      const moodAfter = moodData.filter(mood => {
        const moodDate = new Date(mood.timestamp);
        const hoursDiff = (moodDate - activityDate) / (1000 * 60 * 60);
        return hoursDiff > 0 && hoursDiff <= 24;
      });
      
      // Find mood entries within 24 hours before the activity
      const moodBefore = moodData.filter(mood => {
        const moodDate = new Date(mood.timestamp);
        const hoursDiff = (activityDate - moodDate) / (1000 * 60 * 60);
        return hoursDiff > 0 && hoursDiff <= 24;
      });
      
      if (moodAfter.length > 0 && moodBefore.length > 0) {
        const avgAfter = moodAfter.reduce((sum, m) => sum + m.mood, 0) / moodAfter.length;
        const avgBefore = moodBefore.reduce((sum, m) => sum + m.mood, 0) / moodBefore.length;
        
        if (avgAfter > avgBefore) improvements++;
        total++;
      }
    });
    
    return total > 0 ? (improvements / total * 100).toFixed(1) : 0;
  }

  // Correlation calculations
  calculateExerciseMoodCorrelation(exerciseData, moodData) {
    // Simplified correlation calculation
    const dailyExercise = this.groupByDay(exerciseData);
    const dailyMood = this.groupByDay(moodData, 'mood');
    
    return this.pearsonCorrelation(dailyExercise, dailyMood);
  }

  calculateMeditationMoodCorrelation(meditationData, moodData) {
    const dailyMeditation = this.groupByDay(meditationData);
    const dailyMood = this.groupByDay(moodData, 'mood');
    
    return this.pearsonCorrelation(dailyMeditation, dailyMood);
  }

  calculateBreathingStressCorrelation(breathingData, moodData) {
    const dailyBreathing = this.groupByDay(breathingData);
    const dailyStress = this.groupByDay(moodData, 'anxiety');
    
    return this.pearsonCorrelation(dailyBreathing, dailyStress) * -1; // Negative because more breathing should reduce stress
  }

  groupByDay(data, valueField = null) {
    const grouped = {};
    
    data.forEach(entry => {
      const date = new Date(entry.timestamp || entry.completedAt).toDateString();
      if (!grouped[date]) grouped[date] = [];
      
      grouped[date].push(valueField ? entry[valueField] : 1);
    });
    
    // Calculate daily values (count or average)
    Object.keys(grouped).forEach(date => {
      grouped[date] = valueField 
        ? grouped[date].reduce((sum, val) => sum + val, 0) / grouped[date].length
        : grouped[date].length;
    });
    
    return grouped;
  }

  pearsonCorrelation(x, y) {
    const commonDates = Object.keys(x).filter(date => y[date] !== undefined);
    
    if (commonDates.length < 3) return 0; // Not enough data points
    
    const xValues = commonDates.map(date => x[date]);
    const yValues = commonDates.map(date => y[date]);
    
    const n = xValues.length;
    const sumX = xValues.reduce((sum, val) => sum + val, 0);
    const sumY = yValues.reduce((sum, val) => sum + val, 0);
    const sumXY = xValues.reduce((sum, val, i) => sum + val * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = yValues.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  calculateMoodTrend(moodData) {
    if (moodData.length < 2) return 'insufficient-data';
    
    const recentData = moodData
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-14); // Last 14 entries
    
    if (recentData.length < 2) return 'insufficient-data';
    
    const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2));
    const secondHalf = recentData.slice(Math.floor(recentData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    
    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
  }

  calculateActivityTrends(data) {
    const trends = {};
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    
    Object.entries(data).forEach(([activity, entries]) => {
      const thisWeek = entries.filter(entry => 
        new Date(entry.timestamp || entry.completedAt) > oneWeekAgo
      ).length;
      
      const lastWeek = entries.filter(entry => {
        const date = new Date(entry.timestamp || entry.completedAt);
        return date > twoWeeksAgo && date <= oneWeekAgo;
      }).length;
      
      if (lastWeek === 0) {
        trends[activity] = thisWeek > 0 ? 'new' : 'none';
      } else {
        const change = (thisWeek - lastWeek) / lastWeek;
        if (change > 0.2) trends[activity] = 'increasing';
        else if (change < -0.2) trends[activity] = 'decreasing';
        else trends[activity] = 'stable';
      }
    });
    
    return trends;
  }

  calculateWellnessScoreTrend(data) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Filter data for this week and last week
    const thisWeekData = {};
    const lastWeekData = {};
    
    Object.entries(data).forEach(([key, entries]) => {
      thisWeekData[key] = entries.filter(entry => 
        new Date(entry.timestamp || entry.completedAt) > oneWeekAgo
      );
      
      lastWeekData[key] = entries.filter(entry => {
        const date = new Date(entry.timestamp || entry.completedAt);
        return date > twoWeeksAgo && date <= oneWeekAgo;
      });
    });
    
    const thisWeekScore = this.calculateWellnessScore(thisWeekData);
    const lastWeekScore = this.calculateWellnessScore(lastWeekData);
    
    if (lastWeekScore === 0) return thisWeekScore > 0 ? 'improving' : 'stable';
    
    const change = (thisWeekScore - lastWeekScore) / lastWeekScore;
    
    if (change > 0.1) return 'improving';
    if (change < -0.1) return 'declining';
    return 'stable';
  }

  // Today's Focus recommendation
  getTodaysFocus() {
    const data = this.getAllData();
    const today = new Date().toDateString();
    
    // Check what user has done today
    const todayActivities = {
      mood: data.mood.filter(entry => new Date(entry.timestamp).toDateString() === today),
      gratitude: data.gratitude.filter(entry => new Date(entry.timestamp).toDateString() === today),
      meditation: data.meditation.filter(entry => new Date(entry.timestamp).toDateString() === today),
      breathing: data.breathing.filter(entry => new Date(entry.timestamp).toDateString() === today),
      exercise: data.exercise.filter(entry => new Date(entry.timestamp).toDateString() === today)
    };

    // Determine what's missing and what's most beneficial
    const recommendations = this.generateRecommendations(data);
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high');

    // Focus recommendation logic
    if (todayActivities.mood.length === 0) {
      return {
        type: 'mood-checkin',
        title: 'Daily Mood Check-in',
        description: 'Start your wellness journey today with a quick mood assessment',
        component: 'MoodTracker',
        priority: 'essential',
        estimatedTime: 2
      };
    }

    if (highPriorityRecs.length > 0) {
      const rec = highPriorityRecs[0];
      return {
        type: rec.type,
        title: rec.title,
        description: rec.description,
        component: rec.components[0],
        priority: 'high',
        estimatedTime: 10
      };
    }

    // Default recommendations based on day of week and time
    const dayOfWeek = new Date().getDay();
    const hour = new Date().getHours();

    if (hour < 12 && todayActivities.meditation.length === 0) {
      return {
        type: 'morning-meditation',
        title: 'Morning Meditation',
        description: 'Start your day with mindfulness and clarity',
        component: 'MeditationTimer',
        priority: 'medium',
        estimatedTime: 10
      };
    }

    if (hour > 17 && todayActivities.gratitude.length === 0) {
      return {
        type: 'evening-gratitude',
        title: 'Evening Gratitude',
        description: 'Reflect on the positive moments from your day',
        component: 'GratitudeGame',
        priority: 'medium',
        estimatedTime: 5
      };
    }

    // Weekend focus
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        type: 'weekend-wellness',
        title: 'Weekend Self-Care',
        description: 'Take some time for deeper wellness activities',
        component: 'ProgressiveMuscleRelaxation',
        priority: 'medium',
        estimatedTime: 15
      };
    }

    // Default
    return {
      type: 'breathing-break',
      title: 'Breathing Break',
      description: 'Take a moment to center yourself with conscious breathing',
      component: 'BreathingGame',
      priority: 'low',
      estimatedTime: 5
    };
  }

  // Export data for healthcare providers
  exportHealthcareData() {
    const data = this.getAllData();
    const insights = this.getWellnessInsights(90); // 3 months of data
    
    const exportData = {
      exportDate: new Date().toISOString(),
      patientSummary: {
        totalActivitiesLogged: insights.overview.totalActivities,
        averageMood: insights.overview.avgMood,
        wellnessScore: insights.overview.wellnessScore,
        consistencyStreak: insights.overview.currentStreak,
        activeDays: insights.overview.activeDays
      },
      trends: insights.trends,
      correlations: insights.correlations,
      moodHistory: data.mood.map(entry => ({
        date: entry.timestamp,
        mood: entry.mood,
        anxiety: entry.anxiety,
        energy: entry.energy,
        notes: entry.notes
      })),
      activitySummary: {
        meditationSessions: data.meditation.length,
        breathingExercises: data.breathing.length,
        journalEntries: data.journal.length,
        gratitudePractice: data.gratitude.length,
        exerciseSessions: data.exercise.length
      },
      recommendations: insights.recommendations
    };

    return exportData;
  }

  // Research data (anonymized)
  exportResearchData() {
    const data = this.getAllData();
    const insights = this.getWellnessInsights(365); // 1 year of data
    
    // Remove all personally identifiable information
    const researchData = {
      demographics: {
        sessionCount: insights.overview.totalActivities,
        usagePeriodDays: insights.overview.activeDays,
        averageEngagement: insights.overview.wellnessScore
      },
      patterns: insights.patterns,
      correlations: insights.correlations.map(corr => ({
        type: corr.type,
        strength: corr.strength,
        correlation: Math.round(corr.correlation * 100) / 100
      })),
      trends: insights.trends,
      effectivenessMetrics: {
        moodImprovement: insights.trends.mood === 'improving',
        consistencyScore: insights.overview.currentStreak,
        diversityScore: Object.keys(insights.overview.activityCounts).filter(
          activity => insights.overview.activityCounts[activity] > 0
        ).length
      }
    };

    return researchData;
  }
}

export default new WellnessDataService();