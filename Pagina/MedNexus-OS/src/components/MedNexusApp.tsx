"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity, AlertCircle, AlertTriangle, ArrowRight, Bandage, CalendarDays, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Clock3, Cross, FileHeart, Filter, HeartPulse, Hospital,
  Languages, LayoutDashboard, LockKeyhole, MapPin, Menu, MessageCircle, Package, Phone, Search, ShieldCheck,
  ShoppingBag, Siren, Stethoscope, UserRound, Users, Video, X,
} from "lucide-react";
import { appointments, clinicians, inventory, patients, rooms } from "@/lib/clinical-repository";
import { fictionalPatient } from "@/data/mock-data";
import type { Clinician, InventoryItem, InventoryModel, Locale, Patient, PatientStatus, Role, Section } from "@/types/clinical";

// Canvas/WebGL se carga solo en el navegador: evita ejecutar R3F durante SSR
// y mantiene el resto del portal navegable si el equipo no soporta WebGL.
const MedicalScene = dynamic(() => import("@/components/MedicalScene"), {
  ssr: false,
  loading: () => <div className="scene-loading"><span className="loader" />Preparando escena 3D…</div>,
});

const words: Record<Locale, Record<string, string>> = {
  es: {
    workspace: "ESPACIO DE TRABAJO", clinical: "Clínico", patient: "Paciente", overview: "Resumen", patients: "Pacientes", inventory: "Inventario", team: "Equipo médico", schedule: "Agenda", portal: "Mi cuidado", booking: "Reservar cita", record: "Mi historia", support: "Ayuda segura", demo: "ENTORNO DE DEMOSTRACIÓN", secure: "Conexión institucional", welcome: "Buenos días, Dra. Valentina", welcomePatient: "Hola, Elena", dateLabel: "Jueves, 5 de noviembre · Clínica de demostración · Medellín", datePatient: "Tu cuidado, en un solo lugar", summary: "Panel clínico", patientSummary: "Resumen de salud", appointments: "Citas de hoy", viewAgenda: "Ver agenda", assigned: "Pacientes asignados", allPatients: "Todos los pacientes", availability: "Disponibilidad del equipo", roomStatus: "Ocupación de consultorios", roomValue: "8 de 12 en uso", operations: "Operación clínica", floor: "Vista general · Nivel 2", supplyWatch: "Insumos por reponer", criticalStock: "Existencias bajo el mínimo operativo", openInventory: "Revisar inventario", inventoryTitle: "Inventario clínico", inventorySub: "Medicamentos, insumos y equipos · Bodega de demostración", all: "Todos", medicines: "Medicamentos", supplies: "Insumos", equipment: "Equipos", critical: "Stock crítico", category: "Categoría", route: "Vía / especificación", stock: "Existencias", view3d: "Ver en 3D", reserve: "Solicitar", stockOk: "Disponible", stockLow: "Stock bajo", staffTitle: "Equipo médico", staffSub: "Directorio ficticio y disponibilidad del turno", allSpecialties: "Todas las especialidades", allShifts: "Todos los turnos", morning: "Mañana", afternoon: "Tarde", night: "Noche", available: "Disponible", surgery: "En cirugía", consult: "En consulta", profile: "Ver perfil", scheduleTitle: "Agenda clínica", scheduleSub: "Citas y recursos del día · Medellín, Colombia", roomsTitle: "Salas y quirófanos", room: "Consultorio", surgical: "Quirófano", occupied: "Ocupado", open: "Disponible", status: "Estado clínico", waiting: "En espera", ready: "Listo", inConsultation: "En consulta", allStatuses: "Todos los estados", searchPatient: "Nombre o código", patientPortal: "Portal del paciente", careTitle: "Tu espacio de salud", careSub: "Información y próximos pasos de tu atención", patientSub: "Seguimiento del turno · Datos de demostración", nextAppointment: "Próxima cita", nextDate: "Sábado, 7 de noviembre · 10:30", withDoctor: "Dra. Valentina Ríos · Cardiología", healthCard: "Tu perfil clínico", immutable: "Historial institucional firmado · Solo lectura", personalData: "Datos de identidad", blood: "Grupo sanguíneo", allergies: "Alergias registradas", conditions: "Antecedentes clínicos", signed: "Registro firmado por la clínica", history: "Historial clínico portable", historyNote: "Este registro fue firmado por la institución. Los antecedentes y diagnósticos son de solo lectura para proteger su integridad.", imaging: "Visualización clínica 3D", imagingNote: "Modelo anatómico sintético para demostración. No corresponde a una imagen médica real ni representa un diagnóstico.", openModel: "Abrir modelo 3D", bookingTitle: "Agenda tu atención", bookingSub: "Selecciona especialidad, profesional, fecha y modalidad", specialty: "Especialidad", chooseSpecialty: "Elige una especialidad", doctor: "Profesional", chooseDoctor: "Cualquier profesional disponible", date: "Fecha", modality: "Modalidad", inPerson: "Presencial", telehealth: "Teleconsulta", findTimes: "Buscar disponibilidad", availableSlot: "Horarios de demostración", confirmBooking: "Confirmar reserva de demostración", pharmacy: "Solicitar alistamiento", pharmacyNote: "Solicita el alistamiento de un medicamento previamente recetado para recoger en la clínica. La demo no genera prescripciones.", reserveMed: "Ver catálogo", equipmentHome: "Apoyo para tu cuidado", equipmentNote: "Consulta disponibilidad ficticia de equipos de apoyo, tallas y modelos.", browseSupport: "Explorar equipos", demoNotice: "Datos ficticios · No usar para decisiones clínicas", noResults: "No hay resultados para estos filtros.", close: "Cerrar", dragHint: "Arrastra para rotar · Rueda para acercar", component: "Componentes ilustrativos", annotation: "Anotación demostrativa", diagnosis: "Área anatómica ilustrativa", noDiagnosis: "Ilustración educativa · Sin valor diagnóstico", auth: "Firma institucional simulada", revision: "Versión de demo 1.0 · 02 nov 2026", immutableTag: "INMUTABLE", requestSent: "Solicitud registrada solo en esta demostración.", bookingSent: "Reserva ficticia confirmada en esta demostración.", filterStaff: "Filtra por especialidad, turno o disponibilidad", allDepartments: "Todos los departamentos", resource: "Espacio", service: "Servicio", period: "Horario", capacity: "Capacidad", today: "JUEVES · 05 NOV 2026", careTeam: "Tu equipo de cuidado", clinicalVisual: "Laboratorio visual clínico", surgicalPlan: "Programación quirúrgica", teamStatus: "Estado del turno", inventoryStats: "Catálogo operativo", references: "referencias", monitoring: "Seguimiento", floorPlan: "CLÍNICA DE DEMOSTRACIÓN · MEDELLÍN", clinicalWorkspace: "ESTACIÓN CLÍNICA", patientWorkspace: "CUIDADO PERSONAL", emergency: "Orientación de seguridad", loading: "Preparando escena 3D…", objectLabel: "OBJETO INTERACTIVO", patientRecord: "Registro clínico", reviewedBy: "Validado por", medication: "Medicamento", medicalSupply: "Insumo médico", medicalEquipment: "Equipo médico", reset: "Restablecer vista", modelDetail: "Modelo tridimensional de referencia para explorar el catálogo.", carePersonal: "Atención pensada para ti", personalDescription: "Tu información de demostración está organizada para que encuentres lo que necesitas.", noAppointments: "Sin citas próximas en esta demostración", externalData: "Este prototipo no se conecta a sistemas clínicos externos.", emergencyText: "Si necesitas atención urgente, acude al centro hospitalario más cercano. En una emergencia real, llama a los servicios de emergencia locales para solicitar una ambulancia. Esta demostración no se comunica con hospitales ni ambulancias.", simulateCall: "Simular llamada de orientación", fakeNumber: "+57 000 000 0000", fakeNumberNote: "Número inválido, solo ilustrativo · no llama a ningún servicio", callTitle: "Orientación telefónica simulada", callConnect: "Conectando con el centro de demostración…", callActive: "Llamada de demostración activa", endCall: "Finalizar simulación", callEnded: "Simulación finalizada", urgent: "¿Necesitas atención ahora?", urgentSub: "Acude al centro hospitalario más cercano ante una urgencia. Esta demo no es un servicio médico.", urgentCTA: "Ver opciones de ayuda", dataOf: "Datos ficticios de", eps: "Aseguradora de demo", identity: "Identidad", noEdit: "La historia firmada no se puede editar desde el portal.", noDiagnosisReal: "MedNexus OS no entrega diagnósticos ni recomienda tratamientos o dosis.", nearest: "Centro hospitalario más cercano", noCall: "No se realiza una llamada real", appointmentReason: "Motivo de consulta", filters: "Filtros avanzados", clearFilters: "Limpiar filtros", sortBy: "Ordenar por", criticalOnly: "Mostrar solo stock crítico", categoryAll: "Todas las categorías", routeAll: "Todas las vías", specialtyAll: "Todas las especialidades", countPatients: "pacientes", inventoryCount: "referencias", staffCount: "profesionales", more: "Ver todos", requested: "Solicitud simulada", confirmed: "Confirmación", callSafety: "Este canal es ilustrativo. Para ayuda urgente real, acude al hospital cercano o contacta el servicio de emergencias local.",
    patientTitle: "Tablero de pacientes",
  },
  en: {
    workspace: "WORKSPACE", clinical: "Clinical", patient: "Patient", overview: "Overview", patients: "Patients", inventory: "Inventory", team: "Care team", schedule: "Schedule", portal: "My care", booking: "Book appointment", record: "My record", support: "Safe help", demo: "DEMO ENVIRONMENT", secure: "Institutional connection", welcome: "Good morning, Dr. Valentina", welcomePatient: "Hello, Elena", dateLabel: "Thursday, November 5 · Demonstration clinic · Medellín", datePatient: "Your care, in one place", summary: "Clinical overview", patientSummary: "Health summary", appointments: "Today's appointments", viewAgenda: "View schedule", assigned: "Assigned patients", allPatients: "All patients", availability: "Care team availability", roomStatus: "Clinic room occupancy", roomValue: "8 of 12 in use", operations: "Clinical operations", floor: "Overview · Level 2", supplyWatch: "Supplies to replenish", criticalStock: "Stock below the operating minimum", openInventory: "Review inventory", inventoryTitle: "Clinical inventory", inventorySub: "Medicines, supplies and equipment · Demo storage", all: "All", medicines: "Medicines", supplies: "Supplies", equipment: "Equipment", critical: "Low stock", category: "Category", route: "Route / specification", stock: "Stock", view3d: "View in 3D", reserve: "Request", stockOk: "Available", stockLow: "Low stock", staffTitle: "Care team", staffSub: "Fictional directory and shift availability", allSpecialties: "All specialties", allShifts: "All shifts", morning: "Morning", afternoon: "Afternoon", night: "Night", available: "Available", surgery: "In surgery", consult: "In consultation", profile: "View profile", scheduleTitle: "Clinical schedule", scheduleSub: "Appointments and resources · Medellín, Colombia", patientSub: "Shift tracking · Demonstration data", roomsTitle: "Rooms and operating theatres", room: "Clinic room", surgical: "Operating theatre", occupied: "In use", open: "Available", status: "Clinical status", waiting: "Waiting", ready: "Ready", inConsultation: "In consultation", allStatuses: "All statuses", searchPatient: "Name or code", patientPortal: "Patient portal", careTitle: "Your health space", careSub: "Information and next steps in your care", nextAppointment: "Next appointment", nextDate: "Saturday, November 7 · 10:30", withDoctor: "Dr. Valentina Ríos · Cardiology", healthCard: "Your clinical profile", immutable: "Institutionally signed record · Read only", personalData: "Identity details", blood: "Blood type", allergies: "Recorded allergies", conditions: "Clinical history", signed: "Record signed by the clinic", history: "Portable clinical history", historyNote: "This record was signed by the institution. History and diagnoses are read-only to protect their integrity.", imaging: "3D clinical visualization", imagingNote: "Synthetic anatomical model for demonstration. It is not a real medical image and does not represent a diagnosis.", openModel: "Open 3D model", bookingTitle: "Book your care", bookingSub: "Select specialty, clinician, date and modality", specialty: "Specialty", chooseSpecialty: "Choose a specialty", doctor: "Clinician", chooseDoctor: "Any available clinician", date: "Date", modality: "Modality", inPerson: "In person", telehealth: "Telehealth", findTimes: "Find availability", availableSlot: "Demo appointment times", confirmBooking: "Confirm demo booking", pharmacy: "Request preparation", pharmacyNote: "Request preparation of a previously prescribed medicine for clinic pickup. This demo does not create prescriptions.", reserveMed: "View catalogue", equipmentHome: "Support for your care", equipmentNote: "Check fictional availability of support equipment, sizes and models.", browseSupport: "Browse equipment", demoNotice: "Fictional data · Not for clinical decisions", noResults: "No results match these filters.", close: "Close", dragHint: "Drag to rotate · Scroll to zoom", component: "Illustrative components", annotation: "Demo annotation", diagnosis: "Illustrative anatomical area", noDiagnosis: "Educational illustration · Not diagnostic", auth: "Simulated institutional signature", revision: "Demo version 1.0 · Nov 2, 2026", immutableTag: "IMMUTABLE", requestSent: "Request recorded in this demo only.", bookingSent: "Fictional booking confirmed in this demo.", filterStaff: "Filter by specialty, shift or availability", allDepartments: "All departments", resource: "Resource", service: "Service", period: "Time", capacity: "Capacity", today: "THURSDAY · NOV 05 2026", careTeam: "Your care team", clinicalVisual: "Clinical visual lab", surgicalPlan: "Operating schedule", teamStatus: "Shift status", inventoryStats: "Operating catalogue", references: "references", monitoring: "Monitoring", floorPlan: "DEMONSTRATION CLINIC · MEDELLÍN", clinicalWorkspace: "CLINICAL STATION", patientWorkspace: "PERSONAL CARE", emergency: "Safety guidance", loading: "Preparing 3D scene…", objectLabel: "INTERACTIVE OBJECT", patientRecord: "Clinical record", reviewedBy: "Reviewed by", medication: "Medicine", medicalSupply: "Medical supply", medicalEquipment: "Medical equipment", reset: "Reset view", modelDetail: "Reference 3D model for exploring the catalogue.", carePersonal: "Care designed around you", personalDescription: "Your demo information is organized to help you find what you need.", noAppointments: "No upcoming appointments in this demo", externalData: "This prototype does not connect to external clinical systems.", emergencyText: "If you need urgent care, go to the nearest hospital. In a real emergency, contact your local emergency services to request an ambulance. This demo does not communicate with hospitals or ambulances.", simulateCall: "Simulate guidance call", fakeNumber: "+57 000 000 0000", fakeNumberNote: "Invalid number, for illustration only · no service will be called", callTitle: "Simulated phone guidance", callConnect: "Connecting to the demo center…", callActive: "Demo call active", endCall: "End simulation", callEnded: "Simulation ended", urgent: "Need help now?", urgentSub: "Go to the nearest hospital in an emergency. This demo is not a medical service.", urgentCTA: "View help options", dataOf: "Fictional data for", eps: "Demo insurer", identity: "Identity", noEdit: "The signed record cannot be edited from the portal.", noDiagnosisReal: "MedNexus OS does not diagnose or recommend treatment or dosage.", nearest: "Nearest hospital", noCall: "No real call is made", appointmentReason: "Visit reason", filters: "Advanced filters", clearFilters: "Clear filters", sortBy: "Sort by", criticalOnly: "Show low stock only", categoryAll: "All categories", routeAll: "All routes", specialtyAll: "All specialties", countPatients: "patients", inventoryCount: "references", staffCount: "clinicians", more: "View all", requested: "Demo request", confirmed: "Confirmation", callSafety: "This channel is illustrative. For a real urgent need, go to a nearby hospital or contact local emergency services.",
    patientTitle: "Patient board",
  }
};

