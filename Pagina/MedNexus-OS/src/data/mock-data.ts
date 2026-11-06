import type { Clinician, InventoryItem, Patient } from "@/types/clinical";

// Perfiles, centros, atenciones e insumos completamente ficticios.
// La geografía colombiana se usa como contexto de demo, nunca como directorio real.
export const patients: Patient[] = [
  { id: "MN-CO-2048", name: "Elena Martínez", initials: "EM", age: 42, city: "Medellín", department: "Antioquia", blood: "O+", specialty: "Cardiología", reason: "Control cardiovascular de seguimiento", status: "inConsultation", time: "08:30", allergies: ["Penicilina"], conditions: ["Hipertensión controlada (dato simulado)"], doctor: "Dra. Valentina Ríos", color: "violet" },
  { id: "MN-CO-2051", name: "Julián Torres", initials: "JT", age: 29, city: "Envigado", department: "Antioquia", blood: "A−", specialty: "Ortopedia", reason: "Revisión de recuperación posoperatoria", status: "waiting", time: "09:00", allergies: [], conditions: ["Recuperación posquirúrgica (dato simulado)"], doctor: "Dr. Mateo Vélez", color: "blue" },
  { id: "MN-CO-2056", name: "Sofía Ramírez", initials: "SR", age: 67, city: "Rionegro", department: "Antioquia", blood: "B+", specialty: "Neurología", reason: "Control neurológico programado", status: "ready", time: "09:30", allergies: ["Látex"], conditions: ["Migraña crónica (dato simulado)"], doctor: "Dra. Camila Luna", color: "green" },
  { id: "MN-CO-2060", name: "Andrés Gómez", initials: "AG", age: 51, city: "Medellín", department: "Antioquia", blood: "AB+", specialty: "Medicina interna", reason: "Consulta de seguimiento integral", status: "waiting", time: "10:15", allergies: [], conditions: ["Diabetes tipo 2 (dato simulado)"], doctor: "Dr. Samuel Ortiz", color: "amber" },
  { id: "MN-CO-2064", name: "Lucía Herrera", initials: "LH", age: 34, city: "Bello", department: "Antioquia", blood: "O−", specialty: "Dermatología", reason: "Valoración dermatológica", status: "ready", time: "11:00", allergies: ["Níquel"], conditions: [], doctor: "Dra. Isabella Cruz", color: "pink" },
  { id: "MN-CO-2072", name: "Tomás Cárdenas", initials: "TC", age: 8, city: "Medellín", department: "Antioquia", blood: "A+", specialty: "Pediatría", reason: "Control pediátrico preventivo", status: "waiting", time: "11:30", allergies: ["Polen (referido)"], conditions: [], doctor: "Dra. Paula Mejía", color: "cyan" },
  { id: "MN-CO-2078", name: "Mariana Pardo", initials: "MP", age: 73, city: "La Ceja", department: "Antioquia", blood: "O+", specialty: "Medicina familiar", reason: "Revisión de atención domiciliaria", status: "ready", time: "12:00", allergies: [], conditions: ["Antecedente cardiovascular (simulado)"], doctor: "Dr. Felipe Arango", color: "rose" },
  { id: "MN-CO-2081", name: "David Muñoz", initials: "DM", age: 38, city: "Medellín", department: "Antioquia", blood: "B−", specialty: "Oftalmología", reason: "Seguimiento visual anual", status: "waiting", time: "13:15", allergies: [], conditions: [], doctor: "Dra. Natalia Parra", color: "blue" },
  { id: "MN-CO-2086", name: "Sara Quintero", initials: "SQ", age: 26, city: "Itagüí", department: "Antioquia", blood: "AB−", specialty: "Ginecología", reason: "Consulta de salud preventiva", status: "ready", time: "14:00", allergies: ["Yodo (referido)"], conditions: [], doctor: "Dra. Camila Luna", color: "pink" },
  { id: "MN-CO-2093", name: "Miguel Ángel Castro", initials: "MC", age: 59, city: "Medellín", department: "Antioquia", blood: "A−", specialty: "Neumología", reason: "Revisión respiratoria programada", status: "waiting", time: "14:30", allergies: [], conditions: ["Asma (dato simulado)"], doctor: "Dr. Samuel Ortiz", color: "amber" },
  { id: "MN-CO-2098", name: "Daniela Gil", initials: "DG", age: 46, city: "Sabaneta", department: "Antioquia", blood: "O+", specialty: "Endocrinología", reason: "Control endocrino de seguimiento", status: "ready", time: "15:00", allergies: [], conditions: ["Hipotiroidismo (dato simulado)"], doctor: "Dra. Paula Mejía", color: "violet" },
];

