
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import PatientTriageView from './components/PatientTriageView';
import DigitalTwin from './components/DigitalTwin';
import DoctorPortal from './components/DoctorPortal';
import DoctorsDirectory from './components/DoctorsDirectory';
import OurFacility from './components/OurFacility';
import { ViewMode, PatientRecord, IntakeData, TriageResponse } from './types';
import { ArrowLeft } from 'lucide-react';

const MOCK_RECORDS: PatientRecord[] = [];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.PATIENT_TRIAGE);
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]);
  const [currentUserPhone, setCurrentUserPhone] = useState<string>('');

  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const savedData = localStorage.getItem('jc_juneja_hospital_records');
      return savedData ? JSON.parse(savedData) : MOCK_RECORDS;
    } catch (e) {
      console.error("Failed to load records from local storage", e);
      return MOCK_RECORDS;
    }
  });

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

  const handleNavigate = (view: ViewMode) => {
    if (view === currentView) return;
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  };

  const handleBack = () => {
    if (viewHistory.length === 0) return;
    const historyCopy = [...viewHistory];
    const prevView = historyCopy.pop();
    setViewHistory(historyCopy);
    if (prevView) {
      setCurrentView(prevView);
    }
  };

  const navigateToDigitalTwin = () => {
    handleNavigate(ViewMode.DIGITAL_TWIN);
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
          onNavigate={handleNavigate} 
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-80px)]">
          
          {viewHistory.length > 0 && (
            <button 
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-medium text-sm group"
            >
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shadow-sm">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Previous
            </button>
          )}
          
          {/* State preservation: hide triage view instead of unmounting */}
          <div style={{ display: currentView === ViewMode.PATIENT_TRIAGE ? 'block' : 'none' }}>
            <div className="max-w-4xl mx-auto">
               <PatientTriageView 
                 onSaveRecord={handleSaveRecord} 
                 onNavigateToDigitalTwin={navigateToDigitalTwin}
                 records={records}
                 onLogin={handleLogin}
               />
            </div>
          </div>

          {currentView === ViewMode.DIGITAL_TWIN && (
            <div className="max-w-5xl mx-auto h-full animate-fade-in">
              <DigitalTwin records={records} currentPhone={currentUserPhone} />
            </div>
          )}

          {currentView === ViewMode.OUR_FACILITY && (
            <div className="max-w-6xl mx-auto h-full animate-fade-in">
              <OurFacility />
            </div>
          )}

          {currentView === ViewMode.DOCTOR_PORTAL && (
            <div className="max-w-6xl mx-auto h-full animate-fade-in">
              <DoctorPortal records={records} />
            </div>
          )}

          {currentView === ViewMode.DOCTORS_DIRECTORY && (
            <div className="max-w-6xl mx-auto h-full animate-fade-in">
              <DoctorsDirectory />
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
