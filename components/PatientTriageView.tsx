
import React, { useState, useEffect, useRef } from 'react';
import PatientIntakeForm from './PatientIntakeForm';
import MCQQuestionnaire from './MCQQuestionnaire';
import TriageReport from './TriageReport';
import DisclaimerModal from './DisclaimerModal';
import { sendMessageToTriage, resetSession } from '../services/geminiService';
import { TriageResponse, AppState, IntakeData, AIResponse, MCQStepResponse } from '../types';
import { RefreshCw, ClipboardCheck } from 'lucide-react';

interface Props {
  onSaveRecord: (intake: IntakeData, triage: TriageResponse) => void;
}

const PatientTriageView: React.FC<Props> = ({ onSaveRecord }) => {
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [mcqData, setMcqData] = useState<MCQStepResponse | null>(null);
  const [finalReport, setFinalReport] = useState<TriageResponse | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetSession();
    if (appState === AppState.IDLE) {
       setAppState(AppState.INTAKE);
    }
  }, [appState]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [appState, mcqData, finalReport]);

  const handleDisclaimerAccept = () => {
    setHasAcceptedDisclaimer(true);
    setAppState(AppState.INTAKE);
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
        onSaveRecord(intakeData, report);
      }
      return;
    }

    if ('screen' in response && response.screen === 'patient_intake') {
      alert("Please ensure all fields are filled correctly.");
      setAppState(AppState.INTAKE);
    }
  };

  const handleIntakeSubmit = async (data: IntakeData) => {
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

  const handleReset = () => {
    resetSession();
    setIntakeData(null);
    setMcqData(null);
    setFinalReport(null);
    setAppState(AppState.INTAKE);
  };

  if (!hasAcceptedDisclaimer) {
    return <DisclaimerModal onAccept={handleDisclaimerAccept} />;
  }

  return (
    <div className="pb-32">
        <div className="flex justify-center mb-8">
           <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${appState === AppState.INTAKE ? 'bg-indigo-600 w-8' : 'bg-slate-300'} transition-all duration-300`}/>
              <span className={`h-2 w-2 rounded-full ${appState === AppState.MCQ_ENTRY ? 'bg-indigo-600 w-8' : 'bg-slate-300'} transition-all duration-300`}/>
              <span className={`h-2 w-2 rounded-full ${appState === AppState.RESULTS ? 'bg-indigo-600 w-8' : 'bg-slate-300'} transition-all duration-300`}/>
           </div>
        </div>

        {appState === AppState.INTAKE && (
          <PatientIntakeForm onSubmit={handleIntakeSubmit} isLoading={false} />
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
          <div className="space-y-8">
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
          <div className="max-w-4xl w-full">
               <button 
                 onClick={handleReset}
                 className="w-full bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
               >
                 <RefreshCw className="w-5 h-5" />
                 Start New Triage
               </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTriageView;
