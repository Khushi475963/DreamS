
import React, { useRef, useState } from 'react';
import { TriageResponse, IntakeData } from '../types';
import { 
  AlertOctagon, 
  Hospital, 
  Activity, 
  FlaskConical, 
  HeartHandshake, 
  ClipboardList,
  Leaf,
  Download,
  Loader2,
  User,
  Droplet,
  Hourglass
} from 'lucide-react';

interface Props {
  data: TriageResponse;
  intakeData?: IntakeData;
}

// Extend window interface to include html2pdf
declare global {
  interface Window {
    html2pdf: any;
  }
}

const ProbabilityBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    High: 'bg-rose-100 text-rose-700 border-rose-200',
    Moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };
  
  const colorClass = colors[level as keyof typeof colors] || colors.Low;

  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colorClass} uppercase tracking-wide`}>
      {level}
    </span>
  );
};

const TriageReport: React.FC<Props> = ({ data, intakeData }) => {
  const hasRedFlags = data.red_flags && data.red_flags.length > 0;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !window.html2pdf) return;
    
    setIsDownloading(true);
    const element = reportRef.current;
    
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `Eli_Report_${intakeData?.fullName || 'Patient'}_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Action Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Triage Assessment Results</h2>
        <button 
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md disabled:opacity-70 disabled:cursor-wait"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? 'Generating...' : 'Download Report'}
        </button>
      </div>

      {/* Main Report Container - Referenced for PDF */}
      <div ref={reportRef} id="triage-report-content" className="space-y-6 bg-slate-50 p-2 md:p-0">
        
        {/* Patient Header Section */}
        {intakeData && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
               <User className="w-4 h-4" />
               Patient Profile
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div>
                 <span className="block text-xs text-slate-500 uppercase">Patient Name</span>
                 <span className="font-bold text-slate-800 text-lg">{intakeData.fullName}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-500 uppercase">Age / Sex</span>
                 <span className="font-medium text-slate-800">{intakeData.age} Y / {intakeData.sex}</span>
               </div>
               <div>
                 <span className="block text-xs text-slate-500 uppercase">Blood Group</span>
                 <div className="flex items-center gap-1.5 font-medium text-slate-800">
                   {intakeData.bloodGroup ? (
                     <>
                       <Droplet className="w-3.5 h-3.5 text-rose-500 fill-current" />
                       {intakeData.bloodGroup}
                     </>
                   ) : 'Unknown'}
                 </div>
               </div>
               <div>
                 <span className="block text-xs text-slate-500 uppercase">Date</span>
                 <span className="font-medium text-slate-800">{new Date().toLocaleDateString()}</span>
               </div>
             </div>
          </div>
        )}

        {/* Red Flags Alert */}
        {hasRedFlags && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-lg shadow-sm print:border-rose-500">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-rose-800">Red Flags Identified</h3>
                <ul className="mt-2 space-y-1">
                  {data.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-rose-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  Immediate medical attention recommended
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <ClipboardList className="w-4 h-4" />
            Case Summary
          </h3>
          <p className="text-slate-700 leading-relaxed">{data.symptom_summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Probable Conditions */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              <Activity className="w-4 h-4" />
              Probable Conditions
            </h3>
            <div className="space-y-4">
              {data.probable_conditions.map((condition, idx) => (
                <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-800">{condition.name}</span>
                    <ProbabilityBadge level={condition.probability} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{condition.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 break-inside-avoid">
            {/* Department Recommendation */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 shadow-lg text-white relative overflow-hidden">
               <div className="relative z-10">
                <h3 className="flex items-center gap-2 text-teal-100 text-xs font-bold uppercase tracking-wider mb-2">
                    <Hospital className="w-4 h-4" />
                    Recommended Department
                </h3>
                <div className="text-2xl font-bold tracking-tight mb-4">
                    {data.recommended_department}
                </div>
                {/* Estimated Time Badge */}
                {data.estimated_consultation_time && (
                    <div className="inline-flex items-center gap-2 bg-teal-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-teal-500/30">
                        <Hourglass className="w-4 h-4 text-teal-200" />
                        <span className="text-sm font-medium text-teal-50">Est. Consult Time: {data.estimated_consultation_time}</span>
                    </div>
                )}
               </div>
            </div>

            {/* Recommended Tests */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <FlaskConical className="w-4 h-4" />
                Suggested Diagnostics
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.recommended_tests.map((test, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                    {test}
                  </span>
                ))}
                {data.recommended_tests.length === 0 && (
                  <span className="text-sm text-slate-400 italic">No specific tests recommended at this stage.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-before-auto">
          {/* Self Care */}
          <div className="bg-sky-50 rounded-xl p-5 border border-sky-100">
            <h3 className="flex items-center gap-2 text-sm font-bold text-sky-800 uppercase tracking-wider mb-2">
              <HeartHandshake className="w-4 h-4" />
              Self-Care Guidance
            </h3>
            <p className="text-sm text-sky-900 leading-relaxed">
              {data.self_care_advice}
            </p>
          </div>

          {/* Ayurvedic Suggestions */}
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <h3 className="flex items-center gap-2 text-sm font-bold text-green-800 uppercase tracking-wider mb-2">
              <Leaf className="w-4 h-4" />
              Ayurvedic Suggestions
            </h3>
            <p className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap">
              {data.ayurvedic_suggestions || "No specific Ayurvedic suggestions available for this condition."}
            </p>
            <div className="mt-3 pt-3 border-t border-green-200/50 text-[10px] text-green-700 italic">
              * Complementary suggestions. Consult an Ayurvedic practitioner before starting any herbs, especially if on medication.
            </div>
          </div>
        </div>
        
        {/* Footer for PDF */}
        <div className="hidden print:block text-center text-xs text-slate-400 mt-8 pt-4 border-t border-slate-200">
          Generated by Eli Clinical Triage • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TriageReport;
