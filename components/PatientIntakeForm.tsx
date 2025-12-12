
import React, { useState } from 'react';
import { IntakeData } from '../types';
import { User, Calendar, Ruler, Scale, Activity, Pill, AlertCircle, FileText, ChevronRight, Mic, MicOff, Loader2, Stethoscope, Droplet } from 'lucide-react';
import { parsePatientVoiceInput } from '../services/geminiService';

interface Props {
  onSubmit: (data: IntakeData) => void;
  isLoading: boolean;
}

const PatientIntakeForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<IntakeData>({
    fullName: '',
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

  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const startVoiceAssistant = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      setIsListening(false);
      setIsProcessingVoice(true);

      try {
        const extractedData = await parsePatientVoiceInput(transcript);
        
        // Merge extracted data into form
        setFormData(prev => ({
          ...prev,
          ...extractedData,
          currentSymptoms: extractedData.currentSymptoms ? (prev.currentSymptoms ? `${prev.currentSymptoms}. ${extractedData.currentSymptoms}` : extractedData.currentSymptoms) : prev.currentSymptoms,
          conditions: extractedData.conditions ? (prev.conditions ? `${prev.conditions}, ${extractedData.conditions}` : extractedData.conditions) : prev.conditions,
          medications: extractedData.medications ? (prev.medications ? `${prev.medications}, ${extractedData.medications}` : extractedData.medications) : prev.medications,
          allergies: extractedData.allergies ? (prev.allergies ? `${prev.allergies}, ${extractedData.allergies}` : extractedData.allergies) : prev.allergies,
        }));
      } catch (error) {
        console.error("Voice processing failed", error);
        alert("Could not process voice input. Please try again.");
      } finally {
        setIsProcessingVoice(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setIsProcessingVoice(false);
    };

    recognition.onend = () => {
      // If stopped without result (manual stop or silence)
      if (isListening) setIsListening(false);
    };

    recognition.start();
  };

  const inputClasses = "w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400";
  const textareaClasses = "w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white text-slate-900 placeholder:text-slate-400";
  const selectClasses = "w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up relative">
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Patient Intake Form
          </h2>
          <p className="text-sm text-slate-500 mt-1">Please provide accurate details for a safe clinical assessment.</p>
        </div>
        
        {/* Voice Assistant Button */}
        <button
          type="button"
          onClick={startVoiceAssistant}
          disabled={isListening || isProcessingVoice}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${isListening 
              ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25'
            }
            ${isProcessingVoice ? 'opacity-70 cursor-wait' : ''}
          `}
        >
          {isProcessingVoice ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          {isProcessingVoice ? 'Processing...' : isListening ? 'Listening...' : 'Auto-fill with Voice'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* Section 1: Demographics */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
            Demographics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input required type="number" name="age" value={formData.age} onChange={handleChange} className={`${inputClasses} pl-9`} placeholder="30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Biological Sex</label>
                <select required name="sex" value={formData.sex} onChange={handleChange} className={selectClasses}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Intersex">Intersex</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input required type="number" name="weight" value={formData.weight} onChange={handleChange} className={`${inputClasses} pl-9`} placeholder="70" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input required type="number" name="height" value={formData.height} onChange={handleChange} className={`${inputClasses} pl-9`} placeholder="175" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={`${selectClasses} pl-9`}>
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
        </div>

        {/* Section 2: Current Symptoms (Reason for Visit) */}
        <div className="space-y-4">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
            Current Medical Problem
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Describe your current symptoms / Reason for visit</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3.5 w-5 h-5 text-indigo-500" />
              <textarea 
                required
                name="currentSymptoms" 
                value={formData.currentSymptoms} 
                onChange={handleChange} 
                className={`${textareaClasses} pl-10 h-24 shadow-sm`}
                placeholder="e.g., I have had a high fever and headache for 2 days. I feel very weak." 
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Be as detailed as possible so the AI doesn't need to ask basic questions.</p>
          </div>
        </div>

        {/* Section 3: Medical History */}
        <div className="space-y-4">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
            Medical History
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pre-existing Conditions</label>
              <textarea name="conditions" value={formData.conditions} onChange={handleChange} className={`${textareaClasses} h-20`} placeholder="Diabetes, Hypertension, Asthma, Thyroid..." />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ongoing Medications</label>
              <textarea name="medications" value={formData.medications} onChange={handleChange} className={`${textareaClasses} h-20`} placeholder="List all current medicines..." />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
              <input name="allergies" value={formData.allergies} onChange={handleChange} className={inputClasses} placeholder="Penicillin, Peanuts, Latex..." />
            </div>
          </div>
        </div>

        {/* Section 4: Lifestyle & Vitals */}
        <div className="space-y-4">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">4</span>
            Lifestyle & Vitals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Smoking Status</label>
              <select name="smoking" value={formData.smoking} onChange={handleChange} className={selectClasses}>
                <option value="Never">Never</option>
                <option value="Former">Former</option>
                <option value="Current">Current Smoker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alcohol Consumption</label>
               <select name="alcohol" value={formData.alcohol} onChange={handleChange} className={selectClasses}>
                <option value="None">None</option>
                <option value="Occasional">Occasional</option>
                <option value="Regular">Regular</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
            {(formData.sex === 'Female' || formData.pregnancy !== 'N/A') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pregnancy Status</label>
                <select name="pregnancy" value={formData.pregnancy} onChange={handleChange} className={selectClasses}>
                  <option value="N/A">Not Applicable</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Possible">Possible</option>
                </select>
              </div>
            )}
             <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Vitals (Optional)</label>
               <input name="vitals" value={formData.vitals} onChange={handleChange} className={inputClasses} placeholder="BP: 120/80, Pulse: 72, Temp: 98.6F" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Proceed to Assessment'}
            {!isLoading && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientIntakeForm;
