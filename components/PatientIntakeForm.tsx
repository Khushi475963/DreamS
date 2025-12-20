
import React, { useState, useEffect } from 'react';
import { IntakeData } from '../types';
import { User, ChevronRight, Mail } from 'lucide-react';

interface Props {
  onSubmit: (data: IntakeData) => void;
  isLoading: boolean;
  initialEmail?: string;
  initialRelationship?: string;
  initialData?: IntakeData | null;
}

const PatientIntakeForm: React.FC<Props> = ({ onSubmit, isLoading, initialEmail, initialRelationship, initialData }) => {
  const [formData, setFormData] = useState<IntakeData>({
    email: initialEmail || '',
    fullName: '',
    relationship: initialRelationship || '',
    age: '',
    sex: '',
    bloodGroup: '',
    weight: '',
    height: '',
    currentSymptoms: '',
    conditions: '',
    medications: '',
    allergies: '',
    smoking: 'No',
    alcohol: 'No',
    pregnancy: 'N/A',
    surgeries: '',
    labResults: '',
    vitals: ''
  });

  // Handle specific initial props (New Profile flow)
  useEffect(() => {
    if (initialEmail && !initialData) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail, initialData]);

  useEffect(() => {
      if (initialRelationship && !initialData) {
          setFormData(prev => ({ ...prev, relationship: initialRelationship }));
      }
  }, [initialRelationship, initialData]);

  // Handle full initial data (Edit Profile flow)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Always clear current symptoms for a new triage session, 
        // even if the rest of the profile is pre-filled.
        currentSymptoms: '' 
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400 hover:bg-slate-50";
  const textareaClasses = "w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none resize-none bg-white text-slate-800 placeholder:text-slate-400 hover:bg-slate-50";
  const selectClasses = "w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none bg-white text-slate-800 hover:bg-slate-50";

  return (
    <div className="animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              {initialData ? 'Verify & Update Details' : 'Patient Details'}
            </h2>
            {initialData && <p className="text-xs text-slate-500 mt-1">Please review and update information if anything has changed.</p>}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
          
          {/* Section 1: Demographics */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">1</span>
              Personal Information
            </h3>
            
            <div className="pl-2 md:pl-11 mb-4">
               <label className="block text-sm font-medium text-slate-600 mb-2">Email Address (Account Holder)</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                 <input 
                   required 
                   name="email" 
                   value={formData.email} 
                   onChange={handleChange} 
                   readOnly={!!initialEmail || !!initialData}
                   className={`${inputClasses} pl-10 ${initialEmail || initialData ? 'bg-slate-100 cursor-not-allowed' : ''}`} 
                   placeholder="email@example.com" 
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 md:pl-11">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Relationship to Account Holder</label>
                <input 
                   required 
                   name="relationship" 
                   value={formData.relationship} 
                   onChange={handleChange} 
                   className={inputClasses} 
                   placeholder="e.g. Self, Spouse, Child, Father..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Patient Full Name</label>
                <input required name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder="e.g. Aditi Sharma" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Age</label>
                  <input required type="number" name="age" value={formData.age} onChange={handleChange} className={inputClasses} placeholder="25" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Gender</label>
                  <select required name="sex" value={formData.sex} onChange={handleChange} className={selectClasses}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Weight (kg)</label>
                  <input required type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} placeholder="65" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Height (cm)</label>
                  <input required type="number" name="height" value={formData.height} onChange={handleChange} className={inputClasses} placeholder="165" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={selectClasses}>
                    <option value="">Unknown / Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Current Symptoms */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">2</span>
              Why are you here today?
            </h3>
            <div className="pl-2 md:pl-11">
              <label className="block text-sm font-medium text-slate-600 mb-2">Current Symptoms</label>
              <textarea 
                required
                name="currentSymptoms" 
                value={formData.currentSymptoms} 
                onChange={handleChange} 
                className={`${textareaClasses} h-32 shadow-sm border-indigo-100 bg-indigo-50/30 focus:bg-white`}
                placeholder={initialData ? "Since this is a new visit, please describe your current symptoms..." : "Describe what you are feeling... (e.g., 'Severe headache since morning, sensitivity to light.')"}
              />
            </div>
          </div>

          {/* Section 3: History */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">3</span>
              Medical History
            </h3>
            <div className="grid grid-cols-1 gap-5 pl-2 md:pl-11">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Existing Conditions</label>
                <textarea name="conditions" value={formData.conditions} onChange={handleChange} className={`${textareaClasses} h-20`} placeholder="Diabetes, High BP, Asthma..." />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Current Medications</label>
                <textarea name="medications" value={formData.medications} onChange={handleChange} className={`${textareaClasses} h-20`} placeholder="Names of medicines you take..." />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Allergies</label>
                <input name="allergies" value={formData.allergies} onChange={handleChange} className={inputClasses} placeholder="Foods, Medicines, etc." />
              </div>
            </div>
          </div>

          {/* Section 4: Lifestyle */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">4</span>
              Lifestyle & Vitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 md:pl-11">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Smoking</label>
                <select name="smoking" value={formData.smoking} onChange={handleChange} className={selectClasses}>
                  <option value="Never">Never</option>
                  <option value="Former">Former</option>
                  <option value="Current">Current Smoker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Alcohol</label>
                 <select name="alcohol" value={formData.alcohol} onChange={handleChange} className={selectClasses}>
                  <option value="None">None</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Regular">Regular</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
              {(formData.sex === 'Female' || formData.pregnancy !== 'N/A') && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Pregnancy</label>
                  <select name="pregnancy" value={formData.pregnancy} onChange={handleChange} className={selectClasses}>
                    <option value="N/A">Not Applicable</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Possible">Possible</option>
                  </select>
                </div>
              )}
               <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-600 mb-2">Vitals (If known)</label>
                 <input name="vitals" value={formData.vitals} onChange={handleChange} className={inputClasses} placeholder="BP: 120/80, Pulse: 72" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all shadow-xl hover:shadow-slate-500/30 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? 'Processing...' : (initialData ? 'Update & Start Assessment' : 'Start Assessment')}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientIntakeForm;
