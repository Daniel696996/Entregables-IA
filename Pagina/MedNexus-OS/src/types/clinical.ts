export type Locale = "es" | "en";
export type Role = "clinical" | "patient";
export type Section = "overview" | "patients" | "inventory" | "team" | "schedule" | "care" | "booking" | "record" | "support" | "locations" | "triage";
export type InventoryType = "medicine" | "supply" | "equipment";
export type InventoryModel = "bag" | "capsule" | "vial" | "syringe" | "defibrillator" | "prosthesis" | "glove" | "crutches" | "bone" | "fracture" | "lung" | "pneumonia" | "osteoporosis" | "cell";
export type PatientStatus = "waiting" | "ready" | "inConsultation";
export type ClinicianStatus = "available" | "surgery" | "consult";

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  city: string;
  department: string;
  blood: string;
  specialty: string;
  reason: string;
  status: PatientStatus;
  time: string;
  allergies: string[];
  conditions: string[];
  doctor: string;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryType;
  category: string;
  route: string;
  stock: number;
  unit: string;
  threshold: number;
  sku: string;
  icon: string;
  color: string;
  model: InventoryModel;
  detail: string;
}

export interface Clinician {
  name: string;
  title: string;
  initials: string;
  experience: string;
  status: ClinicianStatus;
  department: string;
  shift: "Mañana" | "Tarde" | "Noche";
  color: string;
  portrait: string;
  credentials?: string[];
  research?: string;
  demoCaseCount?: number;
}

export interface PatientClinicalDetail {
  notes: Array<{ date: string; type: string; author: string; summary: string }>;
  vitals: Array<{ date: string; bloodPressure: string; heartRate: string; temperature: string; oxygenSaturation: string }>;
  studies: Array<{ date: string; title: string; bodyArea: string; model: InventoryModel; summary: string }>;
  activePlan: string[];
  audit: Array<{ date: string; action: string; actor: string; result: string }>;
}

export interface ProjectCollaborator {
  name: string;
  initials: string;
  title: string;
  department: string;
  role: string;
  color: string;
  permissions: string[];
  activity: { reviews: number; tasks: number; availability: "available" | "busy" };
}

export interface ScheduleEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  kind: "Cita" | "Guardia" | "Cirugía" | "Reunión";
  clinician: string;
  resource: string;
  notes: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapsQuery: string;
  officialUrl: string;
}
