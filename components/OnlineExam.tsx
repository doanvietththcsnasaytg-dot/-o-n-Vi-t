import React, { useState, useEffect } from 'react';
import { ExamData, QuestionType, MultipleChoiceQuestion, MatchingQuestion, FillInBlankQuestion } from '../types';
import { Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

interface OnlineExamProps {
  examData: ExamData;
  onExit: () => void;
}

const OnlineExam: React.FC<OnlineExamProps> = ({ examData, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(examData.durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMCQSelect = (qId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleMatching = (qId: number, aIndex: number, bIndex: number) => {
     if (isSubmitted) return;
     // Simple pairing logic: Store array of pairs
     const currentPairs = answers[qId] || [];
     // Remove existing pair if aIndex is already paired
     const filtered = currentPairs.filter((p: any) => p.aIndex !== aIndex);
     setAnswers(prev => ({ ...prev, [qId]: [...filtered, { aIndex, bIndex }] }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    
    // Simple scoring logic demonstration
    examData.questions.forEach(q => {
      if (q.type === QuestionType.MULTIPLE_CHOICE) {
        if (answers[q.id] === (q as MultipleChoiceQuestion).correctAnswerIndex) {
          newScore += 0.5; // Assume 0.5 points per question for 16 Qs = 8 points
        }
      }
      // Add logic for other types...
    });
    
    // Normalize to score/10 roughly
    setScore(Math.min(10, newScore)); 
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      {/* Header Sticky */}
      <div className="sticky top-4 z-10 bg-white rounded-xl shadow-lg border border-slate-200 p-4 mb-8 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-800 text-lg line-clamp-1">{examData.title || 'Bài Kiểm Tra'}</h2>
          <p className="text-sm text-slate-500">Môn: Tin học | Khối: 3</p>
        </div>
        <div className={clsx("flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg", 
          timeLeft < 300 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
        )}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-8">
        {/* Render Questions */}
        {examData.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full font-bold text-slate-600 text-sm">
                {idx + 1}
              </span>
              <div className="flex-grow">
                <p className="font-medium text-slate-800 text-lg">{q.text}</p>
              </div>
            </div>

            {/* MCQ Render */}
            {q.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                {(q as MultipleChoiceQuestion).options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  const isCorrect = (q as MultipleChoiceQuestion).correctAnswerIndex === optIdx;
                  
                  let itemClass = "border border-slate-200 hover:bg-slate-50";
                  if (isSubmitted) {
                    if (isCorrect) itemClass = "bg-green-50 border-green-500 text-green-700";
                    else if (isSelected && !isCorrect) itemClass = "bg-red-50 border-red-500 text-red-700";
                  } else if (isSelected) {
                    itemClass = "bg-blue-50 border-blue-500 text-blue-700";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleMCQSelect(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`p-4 rounded-xl text-left transition-all ${itemClass} flex items-center justify-between`}
                    >
                      <span><span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Matching Render (Simplified) */}
            {q.type === QuestionType.MATCHING && (
              <div className="ml-11 bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 border border-yellow-200">
                (Dạng câu hỏi nối - Đang được hiển thị ở chế độ xem trước đơn giản)
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <strong>Cột A</strong>
                    <ul className="list-disc ml-5">
                      {(q as MatchingQuestion).columnA.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Cột B</strong>
                    <ul className="list-disc ml-5">
                      {(q as MatchingQuestion).columnB.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Fill Blank Render (Simplified) */}
            {q.type === QuestionType.FILL_IN_BLANK && (
               <div className="ml-11 bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 border border-indigo-200">
                 (Câu hỏi điền từ)
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Results */}
      {isSubmitted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Kết quả bài thi</p>
              <h3 className="text-3xl font-bold text-slate-900">{score.toFixed(1)} <span className="text-lg text-slate-400 font-normal">/ 10.0</span></h3>
            </div>
            <button 
              onClick={onExit}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại trang chủ
            </button>
          </div>
        </div>
      )}

      {!isSubmitted && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={handleSubmit}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-xl hover:bg-blue-700 transition-transform hover:scale-105"
          >
            Nộp Bài
          </button>
        </div>
      )}
    </div>
  );
};

export default OnlineExam;
