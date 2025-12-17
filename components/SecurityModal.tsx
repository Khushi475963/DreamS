
import React from 'react';
import { ShieldCheck, Lock, Database, Server, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SecurityModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
        
        <div className="bg-emerald-600 p-6 flex justify-between items-start">
           <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-8 h-8" />
              <div>
                 <h2 className="text-xl font-bold">Data Privacy & HIPAA</h2>
                 <p className="text-emerald-100 text-xs">Compliance Information</p>
              </div>
           </div>
           <button onClick={onClose} className="text-emerald-100 hover:text-white transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-6 space-y-6">
           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="bg-emerald-50 p-3 rounded-xl h-fit">
                    <Database className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">Current Data Storage</h3>
                    <p className="text-sm text-slate-600 mt-1">
                       For this demonstration, all patient data is stored <strong>locally in your browser's Local Storage</strong>.
                    </p>
                    <div className="mt-2 bg-slate-100 px-3 py-1.5 rounded text-xs text-slate-500 font-mono inline-block">
                       localStorage: 'jc_juneja_hospital_records'
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="bg-indigo-50 p-3 rounded-xl h-fit">
                    <Server className="w-6 h-6 text-indigo-600" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">Production Requirement</h3>
                    <p className="text-sm text-slate-600 mt-1">
                       A fully HIPAA-compliant deployment would require:
                    </p>
                    <ul className="text-xs text-slate-500 mt-2 space-y-1 list-disc pl-4">
                       <li>End-to-end encryption (At rest & in transit).</li>
                       <li>BAA (Business Associate Agreement) with Cloud Provider.</li>
                       <li>Strict Access Control (IAM) & Audit Logs.</li>
                       <li>Data never stored permanently on client devices.</li>
                    </ul>
                 </div>
              </div>
           </div>
           
           <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                 <strong>Privacy Note:</strong> As this is a demo environment running in your browser, your data is isolated to this specific device and browser. Clearing your browser cache will remove all records.
              </p>
           </div>
        </div>

        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
           <button 
             onClick={onClose}
             className="text-slate-600 hover:text-slate-900 font-medium text-sm"
           >
             Close Information
           </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
