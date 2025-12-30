
export interface ProbableCondition {
  name: string;
  probability: "Low" | "Moderate" | "High";
  reason: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: Record<string, string>;
  allow_multiple: boolean;
}

export interface TriageResponse {
  symptom_summary: string;
  clarifying_questions_needed: "YES" | "NO";
  questions: MCQQuestion[];
  probable_conditions: ProbableCondition[];
  red_flags: string[];
  recommended_tests: string[];
  recommended_department: string;
  self_care_advice: string;
  ayurvedic_suggestions: string;
  internal_chatbot_trigger: "YES" | "NO";
  estimated_consultation_time: string;
}

export interface IntakeData {
  phoneNumber: string;
  fullName: string;
  relationship: string;
  age: string;
  sex: string;
  bloodGroup: string;
  weight: string;
  height: string;
  currentSymptoms: string;
  conditions: string;
  medications: string;
  allergies: string;
  smoking: string;
  alcohol: string;
  pregnancy: string;
  surgeries: string;
  labResults: string;
  vitals: string;
}

export interface MCQStepResponse {
  screen: "symptom_mcq";
  questions: MCQQuestion[];
  next_action: string;
}

export interface IntakeStepResponse {
    screen: "patient_intake";
    required_fields_missing: string[];
    next_action: string;
}

export type AIResponse = IntakeStepResponse | MCQStepResponse | TriageResponse;

export interface PatientRecord {
  id: string;
  timestamp: number;
  intake: IntakeData;
  triage: TriageResponse;
  status: 'Critical' | 'Urgent' | 'Stable' | 'Pending';
}

export enum AppState {
  IDLE = 'IDLE',
  PATIENT_ID = 'PATIENT_ID',
  SELECT_LANGUAGE = 'SELECT_LANGUAGE', // New state for Language selection
  SELECT_PROFILE = 'SELECT_PROFILE', 
  INTAKE = 'INTAKE',
  QUICK_INTAKE = 'QUICK_INTAKE', 
  ANALYZING_INTAKE = 'ANALYZING_INTAKE',
  MCQ_ENTRY = 'MCQ_ENTRY',
  ANALYZING_MCQ = 'ANALYZING_MCQ',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export enum ViewMode {
  PATIENT_TRIAGE = 'PATIENT_TRIAGE',
  DIGITAL_TWIN = 'DIGITAL_TWIN',
  DOCTOR_PORTAL = 'DOCTOR_PORTAL',
  DOCTORS_DIRECTORY = 'DOCTORS_DIRECTORY',
  OUR_FACILITY = 'OUR_FACILITY'
}
