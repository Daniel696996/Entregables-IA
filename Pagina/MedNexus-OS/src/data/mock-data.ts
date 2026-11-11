import type { Clinician, HospitalFacility, InventoryItem, Patient, PatientClinicalDetail, ProjectCollaborator } from "@/types/clinical";

// Perfiles, centros, atenciones e insumos completamente ficticios.
// La geografía colombiana se usa como contexto de demo, nunca como directorio real.
export const patients: Patient[] = [
  { id: "MN-CO-2048", name: "Elena Martínez", initials: "EM", age: 42, city: "Medellín", department: "Antioquia", blood: "O+", specialty: "Cardiología", reason: "Control cardiovascular de seguimiento", status: "inConsultation", time: "08:30", allergies: ["Penicilina"], conditions: ["Hipertensión controlada (dato simulado)"], doctor: "Dra. Valentina Ríos", color: "violet" },
  { id: "MN-CO-2051", name: "Julián Torres", initials: "JT", age: 29, city: "Envigado", department: "Antioquia", blood: "A−", specialty: "Ortopedia", reason: "Revisión de recuperación posoperatoria", status: "waiting", time: "09:00", allergies: [], conditions: ["Recuperación posquirúrgica (dato simulado)"], doctor: "Dr. Mateo Vélez", color: "blue" },
  { id: "MN-CO-2056", name: "Sofía Ramírez", initials: "SR", age: 67, city: "Rionegro", department: "Antioquia", blood: "B+", specialty: "Neurología", reason: "Control neurológico programado", status: "ready", time: "09:30", allergies: ["Látex"], conditions: ["Migraña crónica (dato simulado)"], doctor: "Dra. Laura Vélez", color: "green" },
  { id: "MN-CO-2060", name: "Andrés Gómez", initials: "AG", age: 51, city: "Medellín", department: "Antioquia", blood: "AB+", specialty: "Medicina interna", reason: "Consulta de seguimiento integral", status: "waiting", time: "10:15", allergies: [], conditions: ["Diabetes tipo 2 (dato simulado)"], doctor: "Dr. Samuel Ortiz", color: "amber" },
  { id: "MN-CO-2064", name: "Lucía Herrera", initials: "LH", age: 34, city: "Bello", department: "Antioquia", blood: "O−", specialty: "Dermatología", reason: "Valoración dermatológica", status: "ready", time: "11:00", allergies: ["Níquel"], conditions: [], doctor: "Dra. Isabella Cruz", color: "pink" },
  { id: "MN-CO-2072", name: "Tomás Cárdenas", initials: "TC", age: 8, city: "Medellín", department: "Antioquia", blood: "A+", specialty: "Pediatría", reason: "Control pediátrico preventivo", status: "waiting", time: "11:30", allergies: ["Polen (referido)"], conditions: [], doctor: "Dra. Andrea Salazar", color: "cyan" },
  { id: "MN-CO-2078", name: "Mariana Pardo", initials: "MP", age: 73, city: "La Ceja", department: "Antioquia", blood: "O+", specialty: "Medicina familiar", reason: "Revisión de atención domiciliaria", status: "ready", time: "12:00", allergies: [], conditions: ["Antecedente cardiovascular (simulado)"], doctor: "Dr. Felipe Arango", color: "rose" },
  { id: "MN-CO-2081", name: "David Muñoz", initials: "DM", age: 38, city: "Medellín", department: "Antioquia", blood: "B−", specialty: "Oftalmología", reason: "Seguimiento visual anual", status: "waiting", time: "13:15", allergies: [], conditions: [], doctor: "Dra. Natalia Parra", color: "blue" },
  { id: "MN-CO-2086", name: "Sara Quintero", initials: "SQ", age: 26, city: "Itagüí", department: "Antioquia", blood: "AB−", specialty: "Ginecología", reason: "Consulta de salud preventiva", status: "ready", time: "14:00", allergies: ["Yodo (referido)"], conditions: [], doctor: "Dra. Laura Vélez", color: "pink" },
  { id: "MN-CO-2093", name: "Miguel Ángel Castro", initials: "MC", age: 59, city: "Medellín", department: "Antioquia", blood: "A−", specialty: "Neumología", reason: "Revisión respiratoria programada", status: "waiting", time: "14:30", allergies: [], conditions: ["Asma (dato simulado)"], doctor: "Dr. Samuel Ortiz", color: "amber" },
  { id: "MN-CO-2098", name: "Daniela Gil", initials: "DG", age: 46, city: "Sabaneta", department: "Antioquia", blood: "O+", specialty: "Endocrinología", reason: "Control endocrino de seguimiento", status: "ready", time: "15:00", allergies: [], conditions: ["Hipotiroidismo (dato simulado)"], doctor: "Dra. Andrea Salazar", color: "violet" },
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
  { name: "José Daniel Pabón Villanueva", title: "Medicina general · Coordinación clínica", initials: "JP", experience: "Trayectoria por verificar · perfil principal de demostración", status: "available", department: "Coordinación médica", shift: "Mañana", color: "blue", portrait: "/jose-daniel-profile.jpg", credentials: ["Registro profesional pendiente de verificación", "Seguridad del paciente · referencia educativa de demo", "RCP avanzado · ejemplo no verificado"], research: "Línea ilustrativa de interés: coordinación clínica y seguridad del paciente.", demoCaseCount: 126 },
  { name: "Valentina Ríos", title: "Cardiología", initials: "VR", experience: "12 años · ecocardiografía y prevención cardiovascular (dato ficticio)", status: "available", department: "Centro cardiovascular", shift: "Mañana", color: "violet", portrait: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80", credentials: ["Ecocardiografía · referencia de perfil demo", "Seguridad del paciente · referencia educativa", "Certificaciones profesionales no verificadas"], research: "Área ilustrativa: prevención cardiovascular y ecocardiografía.", demoCaseCount: 94 },
  { name: "Mateo Vélez", title: "Ortopedia y trauma", initials: "MV", experience: "9 años · cirugía articular y rehabilitación (dato ficticio)", status: "surgery", department: "Unidad quirúrgica", shift: "Mañana", color: "blue", portrait: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80", credentials: ["Cirugía articular · referencia demo", "Rehabilitación musculoesquelética · referencia demo"], research: "Área ilustrativa: recuperación funcional y lesiones articulares.", demoCaseCount: 71 },
  { name: "Laura Vélez", title: "Neurología", initials: "LV", experience: "14 años · neurofisiología clínica (dato ficticio)", status: "available", department: "Neurociencias", shift: "Tarde", color: "green", portrait: "", credentials: ["Neurofisiología clínica · referencia demo", "Certificaciones profesionales no verificadas"], research: "Área ilustrativa: neurofisiología clínica y enfermedades del movimiento.", demoCaseCount: 88 },
  { name: "Samuel Ortiz", title: "Medicina interna", initials: "SO", experience: "8 años · cuidado de condiciones crónicas (dato ficticio)", status: "consult", department: "Clínica central", shift: "Mañana", color: "amber", portrait: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80", credentials: ["Atención de condiciones crónicas · referencia demo", "Certificaciones profesionales no verificadas"], research: "Área ilustrativa: continuidad del cuidado y multimorbilidad.", demoCaseCount: 63 },
  { name: "Isabella Cruz", title: "Dermatología", initials: "IC", experience: "7 años · dermatología clínica (dato ficticio)", status: "available", department: "Consulta externa", shift: "Tarde", color: "pink", portrait: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&h=160&q=80", credentials: ["Dermatología clínica · referencia demo", "Certificaciones profesionales no verificadas"], research: "Área ilustrativa: dermatosis inflamatorias y prevención.", demoCaseCount: 57 },
  { name: "Andrea Salazar", title: "Pediatría y endocrinología", initials: "AS", experience: "11 años · atención integral infantil (dato ficticio)", status: "available", department: "Unidad materno infantil", shift: "Mañana", color: "cyan", portrait: "", credentials: ["Atención pediátrica · referencia demo", "Certificaciones profesionales no verificadas"], research: "Área ilustrativa: crecimiento y prevención en salud infantil.", demoCaseCount: 76 },
  { name: "Felipe Arango", title: "Medicina familiar", initials: "FA", experience: "15 años · atención primaria y familiar", status: "consult", department: "Clínica central", shift: "Tarde", color: "rose", portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80" },
  { name: "Natalia Parra", title: "Oftalmología", initials: "NP", experience: "10 años · segmento anterior y prevención visual", status: "available", department: "Consulta externa", shift: "Tarde", color: "blue", portrait: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80" },
];

export const projectCollaborators: ProjectCollaborator[] = [
  { name: "Camilo Jaramillo", initials: "CJ", portrait: "/camilo-jaramillo-profile.png", title: "Médico · Especialista en Infraestructura y Redes", department: "Operaciones tecnológicas", role: "Administrador de red · demo", color: "blue", permissions: ["Supervisión de nodos", "Gestión de incidentes", "Lectura de telemetría"], activity: { reviews: 18, tasks: 12, availability: "available" } },
  { name: "José Daniel Pabón Villanueva", initials: "JP", portrait: "/jose-daniel-profile.jpg", title: "Administrador · Seguridad clínica", department: "Seguridad institucional", role: "Administrador de plataforma · demo", color: "blue", permissions: ["Control de seguridad clínica", "Gestión de usuarios y roles", "Auditoría y configuración de la demo"], activity: { reviews: 31, tasks: 26, availability: "available" } },
];

const patientStudyBySpecialty: Record<string, { title: string; bodyArea: string; model: PatientClinicalDetail["studies"][number]["model"]; summary: string }> = {
  Cardiología: { title: "Esquema cardiovascular", bodyArea: "Tórax · referencia educativa", model: "defibrillator", summary: "Ilustración de sistema de monitorización cardiovascular. No es un electrocardiograma ni un estudio del paciente." },
  Ortopedia: { title: "Radiografía ósea sintética", bodyArea: "Extremidad · referencia educativa", model: "fracture", summary: "Esquema de fractura para explorar el visor 3D. No corresponde a una imagen clínica real." },
  Neurología: { title: "Esquema neuroanatómico", bodyArea: "Sistema nervioso · referencia educativa", model: "cell", summary: "Ilustración celular para enseñanza. No representa tejido ni hallazgos de una persona." },
  "Medicina interna": { title: "Esquema anatómico general", bodyArea: "Referencia educativa", model: "cell", summary: "Modelo anatómico sintético. No constituye un estudio diagnóstico." },
  Dermatología: { title: "Esquema de tejido cutáneo", bodyArea: "Piel · referencia educativa", model: "cell", summary: "Ilustración celular genérica; no representa una lesión ni hallazgos dermatológicos." },
  "Pediatría y endocrinología": { title: "Esquema óseo pediátrico", bodyArea: "Extremidad · referencia educativa", model: "bone", summary: "Modelo anatómico sintético para explorar estructuras óseas, sin relación con un paciente real." },
  "Medicina familiar": { title: "Esquema respiratorio", bodyArea: "Tórax · referencia educativa", model: "lung", summary: "Ilustración sintética de pulmones para enseñanza, sin valor diagnóstico." },
  Oftalmología: { title: "Esquema celular ocular", bodyArea: "Referencia educativa", model: "cell", summary: "Modelo celular genérico. No es una fotografía ni un estudio oftalmológico." },
  Ginecología: { title: "Esquema anatómico", bodyArea: "Referencia educativa", model: "cell", summary: "Ilustración educativa sintética, no específica de una paciente." },
  Neumología: { title: "Esquema pulmonar", bodyArea: "Tórax · referencia educativa", model: "pneumonia", summary: "Esquema educativo de neumonía; no describe diagnóstico ni hallazgos de una persona." },
  Endocrinología: { title: "Esquema celular endocrino", bodyArea: "Referencia educativa", model: "cell", summary: "Ilustración celular genérica sin mediciones ni hallazgos clínicos." },
};

export const patientClinicalDetails: Record<string, PatientClinicalDetail> = Object.fromEntries(patients.map((patient, index) => {
  const study = patientStudyBySpecialty[patient.specialty] || patientStudyBySpecialty["Medicina interna"];
  const studyCatalog: PatientClinicalDetail["studies"] = [
    { date: "2026-10-22", title: "Radiografía sintética · lesión articular", bodyArea: "Articulación · caso educativo", model: "bone", summary: "Caso compuesto de demostración para explorar anatomía articular; no representa hallazgos de una persona." },
    { date: "2026-10-14", title: "Imagen pulmonar sintética · patrón ilustrativo", bodyArea: "Tórax · caso educativo", model: "pneumonia", summary: "Esquema pulmonar ilustrativo. No permite identificar una enfermedad ni sustituye la lectura radiológica." },
    { date: "2026-09-30", title: "Radiografía sintética · fractura compleja", bodyArea: "Extremidad · caso educativo", model: "fracture", summary: "Modelo visual de fractura para capacitación. No es una radiografía clínica ni una recomendación terapéutica." },
    { date: "2026-09-12", title: "Esquema respiratorio · variación pulmonar", bodyArea: "Tórax · caso educativo", model: "lung", summary: "Ilustración anatómica sintética para ampliar la variedad visual de la ficha." },
    { date: "2026-08-27", title: "Modelo de estructura ósea · articulación", bodyArea: "Sistema musculoesquelético · caso educativo", model: "osteoporosis", summary: "Modelo anatómico de demostración sin datos clínicos, mediciones ni interpretación diagnóstica." },
  ];
  const heartRate = 68 + ((index * 7) % 17);
  const systolic = 108 + ((index * 5) % 20);
  const diastolic = 68 + ((index * 3) % 14);
  const saturation = 96 + (index % 4);
  return [patient.id, {
    notes: [
      { date: "2026-11-08", type: "Evolución", author: patient.doctor, summary: `Nota de seguimiento ficticia para ${patient.specialty.toLocaleLowerCase()}; requiere revisión por profesional autorizado.` },
      { date: "2026-10-22", type: "Control", author: "Equipo de demostración", summary: "Se revisa continuidad del registro de ejemplo. Sin órdenes ni cambios terapéuticos reales." },
      { date: "2026-09-30", type: "Admisión", author: "Registro simulado", summary: "Ingreso de datos inventados para demostrar cronología y auditoría local." },
    ],
    vitals: [
      { date: "2026-11-08", bloodPressure: `${systolic}/${diastolic} mmHg`, heartRate: `${heartRate} lpm`, temperature: `${(36.4 + (index % 5) * 0.1).toFixed(1)} °C`, oxygenSaturation: `${saturation}%` },
      { date: "2026-10-22", bloodPressure: `${systolic - 2}/${diastolic} mmHg`, heartRate: `${heartRate + 2} lpm`, temperature: "36.6 °C", oxygenSaturation: "97%" },
      { date: "2026-09-30", bloodPressure: `${systolic + 1}/${diastolic + 1} mmHg`, heartRate: `${heartRate - 1} lpm`, temperature: "36.5 °C", oxygenSaturation: "98%" },
    ],
    studies: [
      { date: "2026-11-08", ...study },
      studyCatalog[index % studyCatalog.length],
      studyCatalog[(index + 2) % studyCatalog.length],
    ],
    activeTreatments: [
      "Seguimiento de cuidado no farmacológico · fixture de demostración",
      "Reconciliación terapéutica pendiente de revisión profesional · dato ficticio",
    ],
    activePlan: ["Seguimiento y plan de cuidado: dato de demostración sin orden médica.", "Validar cualquier información con el equipo tratante antes de tomar decisiones."],
    audit: [
      { date: "2026-11-08 09:42", action: "Consulta de expediente", actor: patient.doctor, result: "Acceso simulado autorizado" },
      { date: "2026-11-08 09:43", action: "Visualización de estudio educativo", actor: "Visor MedNexus demo", result: "Evento local de muestra" },
    ],
  } satisfies PatientClinicalDetail];
})) as Record<string, PatientClinicalDetail>;

export const medellinFacilities: HospitalFacility[] = [
  { id: "hptu", name: "Hospital Pablo Tobón Uribe", address: "Calle 78B No. 69–240, Robledo, Medellín", phone: "+57 604 445 9000", mapsQuery: "Hospital Pablo Tobón Uribe, Medellín", officialUrl: "https://hptu.org/pages/contacto", coordinates: { lat: 6.2763, lng: -75.5902 } },
  { id: "las-americas", name: "Clínica Las Américas Auna · sede 80", address: "Diagonal 75B No. 2A–80/140, Medellín", phone: "+57 604 342 1010", mapsQuery: "Clínica Las Américas Auna sede 80, Medellín", officialUrl: "https://www.lasamericas.com.co/nuestras-empresas/clinica-las-americas", coordinates: { lat: 6.2228, lng: -75.5964 } },
  { id: "san-vicente", name: "Hospital San Vicente Fundación · Medellín", address: "Calle 64 No. 51D–154, Medellín", phone: "+57 604 444 1333", mapsQuery: "Hospital San Vicente Fundación Medellín", officialUrl: "https://hospitalmedellin.sanvicentefundacion.com/contactanos", coordinates: { lat: 6.2697, lng: -75.5636 } },
  { id: "hospital-general", name: "Hospital General de Medellín", address: "Carrera 48 No. 32–102, Medellín", phone: "+57 604 384 7300", mapsQuery: "Hospital General de Medellín", officialUrl: "https://www.hgm.gov.co/tramites/2/pqrsdf/", coordinates: { lat: 6.2355, lng: -75.5683 } },
  { id: "el-rosario", name: "Clínica El Rosario · sede Tesoro", address: "Carrera 20 No. 2 Sur–185, Medellín", phone: "+57 604 326 9100", mapsQuery: "Clínica El Rosario sede Tesoro Medellín", officialUrl: "https://www.clinicaelrosario.com/la-clinica/nuestra-ubicacion/", coordinates: { lat: 6.1976, lng: -75.5594 } },
];

export const appointments = [
  { date: "2026-11-03", time: "07:00", patientId: "MN-CO-2051", service: "Cirugía · bloque histórico demo", room: "Quirófano 02", color: "blue" },
  { date: "2026-11-04", time: "08:00", patientId: "MN-CO-2056", service: "Neurología · control histórico demo", room: "Consultorio 212", color: "green" },
  { date: "2026-11-05", time: "08:30", patientId: "MN-CO-2048", service: "Cardiología", room: "Consultorio 204", color: "violet" },
  { date: "2026-11-05", time: "09:00", patientId: "MN-CO-2051", service: "Ortopedia", room: "Consultorio 208", color: "blue" },
  { date: "2026-11-05", time: "09:30", patientId: "MN-CO-2056", service: "Neurología", room: "Consultorio 212", color: "green" },
  { date: "2026-11-05", time: "10:15", patientId: "MN-CO-2060", service: "Medicina interna", room: "Consultorio 206", color: "amber" },
  { date: "2026-11-05", time: "11:00", patientId: "MN-CO-2064", service: "Dermatología", room: "Consultorio 201", color: "pink" },
  { date: "2026-11-09", time: "08:15", patientId: "MN-CO-2048", service: "Cardiología · control histórico demo", room: "Consultorio 204", color: "violet" },
  { date: "2026-11-10", time: "09:00", patientId: "MN-CO-2060", service: "Medicina interna · demostración", room: "Consultorio 206", color: "amber" },
  { date: "2026-11-10", time: "10:30", patientId: "MN-CO-2078", service: "Medicina familiar · demostración", room: "Consultorio 210", color: "rose" },
  { date: "2026-11-12", time: "13:30", patientId: "MN-CO-2093", service: "Neumología · demostración", room: "Consultorio 214", color: "cyan" },
];

export const rooms = [
  { date: "2026-11-03", name: "Quirófano 02", type: "Cirugía programada · demo", status: "Ocupado", time: "07:00–11:00", clinician: "Equipo de ortopedia", capacity: "Equipo clínico" },
  { date: "2026-11-04", name: "Consultorio 212", type: "Neurología", status: "Ocupado", time: "08:00–09:00", clinician: "Dra. Laura Vélez", capacity: "1 paciente" },
  { date: "2026-11-05", name: "Consultorio 204", type: "Consulta externa", status: "Ocupado", time: "08:30–09:30", clinician: "Dra. Valentina Ríos", capacity: "1 paciente" },
  { date: "2026-11-05", name: "Consultorio 208", type: "Ortopedia", status: "Ocupado", time: "09:00–10:00", clinician: "Dr. Mateo Vélez", capacity: "1 paciente" },
  { date: "2026-11-05", name: "Quirófano 02", type: "Cirugía programada", status: "Ocupado", time: "07:00–12:00", clinician: "Equipo de ortopedia", capacity: "Equipo clínico" },
  { date: "2026-11-05", name: "Consultorio 212", type: "Neurología", status: "Disponible", time: "10:00–13:00", clinician: "Dra. Laura Vélez", capacity: "1 paciente" },
  { date: "2026-11-05", name: "Sala de procedimientos 01", type: "Procedimientos", status: "Disponible", time: "12:00–16:00", clinician: "Asignación pendiente", capacity: "4 puestos" },
  { date: "2026-11-09", name: "Consultorio 204", type: "Cardiología", status: "Ocupado", time: "08:15–09:00", clinician: "Dra. Valentina Ríos", capacity: "1 paciente" },
  { date: "2026-11-10", name: "Consultorio 206", type: "Medicina interna", status: "Ocupado", time: "09:00–10:00", clinician: "Dr. Samuel Ortiz", capacity: "1 paciente" },
  { date: "2026-11-10", name: "Consultorio 210", type: "Medicina familiar", status: "Ocupado", time: "10:30–11:15", clinician: "Dr. Felipe Arango", capacity: "1 paciente" },
  { date: "2026-11-12", name: "Consultorio 214", type: "Neumología", status: "Disponible", time: "13:00–16:00", clinician: "Dr. Samuel Ortiz", capacity: "1 paciente" },
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
