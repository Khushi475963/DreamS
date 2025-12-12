import React from 'react';
import { ShieldCheck, PlusSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
            <PlusSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Juneja Hospital</h1>
            <p className="text-xs text-slate-500 font-medium">AI Integrated Care System</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold">HIPAA Compliant • Secure Connection</span>
        </div>
      </div>
    </header>
  );
};

export default Header;