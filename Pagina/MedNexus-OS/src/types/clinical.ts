export type Locale = "es" | "en";
export type Role = "clinical" | "patient";
export type Section = "overview" | "patients" | "inventory" | "team" | "schedule" | "care" | "booking" | "record" | "support";
export type InventoryType = "medicine" | "supply" | "equipment";
export type InventoryModel = "bag" | "capsule" | "vial" | "syringe" | "defibrillator" | "prosthesis" | "glove" | "crutches" | "bone";
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
}
