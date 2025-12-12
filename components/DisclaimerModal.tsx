import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<Props> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
        <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-full shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-900">Important Medical Disclaimer</h2>
            <p className="text-sm text-amber-800 mt-1">Please read carefully before proceeding.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>Aarogya AI is a Clinical Triage Assistant, not a doctor.</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>This tool provides information based on medical guidelines but <strong>does not provide a definitive diagnosis</strong>.</li>
            <li>In case of a medical emergency (chest pain, difficulty breathing, severe bleeding), call your local emergency number immediately.</li>
            <li>Do not ignore professional medical advice or delay seeking treatment because of something you have read on this app.</li>
            <li>Your data is processed anonymously for triage purposes only.</li>
          </ul>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onAccept}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-teal-600/20"
          >
            <CheckCircle className="w-4 h-4" />
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
