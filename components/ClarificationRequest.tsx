import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

interface Props {
  questions: string[];
}

const ClarificationRequest: React.FC<Props> = ({ questions }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-fade-in mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <MessageCircleQuestion className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Additional Information Needed</h3>
          <p className="text-xs text-slate-500">To provide an accurate assessment, please answer the following:</p>
        </div>
      </div>
      
      <div className="space-y-3 pl-2">
        {questions.map((q, idx) => (
          <div key={idx} className="flex gap-3 text-slate-700 text-sm">
            <span className="font-bold text-indigo-500 select-none">{idx + 1}.</span>
            <span>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClarificationRequest;
