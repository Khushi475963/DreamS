
import React from 'react';
import { Languages, Check } from 'lucide-react';

interface Props {
  onSelect: (language: string) => void;
}

const LanguageSelection: React.FC<Props> = ({ onSelect }) => {
  const languages = [
    { 
      id: 'English', 
      label: 'English', 
      subLabel: 'Standard English', 
      example: 'Hello, how can I help you?',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
    },
    { 
      id: 'Hindi', 
      label: 'हिंदी (Hindi)', 
      subLabel: 'Devanagari Script', 
      example: 'नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?',
      color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
    },
    { 
      id: 'Hinglish', 
      label: 'Hinglish', 
      subLabel: 'Hindi + English Mix', 
      example: 'Namaste, main aapki kaise help kar sakta hoon?',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-fade-in-up">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-teal-50 rounded-full mb-4">
            <Languages className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Select Language</h2>
          <p className="text-slate-500 text-sm mt-2">
            Choose your preferred language for the consultation.
          </p>
        </div>

        <div className="space-y-4">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative ${lang.color}`}
            >
              <div className="flex justify-between items-center">
                <div>
                   <h3 className="font-bold text-lg">{lang.label}</h3>
                   <p className="text-xs opacity-80 font-medium uppercase tracking-wider mb-1">{lang.subLabel}</p>
                   <p className="text-sm italic opacity-90">"{lang.example}"</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 p-2 rounded-full">
                   <Check className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
