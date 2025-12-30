
import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Stethoscope, UserCog, LayoutDashboard, Contact2, Phone, Building2 } from 'lucide-react';

interface Props {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const SideNav: React.FC<Props> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: ViewMode.PATIENT_TRIAGE, label: 'Patient Triage', icon: Stethoscope },
    { id: ViewMode.DIGITAL_TWIN, label: 'Family Digital Twin', icon: UserCog },
    { id: ViewMode.OUR_FACILITY, label: 'Our Facility', icon: Building2 },
    { id: ViewMode.DOCTOR_PORTAL, label: 'Doctor Portal', icon: LayoutDashboard },
    { id: ViewMode.DOCTORS_DIRECTORY, label: 'Doctors Directory', icon: Contact2 },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex-shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible justify-between h-auto md:h-full">
      <div className="flex flex-row md:flex-col gap-2 w-full">
        <div className="mb-6 px-2 hidden md:block">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Reception Contact Footer (Desktop Only) */}
      <div className="hidden md:block mt-auto pt-4 border-t border-slate-100">
         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Reception / Queries</p>
            <div className="space-y-2">
               <a href="tel:+919805687028" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" /> +91 9805687028
               </a>
               <a href="tel:+919805682028" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" /> +91 9805682028
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SideNav;
