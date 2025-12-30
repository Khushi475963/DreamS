
import React, { useState, useRef } from 'react';
import { PatientRecord } from '../types';
import TriageReport from './TriageReport';
import { LayoutDashboard, Search, Clock, Eye, X, DownloadCloud, Loader2, FileText, ChevronRight, User } from 'lucide-react';

interface Props {
  records: PatientRecord[];
}

// Extend window interface to include html2pdf
declare global {
  interface Window {
    html2pdf: any;
  }
}

const DoctorPortal: React.FC<Props> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const filteredRecords = records.filter(r => 
    r.intake.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.intake.phoneNumber.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Urgent': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const handleExportData = async () => {
    if (!window.html2pdf) {
        alert("PDF export module not loaded. Please refresh the page.");
        return;
    }
    
    setIsExporting(true);
    
    // Create a clone of the table for PDF generation to avoid scroll/overflow clipping issues
    const originalTable = document.getElementById('patient-records-table');
    if (!originalTable) {
        setIsExporting(false);
        return;
    }

    const clone = originalTable.cloneNode(true) as HTMLElement;
    
    // Style the clone for PDF output
    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.background = 'white';
    clone.classList.remove('hidden', 'print:block'); // Ensure headers are visible
    
    // Add title to the clone
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `
      <div style="padding: 20px; text-align: center; border-bottom: 2px solid #eee; margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #1e293b;">J.C. Juneja Hospital</h1>
        <p style="color: #64748b;">Comprehensive Patient Records Report</p>
        <p style="font-size: 12px; color: #94a3b8;">Generated: ${new Date().toLocaleString()}</p>
      </div>
    `;
    clone.insertBefore(titleDiv, clone.firstChild);

    document.body.appendChild(clone);
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `jc_juneja_patient_records_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 1400 }, // Force wider window for canvas
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    try {
        await window.html2pdf().set(opt).from(clone).save();
    } catch (e) {
        console.error("Export failed", e);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        document.body.removeChild(clone);
        setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            Doctor Portal
          </h2>
          <p className="text-slate-500">J.C. Juneja Hospital - Patient Records Summary</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by Name, ID, or Phone..." 
               className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={handleExportData}
            disabled={isExporting || records.length === 0}
            title="Export Data as PDF"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-wait"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
            <span className="hidden md:inline">{isExporting ? 'Generating PDF...' : 'Export Data'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Table View */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col relative">
        <div className="overflow-x-auto flex-1" ref={tableContainerRef}>
          <div id="patient-records-table" className="min-w-full">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-bold text-slate-700">ID</th>
                    <th className="p-4 font-bold text-slate-700">Patient Name</th>
                    <th className="p-4 font-bold text-slate-700">Age / Sex</th>
                    <th className="p-4 font-bold text-slate-700">Triage Status</th>
                    <th className="p-4 font-bold text-slate-700 max-w-xs">Symptoms</th>
                    <th className="p-4 font-bold text-slate-700">Department</th>
                    <th className="p-4 font-bold text-slate-700">Date</th>
                    <th className="p-4 font-bold text-slate-700 text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 opacity-20" />
                          <p>No patient records found.</p>
                          {searchTerm && <p className="text-xs">Try adjusting your search terms.</p>}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-xs text-slate-500">{record.id}</td>
                        <td className="p-4">
                           <div className="font-bold text-slate-800">{record.intake.fullName}</div>
                           <div className="text-[10px] text-slate-400">{record.intake.phoneNumber}</div>
                        </td>
                        <td className="p-4 text-slate-600">{record.intake.age} / {record.intake.sex}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border tracking-wider ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 truncate max-w-xs" title={record.intake.currentSymptoms}>
                          {record.intake.currentSymptoms.length > 35
                            ? record.intake.currentSymptoms.slice(0, 35) + '...' 
                            : record.intake.currentSymptoms || 'N/A'}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">
                            {record.triage.recommended_department}
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                            {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-right print:hidden">
                          <button 
                            onClick={() => setSelectedRecord(record)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
          </div>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
           <span>Total Records: {records.length}</span>
           <span>Filtered: {filteredRecords.length}</span>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
             
             {/* Modal Header */}
             <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {selectedRecord.intake.fullName.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg">{selectedRecord.intake.fullName}</h3>
                      <p className="text-xs text-slate-500">
                        {selectedRecord.intake.age} Y / {selectedRecord.intake.sex} • ID: {selectedRecord.id}
                      </p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="bg-white hover:bg-slate-100 text-slate-500 p-2 rounded-full border border-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             {/* Modal Content */}
             <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Intake</h4>
                       <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-slate-500">Contact</span>
                             <span className="font-medium text-slate-800">{selectedRecord.intake.phoneNumber || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-slate-500">Relationship</span>
                             <span className="font-medium text-slate-800">{selectedRecord.intake.relationship || 'Self'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-slate-500">History</span>
                             <span className="font-medium text-slate-800">{selectedRecord.intake.conditions || 'None'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-slate-500">Allergies</span>
                             <span className="font-medium text-slate-800">{selectedRecord.intake.allergies || 'None'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-2">
                             <span className="text-slate-500">Vitals</span>
                             <span className="font-medium text-slate-800">{selectedRecord.intake.vitals || 'Not Recorded'}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Visit Info</h4>
                        <div className="space-y-2">
                            <span className="text-xs text-slate-500 block">Primary Complaint</span>
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {selectedRecord.intake.currentSymptoms}
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                               <Clock className="w-4 h-4 text-indigo-500" />
                               <span className="text-sm text-slate-600">
                                   Recorded: {new Date(selectedRecord.timestamp).toLocaleString()}
                               </span>
                            </div>
                        </div>
                    </div>
                 </div>

                 <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    Detailed Triage Assessment
                 </h4>
                 <TriageReport data={selectedRecord.triage} intakeData={selectedRecord.intake} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;
