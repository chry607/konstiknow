import { useState } from 'react';
import { Question, Lesson } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { X, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizScreenProps {
  lesson: Lesson;
  onComplete: (score: number, answers: boolean[]) => void;
  onExit: () => void;
}

export function QuizScreen({ lesson, onComplete, onExit }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [hearts, setHearts] = useState(5);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index);
    }
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers([...answers, correct]);
    
    if (!correct && hearts > 0) {
      setHearts(hearts - 1);
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const score = answers.filter(a => a).length + (isCorrect ? 1 : 0);
      onComplete(score, [...answers, isCorrect]);
    }
  };

  const getOptionClass = (index: number) => {
    if (!showFeedback) {
      return selectedAnswer === index 
        ? 'border-blue-500 bg-blue-50 border-2' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50';
    }
    
    if (index === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-50 border-2';
    }
    
    if (index === selectedAnswer && !isCorrect) {
      return 'border-red-500 bg-red-50 border-2';
    }
    
    return 'border-gray-300 opacity-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onExit}
              className="flex-shrink-0 dark:text-gray-300"
            >
              <X className="size-5" />
            </Button>
            
            <div className="flex-1">
              <Progress value={progress} className="h-3" />
            </div>
            
            {/* Hearts */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i}
                  className={`text-xl ${i < hearts ? '' : 'opacity-20'}`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {currentQuestion.question}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {lesson.questions.length}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all dark:bg-gray-800 dark:border-gray-700 ${getOptionClass(index)}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 size-8 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-400 dark:border-gray-500'
                    }`}>
                      {selectedAnswer === index && !showFeedback && (
                        <div className="size-3 rounded-full bg-white" />
                      )}
                      {showFeedback && index === currentQuestion.correctAnswer && (
                        <Check className="size-5 text-white" />
                      )}
                      {showFeedback && index === selectedAnswer && !isCorrect && (
                        <X className="size-5 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{option}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-6 mb-6 ${
                isCorrect 
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
                  : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <div className="flex-shrink-0 size-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="size-6 text-white" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 size-10 rounded-full bg-red-500 flex items-center justify-center">
                      <AlertCircle className="size-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className={`font-bold mb-2 ${
                      isCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                    }`}>
                      {isCorrect ? 'Excellent!' : 'Not quite right'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {!showFeedback ? (
              <Button 
                onClick={handleCheck}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white font-bold"
              >
                Check Answer
              </Button>
            ) : (
              <Button 
                onClick={handleContinue}
                size="lg"
                className={`w-full max-w-xs font-bold ${
                  isCorrect 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                Continue
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}