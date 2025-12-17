
import React, { useState, useEffect, useRef } from 'react';
import PatientIntakeForm from './PatientIntakeForm';
import PatientIdentification from './PatientIdentification';
import MCQQuestionnaire from './MCQQuestionnaire';
import TriageReport from './TriageReport';
import SymptomInput from './SymptomInput';
import DisclaimerModal from './DisclaimerModal';
import { sendMessageToTriage, resetSession } from '../services/geminiService';
import { TriageResponse, AppState, IntakeData, AIResponse, MCQStepResponse, PatientRecord } from '../types';
import { RefreshCw, ClipboardCheck, UserCog, MessageSquare, Save } from 'lucide-react';

interface Props {
  onSaveRecord: (intake: IntakeData, triage: TriageResponse) => void;
  onNavigateToDigitalTwin: () => void;
  records: PatientRecord[];
  onLogin: (email: string) => void;
}

const PatientTriageView: React.FC<Props> = ({ onSaveRecord, onNavigateToDigitalTwin, records, onLogin }) => {
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentEmail, setCurrentEmail] = useState('');
  
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [mcqData, setMcqData] = useState<MCQStepResponse | null>(null);
  const [finalReport, setFinalReport] = useState<TriageResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetSession();
  }, [appState]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [appState, mcqData, finalReport]);

  const triggerSave = (intake: IntakeData, report: TriageResponse) => {
    if (!isSaved) {
       onSaveRecord(intake, report);
       setIsSaved(true);
    }
  };

  const processAIResponse = (response: AIResponse) => {
    if ('screen' in response && response.screen === 'symptom_mcq') {
      setMcqData(response as MCQStepResponse);
      setAppState(AppState.MCQ_ENTRY);
      return;
    }
    
    if ('symptom_summary' in response) {
      const report = response as TriageResponse;
      setFinalReport(report);
      setAppState(AppState.RESULTS);
      
      // Auto-save record when final report is generated and no clarification needed
      if (report.clarifying_questions_needed === 'NO' && intakeData) {
        // Ensure email is consistent from currentEmail state
        const finalIntake = { ...intakeData, email: currentEmail.toLowerCase() };
        triggerSave(finalIntake, report);
      }
      return;
    }

    if ('screen' in response && response.screen === 'patient_intake') {
      alert("Please ensure all fields are filled correctly.");
      setAppState(AppState.INTAKE);
    }
  };

  const processIntake = async (data: IntakeData) => {
    setIntakeData(data);
    setAppState(AppState.ANALYZING_INTAKE);
    
    const prompt = `
      PATIENT INTAKE DATA:
      Name: ${data.fullName}
      Age: ${data.age}
      Sex: ${data.sex}
      Blood Group: ${data.bloodGroup}
      Weight: ${data.weight}kg, Height: ${data.height}cm
      CURRENT SYMPTOMS / REASON FOR VISIT: ${data.currentSymptoms}
      Conditions: ${data.conditions}
      Meds: ${data.medications}
      Allergies: ${data.allergies}
      Smoking: ${data.smoking}, Alcohol: ${data.alcohol}
      Pregnancy: ${data.pregnancy}
      Surgeries: ${data.surgeries}
      Vitals: ${data.vitals}
      
      Proceed to generate MCQs. 
      IMPORTANT: 
      - Do not ask questions about information already provided above.
      - Ask ONLY relevant clinical questions.
    `;

    try {
      const response = await sendMessageToTriage(prompt);
      processAIResponse(response);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleDisclaimerAccept = () => {
    setHasAcceptedDisclaimer(true);
    setShowDisclaimer(false);
    setAppState(AppState.PATIENT_ID);
  };

  const handleEmailSubmit = (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    setCurrentEmail(normalizedEmail);
    onLogin(normalizedEmail);

    // Check if user exists in records
    // IMPORTANT: Strict lower case matching to fix history retrieval issues
    const existingUserRecords = records.filter(r => 
      r.intake.email.toLowerCase().trim() === normalizedEmail
    );
    
    if (existingUserRecords.length > 0) {
      // Returning user - Sort by latest
      const latestRecord = existingUserRecords.sort((a, b) => b.timestamp - a.timestamp)[0];
      // Pre-load data but clear current symptoms
      setIntakeData({
        ...latestRecord.intake,
        email: normalizedEmail, // Ensure email is current
        currentSymptoms: '' // Reset symptoms for new triage
      });
      setAppState(AppState.QUICK_INTAKE);
    } else {
      // New user
      setAppState(AppState.INTAKE);
    }
  };

  const handleIntakeSubmit = async (data: IntakeData) => {
    // Force email consistency
    const consistentData = { ...data, email: currentEmail };
    processIntake(consistentData);
  };

  const handleQuickIntakeSubmit = async (symptoms: string) => {
    if (!intakeData) return;
    
    // Merge new symptoms with existing profile and ensure email
    const updatedIntake = {
      ...intakeData,
      email: currentEmail,
      currentSymptoms: symptoms
    };
    
    processIntake(updatedIntake);
  };

  const handleMCQSubmit = async (answers: Record<string, string[]>) => {
    setAppState(AppState.ANALYZING_MCQ);
    
    let answerString = "USER SYMPTOM ANSWERS:\n";
    const isClarificationPhase = appState === AppState.RESULTS && finalReport?.clarifying_questions_needed === 'YES';
    const questionsToMap = isClarificationPhase ? finalReport.questions : mcqData?.questions || [];

    questionsToMap.forEach(q => {
        const selectedIds = answers[q.id] || [];
        const selectedTexts = selectedIds.map(id => q.options[id]).join(", ");
        answerString += `Question: ${q.question}\nAnswer: ${selectedTexts}\n\n`;
    });

    if (isClarificationPhase) {
      answerString += "\n\nSYSTEM NOTE: User response to clarification. Do NOT ask further questions. Generate final Triage Response.";
    }

    try {
      const response = await sendMessageToTriage(answerString);
      processAIResponse(response);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleManualSave = () => {
    if (finalReport && intakeData) {
        const finalIntake = { ...intakeData, email: currentEmail.toLowerCase() };
        onSaveRecord(finalIntake, finalReport);
        setIsSaved(true);
        alert("Record saved to Doctor Portal successfully.");
    }
  };

  const handleReset = () => {
    resetSession();
    setIntakeData(null);
    setMcqData(null);
    setFinalReport(null);
    setHasAcceptedDisclaimer(false);
    setShowDisclaimer(true);
    setCurrentEmail('');
    setIsSaved(false);
    setAppState(AppState.IDLE);
    onLogin(''); // Clear login in parent
  };

  return (
    <div className="pb-32 relative">
        {showDisclaimer && (
          <DisclaimerModal onAccept={handleDisclaimerAccept} />
        )}

        <div className="flex justify-center mb-8">
           <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${[AppState.INTAKE, AppState.QUICK_INTAKE, AppState.PATIENT_ID].includes(appState) ? 'bg-indigo-600 w-8' : 'bg-slate-300'} transition-all duration-300`}/>
              <span className={`h-2 w-2 rounded-full ${appState === AppState.MCQ_ENTRY ? 'bg-indigo-600 w-8' : 'bg-slate-300'} transition-all duration-300`}/>
              <span className={`h-2 w-2 rounded-full ${appState === AppState.RESULTS ? 'bg-indigo-600 w-8' : 'bg-slate-300'} transition-all duration-300`}/>
           </div>
        </div>

        {appState === AppState.PATIENT_ID && (
          <PatientIdentification onSubmit={handleEmailSubmit} />
        )}

        {appState === AppState.QUICK_INTAKE && intakeData && (
           <div className="max-w-3xl mx-auto animate-fade-in-up">
              <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                       <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Welcome back, {intakeData.fullName.split(' ')[0]}</h2>
                      <p className="text-indigo-100">Eli AI Assistant is ready to help.</p>
                    </div>
                 </div>
                 <div className="bg-white/10 rounded-xl p-4 text-sm text-indigo-50 border border-white/10">
                    <p>I have your medical history on file (Age: {intakeData.age}, Weight: {intakeData.weight}kg, Conditions: {intakeData.conditions || 'None'}). You don't need to enter it again.</p>
                 </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">What seems to be the problem today?</h3>
                 <SymptomInput 
                    onSubmit={handleQuickIntakeSubmit} 
                    isLoading={false} 
                    isFollowUp={false} 
                 />
              </div>
           </div>
        )}

        {appState === AppState.INTAKE && (
          <PatientIntakeForm 
            onSubmit={handleIntakeSubmit} 
            isLoading={false} 
            initialEmail={currentEmail}
          />
        )}
        
        {appState === AppState.ANALYZING_INTAKE && (
          <div className="text-center py-20 animate-pulse">
            <ClipboardCheck className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">Analyzing Patient Profile...</h3>
            <p className="text-slate-500">Generating clinical assessment questions.</p>
          </div>
        )}

        {appState === AppState.MCQ_ENTRY && mcqData && (
          <MCQQuestionnaire questions={mcqData.questions} onSubmit={handleMCQSubmit} isLoading={false} />
        )}

        {appState === AppState.ANALYZING_MCQ && (
          <div className="text-center py-20 animate-pulse">
             <div className="flex gap-2 justify-center mb-4">
                <div className="w-4 h-4 bg-teal-500 rounded-full animate-bounce delay-0"></div>
                <div className="w-4 h-4 bg-teal-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-4 h-4 bg-teal-500 rounded-full animate-bounce delay-300"></div>
             </div>
            <h3 className="text-xl font-semibold text-slate-700">Performing Triage Analysis...</h3>
          </div>
        )}

        {appState === AppState.RESULTS && finalReport && (
          <div className="space-y-8 relative">
             {!isSaved && (
                <div className="absolute top-0 right-0 z-10">
                   <button 
                     onClick={handleManualSave}
                     className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2"
                   >
                     <Save className="w-4 h-4" />
                     Save to Records
                   </button>
                </div>
             )}

            {finalReport.clarifying_questions_needed === 'NO' ? (
                <TriageReport data={finalReport} intakeData={intakeData || undefined} />
            ) : (
                <div className="animate-fade-in space-y-4">
                     <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                        <h3 className="text-lg font-semibold text-indigo-900">Additional Clarification Needed</h3>
                        <p className="text-indigo-700 text-sm">Please answer these follow-up questions.</p>
                     </div>
                    <MCQQuestionnaire questions={finalReport.questions} onSubmit={handleMCQSubmit} isLoading={false} />
                </div>
            )}
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-600">
            <p className="font-semibold">A connection error occurred.</p>
            <button onClick={() => setAppState(AppState.IDLE)} className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg shadow-sm">Reset</button>
          </div>
        )}
        
        <div ref={scrollRef}></div>

      {(appState === AppState.RESULTS && finalReport?.clarifying_questions_needed === 'NO') && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 flex justify-center">
          <div className="max-w-4xl w-full flex flex-col md:flex-row gap-3">
               <button 
                 onClick={onNavigateToDigitalTwin}
                 className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
               >
                 <UserCog className="w-5 h-5" />
                 View My Digital Twin
               </button>
               <button 
                 onClick={handleReset}
                 className="flex-1 bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
               >
                 <RefreshCw className="w-5 h-5" />
                 New Assessment
               </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTriageView;
