
import React, { useState } from 'react';
import { Phone, ArrowRight } from 'lucide-react';

interface Props {
  onSubmit: (phone: string) => void;
}

const PatientIdentification: React.FC<Props> = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length >= 10) {
      onSubmit(phone.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] animate-fade-in-up">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Patient Identification</h2>
          <p className="text-slate-500 text-sm mt-2">
            Please enter your phone number to securely access your Family Digital Twin and start triage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Only allow numbers
              placeholder="e.g. 9876543210"
              maxLength={10}
              minLength={10}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none transition-all tracking-widest font-medium"
            />
          </div>
          <button 
            type="submit"
            disabled={phone.length < 10}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientIdentification;
