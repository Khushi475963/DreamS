
import React, { useState } from 'react';
import { PatientRecord } from '../types';
import TriageReport from './TriageReport';
import { LayoutDashboard, AlertCircle, Search, User, Clock, ChevronRight, X, DownloadCloud } from 'lucide-react';

interface Props {
  records: PatientRecord[];
}

const DoctorPortal: React.FC<Props> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.intake.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Urgent': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `juneja_patient_records_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    alert("File ready to download! \n\nPlease save this file to: \nC:\\Users\\Khushi\\OneDrive\\Desktop\\DreamS\\Juneja Website");
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            Doctor Portal
          </h2>
          <p className="text-slate-500">Live Triage Dashboard & Patient Queue</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search Patient Name or ID..." 
               className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={handleExportData}
            title="Export Database to File"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <DownloadCloud className="w-4 h-4" />
            <span className="hidden md:inline">Export Data</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 overflow-hidden h-[calc(100vh-200px)]">
        
        {/* Left List Panel */}
        <div className="w-full md:w-1/3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Patient Queue ({filteredRecords.length})</span>
           </div>
           <div className="overflow-y-auto flex-1 p-2 space-y-2">
             {filteredRecords.length === 0 ? (
               <div className="text-center py-10 text-slate-400">
                 <p>No records found.</p>
               </div>
             ) : (
               filteredRecords.map(record => (
                 <div 
                   key={record.id}
                   onClick={() => setSelectedRecord(record)}
                   className={`
                     p-4 rounded-xl cursor-pointer border transition-all hover:shadow-md
                     ${selectedRecord?.id === record.id 
                       ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-300' 
                       : 'bg-white border-slate-100 hover:border-indigo-100'
                     }
                   `}
                 >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                           {record.intake.fullName.charAt(0)}
                         </div>
                         <div>
                           <p className="font-semibold text-slate-800 text-sm">{record.intake.fullName}</p>
                           <p className="text-xs text-slate-400">ID: {record.id.slice(0,6)}</p>
                         </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mb-2">{record.intake.currentSymptoms}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      {record.triage.recommended_department}
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Right Detail Panel */}
        <div className="hidden md:flex flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-col">
          {selectedRecord ? (
            <div className="flex flex-col h-full">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                     <h3 className="font-bold text-slate-800">{selectedRecord.intake.fullName}</h3>
                     <span className="text-xs text-slate-500">| {selectedRecord.intake.age} / {selectedRecord.intake.sex}</span>
                  </div>
                  <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6">
                 {/* Reusing the Triage Report Component for Consistency */}
                 <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Intake Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div><span className="text-slate-500">History:</span> {selectedRecord.intake.conditions || 'None'}</div>
                       <div><span className="text-slate-500">Meds:</span> {selectedRecord.intake.medications || 'None'}</div>
                       <div><span className="text-slate-500">Allergies:</span> {selectedRecord.intake.allergies || 'None'}</div>
                       <div><span className="text-slate-500">Vitals:</span> {selectedRecord.intake.vitals || 'Not Recorded'}</div>
                    </div>
                 </div>
                 <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">AI Triage Analysis</h4>
                 <TriageReport data={selectedRecord.triage} intakeData={selectedRecord.intake} />
               </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <User className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a patient from the queue to view details</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorPortal;
