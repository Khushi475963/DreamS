import React, { useState } from 'react';
import { MCQQuestion } from '../types';
import { HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
  questions: MCQQuestion[];
  onSubmit: (answers: Record<string, string[]>) => void;
  isLoading: boolean;
}

const MCQQuestionnaire: React.FC<Props> = ({ questions, onSubmit, isLoading }) => {
  // State to store answers: QuestionID -> Array of selected Option IDs
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const handleOptionToggle = (questionId: string, optionId: string, allowMultiple: boolean) => {
    setAnswers(prev => {
      const currentSelections = prev[questionId] || [];
      
      if (allowMultiple) {
        // Toggle selection
        if (currentSelections.includes(optionId)) {
          return { ...prev, [questionId]: currentSelections.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...currentSelections, optionId] };
        }
      } else {
        // Single selection
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const isFormComplete = questions.every(q => (answers[q.id] && answers[q.id].length > 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormComplete && !isLoading) {
      onSubmit(answers);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Symptom Assessment</h2>
        <p className="text-slate-500 mt-2">Please answer the following questions to help us understand your condition.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">Q{idx + 1}</span>
              {q.question}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
              {Object.entries(q.options).map(([optId, optText]) => {
                const isSelected = answers[q.id]?.includes(optId);
                return (
                  <label 
                    key={optId}
                    className={`
                      relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                        : 'border-slate-100 hover:border-indigo-200 bg-slate-50'
                      }
                    `}
                  >
                    <input 
                      type={q.allow_multiple ? "checkbox" : "radio"}
                      name={q.id}
                      className="sr-only"
                      onChange={() => handleOptionToggle(q.id, optId, q.allow_multiple)}
                      checked={isSelected}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="font-medium">{optText}</span>
                  </label>
                );
              })}
            </div>
            <div className="pl-11 mt-3">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {q.allow_multiple ? 'Select all that apply' : 'Select one option'}
              </span>
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={!isFormComplete || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'Submit Assessment'}
            {!isLoading && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MCQQuestionnaire;
