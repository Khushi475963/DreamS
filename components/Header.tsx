
import React, { useState } from 'react';
import { ShieldCheck, PlusSquare } from 'lucide-react';
import SecurityModal from './SecurityModal';

const Header: React.FC = () => {
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
              <PlusSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">J.C. Juneja Hospital</h1>
              <p className="text-xs text-slate-500 font-medium">Charitable Hospital of Mankind • AI Care System</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSecurityModal(true)}
            className="hidden md:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Click for Data Privacy Info"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">HIPAA Compliant • Secure Connection</span>
          </button>
        </div>
      </header>

      {showSecurityModal && (
        <SecurityModal onClose={() => setShowSecurityModal(false)} />
      )}
    </>
  );
};

export default Header;
