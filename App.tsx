
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import PatientTriageView from './components/PatientTriageView';
import DigitalTwin from './components/DigitalTwin';
import DoctorPortal from './components/DoctorPortal';
import DoctorsDirectory from './components/DoctorsDirectory';
import OurFacility from './components/OurFacility';
import { ViewMode, PatientRecord, IntakeData, TriageResponse } from './types';

// Initialize with empty array as requested
const MOCK_RECORDS: PatientRecord[] = [];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.PATIENT_TRIAGE);
  const [currentUserPhone, setCurrentUserPhone] = useState<string>('');

  // Initialize records from LocalStorage or fall back to empty array
  // Updated key to 'jc_juneja_hospital_records'
  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const savedData = localStorage.getItem('jc_juneja_hospital_records');
      return savedData ? JSON.parse(savedData) : MOCK_RECORDS;
    } catch (e) {
      console.error("Failed to load records from local storage", e);
      return MOCK_RECORDS;
    }
  });

  // Save records to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('jc_juneja_hospital_records', JSON.stringify(records));
    } catch (e) {
      console.error("Failed to save records to local storage", e);
    }
  }, [records]);

  const handleSaveRecord = (intake: IntakeData, triage: TriageResponse) => {
    const isCritical = triage.red_flags.length > 0;
    const isUrgent = triage.probable_conditions.some(c => c.probability === 'High') && !isCritical;
    
    const newRecord: PatientRecord = {
      id: `JCJH-${Math.floor(Math.random() * 100000)}`,
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

  const handleLogin = (phone: string) => {
    setCurrentUserPhone(phone);
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
                 records={records}
                 onLogin={handleLogin}
               />
            </div>
          )}

          {currentView === ViewMode.DIGITAL_TWIN && (
            <div className="max-w-5xl mx-auto h-full">
              <DigitalTwin records={records} currentPhone={currentUserPhone} />
            </div>
          )}

          {currentView === ViewMode.OUR_FACILITY && (
            <div className="max-w-6xl mx-auto h-full">
              <OurFacility />
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