type ModalState =
  | { kind: "model"; title: string; model: InventoryModel; description: string; clinical?: boolean }
  | { kind: "call" }
  | { kind: "clinician"; clinician: Clinician }
  | { kind: "patient"; patient: Patient }
  | null;

const statusText: Record<Locale, Record<string, string>> = {
  es: { available: "Disponible", surgery: "En cirugía", consult: "En consulta", waiting: "En espera", ready: "Listo", inConsultation: "En consulta" },
  en: { available: "Available", surgery: "In surgery", consult: "In consultation", waiting: "Waiting", ready: "Ready", inConsultation: "In consultation" },
};

const englishValues: Record<string, string> = {
  Cardiología: "Cardiology", "Ortopedia y trauma": "Orthopedics and trauma", Ortopedia: "Orthopedics",
  Neurología: "Neurology", "Medicina interna": "Internal medicine", Dermatología: "Dermatology",
  Pediatría: "Pediatrics", "Pediatría y endocrinología": "Pediatrics and endocrinology",
  "Medicina familiar": "Family medicine", Oftalmología: "Ophthalmology", Ginecología: "Gynecology",
  Neumología: "Pulmonology", Endocrinología: "Endocrinology",
  "Centro cardiovascular": "Cardiac center", "Unidad quirúrgica": "Surgical unit",
  Neurociencias: "Neurosciences", "Clínica central": "Central clinic",
  "Consulta externa": "Outpatient clinic", "Unidad materno infantil": "Maternal and child unit",
  Soluciones: "Solutions", Antibióticos: "Antibiotics", Anestésicos: "Anesthetics",
  Analgésicos: "Pain relief", Insumos: "Supplies", Equipos: "Equipment",
  Protección: "Protective equipment", Apoyo: "Mobility support",
  Instrumental: "Instruments", Intravenosa: "Intravenous", Infiltración: "Injection",
  Estéril: "Sterile", Batería: "Battery", Tallas: "Sizes", Calibre: "Gauge",
  "Cloruro de sodio 0,9%": "Sodium chloride 0.9%", "Amoxicilina 500 mg": "Amoxicillin 500 mg",
  "Lidocaína 2%": "Lidocaine 2%", "Acetaminofén 500 mg": "Acetaminophen 500 mg",
  "Jeringa de precisión": "Precision syringe", "Aguja hipodérmica": "Hypodermic needle",
  "Desfibrilador portátil": "Portable defibrillator", "Prótesis de cadera modular": "Modular hip prosthesis",
  "Guantes de nitrilo": "Nitrile gloves", "Muletas ajustables": "Adjustable crutches",
  "Silla de ruedas plegable": "Folding wheelchair", "Bisturí desechable": "Disposable scalpel",
  "Control cardiovascular de seguimiento": "Cardiovascular follow-up",
  "Revisión de recuperación posoperatoria": "Post-operative recovery review",
  "Control neurológico programado": "Scheduled neurology follow-up",
  "Consulta de seguimiento integral": "Comprehensive follow-up visit",
  "Valoración dermatológica": "Dermatology assessment", "Control pediátrico preventivo": "Preventive pediatric check-up",
  "Revisión de atención domiciliaria": "Home-care follow-up", "Seguimiento visual anual": "Annual vision follow-up",
  "Consulta de salud preventiva": "Preventive health visit", "Revisión respiratoria programada": "Scheduled respiratory follow-up",
  "Control endocrino de seguimiento": "Endocrinology follow-up",
  "Hipertensión controlada (dato simulado)": "Controlled hypertension (simulated)",
  "Recuperación posquirúrgica (dato simulado)": "Post-surgical recovery (simulated)",
  "Migraña crónica (dato simulado)": "Chronic migraine (simulated)",
  "Diabetes tipo 2 (dato simulado)": "Type 2 diabetes (simulated)",
  "Asma (dato simulado)": "Asthma (simulated)",
  "Hipotiroidismo (dato simulado)": "Hypothyroidism (simulated)",
  "Penicilina (ejemplo ficticio)": "Penicillin (fictional example)",
  "Látex": "Latex", "Polen (referido)": "Pollen (reported)", "Níquel": "Nickel", "Yodo (referido)": "Iodine (reported)",
  "Salud de Demostración EPS": "Demonstration insurer",
  "12 años · ecocardiografía y prevención cardiovascular": "12 years · echocardiography and cardiovascular prevention",
  "9 años · cirugía articular y rehabilitación": "9 years · joint surgery and rehabilitation",
  "14 años · neurofisiología clínica": "14 years · clinical neurophysiology",
  "8 años · cuidado de condiciones crónicas": "8 years · chronic care",
  "7 años · dermatología clínica": "7 years · clinical dermatology",
  "11 años · atención integral infantil": "11 years · comprehensive pediatric care",
  "15 años · atención primaria y familiar": "15 years · primary and family care",
  "10 años · segmento anterior y prevención visual": "10 years · anterior segment and vision prevention",
  "Ocupado": "In use", "Disponible": "Available",
  "Consultorio 204": "Clinic room 204", "Consultorio 208": "Clinic room 208",
  "Consultorio 212": "Clinic room 212", "Consultorio 206": "Clinic room 206",
  "Consultorio 201": "Clinic room 201", "Quirófano 02": "Operating theatre 02",
  "Sala de procedimientos 01": "Procedure room 01",
  "Cirugía programada": "Scheduled surgery", Procedimientos: "Procedures",
  "07:00–12:00": "07:00–12:00", "Asignación pendiente": "Assignment pending",
  "1 paciente": "1 patient", "4 puestos": "4 stations", "Equipo clínico": "Care team",
  "Control cardiovascular": "Cardiovascular follow-up", "Seguimiento de rodilla": "Knee follow-up",
  "Revisión neurológica": "Neurology follow-up", "Consulta de seguimiento": "Follow-up visit",
  "Conexión Luer Lock · polipropileno de grado médico · modelo 3D ilustrativo.": "Luer Lock connection · medical-grade polypropylene · illustrative 3D model.",
  "Monitorización ilustrativa · accesorios adulto/pediátrico de demostración.": "Illustrative monitor · demo adult/pediatric accessories.",
  "Configuración modular ilustrativa en titanio grado implante.": "Illustrative modular configuration in implant-grade titanium.",
  "Sin látex · variaciones por talla disponibles en esta muestra.": "Latex-free · size variations available in this sample.",
  "Aluminio ligero · altura regulable · disponibilidad ficticia.": "Lightweight aluminum · adjustable height · fictional availability.",
};

  function localized(value: string, locale: Locale) {
  if (locale === "es") return value;
  if (englishValues[value]) return englishValues[value];
  const prefixes: Record<string, string> = {
    Intravenosa: "Intravenous", "Oral ·": "Oral ·", Infiltración: "Injection",
    Estéril: "Sterile", Batería: "Battery", Tallas: "Sizes", Calibre: "Gauge",
  };
  const prefix = Object.keys(prefixes).find((key) => value.startsWith(key));
  if (!prefix) return value;
  const rest = value.slice(prefix.length).replace("bolsa", "bag").replace("cápsulas", "capsules").replace("tabletas", "tablets").replace("vial", "vial").replace("unidades", "units").replace("caja", "box").replace("pares", "pairs").replace("acero inoxidable", "stainless steel").replace("polipropileno grado médico", "medical-grade polypropylene");
  return prefixes[prefix] + rest;
}

