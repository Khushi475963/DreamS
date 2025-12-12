import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  isFollowUp?: boolean;
}

const SymptomInput: React.FC<Props> = ({ onSubmit, isLoading, isFollowUp }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className={`transition-all duration-500 ${isFollowUp ? 'mt-4' : 'mt-8'}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={isFollowUp ? "Please answer the questions above..." : "Describe your symptoms in detail (e.g., 'I have fever and stomach pain for 2 days')..."}
          className={`w-full bg-white border-2 rounded-xl p-4 pr-14 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-colors resize-none shadow-sm ${
            isLoading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 focus:border-teal-500'
          } ${isFollowUp ? 'min-h-[80px]' : 'min-h-[120px]'}`}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-3 bottom-3 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-all shadow-md"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      {!isFollowUp && (
        <div className="mt-3 flex items-start gap-2 text-xs text-slate-400 px-1">
          <Sparkles className="w-3.5 h-3.5 mt-0.5" />
          <p>AI analyzes severity, duration, and associated risk factors to provide accurate triage.</p>
        </div>
      )}
    </div>
  );
};

export default SymptomInput;
