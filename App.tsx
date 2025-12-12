
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import PatientTriageView from './components/PatientTriageView';
import DigitalTwin from './components/DigitalTwin';
import DoctorPortal from './components/DoctorPortal';
import DoctorsDirectory from './components/DoctorsDirectory';
import { ViewMode, PatientRecord, IntakeData, TriageResponse } from './types';

// Mock Initial Data (Used only if no local data exists)
const MOCK_RECORDS: PatientRecord[] = [
  {
    id: 'JH-88231',
    timestamp: Date.now() - 86400000 * 2,
    status: 'Stable',
    intake: {
      fullName: 'Rahul Verma',
      age: '45',
      sex: 'Male',
      bloodGroup: 'B+',
      weight: '78',
      height: '175',
      currentSymptoms: 'Mild cough and sore throat',
      conditions: 'Hypertension',
      medications: 'Amlodipine',
      allergies: 'None',
      smoking: 'No',
      alcohol: 'Occasional',
      pregnancy: 'N/A',
      surgeries: 'None',
      labResults: '',
      vitals: 'BP: 130/85'
    },
    triage: {
      symptom_summary: 'Patient reports mild upper respiratory symptoms.',
      clarifying_questions_needed: 'NO',
      questions: [],
      probable_conditions: [
         { name: 'Viral Pharyngitis', probability: 'High', reason: 'Sore throat + cough without fever' },
         { name: 'Allergic Rhinitis', probability: 'Moderate', reason: 'Mild symptoms' }
      ],
      red_flags: [],
      recommended_tests: [],
      recommended_department: 'General Medicine',
      self_care_advice: 'Salt water gargle, steam inhalation.',
      ayurvedic_suggestions: 'Ginger tea with honey.',
      internal_chatbot_trigger: 'NO'
    }
  },
  {
    id: 'JH-99102',
    timestamp: Date.now() - 3600000 * 5,
    status: 'Critical',
    intake: {
      fullName: 'Sarah Juneja',
      age: '62',
      sex: 'Female',
      bloodGroup: 'A+',
      weight: '65',
      height: '160',
      currentSymptoms: 'Severe chest heaviness radiating to left arm',
      conditions: 'Diabetes Type 2',
      medications: 'Metformin',
      allergies: 'Sulfa drugs',
      smoking: 'Former',
      alcohol: 'No',
      pregnancy: 'N/A',
      surgeries: 'C-Section (1990)',
      labResults: '',
      vitals: 'BP: 160/100, Pulse: 110'
    },
    triage: {
      symptom_summary: 'Classic angina symptoms with risk factors.',
      clarifying_questions_needed: 'NO',
      questions: [],
      probable_conditions: [
         { name: 'Acute Coronary Syndrome', probability: 'High', reason: 'Radiating chest pain + diabetes risk' },
         { name: 'Angina Pectoris', probability: 'High', reason: 'Exertional pain pattern' }
      ],
      red_flags: ['Radiating chest pain', 'History of Diabetes', 'High BP'],
      recommended_tests: ['ECG', 'Troponin I', 'Echo'],
      recommended_department: 'Cardiology',
      self_care_advice: 'Chew Aspirin 300mg immediately if not allergic. Do not walk.',
      ayurvedic_suggestions: 'Arjuna bark tea (post-stabilization only).',
      internal_chatbot_trigger: 'NO'
    }
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.PATIENT_TRIAGE);

  // Initialize records from LocalStorage or fall back to Mock Data
  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const savedData = localStorage.getItem('juneja_hospital_records');
      return savedData ? JSON.parse(savedData) : MOCK_RECORDS;
    } catch (e) {
      console.error("Failed to load records from local storage", e);
      return MOCK_RECORDS;
    }
  });

  // Save records to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('juneja_hospital_records', JSON.stringify(records));
    } catch (e) {
      console.error("Failed to save records to local storage", e);
    }
  }, [records]);

  const handleSaveRecord = (intake: IntakeData, triage: TriageResponse) => {
    const isCritical = triage.red_flags.length > 0;
    const isUrgent = triage.probable_conditions.some(c => c.probability === 'High') && !isCritical;
    
    const newRecord: PatientRecord = {
      id: `JH-${Math.floor(Math.random() * 100000)}`,
      timestamp: Date.now(),
      status: isCritical ? 'Critical' : isUrgent ? 'Urgent' : 'Stable',
      intake,
      triage
    };

    setRecords(prev => [newRecord, ...prev]);
  };

  const navigateToDigitalTwin = () => {
    setCurrentView(ViewMode.DIGITAL_TWIN);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <div className="flex flex-col md:flex-row flex-1 max-w-7xl w-full mx-auto">
        <SideNav 
          currentView={currentView} 
          onNavigate={setCurrentView} 
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-80px)]">
          
          {currentView === ViewMode.PATIENT_TRIAGE && (
            <div className="max-w-4xl mx-auto">
               <PatientTriageView 
                 onSaveRecord={handleSaveRecord} 
                 onNavigateToDigitalTwin={navigateToDigitalTwin}
               />
            </div>
          )}

          {currentView === ViewMode.DIGITAL_TWIN && (
            <div className="max-w-5xl mx-auto h-full">
              <DigitalTwin records={records} />
            </div>
          )}

          {currentView === ViewMode.DOCTOR_PORTAL && (
            <div className="max-w-6xl mx-auto h-full">
              <DoctorPortal records={records} />
            </div>
          )}

          {currentView === ViewMode.DOCTORS_DIRECTORY && (
            <div className="max-w-6xl mx-auto h-full">
              <DoctorsDirectory />
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
