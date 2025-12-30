
import React, { useState, useEffect } from 'react';
import { IntakeData } from '../types';
import { User, ChevronRight, Phone } from 'lucide-react';

interface Props {
  onSubmit: (data: IntakeData) => void;
  isLoading: boolean;
  initialPhone?: string;
  initialRelationship?: string;
  initialData?: IntakeData | null;
  selectedLanguage?: string;
}

const PatientIntakeForm: React.FC<Props> = ({ onSubmit, isLoading, initialPhone, initialRelationship, initialData, selectedLanguage = 'English' }) => {
  const [formData, setFormData] = useState<IntakeData>({
    phoneNumber: initialPhone || '',
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

  // Translation Dictionary
  const translations: Record<string, any> = {
    English: {
      header: "Patient Details",
      verifyHeader: "Verify & Update Details",
      subHeader: "Please review and update information if anything has changed.",
      section1: "Personal Information",
      phoneLabel: "Phone Number",
      relationLabel: "Relationship to Account Holder",
      relationPlaceholder: "e.g. Self, Spouse, Child, Father...",
      nameLabel: "Patient Full Name",
      namePlaceholder: "e.g. Aditi Sharma",
      ageLabel: "Age",
      genderLabel: "Gender",
      genderOptions: { select: "Select", male: "Male", female: "Female", others: "Others" },
      weightLabel: "Weight (kg)",
      heightLabel: "Height (cm)",
      bloodGroupLabel: "Blood Group",
      section2: "Why are you here today?",
      symptomsLabel: "Current Symptoms",
      symptomsPlaceholder: "Describe what you are feeling... (e.g., 'Severe headache since morning, sensitivity to light.')",
      symptomsPlaceholderEdit: "Since this is a new visit, please describe your current symptoms...",
      section3: "Medical History",
      conditionsLabel: "Existing Conditions",
      conditionsPlaceholder: "Diabetes, High BP, Asthma...",
      medsLabel: "Current Medications",
      medsPlaceholder: "Names of medicines you take...",
      allergiesLabel: "Allergies",
      allergiesPlaceholder: "Foods, Medicines, etc.",
      section4: "Lifestyle & Vitals",
      smokingLabel: "Smoking",
      smokingOptions: { never: "Never", former: "Former", current: "Current Smoker" },
      alcoholLabel: "Alcohol",
      alcoholOptions: { none: "None", occasional: "Occasional", regular: "Regular", heavy: "Heavy" },
      pregnancyLabel: "Pregnancy",
      pregnancyOptions: { na: "Not Applicable", no: "No", yes: "Yes", possible: "Possible" },
      vitalsLabel: "Vitals (If known)",
      vitalsPlaceholder: "BP: 120/80, Pulse: 72",
      submitBtn: "Start Assessment",
      updateBtn: "Update & Start Assessment",
      processing: "Processing..."
    },
    Hindi: {
      header: "रोगी का विवरण",
      verifyHeader: "विवरण सत्यापित और अपडेट करें",
      subHeader: "कृपया जानकारी की समीक्षा करें और यदि कुछ बदला है तो उसे अपडेट करें।",
      section1: "व्यक्तिगत जानकारी",
      phoneLabel: "फ़ोन नंबर",
      relationLabel: "खाता धारक से संबंध",
      relationPlaceholder: "जैसे: स्वयं, पति/पत्नी, बच्चा, पिता...",
      nameLabel: "रोगी का पूरा नाम",
      namePlaceholder: "जैसे: अदिति शर्मा",
      ageLabel: "उम्र (Age)",
      genderLabel: "लिंग (Gender)",
      genderOptions: { select: "चुनें", male: "पुरुष (Male)", female: "महिला (Female)", others: "अन्य (Others)" },
      weightLabel: "वजन (Weight in kg)",
      heightLabel: "लंबाई (Height in cm)",
      bloodGroupLabel: "रक्त समूह (Blood Group)",
      section2: "आज आप यहाँ क्यों हैं?",
      symptomsLabel: "वर्तमान लक्षण (Symptoms)",
      symptomsPlaceholder: "आपको क्या महसूस हो रहा है, विस्तार से बताएं... (जैसे: 'सुबह से तेज सिरदर्द, रोशनी से परेशानी।')",
      symptomsPlaceholderEdit: "चूंकि यह एक नई विजिट है, कृपया अपने वर्तमान लक्षणों का वर्णन करें...",
      section3: "चिकित्सा इतिहास (Medical History)",
      conditionsLabel: "मौजूदा बीमारियाँ",
      conditionsPlaceholder: "मधुमेह (Diabetes), उच्च रक्तचाप (High BP), अस्थमा...",
      medsLabel: "वर्तमान दवाएं",
      medsPlaceholder: "जो दवाएं आप ले रहे हैं उनके नाम...",
      allergiesLabel: "एलर्जी",
      allergiesPlaceholder: "भोजन, दवाएं, आदि...",
      section4: "जीवन शैली और विटल्स",
      smokingLabel: "धूम्रपान (Smoking)",
      smokingOptions: { never: "कभी नहीं", former: "पूर्व धूम्रपान करने वाला", current: "वर्तमान धूम्रपान करने वाला" },
      alcoholLabel: "शराब (Alcohol)",
      alcoholOptions: { none: "बिल्कुल नहीं", occasional: "कभी-कभी", regular: "नियमित", heavy: "अधिक मात्रा में" },
      pregnancyLabel: "गर्भावस्था (Pregnancy)",
      pregnancyOptions: { na: "लागू नहीं", no: "नहीं", yes: "हाँ", संभव: "संभव है" },
      vitalsLabel: "विटल्स (यदि ज्ञात हो)",
      vitalsPlaceholder: "BP: 120/80, Pulse: 72",
      submitBtn: "मूल्यांकन शुरू करें",
      updateBtn: "अपडेट करें और शुरू करें",
      processing: "प्रक्रिया चल रही है..."
    },
    Hinglish: {
      header: "Patient Details",
      verifyHeader: "Details Check aur Update Karein",
      subHeader: "Agar kuch change hua hai to please update karein.",
      section1: "Personal Information",
      phoneLabel: "Phone Number",
      relationLabel: "Relationship (Rishta)",
      relationPlaceholder: "e.g. Self (Khud), Spouse (Pati/Patni), Child (Bachha)...",
      nameLabel: "Patient Full Name",
      namePlaceholder: "e.g. Aditi Sharma",
      ageLabel: "Age (Umar)",
      genderLabel: "Gender (Ling)",
      genderOptions: { select: "Select", male: "Male", female: "Female", others: "Others" },
      weightLabel: "Weight (kg)",
      heightLabel: "Height (cm)",
      bloodGroupLabel: "Blood Group",
      section2: "Aaj aap yahan kyun aaye hain?",
      symptomsLabel: "Abhi kya takleef hai? (Current Symptoms)",
      symptomsPlaceholder: "Apni takleef batayein... (Jaise: 'Subah se sar dard hai, light se pareshani ho rahi hai.')",
      symptomsPlaceholderEdit: "Ye nayi visit hai, kripya apne abhi ke symptoms batayein...",
      section3: "Medical History (Purani Bimariyan)",
      conditionsLabel: "Pehle se koi bimari?",
      conditionsPlaceholder: "Sugar (Diabetes), BP, Asthma...",
      medsLabel: "Abhi koi dawai chal rahi hai?",
      medsPlaceholder: "Dawaiyon ke naam...",
      allergiesLabel: "Kisi cheez se Allergy hai?",
      allergiesPlaceholder: "Khana, Dawai, etc.",
      section4: "Lifestyle & Vitals",
      smokingLabel: "Smoking karte hain?",
      smokingOptions: { never: "Kabhi nahi", former: "Pehle karte the", current: "Haan, karte hain" },
      alcoholLabel: "Alcohol (Sharab) peete hain?",
      alcoholOptions: { none: "Bilkul nahi", occasional: "Kabhi-kabhi", regular: "Rozana", heavy: "Bahut jyada" },
      pregnancyLabel: "Pregnancy",
      pregnancyOptions: { na: "Laagu nahi", no: "Nahi", yes: "Haan", possible: "Ho sakta hai" },
      vitalsLabel: "Vitals (Agar pata ho)",
      vitalsPlaceholder: "BP: 120/80, Pulse: 72",
      submitBtn: "Check-up Shuru Karein",
      updateBtn: "Update karke Shuru Karein",
      processing: "Processing..."
    }
  };

  const t = translations[selectedLanguage] || translations['English'];

  // Handle specific initial props (New Profile flow)
  useEffect(() => {
    if (initialPhone && !initialData) {
      setFormData(prev => ({ ...prev, phoneNumber: initialPhone }));
    }
  }, [initialPhone, initialData]);

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
              {initialData ? t.verifyHeader : t.header}
            </h2>
            {initialData && <p className="text-xs text-slate-500 mt-1">{t.subHeader}</p>}
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
             {selectedLanguage}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
          
          {/* Section 1: Demographics */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">1</span>
              {t.section1}
            </h3>
            
            <div className="pl-2 md:pl-11 mb-4">
               <label className="block text-sm font-medium text-slate-600 mb-2">{t.phoneLabel}</label>
               <div className="relative">
                 <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                 <input 
                   required 
                   name="phoneNumber" 
                   value={formData.phoneNumber} 
                   onChange={handleChange} 
                   readOnly={!!initialPhone || !!initialData}
                   className={`${inputClasses} pl-10 ${initialPhone || initialData ? 'bg-slate-100 cursor-not-allowed' : ''}`} 
                   placeholder="9876543210" 
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 md:pl-11">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.relationLabel}</label>
                <input 
                   required 
                   name="relationship" 
                   value={formData.relationship} 
                   onChange={handleChange} 
                   className={inputClasses} 
                   placeholder={t.relationPlaceholder} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.nameLabel}</label>
                <input required name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} placeholder={t.namePlaceholder} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t.ageLabel}</label>
                  <input required type="number" name="age" value={formData.age} onChange={handleChange} className={inputClasses} placeholder="25" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t.genderLabel}</label>
                  <select required name="sex" value={formData.sex} onChange={handleChange} className={selectClasses}>
                    <option value="">{t.genderOptions.select}</option>
                    <option value="Male">{t.genderOptions.male}</option>
                    <option value="Female">{t.genderOptions.female}</option>
                    <option value="Others">{t.genderOptions.others}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t.weightLabel}</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} placeholder="65" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t.heightLabel}</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClasses} placeholder="165" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t.bloodGroupLabel}</label>
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
              {t.section2}
            </h3>
            <div className="pl-2 md:pl-11">
              <label className="block text-sm font-medium text-slate-600 mb-2">{t.symptomsLabel}</label>
              <textarea 
                required
                name="currentSymptoms" 
                value={formData.currentSymptoms} 
                onChange={handleChange} 
                className={`${textareaClasses} h-32 shadow-sm border-indigo-100 bg-indigo-50/30 focus:bg-white`}
                placeholder={initialData ? t.symptomsPlaceholderEdit : t.symptomsPlaceholder}
              />
            </div>
          </div>

          {/* Section 3: History */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">3</span>
              {t.section3}
            </h3>
            <div className="grid grid-cols-1 gap-5 pl-2 md:pl-11">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.conditionsLabel}</label>
                <textarea name="conditions" value={formData.conditions} onChange={handleChange} className={`${textareaClasses} h-20`} placeholder={t.conditionsPlaceholder} />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.medsLabel}</label>
                <textarea name="medications" value={formData.medications} onChange={handleChange} className={`${textareaClasses} h-20`} placeholder={t.medsPlaceholder} />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.allergiesLabel}</label>
                <input name="allergies" value={formData.allergies} onChange={handleChange} className={inputClasses} placeholder={t.allergiesPlaceholder} />
              </div>
            </div>
          </div>

          {/* Section 4: Lifestyle */}
          <div className="space-y-5">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">4</span>
              {t.section4}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 md:pl-11">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.smokingLabel}</label>
                <select name="smoking" value={formData.smoking} onChange={handleChange} className={selectClasses}>
                  <option value="Never">{t.smokingOptions.never}</option>
                  <option value="Former">{t.smokingOptions.former}</option>
                  <option value="Current">{t.smokingOptions.current}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">{t.alcoholLabel}</label>
                 <select name="alcohol" value={formData.alcohol} onChange={handleChange} className={selectClasses}>
                  <option value="None">{t.alcoholOptions.none}</option>
                  <option value="Occasional">{t.alcoholOptions.occasional}</option>
                  <option value="Regular">{t.alcoholOptions.regular}</option>
                  <option value="Heavy">{t.alcoholOptions.heavy}</option>
                </select>
              </div>
              {(formData.sex === 'Female' || formData.pregnancy !== 'N/A') && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">{t.pregnancyLabel}</label>
                  <select name="pregnancy" value={formData.pregnancy} onChange={handleChange} className={selectClasses}>
                    <option value="N/A">{t.pregnancyOptions.na}</option>
                    <option value="No">{t.pregnancyOptions.no}</option>
                    <option value="Yes">{t.pregnancyOptions.yes}</option>
                    <option value="Possible">{t.pregnancyOptions.possible}</option>
                  </select>
                </div>
              )}
               <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-600 mb-2">{t.vitalsLabel}</label>
                 <input name="vitals" value={formData.vitals} onChange={handleChange} className={inputClasses} placeholder={t.vitalsPlaceholder} />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all shadow-xl hover:shadow-slate-500/30 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? t.processing : (initialData ? t.updateBtn : t.submitBtn)}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientIntakeForm;
