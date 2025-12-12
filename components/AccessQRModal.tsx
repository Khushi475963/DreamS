
import React, { useState, useEffect } from 'react';
import { X, Printer, QrCode, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const AccessQRModal: React.FC<Props> = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const uniqueCode = "JH-ENTRY-2025";
  
  useEffect(() => {
    // Initialize with current URL, but clean it up if needed
    setUrl(window.location.href);
  }, []);

  // Generates a QR code image using a public API
  // Using higher ECC (Error Correction Level) 'L' or 'M' is default, explicit sets usually not needed for simple URLs but good to keep standard.
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:absolute print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up print:shadow-none print:w-full print:max-w-none flex flex-col max-h-[90vh]">
        
        {/* Header - Styled for both screen and print */}
        <div className="bg-indigo-600 p-6 text-center print:bg-white print:text-black print:border-b-2 print:border-black relative shrink-0">
           <h2 className="text-2xl font-bold text-white mb-1 print:text-black">Juneja Hospital</h2>
           <p className="text-indigo-100 text-sm print:text-slate-600">AI Clinical Triage Access</p>
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 text-white/80 hover:text-white print:hidden"
           >
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-6 overflow-y-auto">
           
           <div className="space-y-2">
             <h3 className="text-xl font-bold text-slate-800">Scan to Start Triage</h3>
             <p className="text-slate-500 text-sm">Patients can scan this QR code to access the self-check-in portal instantly.</p>
           </div>

           <div className="p-4 bg-white border-2 border-slate-900 rounded-xl shadow-sm relative group">
             {url ? (
                <img src={qrUrl} alt="App QR Code" className="w-48 h-48 object-contain" />
             ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
             )}
           </div>

           {/* URL Editor for Troubleshooting */}
           <div className="w-full print:hidden text-left bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                 <LinkIcon className="w-3 h-3" />
                 Destination URL
              </label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                <strong>Tip:</strong> If testing on a phone, replace "localhost" with your computer's local IP address (e.g., 192.168.1.5).
              </p>
           </div>

           <div className="bg-slate-50 rounded-lg p-4 w-full border border-slate-200 print:border-black shrink-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Hospital Unique Code</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-mono font-bold text-slate-800">{uniqueCode}</code>
              </div>
           </div>

           <div className="print:hidden w-full space-y-3 shrink-0">
              <button 
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-md"
              >
                <Printer className="w-5 h-5" />
                Print Hospital Poster
              </button>
           </div>
        </div>
        
        {/* Footer visible only when printing */}
        <div className="hidden print:block text-center mb-6 text-sm text-slate-500">
           Powered by Juneja Hospital AI Care System • 24/7 Emergency Support
        </div>

      </div>
    </div>
  );
};

export default AccessQRModal;