const specialties = Array.from(new Set(clinicians.map((clinician) => clinician.title)));
const categories = Array.from(new Set(inventory.map((item) => item.category)));
const routes = Array.from(new Set(inventory.map((item) => item.route.split(" · ")[0])));

function initialsAvatar(initials: string, color: string, portrait?: string) {
  return <div className={"avatar avatar-" + color + (portrait ? " avatar-photo" : "")} style={portrait ? { backgroundImage: "url(" + portrait + ")" } : undefined} aria-label={initials}>{portrait ? <span className="avatar-photo-initials">{initials}</span> : initials}</div>;
}

export default function MedNexusApp() {
  const [locale, setLocale] = useState<Locale>("es");
  const [role, setRole] = useState<Role>("clinical");
  const [section, setSection] = useState<Section>("overview");
  const [inventoryType, setInventoryType] = useState("all");
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState("all");
  const [inventoryRoute, setInventoryRoute] = useState("all");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientStatus, setPatientStatus] = useState("all");
  const [staffSpecialty, setStaffSpecialty] = useState("all");
  const [staffShift, setStaffShift] = useState("all");
  const [staffStatus, setStaffStatus] = useState("all");
  const [bookingSpecialty, setBookingSpecialty] = useState("");
  const [bookingDoctor, setBookingDoctor] = useState("");
  const [bookingModality, setBookingModality] = useState("Presencial");
  const [bookingDate, setBookingDate] = useState("2026-11-07");
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [callActive, setCallActive] = useState(false);
  const [callElapsed, setCallElapsed] = useState(0);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const t = (key: string) => words[locale][key] || key;

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 3200); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!callActive) return; const timer = window.setInterval(() => setCallElapsed((value) => value + 1), 1000); return () => window.clearInterval(timer); }, [callActive]);
  useEffect(() => {
    if (!modal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (modal.kind === "call") {
        setCallActive(false);
        setToast(words[locale].callEnded);
      }
      setModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, locale]);

  // Lógica combinada del catálogo:
  // - Las coincidencias del texto se evalúan con OR entre nombre, código, tipo,
  //   ruta y SKU para que una sola palabra encuentre referencias relacionadas.
  // - Después, tipo, categoría, ruta y stock crítico se combinan con AND.
  // - Los valores originales de los filtros no se traducen; la traducción solo
  //   cambia la etiqueta visible y nunca altera los resultados en español/inglés.
  // - El umbral es inclusivo: stock igual al mínimo también pide revisión.
  const filteredInventory = useMemo(() => inventory.filter((item) => {
    const query = inventoryQuery.trim().toLocaleLowerCase();
    const queryMatch = !query || [item.name, item.id, item.category, item.route, item.sku].some((value) => value.toLocaleLowerCase().includes(query));
    return queryMatch && (inventoryType === "all" || item.type === inventoryType) && (inventoryCategory === "all" || item.category === inventoryCategory) && (inventoryRoute === "all" || item.route.startsWith(inventoryRoute)) && (!criticalOnly || item.stock <= item.threshold);
  }), [inventoryQuery, inventoryType, inventoryCategory, inventoryRoute, criticalOnly]);

  // La búsqueda de pacientes encuentra cualquier fragmento en identidad,
  // código ficticio, ciudad o especialidad; el estado se aplica como segundo
  // criterio obligatorio para combinar filtros sin perder resultados.
  const filteredPatients = useMemo(() => patients.filter((person) => {
    const query = patientQuery.trim().toLocaleLowerCase();
    return (!query || [person.name, person.id, person.city, person.specialty].some((value) => value.toLocaleLowerCase().includes(query))) && (patientStatus === "all" || person.status === patientStatus);
  }), [patientQuery, patientStatus]);

  // El directorio aplica los tres filtros simultáneamente. Los valores
  // localizados de los selects conservan como value el dato canónico del fixture.
  const filteredClinicians = useMemo(() => clinicians.filter((person) => {
    return (staffSpecialty === "all" || person.title === staffSpecialty) && (staffShift === "all" || person.shift === staffShift) && (staffStatus === "all" || person.status === staffStatus);
  }), [staffSpecialty, staffShift, staffStatus]);

  const navItems: { key: Section; icon: ReactNode; label: string }[] = role === "clinical"
    ? [
      { key: "overview", icon: <LayoutDashboard />, label: t("overview") },
      { key: "patients", icon: <Users />, label: t("patients") },
      { key: "inventory", icon: <Package />, label: t("inventory") },
      { key: "team", icon: <Stethoscope />, label: t("team") },
      { key: "schedule", icon: <CalendarDays />, label: t("schedule") },
    ]
    : [
      { key: "care", icon: <HeartPulse />, label: t("portal") },
      { key: "booking", icon: <CalendarDays />, label: t("booking") },
      { key: "record", icon: <FileHeart />, label: t("record") },
      { key: "inventory", icon: <Package />, label: t("equipment") },
      { key: "support", icon: <CircleHelp />, label: t("support") },
    ];

  function switchRole(nextRole: Role) {
    setRole(nextRole);
    setSection(nextRole === "clinical" ? "overview" : "care");
    setMobileNav(false);
  }

  function openItem(item: InventoryItem) {
    setModal({ kind: "model", title: localized(item.name, locale), model: item.model, description: localized(item.detail, locale) });
  }

  function openClinicalModel() {
    setModal({ kind: "model", title: locale === "es" ? "Modelo anatómico ilustrativo" : "Illustrative anatomical model", model: "bone", description: t("imagingNote"), clinical: true });
  }

  function simulateCall() {
    setCallElapsed(0);
    setCallActive(true);
    setModal({ kind: "call" });
  }

  function finishCall() {
    setCallActive(false);
    setToast(t("callEnded"));
    setModal(null);
  }

  const shellTitle = section === "inventory" ? t("inventoryTitle")
    : section === "patients" ? t("patientTitle")
      : section === "team" ? t("staffTitle")
        : section === "schedule" ? t("scheduleTitle")
          : section === "booking" ? t("bookingTitle")
            : section === "record" ? t("history")
              : section === "support" ? t("emergency")
                : role === "clinical" ? t("summary") : t("careTitle");

  function renderInventory() {
    return <section className="content-area">
      <PageHeading eyebrow={role === "patient" ? t("patientPortal") : t("clinicalWorkspace")} title={t("inventoryTitle")} subtitle={t("inventorySub")} />
      <div className="inventory-toolbar glass">
        <div className="filter-tabs">
          {[["all", t("all")], ["medicine", t("medicines")], ["supply", t("supplies")], ["equipment", t("equipment")]].map(([value, label]) => <button key={value} className={"filter-tab " + (inventoryType === value ? "active" : "")} onClick={() => setInventoryType(value)}>{label}</button>)}
        </div>
        <div className="toolbar-controls">
          <label className="search-control"><Search size={16} /><input value={inventoryQuery} onChange={(event) => setInventoryQuery(event.target.value)} placeholder={locale === "es" ? "Nombre, código o especificación" : "Name, code or specification"} /></label>
          <select value={inventoryCategory} onChange={(event) => setInventoryCategory(event.target.value)} aria-label={t("category")}><option value="all">{t("categoryAll")}</option>{categories.map((category) => <option key={category} value={category}>{localized(category, locale)}</option>)}</select>
          <select value={inventoryRoute} onChange={(event) => setInventoryRoute(event.target.value)} aria-label={t("route") + " filter"}><option value="all">{t("routeAll")}</option>{routes.map((route) => <option key={route} value={route}>{localized(route, locale)}</option>)}</select>
          <label className="check-filter"><input type="checkbox" checked={criticalOnly} onChange={(event) => setCriticalOnly(event.target.checked)} /><span>{t("criticalOnly")}</span></label>
        </div>
      </div>
      <div className="inventory-result-line"><span><b>{filteredInventory.length}</b> {t("inventoryCount")}</span><span><span className="legend-dot cyan-dot" /> {t("stockOk")} <span className="legend-dot amber-dot" /> {t("stockLow")}</span></div>
      {filteredInventory.length ? <div className="inventory-grid">{filteredInventory.map((item) => {
        const isLow = item.stock <= item.threshold;
        const kind = item.type === "medicine" ? t("medication") : item.type === "supply" ? t("medicalSupply") : t("medicalEquipment");
        return <article key={item.id} className="inventory-card glass">
          <div className="inventory-card-top"><div className={"supply-icon icon-" + item.color}>{item.icon}</div><span className={"stock-pill " + (isLow ? "low" : "good")}><i />{isLow ? t("stockLow") : t("stockOk")}</span></div>
          <div className="item-kind">{kind} <span>·</span> {localized(item.category, locale)}</div>
          <h3>{localized(item.name, locale)}</h3><p className="item-route">{localized(item.route, locale)}</p>
          <div className="item-stock-row"><span>{t("stock")}</span><b className={isLow ? "stock-number low-text" : "stock-number"}>{item.stock} <small>{item.unit}</small></b></div>
          <div className="stock-meter"><span style={{ width: Math.min(100, item.stock / Math.max(item.threshold * 2, 1) * 100) + "%" }} className={isLow ? "meter-low" : ""} /></div>
          <div className="inventory-card-footer"><span className="sku">{item.id} · {item.sku}</span><button className="button button-secondary button-small" onClick={() => role === "clinical" ? openItem(item) : setToast(t("requestSent"))}>{role === "clinical" ? t("view3d") : t("reserve")} <ArrowRight size={14} /></button></div>
          {role === "clinical" && <button className="model-preview" onClick={() => openItem(item)}><span className="preview-orbit"><Package size={18} /></span><span>{locale === "es" ? "Explorar modelo" : "Explore model"}</span><span className="model-tag">3D</span></button>}
        </article>;
      })}</div> : <EmptyState text={t("noResults")} />}
    </section>;
  }

  function renderPatientRows(list: Patient[]) {
    return list.map((person) => <tr key={person.id}>
      <td><button className="patient-name-button" onClick={() => setModal({ kind: "patient", patient: person })}>{initialsAvatar(person.initials, person.color)}<span><b>{person.name}</b><small>{person.id} · {person.age} {locale === "es" ? "años" : "yrs"} · {person.city}</small></span></button></td>
      <td><span className="specialty-badge">{localized(person.specialty, locale)}</span></td>
      <td><span className="status-label"><i className={"status-dot " + person.status} />{statusText[locale][person.status]}</span></td>
      <td>{person.time}</td>
      <td className="reason-cell">{localized(person.reason, locale)}</td>
      <td><button className="icon-button tiny" aria-label={t("profile")} onClick={() => setModal({ kind: "patient", patient: person })}><ArrowRight size={15} /></button></td>
    </tr>);
  }

  function renderTeamCards() {
    return filteredClinicians.map((person) => <article className="clinician-card glass" key={person.name}>
      <div className="clinician-card-head">{initialsAvatar(person.initials, person.color, person.portrait)}<span className={"status-pill " + person.status}><i />{statusText[locale][person.status]}</span></div>
      <h3>{person.name}</h3><div className="clinician-specialty">{localized(person.title, locale)}</div><p>{localized(person.experience, locale)}</p>
      <div className="clinician-meta"><span><Hospital size={14} />{localized(person.department, locale)}</span><span><Clock3 size={14} />{locale === "es" ? person.shift : person.shift === "Mañana" ? "Morning" : person.shift === "Tarde" ? "Afternoon" : "Night"}</span></div>
      <button className="button button-secondary full-button" onClick={() => setModal({ kind: "clinician", clinician: person })}>{t("profile")} <ArrowRight size={14} /></button>
    </article>);
  }

  function renderOverview() {
    if (role === "patient") return renderCareHome();
    const lowCount = inventory.filter((item) => item.stock <= item.threshold).length;
    const readyCount = patients.filter((patient) => patient.status === "ready").length;
    return <section className="content-area">
      <div className="welcome-row"><div><span className="eyebrow"><span className="pulse-dot" />{t("clinicalWorkspace")}</span><h1>{t("welcome")}</h1><p>{t("dateLabel")}</p></div><div className="date-chip"><CalendarDays size={16} />{t("today")}</div></div>
      <div className="stat-grid">
        <StatCard icon={<CalendarDays />} label={t("appointments")} value="18" change="+3" color="cyan" foot={locale === "es" ? "en la jornada" : "today"} spark="M0 26 C10 22 12 27 20 18 S32 20 38 14 S50 17 56 8 S69 13 76 4" />
        <StatCard icon={<Users />} label={t("assigned")} value={String(patients.length).padStart(2, "0")} change={String(readyCount)} color="violet" foot={locale === "es" ? "listos para atención" : "ready for care"} spark="M0 24 C10 18 12 24 20 19 S33 23 39 12 S50 18 56 10 S66 15 76 5" />
        <StatCard icon={<Package />} label={t("supplyWatch")} value={String(lowCount).padStart(2, "0")} change={locale === "es" ? "Atención" : "Watch"} color="amber" foot={t("criticalStock")} spark="M0 20 C10 19 14 21 20 14 S31 20 38 16 S47 8 56 12 S66 6 76 3" />
        <StatCard icon={<Activity />} label={t("availability")} value="06" change="82%" color="green" foot={locale === "es" ? "equipo en turno" : "team on shift"} spark="M0 22 C8 17 14 25 20 16 S31 17 38 12 S49 17 56 8 S68 13 76 4" />
      </div>
      <div className="dashboard-grid">
        <section className="panel glass agenda-panel"><PanelHeader title={t("appointments")} sub={t("dateLabel")} action={t("viewAgenda")} onAction={() => setSection("schedule")} /><div className="agenda-list">{appointments.slice(0, 4).map((apt) => {
          const person = patients.find((patient) => patient.id === apt.patientId);
          return <div className="agenda-row" key={apt.patientId}><div className="agenda-time">{apt.time}<span /></div><div className={"agenda-marker marker-" + apt.color} /><div className="agenda-info"><b>{person?.name}</b><span>{localized(apt.service, locale)} <i>·</i> {localized(person?.reason || "", locale)}</span></div><span className="agenda-room">{localized(apt.room, locale)}</span></div>;
        })}</div><button className="text-link" onClick={() => setSection("schedule")}>{t("viewAgenda")} <ArrowRight size={14} /></button></section>
        <section className="panel glass occupancy-panel"><PanelHeader title={t("roomStatus")} sub={t("floor")} /><div className="occupancy-main"><div className="occupancy-ring"><span><b>67</b><small>%</small></span></div><div className="occupancy-data"><b>{t("roomValue")}</b><span><i className="legend-dot cyan-dot" />{locale === "es" ? "Consultorios" : "Clinic rooms"}</span><span><i className="legend-dot muted-dot" />{locale === "es" ? "Quirófanos" : "Operating theatres"}</span></div></div><div className="room-bars">{[["Consulta externa", 74], ["Unidad quirúrgica", 56], ["Diagnóstico", 34]].map(([name, value]) => <div className="room-bar-row" key={name as string}><span>{name}</span><div className="bar-track"><i style={{ width: value + "%" }} /></div><small>{value}%</small></div>)}</div></section>
        <section className="panel glass patient-panel"><PanelHeader title={t("assigned")} sub={t("patientSub")} action={t("more")} onAction={() => setSection("patients")} /><div className="mini-patient-list">{patients.slice(0, 4).map((person) => <button className="mini-patient" key={person.id} onClick={() => setModal({ kind: "patient", patient: person })}>{initialsAvatar(person.initials, person.color)}<span><b>{person.name}</b><small>{localized(person.specialty, locale)} · {person.time}</small></span><i className={"status-dot " + person.status} /></button>)}</div></section>
        <section className="panel glass supply-panel"><div className="supply-graphic"><div className="supply-circle"><Package size={22} /></div><div className="supply-glow" /></div><div className="supply-copy"><span className="eyebrow eyebrow-amber">{t("monitoring")}</span><h3>{t("supplyWatch")}</h3><p>{lowCount} {locale === "es" ? "referencias requieren revisión en esta simulación." : "references need review in this simulation."}</p><button className="button button-secondary button-small" onClick={() => setSection("inventory")}>{t("openInventory")} <ArrowRight size={14} /></button></div></section>
      </div>
      <div className="demo-inline"><ShieldCheck size={15} /><span>{t("demoNotice")} · {t("externalData")}</span></div>
    </section>;
  }

  function renderCareHome() {
    return <section className="content-area patient-content">
      <div className="welcome-row"><div><span className="eyebrow"><span className="pulse-dot" />{t("patientWorkspace")}</span><h1>{t("welcomePatient")}</h1><p>{t("careSub")} · {fictionalPatient.city}, {fictionalPatient.department}</p></div><div className="patient-top-id"><div className="patient-top-avatar">EM</div><span><b>{fictionalPatient.name}</b><small>{fictionalPatient.id} · {fictionalPatient.age} {locale === "es" ? "años" : "yrs"}</small></span></div></div>
      <div className="patient-hero glass"><div className="patient-hero-copy"><span className="eyebrow">MEDNEXUS CARE · {fictionalPatient.city.toUpperCase()}</span><h2>{t("carePersonal")}</h2><p>{t("personalDescription")}</p><div className="patient-hero-actions"><button className="button button-primary" onClick={() => setSection("booking")}><CalendarDays size={16} />{t("booking")}</button><button className="button button-glass" onClick={() => setSection("record")}><FileHeart size={16} />{t("history")}</button></div></div><div className="patient-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><HeartPulse size={36} /></div><span className="orbit-node node-one"><Activity size={14} /></span><span className="orbit-node node-two"><Cross size={14} /></span><span className="orbit-node node-three"><ShieldCheck size={14} /></span></div></div>
      <div className="patient-home-grid">
        <section className="panel glass next-appointment"><PanelHeader title={t("nextAppointment")} sub={t("nextDate")} /><div className="appointment-doctor">{initialsAvatar("VR", "violet", clinicians[0].portrait)}<div><b>{t("withDoctor")}</b><span>{locale === "es" ? "Clínica de demostración · Medellín" : "Demo clinic · Medellín"}</span></div></div><div className="appointment-detail"><span><Video size={15} />{bookingModality === "Teleconsulta" ? t("telehealth") : t("inPerson")}</span><span><Clock3 size={15} />30 {locale === "es" ? "minutos" : "minutes"}</span></div><button className="text-link" onClick={() => setSection("booking")}>{t("viewAgenda")} <ArrowRight size={14} /></button></section>
        <section className="panel glass patient-health-card"><PanelHeader title={t("healthCard")} sub={t("immutable")} action={t("record")} onAction={() => setSection("record")} /><div className="health-chip-row"><span className="health-chip blood-chip"><span>ABO</span><b>{fictionalPatient.blood}</b></span><span className="health-chip"><ShieldCheck size={16} /><span>{fictionalPatient.eps}</span></span></div><div className="health-summary-row"><div><small>{t("allergies")}</small><b>{fictionalPatient.allergies.length}</b></div><div><small>{t("conditions")}</small><b>{fictionalPatient.conditions.length}</b></div><div className="signature-seal"><LockKeyhole size={16} /></div></div></section>
      </div>
      <div className="patient-actions-grid">
        <ActionCard icon={<ShoppingBag />} color="cyan" title={t("pharmacy")} text={t("pharmacyNote")} action={t("reserveMed")} onClick={() => { setInventoryType("medicine"); setSection("inventory"); }} />
        <ActionCard icon={<Bandage />} color="violet" title={t("equipmentHome")} text={t("equipmentNote")} action={t("browseSupport")} onClick={() => { setInventoryType("equipment"); setSection("inventory"); }} />
        <ActionCard icon={<MessageCircle />} color="green" title={t("emergency")} text={t("urgentSub")} action={t("urgentCTA")} onClick={() => setSection("support")} />
      </div>
      <section className="safety-banner"><div className="safety-icon"><Siren size={18} /></div><div><b>{t("urgent")}</b><p>{t("emergencyText")}</p></div><button className="button button-danger-soft" onClick={() => setSection("support")}>{t("urgentCTA")} <ArrowRight size={14} /></button></section>
      <div className="demo-inline"><ShieldCheck size={15} /><span>{t("demoNotice")} · {t("noDiagnosisReal")}</span></div>
    </section>;
  }

  function renderPatients() {
    return <section className="content-area"><PageHeading eyebrow={t("clinicalWorkspace")} title={t("patientTitle")} subtitle={t("patientSub")} />
      <div className="table-toolbar glass"><label className="search-control"><Search size={16} /><input value={patientQuery} onChange={(event) => setPatientQuery(event.target.value)} placeholder={t("searchPatient")} /></label><div className="toolbar-controls"><select value={patientStatus} onChange={(event) => setPatientStatus(event.target.value)}><option value="all">{t("allStatuses")}</option><option value="waiting">{t("waiting")}</option><option value="ready">{t("ready")}</option><option value="inConsultation">{t("inConsultation")}</option></select><button className="button button-secondary button-small" onClick={() => { setPatientQuery(""); setPatientStatus("all"); }}><Filter size={14} />{t("clearFilters")}</button></div></div>
      <div className="table-card glass"><div className="table-caption"><div><span className="eyebrow">{t("assigned")}</span><h3>{filteredPatients.length} {t("countPatients")}</h3></div><span className="data-note"><span className="pulse-dot" />{t("demoNotice")}</span></div><div className="table-scroll"><table><thead><tr><th>{t("patient")}</th><th>{t("specialty")}</th><th>{t("status")}</th><th>{t("period")}</th><th>{t("appointmentReason")}</th><th /></tr></thead><tbody>{renderPatientRows(filteredPatients)}</tbody></table></div>{!filteredPatients.length && <EmptyState text={t("noResults")} />}</div>
    </section>;
  }

  function renderTeam() {
    const statusFilters = [["all", t("all")], ["available", t("available")], ["surgery", t("surgery")], ["consult", t("consult")]];
    return <section className="content-area"><PageHeading eyebrow={t("clinicalWorkspace")} title={t("staffTitle")} subtitle={t("staffSub")} />
      <div className="team-controls glass"><div className="team-filter-label"><Filter size={16} /><span>{t("filters")}</span></div><select value={staffSpecialty} onChange={(event) => setStaffSpecialty(event.target.value)}><option value="all">{t("specialtyAll")}</option>{specialties.map((specialty) => <option key={specialty} value={specialty}>{localized(specialty, locale)}</option>)}</select><select value={staffShift} onChange={(event) => setStaffShift(event.target.value)}><option value="all">{t("allShifts")}</option><option value="Mañana">{t("morning")}</option><option value="Tarde">{t("afternoon")}</option><option value="Noche">{t("night")}</option></select><select value={staffStatus} onChange={(event) => setStaffStatus(event.target.value)}><option value="all">{t("availability")}</option><option value="available">{t("available")}</option><option value="surgery">{t("surgery")}</option><option value="consult">{t("consult")}</option></select><button className="button button-quiet button-small" onClick={() => { setStaffSpecialty("all"); setStaffShift("all"); setStaffStatus("all"); }}>{t("clearFilters")}</button></div>
      <div className="directory-summary"><span>{filteredClinicians.length} {t("staffCount")}</span><div>{statusFilters.slice(1).map(([key, label]) => <span className={"status-summary status-" + key} key={key}><i />{label}<b>{clinicians.filter((person) => key === person.status).length}</b></span>)}</div></div>
      <div className="clinician-grid">{renderTeamCards()}</div>{!filteredClinicians.length && <EmptyState text={t("noResults")} />}
    </section>;
  }

  function renderSchedule() {
    return <section className="content-area"><PageHeading eyebrow={t("clinicalWorkspace")} title={t("scheduleTitle")} subtitle={t("scheduleSub")} />
      <div className="schedule-overview"><div className="schedule-date-card glass"><div className="calendar-mini-head"><button className="icon-button tiny"><ChevronLeft size={15} /></button><span>{locale === "es" ? "NOVIEMBRE 2026" : "NOVEMBER 2026"}</span><button className="icon-button tiny"><ChevronRight size={15} /></button></div><div className="weekdays">{["L", "M", "X", "J", "V", "S", "D"].map((day, i) => <span key={i}>{locale === "en" ? ["M", "T", "W", "T", "F", "S", "S"][i] : day}</span>)}</div><div className="month-grid">{Array.from({ length: 35 }, (_, i) => i - 5).map((day, i) => <button key={i} className={(day === 5 ? "selected-day " : "") + (day < 1 || day > 30 ? "muted-day" : "")}>{day < 1 ? 31 + day : day > 30 ? day - 30 : day}</button>)}</div><div className="calendar-legend"><span><i className="legend-dot cyan-dot" />{t("appointments")}</span><span><i className="legend-dot violet-dot" />{t("surgical")}</span></div></div>
        <div className="schedule-timeline panel glass"><PanelHeader title={t("appointments")} sub={locale === "es" ? "Jueves, 5 de noviembre · COT (UTC−5)" : "Thursday, November 5 · COT (UTC−5)"} action={t("booking")} onAction={() => { switchRole("patient"); setSection("booking"); }} /><div className="timeline-list">{appointments.map((apt) => { const person = patients.find((p) => p.id === apt.patientId); return <div className="timeline-item" key={apt.patientId}><span className="timeline-time">{apt.time}</span><div className={"timeline-bar color-" + apt.color} /><div className="timeline-copy"><b>{person?.name}</b><span>{localized(apt.service, locale)} · {localized(apt.room, locale)}</span></div><span className="timeline-status"><i className={"status-dot " + (person?.status || "ready")} /></span></div>; })}</div></div></div>
      <div className="panel glass room-table-panel"><PanelHeader title={t("roomsTitle")} sub={t("surgicalPlan")} /><div className="table-scroll"><table><thead><tr><th>{t("resource")}</th><th>{t("service")}</th><th>{t("period")}</th><th>{t("doctor")}</th><th>{t("capacity")}</th><th>{t("status")}</th></tr></thead><tbody>{rooms.map((room) => <tr key={room.name}><td><b>{localized(room.name, locale)}</b></td><td>{localized(room.type, locale)}</td><td>{room.time}</td><td>{room.clinician}</td><td>{localized(room.capacity, locale)}</td><td><span className="status-label"><i className={"status-dot " + (room.status === "Ocupado" ? "inConsultation" : "available")} />{localized(room.status, locale)}</span></td></tr>)}</tbody></table></div></div>
    </section>;
  }

  function renderBooking() {
    const availableDoctors = clinicians.filter((clinician) => !bookingSpecialty || clinician.title === bookingSpecialty || clinician.title.includes(bookingSpecialty));
    return <section className="content-area"><PageHeading eyebrow={t("patientPortal")} title={t("bookingTitle")} subtitle={t("bookingSub")} />
      <div className="booking-layout"><section className="panel glass booking-panel"><div className="booking-panel-title"><div className="section-icon cyan-icon"><CalendarDays size={18} /></div><div><h3>{locale === "es" ? "Encuentra un espacio" : "Find a time"}</h3><p>{locale === "es" ? "Todos los espacios son ficticios y no se reservan en un sistema real." : "All times are fictional and not booked in a live system."}</p></div></div>
        <div className="booking-fields"><label>{t("specialty")}<select value={bookingSpecialty} onChange={(event) => { setBookingSpecialty(event.target.value); setBookingDoctor(""); setSlotsVisible(false); }}><option value="">{t("chooseSpecialty")}</option>{specialties.map((specialty) => <option key={specialty} value={specialty}>{localized(specialty, locale)}</option>)}<option value="Medicina interna">{localized("Medicina interna", locale)}</option><option value="Pediatría">{localized("Pediatría", locale)}</option><option value="Ginecología">{localized("Ginecología", locale)}</option><option value="Neumología">{localized("Neumología", locale)}</option><option value="Endocrinología">{localized("Endocrinología", locale)}</option><option value="Medicina familiar">{localized("Medicina familiar", locale)}</option></select></label>
          <label>{t("doctor")}<select value={bookingDoctor} onChange={(event) => setBookingDoctor(event.target.value)}><option value="">{t("chooseDoctor")}</option>{availableDoctors.map((doctor) => <option key={doctor.name}>{doctor.name}</option>)}</select></label>
          <label>{t("date")}<input type="date" value={bookingDate} min="2026-11-05" onChange={(event) => { setBookingDate(event.target.value); setSlotsVisible(false); }} /></label>
          <div className="modality-field"><span>{t("modality")}</span><div className="segmented-control"><button className={bookingModality === "Presencial" ? "active" : ""} onClick={() => setBookingModality("Presencial")}><Hospital size={15} />{t("inPerson")}</button><button className={bookingModality === "Teleconsulta" ? "active" : ""} onClick={() => setBookingModality("Teleconsulta")}><Video size={15} />{t("telehealth")}</button></div></div>
        </div>
        <button className="button button-primary full-button search-times" onClick={() => { setSlotsVisible(true); setSelectedSlot(""); }}><Search size={16} />{t("findTimes")}</button>
        {slotsVisible && <div className="slots-panel"><div className="slots-heading"><span className="pulse-dot" />{t("availableSlot")} · {bookingDate}</div><div className="slot-list">{["08:30", "10:30", "13:00", "15:30"].map((time) => <button className={"slot-button " + (selectedSlot === time ? "selected" : "")} onClick={() => setSelectedSlot(time)} key={time}>{time}</button>)}</div><button className="button button-secondary full-button" disabled={!selectedSlot} onClick={() => { setToast(t("bookingSent")); setSlotsVisible(false); setSelectedSlot(""); }}>{t("confirmBooking")} <ArrowRight size={14} /></button></div>}
      </section>
      <aside className="booking-aside"><div className="booking-aside-card glass"><div className="aside-orbit"><HeartPulse size={22} /></div><span className="eyebrow">{t("careTeam")}</span><h3>{locale === "es" ? "Atención coordinada" : "Coordinated care"}</h3><p>{locale === "es" ? "Elige una modalidad para consultar horarios de ejemplo en la Clínica MedNexus de Demostración." : "Choose a modality to view sample times at the MedNexus Demonstration Clinic."}</p><div className="aside-stat"><span><Users size={15} />{clinicians.length} {t("staffCount")}</span><span><ShieldCheck size={15} />{t("demoNotice")}</span></div></div><ActionCard icon={<ShoppingBag />} color="cyan" title={t("pharmacy")} text={t("pharmacyNote")} action={t("reserveMed")} onClick={() => { setInventoryType("medicine"); setSection("inventory"); }} /><ActionCard icon={<Bandage />} color="violet" title={t("equipmentHome")} text={t("equipmentNote")} action={t("browseSupport")} onClick={() => { setInventoryType("equipment"); setSection("inventory"); }} /></aside></div>
      <div className="demo-inline"><ShieldCheck size={15} /><span>{t("demoNotice")} · {t("externalData")}</span></div>
    </section>;
  }

  function renderRecord() {
    return <section className="content-area"><PageHeading eyebrow={t("patientPortal")} title={t("history")} subtitle={t("historyNote")} />
      <div className="record-layout"><section className="panel glass record-card"><div className="record-header"><div className="record-seal"><FileHeart size={22} /></div><div><span className="eyebrow">{t("patientRecord")}</span><h3>{fictionalPatient.name}</h3><p>{fictionalPatient.id} · {fictionalPatient.city}, {fictionalPatient.department}</p></div><span className="immutable-pill"><LockKeyhole size={13} />{t("immutableTag")}</span></div><div className="record-divider" /><div className="identity-grid"><RecordField label={t("identity")} value={fictionalPatient.name} note={fictionalPatient.age + " años · " + fictionalPatient.city + ", " + fictionalPatient.department} /><RecordField label={t("blood")} value={fictionalPatient.blood} note={locale === "es" ? "Grupo sanguíneo (simulado)" : "Blood type (simulated)"} /><RecordField label={t("eps")} value={fictionalPatient.eps} note={locale === "es" ? "Aseguradora ficticia" : "Fictional insurer"} /><RecordField label={t("allergies")} value={fictionalPatient.allergies.join(", ")} note={locale === "es" ? "Dato de ejemplo" : "Sample data"} /><RecordField label={t("conditions")} value={fictionalPatient.conditions[0]} note={locale === "es" ? "Antecedente de demostración" : "Demo history"} /><RecordField label={locale === "es" ? "Contacto de emergencia" : "Emergency contact"} value={locale === "es" ? "Registro de ejemplo" : "Sample record"} note={locale === "es" ? "No contactar" : "Do not contact"} /></div><div className="signature-block"><div className="signature-icon"><ShieldCheck size={17} /></div><div><b>{t("signed")}</b><span>{fictionalPatient.signedBy} · {fictionalPatient.signedAt}</span></div><span className="signature-hash">SHA-256 · DEMO-8A1F…62B0</span></div><div className="record-readonly"><LockKeyhole size={15} /><span>{t("noEdit")}</span></div></section>
      <aside className="record-aside"><div className="panel glass imaging-card"><div className="imaging-visual"><div className="imaging-glow" /><div className="bone-emoji">◈</div><div className="image-crosshair cross-one" /><div className="image-crosshair cross-two" /><span className="image-label">3D · DEMO</span></div><div className="imaging-copy"><span className="eyebrow">{t("clinicalVisual")}</span><h3>{t("imaging")}</h3><p>{t("imagingNote")}</p><button className="button button-primary button-small" onClick={openClinicalModel}>{t("openModel")} <ArrowRight size={14} /></button></div></div><div className="panel glass immutable-note"><div className="note-lock"><LockKeyhole size={17} /></div><div><b>{t("immutableTag")}</b><p>{locale === "es" ? "Los antecedentes se muestran en modo de solo lectura, sin controles de edición." : "History is shown read-only, without editing controls."}</p></div></div></aside></div>
      <div className="demo-inline"><ShieldCheck size={15} /><span>{t("demoNotice")} · {t("noDiagnosisReal")}</span></div>
    </section>;
  }

  function renderSupport() {
    return <section className="content-area"><PageHeading eyebrow={t("patientPortal")} title={t("emergency")} subtitle={t("callSafety")} />
      <div className="support-hero glass"><div className="support-emergency-icon"><Siren size={25} /></div><div><span className="eyebrow eyebrow-amber">{locale === "es" ? "INFORMACIÓN DE SEGURIDAD" : "SAFETY INFORMATION"}</span><h2>{t("urgent")}</h2><p>{t("emergencyText")}</p></div></div>
      <div className="support-grid"><article className="support-option glass"><div className="support-option-icon"><Hospital size={19} /></div><span className="eyebrow">{t("nearest")}</span><h3>{locale === "es" ? "Busca atención presencial" : "Seek in-person care"}</h3><p>{locale === "es" ? "Acude al centro hospitalario más cercano. Esta demo no usa ubicación ni genera rutas." : "Go to the nearest hospital. This demo does not use your location or provide directions."}</p><div className="support-foot"><MapPin size={15} /><span>{locale === "es" ? "Ubicación no solicitada" : "Location not requested"}</span></div></article>
        <article className="support-option glass"><div className="support-option-icon support-green"><Phone size={19} /></div><span className="eyebrow">{locale === "es" ? "SIMULADOR" : "SIMULATOR"}</span><h3>{t("simulateCall")}</h3><p>{locale === "es" ? "Inicia una llamada visual de práctica con el centro ficticio. No usa el marcador del dispositivo." : "Start a visual practice call with the fictional center. It does not open your device dialer."}</p><div className="fake-number">{t("fakeNumber")} <span>DEMO</span></div><button className="button button-primary full-button" onClick={simulateCall}><Phone size={15} />{t("simulateCall")}</button><small className="fake-note">{t("fakeNumberNote")}</small></article>
        <article className="support-option support-red glass"><div className="support-option-icon support-red-icon"><AlertTriangle size={19} /></div><span className="eyebrow">{locale === "es" ? "URGENCIA REAL" : "REAL EMERGENCY"}</span><h3>{locale === "es" ? "Contacta servicios locales" : "Contact local services"}</h3><p>{locale === "es" ? "Para una emergencia real, llama a los servicios de emergencia locales desde un teléfono real. No uses el número ficticio de esta demo." : "For a real emergency, contact local emergency services from a real phone. Do not use this demo's fictional number."}</p><div className="support-foot"><ShieldCheck size={15} /><span>{t("noCall")}</span></div></article></div>
      <div className="safety-banner"><div className="safety-icon"><HeartPulse size={17} /></div><div><b>{t("noDiagnosisReal")}</b><p>{locale === "es" ? "Este prototipo ofrece únicamente navegación de ejemplo." : "This prototype only provides sample navigation."}</p></div></div>
    </section>;
  }

  function renderMain() {
    if (section === "overview" || section === "care") return renderOverview();
    if (section === "inventory") return renderInventory();
    if (section === "patients") return renderPatients();
    if (section === "team") return renderTeam();
    if (section === "schedule") return renderSchedule();
    if (section === "booking") return renderBooking();
    if (section === "record") return renderRecord();
    return renderSupport();
  }

  return <div className="app-shell">
    <aside className={"sidebar " + (mobileNav ? "sidebar-open" : "")}>
      <div className="brand-row"><div className="brand-mark"><Cross size={17} strokeWidth={2.6} /><span /></div><div className="brand-text"><b>MedNexus<span>OS</span></b><small>CLINICAL PLATFORM</small></div><button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label={t("close")}><X size={18} /></button></div>
      <div className="demo-badge"><span className="pulse-dot" />{t("demo")}</div>
      <div className="sidebar-label">{t("workspace")}</div>
      <div className="role-switch"><button className={role === "clinical" ? "selected" : ""} onClick={() => switchRole("clinical")}><Stethoscope size={15} /><span>{t("clinical")}</span></button><button className={role === "patient" ? "selected" : ""} onClick={() => switchRole("patient")}><UserRound size={15} /><span>{t("patient")}</span></button></div>
      <div className="sidebar-label nav-label">{role === "clinical" ? t("clinicalWorkspace") : t("patientWorkspace")}</div>
      <nav className="main-nav">{navItems.map((item) => <button key={item.key} className={"nav-item " + (section === item.key || (section === "overview" && item.key === "overview") ? "active" : "")} onClick={() => { setSection(item.key); setMobileNav(false); }}>{item.icon}<span>{item.label}</span>{item.key === "inventory" && inventory.filter((value) => value.stock <= value.threshold).length > 0 && <i className="nav-count">{inventory.filter((value) => value.stock <= value.threshold).length}</i>}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-help"><div className="help-icon"><ShieldCheck size={17} /></div><div><b>{t("secure")}</b><span>{locale === "es" ? "Simulación · sin conexión externa" : "Simulation · no external link"}</span></div><LockKeyhole size={14} /></div>
      <button className="sidebar-emergency" onClick={() => { switchRole("patient"); setSection("support"); }}><span className="emergency-beacon"><Siren size={16} /></span><span><b>{t("emergency")}</b><small>{t("urgentSub")}</small></span><ArrowRight size={14} /></button>
      <div className="sidebar-profile">{initialsAvatar(role === "clinical" ? "VR" : "EM", role === "clinical" ? "violet" : "cyan", role === "clinical" ? clinicians[0].portrait : undefined)}<span><b>{role === "clinical" ? "Valentina Ríos" : fictionalPatient.name}</b><small>{role === "clinical" ? "Clínica · Medellín" : fictionalPatient.id}</small></span><button className="icon-button tiny"><ChevronDown size={15} /></button></div>
    </aside>
    {mobileNav && <button className="nav-backdrop" aria-label={t("close")} onClick={() => setMobileNav(false)} />}
    <main className="main-shell"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label={locale === "es" ? "Abrir menú" : "Open menu"}><Menu size={19} /></button><div className="breadcrumb"><span>MedNexus OS</span><ChevronRight size={14} /><b>{shellTitle}</b></div></div><div className="topbar-actions"><div className="connection-state"><span className="connection-dot" /><span>{t("secure")}</span></div><button className="language-button" onClick={() => setLocale(locale === "es" ? "en" : "es")}><Languages size={16} /><span>{locale.toUpperCase()}</span></button><span className="topbar-divider" />{initialsAvatar(role === "clinical" ? "VR" : "EM", role === "clinical" ? "violet" : "cyan", role === "clinical" ? clinicians[0].portrait : undefined)}<div className="topbar-user"><b>{role === "clinical" ? "Valentina Ríos" : "Elena Martínez"}</b><small>{role === "clinical" ? "Médica · Antioquia" : "Paciente · Medellín"}</small></div></div></header>
      {renderMain()}
      <footer className="app-footer"><span>© 2026 MedNexus OS · {t("demoNotice")}</span><span>CO · COT (UTC−5) <span className="footer-divider">·</span> v0.1.0</span></footer>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { if (modal.kind === "call") finishCall(); else setModal(null); } }}><div className={"modal-card " + (modal.kind === "model" ? "model-modal" : modal.kind === "call" ? "call-modal" : "profile-modal")} role="dialog" aria-modal="true" aria-label={modal.kind === "model" ? modal.title : modal.kind === "call" ? t("callTitle") : t("profile")}><button className="modal-close icon-button" aria-label={t("close")} onClick={() => { if (modal.kind === "call") finishCall(); else setModal(null); }}><X size={18} /></button>
      {modal.kind === "model" && <><div className="modal-heading"><span className="eyebrow">{modal.clinical ? t("clinicalVisual") : t("objectLabel")}</span><h2>{modal.title}</h2><p>{modal.description}</p></div><div className="model-viewer"><div className="viewer-grid" /><div className="viewer-canvas"><MedicalScene model={modal.model} /></div><div className="viewer-tag"><span className="pulse-dot" />{modal.clinical ? t("noDiagnosis") : t("view3d")}</div><div className="viewer-scale">360° · WEBGL</div><div className="viewer-annotation"><span className="annotation-line" /><div><small>{modal.clinical ? t("annotation") : t("component")}</small><b>{modal.clinical ? t("diagnosis") : modal.title}</b></div></div></div><div className="model-modal-footer"><span><span className="drag-icon">↔</span>{t("dragHint")}</span><span className="model-note"><ShieldCheck size={14} />{modal.clinical ? t("imagingNote") : t("modelDetail")}</span></div></>}
      {modal.kind === "call" && <div className="call-content"><div className="call-brand"><div className="brand-mark small-mark"><Cross size={14} /></div><b>MedNexus<span> OS</span></b></div><div className="call-avatar"><div className="call-avatar-ring"><HeadsetIcon /></div><span className="call-wave wave-a" /><span className="call-wave wave-b" /></div><span className="eyebrow eyebrow-green">{t("callTitle")}</span><h2>{callActive ? t("callActive") : t("callConnect")}</h2><p>{t("fakeNumber")}</p><div className="call-timer">00:{String(callElapsed % 60).padStart(2, "0")} <span>·</span> DEMO</div><div className="call-warning"><AlertCircle size={15} /><span>{t("fakeNumberNote")}</span></div><p className="call-guidance">{t("callSafety")}</p><button className="button button-end-call" onClick={finishCall}><Phone size={16} />{t("endCall")}</button></div>}
      {modal.kind === "clinician" && <div className="profile-modal-content">{initialsAvatar(modal.clinician.initials, modal.clinician.color, modal.clinician.portrait)}<span className={"status-pill " + modal.clinician.status}><i />{statusText[locale][modal.clinician.status]}</span><h2>{modal.clinician.name}</h2><h3>{localized(modal.clinician.title, locale)}</h3><p>{localized(modal.clinician.experience, locale)}</p><div className="profile-detail-list"><span><Hospital size={15} />{localized(modal.clinician.department, locale)}</span><span><Clock3 size={15} />{locale === "es" ? modal.clinician.shift : modal.clinician.shift === "Mañana" ? "Morning" : modal.clinician.shift === "Tarde" ? "Afternoon" : "Night"}</span><span><ShieldCheck size={15} />{locale === "es" ? "Perfil ficticio · Clínica de demostración" : "Fictional profile · Demo clinic"}</span></div><button className="button button-primary full-button" onClick={() => { setModal(null); setRole("patient"); setSection("booking"); setBookingSpecialty(modal.clinician.title); setBookingDoctor(modal.clinician.name); }}>{t("booking")}</button></div>}
      {modal.kind === "patient" && <div className="patient-modal-content"><div className="patient-modal-head">{initialsAvatar(modal.patient.initials, modal.patient.color)}<div><span className="eyebrow">{t("patientRecord")}</span><h2>{modal.patient.name}</h2><p>{modal.patient.id} · {modal.patient.age} {locale === "es" ? "años" : "yrs"} · {modal.patient.city}, {localized(modal.patient.department, locale)}</p></div></div><div className="patient-modal-fields"><RecordField label={t("specialty")} value={localized(modal.patient.specialty, locale)} note={localized(modal.patient.reason, locale)} /><RecordField label={t("blood")} value={modal.patient.blood} note={locale === "es" ? "Dato ficticio" : "Fictional data"} /><RecordField label={t("allergies")} value={modal.patient.allergies.map((value) => localized(value, locale)).join(", ") || (locale === "es" ? "Ninguna registrada en demo" : "None recorded in demo")} note={locale === "es" ? "Solo lectura" : "Read only"} /><RecordField label={t("conditions")} value={modal.patient.conditions.map((value) => localized(value, locale)).join(", ") || (locale === "es" ? "Sin antecedentes de ejemplo" : "No sample history")} note={locale === "es" ? "Solo lectura" : "Read only"} /></div><div className="record-readonly"><LockKeyhole size={15} />{t("noEdit")}</div><button className="button button-secondary full-button" onClick={() => setModal(null)}>{t("close")}</button></div>}
      </div></div>}
    {toast && <div className="toast"><CheckCircle2 size={17} /><span>{toast}</span></div>}
  </div>;
}

function PageHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div><div className="heading-indicator"><span className="pulse-dot" />LIVE · DEMO</div></div>;
}

function StatCard({ icon, label, value, change, foot, color, spark }: { icon: ReactNode; label: string; value: string; change: string; foot: string; color: string; spark: string }) {
  return <article className="stat-card glass"><div className="stat-top"><span className={"stat-icon stat-" + color}>{icon}</span><span className={"stat-change " + color}>{change}</span></div><div className="stat-label">{label}</div><div className="stat-bottom"><div><strong>{value}</strong><small>{foot}</small></div><svg className={"sparkline spark-" + color} viewBox="0 0 76 32" aria-hidden="true"><path d={spark} /></svg></div></article>;
}

function PanelHeader({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return <div className="panel-header"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>{action && <button className="text-link" onClick={onAction}>{action} <ArrowRight size={14} /></button>}</div>;
}

function ActionCard({ icon, color, title, text, action, onClick }: { icon: ReactNode; color: string; title: string; text: string; action: string; onClick: () => void }) {
  return <article className="action-card glass"><div className={"action-card-icon " + color}>{icon}</div><div className="action-card-copy"><h3>{title}</h3><p>{text}</p><button className="text-link" onClick={onClick}>{action} <ArrowRight size={14} /></button></div></article>;
}

function EmptyState({ text }: { text: string }) { return <div className="empty-state glass"><Search size={19} /><span>{text}</span></div>; }
function RecordField({ label, value, note }: { label: string; value: string; note: string }) { return <div className="record-field"><small>{label}</small><b>{value}</b><span>{note}</span></div>; }
function HeadsetIcon() { return <MessageCircle size={24} />; }
