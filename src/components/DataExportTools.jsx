import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  FileText, 
  Shield, 
  User, 
  Heart, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Info,
  Lock
} from 'lucide-react';
import wellnessDataService from '../services/wellnessDataService';

const DataExportTools = () => {
  const [exportType, setExportType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const exportOptions = [
    {
      id: 'healthcare',
      title: 'Healthcare Provider Report',
      description: 'Comprehensive wellness summary for sharing with your healthcare team',
      icon: User,
      color: '#4299e1',
      includes: [
        'Mood trends and patterns',
        'Activity completion rates', 
        'Wellness score progression',
        'Identified correlations',
        'Recommendation insights'
      ],
      format: 'PDF Report',
      privacy: 'Includes personal wellness data'
    },
    {
      id: 'research',
      title: 'Anonymous Research Data',
      description: 'Help advance mental health research by sharing anonymized data',
      icon: Heart,
      color: '#48bb78',
      includes: [
        'Usage patterns (anonymized)',
        'Effectiveness metrics',
        'Demographic categories only',
        'No personal identifiers',
        'Aggregated insights'
      ],
      format: 'JSON Data',
      privacy: 'Completely anonymous - no personal data'
    },
    {
      id: 'personal',
      title: 'Personal Backup',
      description: 'Download all your wellness data for personal records',
      icon: Download,
      color: '#ed8936',
      includes: [
        'Complete activity history',
        'All mood entries',
        'Journal entries',
        'Personal notes',
        'Achievement progress'
      ],
      format: 'JSON + PDF',
      privacy: 'Your complete personal data'
    }
  ];

  const handleExport = async (type) => {
    setIsExporting(true);
    setExportType(type);

    try {
      let exportData;
      let filename;

      switch (type) {
        case 'healthcare':
          exportData = wellnessDataService.exportHealthcareData();
          filename = `wellness-report-${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'research':
          exportData = wellnessDataService.exportResearchData();
          filename = `anonymous-research-data-${Date.now()}.json`;
          break;
        case 'personal':
          exportData = wellnessDataService.getAllData();
          filename = `personal-wellness-backup-${new Date().toISOString().split('T')[0]}.json`;
          break;
        default:
          throw new Error('Invalid export type');
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // If healthcare report, also generate PDF-style summary
      if (type === 'healthcare') {
        generateHealthcarePDF(exportData);
      }

      setExportComplete(true);
      
      // Track export for analytics (anonymized)
      if (type === 'research') {
        localStorage.setItem('research-contribution', JSON.stringify({
          date: new Date().toISOString(),
          dataPoints: Object.keys(exportData.demographics).length
        }));
      }

      setTimeout(() => {
        setExportComplete(false);
        setExportType(null);
        setIsExporting(false);
      }, 3000);

    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportType(null);
    }
  };

  const generateHealthcarePDF = (data) => {
    // Generate a formatted text summary for healthcare providers
    const summary = `
WELLNESS SUMMARY REPORT
Generated: ${new Date().toLocaleDateString()}

PATIENT OVERVIEW:
- Total Activities Logged: ${data.patientSummary.totalActivitiesLogged}
- Average Mood Score: ${data.patientSummary.averageMood}/10
- Overall Wellness Score: ${data.patientSummary.wellnessScore}/100
- Current Consistency Streak: ${data.patientSummary.consistencyStreak} days
- Active Days in Period: ${data.patientSummary.activeDays}

IDENTIFIED TRENDS:
- Mood Trend: ${data.trends.mood || 'Stable'}
- Wellness Score Trend: ${data.trends.wellnessScore || 'Stable'}

KEY CORRELATIONS:
${data.correlations.map(corr => `- ${corr.message}`).join('\n')}

ACTIVITY SUMMARY:
- Meditation Sessions: ${data.activitySummary.meditationSessions}
- Breathing Exercises: ${data.activitySummary.breathingExercises}
- Journal Entries: ${data.activitySummary.journalEntries}
- Gratitude Practice: ${data.activitySummary.gratitudePractice}
- Exercise Sessions: ${data.activitySummary.exerciseSessions}

RECOMMENDATIONS:
${data.recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n')}

RECENT MOOD ENTRIES (Last 10):
${data.moodHistory.slice(-10).map(entry => 
  `${new Date(entry.date).toLocaleDateString()}: Mood ${entry.mood}/10${entry.notes ? ' - ' + entry.notes : ''}`
).join('\n')}

---
This report is generated from user-reported wellness data and should be considered alongside professional clinical assessment.
    `;

    const textBlob = new Blob([summary], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = textUrl;
    a.download = `wellness-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(textUrl);
  };

  return (
    <div className="data-export-tools">
      <div className="export-header">
        <h2>Export Your Data</h2>
        <p>Download your wellness data for healthcare providers, research, or personal backup</p>
      </div>

      <div className="export-options">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = exportType === option.id;
          const isCompleted = exportComplete && exportType === option.id;

          return (
            <motion.div
              key={option.id}
              className={`export-option ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="option-header">
                <div className="option-icon" style={{ backgroundColor: option.color }}>
                  {isCompleted ? (
                    <CheckCircle size={24} />
                  ) : isSelected && isExporting ? (
                    <div className="loading-spinner" />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <div className="option-info">
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </div>
              </div>

              <div className="option-details">
                <div className="includes-section">
                  <h4>Includes:</h4>
                  <ul>
                    {option.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="option-meta">
                  <div className="meta-item">
                    <FileText size={16} />
                    <span>{option.format}</span>
                  </div>
                  <div className="meta-item">
                    <Shield size={16} />
                    <span>{option.privacy}</span>
                  </div>
                </div>
              </div>

              {option.id === 'research' && (
                <div className="research-notice">
                  <Info size={16} />
                  <span>Your contribution helps improve mental health tools for everyone</span>
                </div>
              )}

              <div className="option-actions">
                {isCompleted ? (
                  <div className="completion-message">
                    <CheckCircle size={16} />
                    Export completed successfully!
                  </div>
                ) : (
                  <button
                    className="export-button"
                    onClick={() => handleExport(option.id)}
                    disabled={isExporting}
                  >
                    {isSelected && isExporting ? (
                      'Exporting...'
                    ) : (
                      <>
                        <Download size={16} />
                        Export Data
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy and Consent Section */}
      <div className="privacy-section">
        <div className="privacy-header">
          <Lock size={20} />
          <h3>Privacy & Consent</h3>
        </div>
        
        <div className="privacy-content">
          <div className="privacy-item">
            <h4>Your Data Security</h4>
            <p>All exports are generated locally on your device. Your data is never sent to external servers during the export process.</p>
          </div>
          
          <div className="privacy-item">
            <h4>Healthcare Provider Sharing</h4>
            <p>Healthcare reports contain your personal wellness data. Only share with trusted healthcare professionals.</p>
          </div>
          
          <div className="privacy-item">
            <h4>Research Contribution</h4>
            <p>Research exports are completely anonymized. No personal identifiers or specific entries are included.</p>
          </div>
          
          <div className="privacy-item">
            <h4>Data Retention</h4>
            <p>Exported files are saved to your device. You control how long to keep them and who to share them with.</p>
          </div>
        </div>

        <div className="consent-section">
          <label className="consent-checkbox">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
            />
            <span className="checkmark"></span>
            I understand how my data will be used and consent to exporting it according to the privacy terms above.
          </label>
        </div>
      </div>

      <style jsx>{`
        .data-export-tools {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
          background: #f8f9fa;
        }

        .export-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .export-header h2 {
          color: #2d3748;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .export-header p {
          color: #718096;
          font-size: 16px;
          margin: 0;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .export-options {
          display: grid;
          gap: 24px;
          margin-bottom: 40px;
        }

        .export-option {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .export-option:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .export-option.selected {
          border-color: #4299e1;
        }

        .export-option.completed {
          border-color: #48bb78;
          background: #f0fff4;
        }

        .option-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .option-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .option-info h3 {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .option-info p {
          color: #4a5568;
          margin: 0;
          line-height: 1.5;
        }

        .option-details {
          margin-bottom: 20px;
        }

        .includes-section h4 {
          color: #2d3748;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .includes-section ul {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
        }

        .includes-section li {
          color: #4a5568;
          font-size: 14px;
          margin-bottom: 4px;
          padding-left: 16px;
          position: relative;
        }

        .includes-section li::before {
          content: '•';
          color: #4299e1;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .option-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #718096;
          font-size: 14px;
        }

        .research-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #e6fffa;
          border: 1px solid #b2f5ea;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          color: #234e52;
          font-size: 14px;
        }

        .option-actions {
          display: flex;
          justify-content: flex-end;
        }

        .export-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #4299e1;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-button:hover:not(:disabled) {
          background: #3182ce;
        }

        .export-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .completion-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #48bb78;
          font-weight: 500;
        }

        .privacy-section {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .privacy-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .privacy-header h3 {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .privacy-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .privacy-item h4 {
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .privacy-item p {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .consent-section {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }

        .consent-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
        }

        .consent-checkbox input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #cbd5e0;
          border-radius: 4px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .consent-checkbox input[type="checkbox"]:checked + .checkmark {
          background: #4299e1;
          border-color: #4299e1;
        }

        .consent-checkbox input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .data-export-tools {
            padding: 16px;
          }

          .option-header {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .option-meta {
            flex-direction: column;
            gap: 8px;
          }

          .privacy-content {
            grid-template-columns: 1fr;
          }

          .consent-checkbox {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default DataExportTools;