import {
  appointments as demoAppointments,
  clinicians as demoClinicians,
  inventory as demoInventory,
  patients as demoPatients,
  rooms as demoRooms,
} from "@/data/mock-data";
import type { Clinician, InventoryItem, Patient } from "@/types/clinical";

/**
 * Data access seam for the UI. The demo adapter below returns typed fixtures;
 * a production adapter can call an authenticated API/FHIR facade instead.
 * Keep clinical access checks and audit recording in that future server layer.
 */
export interface ClinicalRepository {
  listPatients(): Patient[];
  listInventory(): InventoryItem[];
  listClinicians(): Clinician[];
  listAppointments(): typeof demoAppointments;
  listRooms(): typeof demoRooms;
}

export const demoRepository: ClinicalRepository = {
  listPatients: () => demoPatients,
  listInventory: () => demoInventory,
  listClinicians: () => demoClinicians,
  listAppointments: () => demoAppointments,
  listRooms: () => demoRooms,
};

// Stable demo exports keep screen components simple while centralizing the
// data source behind the repository adapter.
export const patients = demoRepository.listPatients();
export const inventory = demoRepository.listInventory();
export const clinicians = demoRepository.listClinicians();
export const appointments = demoRepository.listAppointments();
export const rooms = demoRepository.listRooms();
