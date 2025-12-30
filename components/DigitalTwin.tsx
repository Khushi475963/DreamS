
import React, { useState } from 'react';
import { PatientRecord } from '../types';
import { Dna, Activity, CalendarClock, FileText, ArrowUpRight, User, RefreshCw, Users, Filter, ChevronDown } from 'lucide-react';

interface Props {
  records: PatientRecord[];
  currentPhone?: string;
}

const DigitalTwin: React.FC<Props> = ({ records, currentPhone }) => {
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>('All');

  const normalize = (str?: string) => str?.trim() || '';
  
  const userRecords = currentPhone 
    ? records.filter(r => normalize(r.intake.phoneNumber) === normalize(currentPhone))
    : [];
  
  // Extract unique family members from records with their relationships
  const uniqueMembersMap = new Map<string, string>();
  userRecords.forEach(r => {
      // Use the name as key. If multiple relationships exist for same name (unlikely), keep first found.
      if (!uniqueMembersMap.has(r.intake.fullName)) {
          uniqueMembersMap.set(r.intake.fullName, r.intake.relationship || '');
      }
  });

  const memberOptions = Array.from(uniqueMembersMap.entries()).map(([name, relation]) => ({
      name,
      relation
  }));

  // Filter based on selection
  const filteredRecords = selectedFamilyMember === 'All'
    ? userRecords
    : userRecords.filter(r => r.intake.fullName === selectedFamilyMember);

  // Sort records by latest first
  const sortedRecords = [...filteredRecords].sort((a, b) => b.timestamp - a.timestamp);
  const latestRecord = sortedRecords[0];

  if (!currentPhone) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 animate-fade-in">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium text-slate-600">Identification Required</p>
            <p className="text-sm mt-1">Please enter your phone number in the Triage section to view your Family Digital Twin.</p>
        </div>
      );
  }

  if (userRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 animate-fade-in">
        <Dna className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-lg font-bold text-slate-600">No Records Found</h3>
        <p className="text-sm mt-2 max-w-xs text-center">
            We couldn't find any medical history for <span className="text-indigo-600 font-medium">{currentPhone}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2">
            <p className="text-xs text-slate-400">If you just completed a triage, ensure it was saved correctly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Family Digital Twin</h2>
          <p className="text-slate-500">Longitudinal Health Record & Family Identity</p>
        </div>
        
        {/* Family Member Filter */}
        {memberOptions.length > 0 && (
            <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Viewing Profile:
                </span>
                <div className="relative">
                    <select 
                        value={selectedFamilyMember}
                        onChange={(e) => setSelectedFamilyMember(e.target.value)}
                        className="appearance-none bg-indigo-50 border border-indigo-100 hover:border-indigo-300 text-indigo-700 text-sm font-bold py-2 pl-3 pr-10 rounded-lg cursor-pointer focus:outline-none transition-colors min-w-[200px]"
                    >
                        <option value="All">All Family Members</option>
                        {memberOptions.map((member, idx) => (
                            <option key={idx} value={member.name}>
                                {member.name} {member.relation ? `• ${member.relation}` : ''}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>
        )}
      </div>

      {!latestRecord ? (
         <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
            <p>No records found for selected family member.</p>
         </div>
      ) : (
        <>
        {/* Top Card: Profile Summary - ONLY SHOW IF SPECIFIC MEMBER SELECTED */}
        {selectedFamilyMember !== 'All' && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 border-r border-white/10 pr-6">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-lg shadow-indigo-500/30">
                    {latestRecord.intake.fullName.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold">{latestRecord.intake.fullName}</h3>
                    <p className="text-slate-400 text-sm">
                    {latestRecord.intake.relationship && <span className="font-semibold text-indigo-300">({latestRecord.intake.relationship}) </span>}
                    {latestRecord.intake.age} Y / {latestRecord.intake.sex}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-indigo-500/30 px-2 py-0.5 rounded text-indigo-200 border border-indigo-500/30">
                        Selected Profile
                    </span>
                    </div>
                </div>
                <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Blood Type</p>
                        <p className="font-semibold text-lg">{latestRecord.intake.bloodGroup || "Unknown"}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Height</p>
                        <p className="font-semibold text-lg">{latestRecord.intake.height ? `${latestRecord.intake.height} cm` : 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Weight</p>
                        <p className="font-semibold text-lg">{latestRecord.intake.weight ? `${latestRecord.intake.weight} kg` : 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">BMI</p>
                        <p className="font-semibold text-lg">
                        {latestRecord.intake.weight && latestRecord.intake.height ? 
                            ((parseFloat(latestRecord.intake.weight) / ((parseFloat(latestRecord.intake.height)/100) ** 2))).toFixed(1)
                            : 'N/A'}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Chronic Conditions</p>
                        <p className="font-medium">{latestRecord.intake.conditions || "None reported"}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Allergies</p>
                        <p className="font-medium text-rose-300">{latestRecord.intake.allergies || "None reported"}</p>
                    </div>
                </div>
                </div>
            </div>
        )}

        {/* Vitals & Recent History */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Latest Vitals Snapshot - ONLY SHOW IF SPECIFIC MEMBER SELECTED */}
            {selectedFamilyMember !== 'All' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                    <Activity className="w-5 h-5 text-teal-600" />
                    Latest Vitals Snapshot
                </h3>
                <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Reported Vitals</p>
                    <p className="font-mono text-slate-800 font-medium">{latestRecord.intake.vitals || "Not recorded"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Smoking</p>
                        <p className="font-medium text-slate-800">{latestRecord.intake.smoking}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Alcohol</p>
                        <p className="font-medium text-slate-800">{latestRecord.intake.alcohol}</p>
                    </div>
                    </div>
                </div>
                </div>
            )}

            {/* Timeline of Visits - Full width if All, 2/3 width if specific */}
            <div className={`${selectedFamilyMember === 'All' ? 'md:col-span-3' : 'md:col-span-2'} bg-white p-6 rounded-2xl border border-slate-200 shadow-sm`}>
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <CalendarClock className="w-5 h-5 text-indigo-600" />
                Assessment History
            </h3>
            <div className={`space-y-4 overflow-y-auto pr-2 ${selectedFamilyMember === 'All' ? '' : 'max-h-[300px]'}`}>
                {sortedRecords.map((rec) => (
                <div key={rec.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                        <span className="text-xs font-bold">{new Date(rec.timestamp).getDate()}</span>
                        <span className="text-xs uppercase">{new Date(rec.timestamp).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-slate-800">{rec.intake.currentSymptoms.slice(0, 40)}...</h4>
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                <User className="w-3 h-3" /> {rec.intake.fullName}
                            </p>
                        </div>
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
        </>
      )}
    </div>
  );
};

export default DigitalTwin;
