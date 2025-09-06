import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Lightbulb, BookOpen, Target } from 'lucide-react';

const MentalHealthMyths = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);

  const mythsAndFacts = [
    {
      id: 1,
      myth: "Mental health problems are a sign of weakness or personal failure",
      fact: "Mental health conditions are medical conditions, just like diabetes or heart disease",
      explanation: "Mental health conditions are caused by a complex combination of biological, psychological, and environmental factors. They have nothing to do with personal strength, character flaws, or willpower. Just as you wouldn't blame someone for having diabetes, mental health conditions are not a choice or moral failing.",
      category: "Stigma",
      question: "Mental health problems are primarily caused by:",
      options: [
        "Personal weakness and lack of willpower",
        "Complex biological, psychological, and environmental factors",
        "Poor life choices and moral failures",
        "Not trying hard enough to be positive"
      ],
      correctAnswer: 1,
      tips: [
        "Treat mental health with the same respect as physical health",
        "Avoid language that suggests blame or personal responsibility",
        "Remember that seeking help shows strength, not weakness"
      ]
    },
    {
      id: 2,
      myth: "People with mental illness are violent and dangerous",
      fact: "People with mental illness are more likely to be victims of violence than perpetrators",
      explanation: "Media portrayals often perpetuate this harmful stereotype. In reality, only 3-5% of violent acts are committed by people with serious mental illness. People with mental health conditions are actually 10 times more likely to be victims of violent crime than the general population.",
      category: "Stereotypes",
      question: "What is the reality about mental illness and violence?",
      options: [
        "People with mental illness commit most violent crimes",
        "Mental illness makes people inherently dangerous",
        "People with mental illness are more likely to be victims than perpetrators",
        "There's no relationship between mental health and violence"
      ],
      correctAnswer: 2,
      tips: [
        "Challenge stereotypes when you encounter them",
        "Focus on the person, not their diagnosis",
        "Educate others about the real statistics"
      ]
    },
    {
      id: 3,
      myth: "Therapy is only for people with serious mental illness",
      fact: "Therapy can benefit anyone looking to improve their mental health and life skills",
      explanation: "Therapy isn't just for crisis situations. It's a valuable tool for personal growth, learning coping skills, improving relationships, and maintaining good mental health. Many people use therapy for stress management, life transitions, or simply to understand themselves better.",
      category: "Treatment",
      question: "Who can benefit from therapy?",
      options: [
        "Only people with diagnosed mental illness",
        "Anyone looking to improve their mental health and life skills",
        "Only people in crisis situations",
        "People who can't handle problems on their own"
      ],
      correctAnswer: 1,
      tips: [
        "Consider therapy as preventive mental health care",
        "Remember that therapy is a sign of self-care, not weakness",
        "Know that therapy works differently for different people"
      ]
    },
    {
      id: 4,
      myth: "Medication for mental health changes your personality",
      fact: "Properly prescribed medication helps restore your true self by managing symptoms",
      explanation: "When mental health conditions are active, they can mask your true personality. Effective medication helps manage symptoms like severe depression, anxiety, or mood swings, allowing your authentic self to emerge. The goal is to feel like yourself again, not to become someone different.",
      category: "Treatment",
      question: "What is the goal of mental health medication?",
      options: [
        "To change your personality completely",
        "To make you feel emotionally numb",
        "To help manage symptoms so you can feel like yourself",
        "To make all problems disappear instantly"
      ],
      correctAnswer: 2,
      tips: [
        "Work closely with your doctor to find the right medication",
        "Be patient - finding the right medication takes time",
        "Communicate openly about how medication affects you"
      ]
    },
    {
      id: 5,
      myth: "Mental health problems are rare and don't affect many people",
      fact: "1 in 4 people will experience a mental health condition in their lifetime",
      explanation: "Mental health conditions are incredibly common. In fact, they're so common that most people either have personal experience or know someone close to them who has been affected. This includes everything from anxiety and depression to PTSD and bipolar disorder.",
      category: "Prevalence",
      question: "How common are mental health conditions?",
      options: [
        "Very rare, affecting less than 1% of people",
        "Uncommon, affecting about 5% of people",
        "Common, affecting 1 in 4 people in their lifetime",
        "Universal, affecting everyone equally"
      ],
      correctAnswer: 2,
      tips: [
        "Know that you're not alone if you're struggling",
        "Normalize conversations about mental health",
        "Remember that many successful people have mental health conditions"
      ]
    },
    {
      id: 6,
      myth: "Children don't experience real mental health problems",
      fact: "Half of all mental health conditions begin by age 14",
      explanation: "Children and adolescents can and do experience mental health conditions. Early intervention is crucial because it can prevent more serious problems later in life. Many adult mental health conditions have their roots in childhood or adolescence.",
      category: "Development",
      question: "When do most mental health conditions first appear?",
      options: [
        "Only in adulthood after age 25",
        "Primarily in elderly people",
        "Half begin by age 14, most by age 24",
        "Mental health problems can't be diagnosed in children"
      ],
      correctAnswer: 2,
      tips: [
        "Take children's emotional struggles seriously",
        "Look for changes in behavior, mood, or performance",
        "Seek professional help early when concerned"
      ]
    },
    {
      id: 7,
      myth: "People with mental illness can't work or contribute to society",
      fact: "Many people with mental health conditions are highly productive and successful",
      explanation: "With proper treatment and support, people with mental health conditions work in every profession imaginable. Many successful entrepreneurs, artists, scientists, and leaders have openly discussed their mental health journeys. Mental health conditions don't define a person's capabilities or worth.",
      category: "Capability",
      question: "What's true about people with mental health conditions and work?",
      options: [
        "They can't hold down steady jobs",
        "They're less productive than others",
        "Many are highly successful with proper treatment and support",
        "They should only work in certain types of jobs"
      ],
      correctAnswer: 2,
      tips: [
        "Focus on abilities, not limitations",
        "Support workplace mental health initiatives",
        "Remember that diversity includes neurodiversity"
      ]
    },
    {
      id: 8,
      myth: "If you talk about suicide, you'll encourage it",
      fact: "Talking openly about suicide can actually prevent it",
      explanation: "Asking someone directly about suicidal thoughts doesn't plant the idea or make it more likely to happen. In fact, it often provides relief and opens the door to getting help. Many people feel isolated with these thoughts, and knowing someone cares enough to ask can be life-saving.",
      category: "Crisis",
      question: "What should you do if you're worried someone might be suicidal?",
      options: [
        "Avoid the topic so you don't give them ideas",
        "Ask directly and listen without judgment",
        "Wait for them to bring it up first",
        "Only talk to professionals about your concerns"
      ],
      correctAnswer: 1,
      tips: [
        "Ask directly: 'Are you thinking about suicide?'",
        "Listen without trying to fix or minimize",
        "Help connect them with professional resources"
      ]
    },
    {
      id: 9,
      myth: "Mental health problems will go away on their own if you just wait",
      fact: "Mental health conditions typically require active treatment and support",
      explanation: "While some mild symptoms might improve with time, most mental health conditions benefit significantly from treatment. Without intervention, many conditions can worsen or become chronic. Early treatment often leads to better outcomes and prevents complications.",
      category: "Treatment",
      question: "What happens to untreated mental health conditions?",
      options: [
        "They always resolve on their own with time",
        "They typically require active treatment and support",
        "They only get better if you're strong enough",
        "They're not real medical conditions anyway"
      ],
      correctAnswer: 1,
      tips: [
        "Seek help early rather than waiting",
        "Remember that treatment works for most people",
        "Don't suffer in silence hoping things will improve"
      ]
    },
    {
      id: 10,
      myth: "Mental health treatment doesn't really work",
      fact: "Mental health treatments are highly effective for most people",
      explanation: "Research shows that therapy, medication, or a combination of both helps 80-90% of people with mental health conditions. Recovery is not only possible but expected with proper treatment. The key is finding the right approach for each individual.",
      category: "Treatment",
      question: "How effective are mental health treatments?",
      options: [
        "They rarely work and are mostly placebo effects",
        "They help 80-90% of people who receive them",
        "They only work for people with mild problems",
        "Success depends entirely on willpower"
      ],
      correctAnswer: 1,
      tips: [
        "Don't give up if the first treatment doesn't work",
        "Be open to trying different approaches",
        "Recovery is a journey, not a destination"
      ]
    }
  ];

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuiz(0);
    setScore(0);
    setCompletedQuestions([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === mythsAndFacts[currentQuiz].correctAnswer) {
      setScore(score + 1);
    }
    
    setCompletedQuestions([...completedQuestions, {
      id: mythsAndFacts[currentQuiz].id,
      correct: answerIndex === mythsAndFacts[currentQuiz].correctAnswer
    }]);
  };

  const nextQuestion = () => {
    if (currentQuiz < mythsAndFacts.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      setQuizMode(false);
    }
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompletedQuestions([]);
  };

  if (quizMode) {
    const currentItem = mythsAndFacts[currentQuiz];
    
    return (
      <div className="myths-quiz-container">
        <motion.div 
          className="quiz-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="quiz-progress">
            Question {currentQuiz + 1} of {mythsAndFacts.length}
          </div>
          <div className="quiz-score">Score: {score}/{currentQuiz + (showExplanation ? 1 : 0)}</div>
        </motion.div>

        <motion.div 
          className="quiz-question-card"
          key={currentQuiz}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="question-category">
            <span className="category-badge">{currentItem.category}</span>
          </div>

          <h3>{currentItem.question}</h3>

          <div className="quiz-options">
            {currentItem.options.map((option, index) => (
              <motion.button
                key={index}
                className={`quiz-option ${
                  selectedAnswer === index 
                    ? index === currentItem.correctAnswer 
                      ? 'correct' 
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
              >
                {option}
                {selectedAnswer === index && (
                  index === currentItem.correctAnswer 
                    ? <CheckCircle size={20} />
                    : <XCircle size={20} />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                className="quiz-explanation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="myth-fact-reveal">
                  <div className="myth-section">
                    <h4>❌ Myth:</h4>
                    <p>{currentItem.myth}</p>
                  </div>
                  <div className="fact-section">
                    <h4>✅ Fact:</h4>
                    <p>{currentItem.fact}</p>
                  </div>
                </div>

                <div className="detailed-explanation">
                  <h4>Why this matters:</h4>
                  <p>{currentItem.explanation}</p>
                </div>

                <div className="practical-tips">
                  <h4>💡 Practical Tips:</h4>
                  <ul>
                    {currentItem.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  className="next-question-button"
                  onClick={nextQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentQuiz < mythsAndFacts.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Quiz completed or browse mode
  if (completedQuestions.length > 0) {
    return (
      <div className="quiz-results-container">
        <motion.div 
          className="results-header"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Brain size={48} className="results-icon" />
          <h2>Quiz Complete!</h2>
          <div className="final-score">
            You scored {score} out of {mythsAndFacts.length}
          </div>
        </motion.div>

        <div className="performance-analysis">
          {score >= mythsAndFacts.length * 0.8 && (
            <div className="performance-excellent">
              <h3>🎉 Excellent Knowledge!</h3>
              <p>You have a strong understanding of mental health facts. Keep spreading accurate information!</p>
            </div>
          )}
          {score >= mythsAndFacts.length * 0.6 && score < mythsAndFacts.length * 0.8 && (
            <div className="performance-good">
              <h3>👏 Good Work!</h3>
              <p>You're well-informed about mental health. Consider reviewing the areas you missed.</p>
            </div>
          )}
          {score < mythsAndFacts.length * 0.6 && (
            <div className="performance-review">
              <h3>📚 Keep Learning!</h3>
              <p>There's always more to learn about mental health. Review the facts and try again!</p>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          <motion.button
            className="action-button primary"
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Quiz
          </motion.button>
          <motion.button
            className="action-button secondary"
            onClick={resetQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse All Facts
          </motion.button>
        </div>
      </div>
    );
  }

  // Browse mode
  return (
    <div className="mental-health-myths-container">
      <motion.div 
        className="myths-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Brain size={32} className="header-icon" />
        <div>
          <h2>Mental Health: Myths vs Facts</h2>
          <p>Challenge misconceptions and learn the truth about mental health</p>
        </div>
      </motion.div>

      <div className="myths-intro">
        <motion.div 
          className="intro-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Why This Matters</h3>
          <p>Myths and misconceptions about mental health can prevent people from seeking help, increase stigma, and perpetuate harmful stereotypes. Learning the facts helps create a more understanding and supportive world for everyone.</p>
          
          <motion.button
            className="start-quiz-button"
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target size={20} />
            Test Your Knowledge
          </motion.button>
        </motion.div>
      </div>

      <div className="myths-collection">
        <h3>Common Myths & Facts</h3>
        <div className="myths-grid">
          {mythsAndFacts.map((item, index) => (
            <motion.div
              key={item.id}
              className="myth-fact-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-category">
                <span className="category-badge">{item.category}</span>
              </div>

              <div className="myth-section">
                <h4>❌ Myth</h4>
                <p>{item.myth}</p>
              </div>

              <div className="fact-section">
                <h4>✅ Fact</h4>
                <p>{item.fact}</p>
              </div>

              <div className="explanation-section">
                <h4>💡 Why This Matters</h4>
                <p>{item.explanation}</p>
              </div>

              <div className="tips-section">
                <h4>Practical Tips:</h4>
                <ul>
                  {item.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="action-section">
        <h3>How You Can Help</h3>
        <div className="action-grid">
          <div className="action-card">
            <Lightbulb size={24} />
            <h4>Share Knowledge</h4>
            <p>Correct misconceptions when you hear them. Share accurate information with friends and family.</p>
          </div>
          <div className="action-card">
            <BookOpen size={24} />
            <h4>Keep Learning</h4>
            <p>Stay informed about mental health research and best practices. Knowledge is power.</p>
          </div>
          <div className="action-card">
            <Brain size={24} />
            <h4>Practice Empathy</h4>
            <p>Listen without judgment. Understand that everyone's mental health journey is unique.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthMyths;