
import React from 'react';
import { PatientRecord } from '../types';
import { Dna, Activity, CalendarClock, FileText, ArrowUpRight, User, RefreshCw } from 'lucide-react';

interface Props {
  records: PatientRecord[];
  currentEmail?: string;
}

const DigitalTwin: React.FC<Props> = ({ records, currentEmail }) => {
  // Robust case-insensitive email matching
  const normalize = (str?: string) => str?.trim().toLowerCase() || '';
  
  const userRecords = currentEmail 
    ? records.filter(r => normalize(r.intake.email) === normalize(currentEmail))
    : [];

  // Sort records by latest first
  const sortedRecords = [...userRecords].sort((a, b) => b.timestamp - a.timestamp);
  const latestRecord = sortedRecords[0];

  if (!currentEmail) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 animate-fade-in">
            <User className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium text-slate-600">Identification Required</p>
            <p className="text-sm mt-1">Please enter your email in the Triage section to view your Digital Twin.</p>
        </div>
      );
  }

  if (!latestRecord) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 animate-fade-in">
        <Dna className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-lg font-bold text-slate-600">No Records Found</h3>
        <p className="text-sm mt-2 max-w-xs text-center">
            We couldn't find any medical history for <span className="text-indigo-600 font-medium">{currentEmail}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2">
            <p className="text-xs text-slate-400">If you just completed a triage, ensure it was saved correctly.</p>
        </div>
      </div>
    );
  }

  const { intake } = latestRecord;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Digital Twin</h2>
          <p className="text-slate-500">Longitudinal Health Record & Identity</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
          <Dna className="w-4 h-4" />
          ID: {latestRecord.id.slice(0, 8).toUpperCase()}
        </div>
      </div>

      {/* Top Card: Profile Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 border-r border-white/10 pr-6">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-lg shadow-indigo-500/30">
              {intake.fullName.charAt(0)}
            </div>
            <h3 className="text-xl font-bold">{intake.fullName}</h3>
            <p className="text-slate-400 text-sm">{intake.age} Y / {intake.sex}</p>
            <p className="text-indigo-300 text-xs mt-1">{intake.email}</p>
          </div>
          <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
             <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Blood Type</p>
                <p className="font-semibold text-lg">{intake.bloodGroup || "Unknown"}</p>
             </div>
             <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Height</p>
                <p className="font-semibold text-lg">{intake.height} cm</p>
             </div>
             <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Weight</p>
                <p className="font-semibold text-lg">{intake.weight} kg</p>
             </div>
             <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">BMI</p>
                <p className="font-semibold text-lg">
                  {((parseFloat(intake.weight) / ((parseFloat(intake.height)/100) ** 2))).toFixed(1)}
                </p>
             </div>
             <div className="col-span-2">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Chronic Conditions</p>
                <p className="font-medium">{intake.conditions || "None reported"}</p>
             </div>
             <div className="col-span-2">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Allergies</p>
                <p className="font-medium text-rose-300">{intake.allergies || "None reported"}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Vitals & Recent History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Latest Vitals Snapshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            <Activity className="w-5 h-5 text-teal-600" />
            Latest Vitals Snapshot
          </h3>
          <div className="space-y-4">
             <div className="p-3 bg-slate-50 rounded-lg">
               <p className="text-xs text-slate-500 mb-1">Reported Vitals</p>
               <p className="font-mono text-slate-800 font-medium">{intake.vitals || "Not recorded"}</p>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-slate-50 rounded-lg">
                 <p className="text-xs text-slate-500 mb-1">Smoking</p>
                 <p className="font-medium text-slate-800">{intake.smoking}</p>
               </div>
               <div className="p-3 bg-slate-50 rounded-lg">
                 <p className="text-xs text-slate-500 mb-1">Alcohol</p>
                 <p className="font-medium text-slate-800">{intake.alcohol}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Timeline of Visits */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
            Assessment History
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {sortedRecords.map((rec) => (
              <div key={rec.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                 <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                    <span className="text-xs font-bold">{new Date(rec.timestamp).getDate()}</span>
                    <span className="text-xs uppercase">{new Date(rec.timestamp).toLocaleString('default', { month: 'short' })}</span>
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-800">{rec.intake.currentSymptoms.slice(0, 40)}...</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        rec.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                        rec.status === 'Urgent' ? 'bg-amber-100 text-amber-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Dep: {rec.triage.recommended_department} • {rec.triage.probable_conditions[0]?.name}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {rec.triage.red_flags.length > 0 && (
                        <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          {rec.triage.red_flags.length} Red Flags
                        </span>
                      )}
                    </div>
                 </div>
                 <button className="self-center text-slate-300 hover:text-indigo-600">
                    <ArrowUpRight className="w-5 h-5" />
                 </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalTwin;