export const inventory: InventoryItem[] = [
  { id: "MED-CO-104", name: "Cloruro de sodio 0,9%", type: "medicine", category: "Soluciones", route: "Intravenosa · bolsa 500 ml", stock: 184, unit: "bolsas", threshold: 60, sku: "DEMO-NS-500", icon: "◉", color: "cyan", model: "bag", detail: "Solución de muestra para ilustrar el flujo de inventario. No asociada a una prescripción real." },
  { id: "MED-CO-208", name: "Amoxicilina 500 mg", type: "medicine", category: "Antibióticos", route: "Oral · cápsulas", stock: 24, unit: "cajas", threshold: 40, sku: "DEMO-AMX-500", icon: "✳", color: "violet", model: "capsule", detail: "Empaque ficticio para demostrar filtros por categoría y existencias." },
  { id: "MED-CO-312", name: "Lidocaína 2%", type: "medicine", category: "Anestésicos", route: "Infiltración · vial 10 ml", stock: 12, unit: "viales", threshold: 20, sku: "DEMO-LID-2", icon: "◈", color: "blue", model: "vial", detail: "Referencia ficticia. La disponibilidad no indica que pueda usarse para una persona." },
  { id: "MED-CO-417", name: "Acetaminofén 500 mg", type: "medicine", category: "Analgésicos", route: "Oral · tabletas", stock: 92, unit: "cajas", threshold: 30, sku: "DEMO-ACE-500", icon: "✳", color: "green", model: "capsule", detail: "Elemento de catálogo demostrativo; sin orientación de uso ni dosis." },
  { id: "SUP-CO-021", name: "Jeringa de precisión", type: "supply", category: "Insumos", route: "Estéril · 10 ml · Luer Lock", stock: 68, unit: "unidades", threshold: 25, sku: "DEMO-SYP-10", icon: "⌁", color: "cyan", model: "syringe", detail: "Conexión Luer Lock · polipropileno de grado médico · modelo 3D ilustrativo." },
  { id: "SUP-CO-025", name: "Aguja hipodérmica", type: "supply", category: "Insumos", route: "Calibre 21G · 25 mm", stock: 110, unit: "unidades", threshold: 40, sku: "DEMO-NEE-21G", icon: "⌁", color: "blue", model: "syringe", detail: "Variación de muestra con calibre y longitud para filtros de inventario." },
  { id: "SUP-CO-048", name: "Desfibrilador portátil", type: "equipment", category: "Equipos", route: "Batería · autonomía de referencia 8 h", stock: 7, unit: "unidades", threshold: 4, sku: "DEMO-DEF-AED", icon: "ϟ", color: "green", model: "defibrillator", detail: "Monitorización ilustrativa · accesorios adulto/pediátrico de demostración." },
  { id: "SUP-CO-063", name: "Prótesis de cadera modular", type: "equipment", category: "Ortopedia", route: "Tallas de referencia 1–6 · titanio", stock: 3, unit: "kits", threshold: 3, sku: "DEMO-HIP-TI", icon: "◇", color: "amber", model: "prosthesis", detail: "Configuración modular ilustrativa en titanio grado implante." },
  { id: "SUP-CO-077", name: "Guantes de nitrilo", type: "supply", category: "Protección", route: "Tallas S / M / L · caja x 100", stock: 420, unit: "cajas", threshold: 100, sku: "DEMO-NTR-100", icon: "⌑", color: "blue", model: "glove", detail: "Sin látex · variaciones por talla disponibles en esta muestra." },
  { id: "SUP-CO-092", name: "Muletas ajustables", type: "equipment", category: "Apoyo", route: "Tallas S / M / L · aluminio", stock: 18, unit: "pares", threshold: 8, sku: "DEMO-CRU-AL", icon: "╱", color: "violet", model: "crutches", detail: "Aluminio ligero · altura regulable · disponibilidad ficticia." },
  { id: "SUP-CO-116", name: "Silla de ruedas plegable", type: "equipment", category: "Apoyo", route: "Adulto · ancho de asiento de referencia 46 cm", stock: 9, unit: "unidades", threshold: 5, sku: "DEMO-WCH-46", icon: "◉", color: "cyan", model: "crutches", detail: "Equipo de apoyo domiciliario en una talla ilustrativa." },
  { id: "SUP-CO-132", name: "Bisturí desechable", type: "supply", category: "Instrumental", route: "Hoja # 15 · acero inoxidable", stock: 16, unit: "unidades", threshold: 30, sku: "DEMO-SCL-15", icon: "⌁", color: "amber", model: "syringe", detail: "Referencia de catálogo ficticia con calibre y material." },
];

export const clinicians: Clinician[] = [
  { name: "Valentina Ríos", title: "Cardiología", initials: "VR", experience: "12 años · ecocardiografía y prevención cardiovascular", status: "available", department: "Centro cardiovascular", shift: "Mañana", color: "violet", portrait: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Mateo Vélez", title: "Ortopedia y trauma", initials: "MV", experience: "9 años · cirugía articular y rehabilitación", status: "surgery", department: "Unidad quirúrgica", shift: "Mañana", color: "blue", portrait: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Camila Luna", title: "Neurología", initials: "CL", experience: "14 años · neurofisiología clínica", status: "available", department: "Neurociencias", shift: "Tarde", color: "green", portrait: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Samuel Ortiz", title: "Medicina interna", initials: "SO", experience: "8 años · cuidado de condiciones crónicas", status: "consult", department: "Clínica central", shift: "Mañana", color: "amber", portrait: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Isabella Cruz", title: "Dermatología", initials: "IC", experience: "7 años · dermatología clínica", status: "available", department: "Consulta externa", shift: "Tarde", color: "pink", portrait: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Paula Mejía", title: "Pediatría y endocrinología", initials: "PM", experience: "11 años · atención integral infantil", status: "available", department: "Unidad materno infantil", shift: "Mañana", color: "cyan", portrait: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Felipe Arango", title: "Medicina familiar", initials: "FA", experience: "15 años · atención primaria y familiar", status: "consult", department: "Clínica central", shift: "Tarde", color: "rose", portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Natalia Parra", title: "Oftalmología", initials: "NP", experience: "10 años · segmento anterior y prevención visual", status: "available", department: "Consulta externa", shift: "Tarde", color: "blue", portrait: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80" },
];

export const appointments = [
  { time: "08:30", patientId: "MN-CO-2048", service: "Cardiología", room: "Consultorio 204", color: "violet" },
  { time: "09:00", patientId: "MN-CO-2051", service: "Ortopedia", room: "Consultorio 208", color: "blue" },
  { time: "09:30", patientId: "MN-CO-2056", service: "Neurología", room: "Consultorio 212", color: "green" },
  { time: "10:15", patientId: "MN-CO-2060", service: "Medicina interna", room: "Consultorio 206", color: "amber" },
  { time: "11:00", patientId: "MN-CO-2064", service: "Dermatología", room: "Consultorio 201", color: "pink" },
];

export const rooms = [
  { name: "Consultorio 204", type: "Consulta externa", status: "Ocupado", time: "08:30–09:30", clinician: "Dra. Valentina Ríos", capacity: "1 paciente" },
  { name: "Consultorio 208", type: "Ortopedia", status: "Ocupado", time: "09:00–10:00", clinician: "Dr. Mateo Vélez", capacity: "1 paciente" },
  { name: "Quirófano 02", type: "Cirugía programada", status: "Ocupado", time: "07:00–12:00", clinician: "Equipo de ortopedia", capacity: "Equipo clínico" },
  { name: "Consultorio 212", type: "Neurología", status: "Disponible", time: "10:00–13:00", clinician: "Dra. Camila Luna", capacity: "1 paciente" },
  { name: "Sala de procedimientos 01", type: "Procedimientos", status: "Disponible", time: "12:00–16:00", clinician: "Asignación pendiente", capacity: "4 puestos" },
];

export const fictionalPatient = {
  name: "Elena Martínez",
  id: "MN-CO-2048",
  age: 42,
  city: "Medellín",
  department: "Antioquia",
  blood: "O+",
  eps: "Salud de Demostración EPS",
  allergies: ["Penicilina (ejemplo ficticio)"],
  conditions: ["Hipertensión controlada (ejemplo ficticio)", "Seguimiento cardiovascular (ejemplo ficticio)"],
  signedBy: "Clínica MedNexus de Demostración · Medellín",
  signedAt: "02 nov 2026 · 14:32 COT",
  emergencyNumber: "+57 000 000 0000",
};
