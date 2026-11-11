"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, AudioLines, Check, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, FileCheck2, LockKeyhole, MapPin, Mic, Network,
  PackageCheck, Rotate3D, ShieldCheck, Stethoscope, Wifi, X, ClipboardList, Users, Package, Volume2,
} from "lucide-react";
import type { Clinician, InventoryItem, Locale, Section } from "@/types/clinical";
import type { NetworkNodeId } from "@/components/NetworkTopology";

const NetworkTopology = dynamic(() => import("@/components/NetworkTopology"), {
  ssr: false,
  loading: () => <div className="safety-scene-loading"><Image src="/mednexus-clinical-mark.png" alt="" width={26} height={26} /><span />Preparando topología…</div>,
});

const copy = {
  es: {
    eyebrow: "CENTRO DE OPERACIONES CLÍNICAS", title: "Seguridad clínica",
    subtitle: "Una vista clara del estado de la infraestructura hospitalaria.",
    demo: "ENTORNO DE DEMOSTRACIÓN", systems: "Sistemas supervisados", review: "Revisión sugerida",
    stable: "Sin incidentes críticos", synced: "Estado de muestra · actualización simulada",
    estateTitle: "Estado de los sistemas", estateSub: "Vista simulada de los servicios prioritarios",
    active: "Operativo", attention: "Revisión sugerida", ehr: "Historias clínicas electrónicas",
    ehrMeta: "Acceso y disponibilidad", monitoring: "Red de monitoreo de pacientes",
    monitoringMeta: "Segmento de dispositivos", pharmacy: "Servidores de farmacia",
    pharmacyMeta: "Servicios de inventario", topology: "Topología de red hospitalaria",
    topologySub: "Selecciona un nodo o arrastra para explorar la red.",
    rotate: "Rotar", zoom: "Acercar", selected: "Nodo seleccionado", demoNode: "Estado de demostración",
    voiceTitle: "Asistente de voz clínico", voiceSub: "Navega por el sistema y consulta equipo o existencias por voz o texto.",
    start: "Activar micrófono", stop: "Detener escucha", idle: "Listo para escuchar o recibir un reporte escrito",
    listening: "Escuchando desde este dispositivo…", response: "Respuesta de demostración",
    userLine: "Quiero reportar una interrupción en una estación de monitoreo.",
    assistantLine: "Reporte de demostración recibido. El equipo de TI revisará el nodo de monitoreo seleccionado.",
    noMic: "Habla con claridad y pulsa detener para recibir una respuesta.", voiceNote: "La transcripción del navegador puede usar un servicio de voz externo.",
    recommendations: "Recomendaciones defensivas", recSub: "Acciones de seguridad para revisar con el equipo de TI.",
    priority: "Prioridad alta", normal: "Revisión", patchTitle: "Revisar parches del segmento de monitoreo",
    patchText: "Confirmar la ventana de mantenimiento y validar el reinicio con el responsable de TI.",
    networkTitle: "Validar la segmentación de red", networkText: "Revisar el aislamiento entre dispositivos clínicos y la red administrativa.",
    accessTitle: "Revisar las cuentas privilegiadas", accessText: "Confirmar la autenticación multifactor y retirar cuentas de servicio sin uso.",
    internal: "Política interna · demo", hipaa: "HIPAA · referencia", inspect: "Inspeccionar nodo",
    mark: "Marcar revisado", marked: "Revisado", lowStock: "Referencias de inventario bajo mínimo",
    detail: "Abrir inventario", safetyNote: "Datos sintéticos. Este panel no valida cumplimiento normativo ni sustituye una evaluación institucional.",
    safeNode: "Operativo", reviewNode: "Revisión sugerida",
    auditTitle: "Cronología de auditoría", auditSub: "Eventos sintéticos de seguridad y operación.",
    auditDate: "Fecha", auditSystem: "Sistema", auditSeverity: "Nivel", all: "Todos",
    high: "Alto", medium: "Medio", info: "Informativo", monitoringSystem: "Red de monitoreo",
    pharmacySystem: "Servidores de farmacia", ehrSystem: "Historias clínicas", noEvents: "No hay eventos para estos filtros.",
    eventDetails: "Ver detalles", actor: "Actor", source: "Origen", description: "Detalle del evento",
    pendingReview: "Pendiente de revisión", open: "Abierto", recorded: "Registrado",
    markEventReviewed: "Marcar revisado", eventReviewed: "Revisado", localReview: "Cambio guardado solo en esta demostración.",
    auditEvent1: "Cambio en una regla de firewall", auditSummary1: "Una regla de la red de monitoreo requiere aprobación de seguridad.",
    auditDetail1: "Se modificó una regla de firewall en el entorno de demostración. Verifica el cambio frente a la solicitud aprobada y registra el resultado.",
    auditActor1: "Cuenta técnica DEMO-NET-04", auditSource1: "Simulador de red",
    auditEvent2: "Parche disponible; falta programar mantenimiento", auditSummary2: "La ventana de mantenimiento aún no está programada.",
    auditDetail2: "El catálogo ficticio indica una actualización disponible para el servidor de farmacia. Confirma la ventana con el equipo de TI.",
    auditActor2: "Servicio de inventario de demo", auditSource2: "Simulador de parches",
    auditEvent3: "Inicio de sesión con MFA", auditSummary3: "Acceso de demostración exitoso; no se consultaron datos de pacientes.",
    auditDetail3: "El inicio de sesión de prueba completó el segundo factor. Este registro no procede de un proveedor de identidad real.",
    auditActor3: "Cuenta demo TI-04", auditSource3: "Proveedor de identidad ficticio",
  },
  en: {
    eyebrow: "CLINICAL OPERATIONS CENTER", title: "Clinical safety",
    subtitle: "A clear view of hospital infrastructure status.",
    demo: "DEMONSTRATION ENVIRONMENT", systems: "Systems monitored", review: "Suggested review",
    stable: "No critical incidents", synced: "Sample status · simulated update",
    estateTitle: "System status", estateSub: "Simulated view of priority services",
    active: "Operational", attention: "Suggested review", ehr: "Electronic health records",
    ehrMeta: "Access and availability", monitoring: "Patient monitoring network",
    monitoringMeta: "Device segment", pharmacy: "Pharmacy servers", pharmacyMeta: "Inventory services",
    topology: "Hospital network topology", topologySub: "Select a node or drag to explore the network.",
    rotate: "Rotate", zoom: "Zoom", selected: "Selected node", demoNode: "Demonstration status",
    voiceTitle: "Clinical voice assistant", voiceSub: "Navigate the workspace and ask about the care team or inventory by voice or text.",
    start: "Enable microphone", stop: "Stop listening", idle: "Ready for speech or a written report",
    listening: "Listening on this device…", response: "Demonstration response",
    userLine: "I want to report an outage at a monitoring station.",
    assistantLine: "Demo report received. The IT team will review the selected monitoring node.",
    noMic: "Speak clearly, then stop listening to receive a response.", voiceNote: "Browser speech transcription may use an external voice service.",
    recommendations: "Defensive recommendations", recSub: "Security actions to review with the IT team.",
    priority: "High priority", normal: "Review", patchTitle: "Review monitoring segment patches",
    patchText: "Confirm the maintenance window and validate the restart with the IT owner.",
    networkTitle: "Validate network segmentation", networkText: "Review isolation between clinical devices and the administrative network.",
    accessTitle: "Review privileged accounts", accessText: "Confirm multifactor authentication and remove unused service accounts.",
    internal: "Internal policy · demo", hipaa: "HIPAA · reference", inspect: "Inspect node",
    mark: "Mark reviewed", marked: "Reviewed", lowStock: "Inventory references below minimum",
    detail: "Open inventory", safetyNote: "Synthetic data. This panel does not validate regulatory compliance or replace an institutional assessment.",
    safeNode: "Operational", reviewNode: "Suggested review",
    auditTitle: "Audit timeline", auditSub: "Synthetic security and operations events.",
    auditDate: "Date", auditSystem: "System", auditSeverity: "Level", all: "All",
    high: "High", medium: "Medium", info: "Informational", monitoringSystem: "Monitoring network",
    pharmacySystem: "Pharmacy servers", ehrSystem: "Health records", noEvents: "No events match these filters.",
    eventDetails: "View details", actor: "Actor", source: "Source", description: "Event detail",
    pendingReview: "Pending review", open: "Open", recorded: "Recorded",
    markEventReviewed: "Mark reviewed", eventReviewed: "Reviewed", localReview: "Change saved in this demo only.",
    auditEvent1: "Firewall rule change", auditSummary1: "A monitoring network rule requires security approval.",
    auditDetail1: "A firewall rule was changed in the demonstration environment. Verify it against the approved change request and record the outcome.",
    auditActor1: "Technical account DEMO-NET-04", auditSource1: "Network simulator",
    auditEvent2: "Patch available; maintenance not scheduled", auditSummary2: "The maintenance window has not been scheduled yet.",
    auditDetail2: "The fictional catalogue shows an update available for the pharmacy server. Confirm a maintenance window with IT.",
    auditActor2: "Demo inventory service", auditSource2: "Patch simulator",
    auditEvent3: "MFA sign-in", auditSummary3: "Successful demo access; no patient data was accessed.",
    auditDetail3: "The test sign-in completed its second factor. This record does not come from a real identity provider.",
    auditActor3: "Demo account IT-04", auditSource3: "Fictional identity provider",
  },
} as const;

type AuditSeverity = "high" | "medium" | "info";
type AuditSystem = "monitoring" | "pharmacy" | "ehr";
type AuditStatus = "pendingReview" | "open" | "recorded" | "eventReviewed";
type SecurityDemoEvent = { id: string; time: string; title: string; detail: string; severity: "info" | "warning" };

const auditEvents: {
  id: string;
  date: string;
  time: string;
  severity: AuditSeverity;
  system: AuditSystem;
  titleKey: "auditEvent1" | "auditEvent2" | "auditEvent3";
  summaryKey: "auditSummary1" | "auditSummary2" | "auditSummary3";
  detailKey: "auditDetail1" | "auditDetail2" | "auditDetail3";
  actorKey: "auditActor1" | "auditActor2" | "auditActor3";
  sourceKey: "auditSource1" | "auditSource2" | "auditSource3";
  status: Exclude<AuditStatus, "eventReviewed">;
}[] = [
  { id: "audit-0914", date: "2026-11-09", time: "09:14", severity: "high", system: "monitoring", titleKey: "auditEvent1", summaryKey: "auditSummary1", detailKey: "auditDetail1", actorKey: "auditActor1", sourceKey: "auditSource1", status: "pendingReview" },
  { id: "audit-0902", date: "2026-11-09", time: "09:02", severity: "medium", system: "pharmacy", titleKey: "auditEvent2", summaryKey: "auditSummary2", detailKey: "auditDetail2", actorKey: "auditActor2", sourceKey: "auditSource2", status: "open" },
  { id: "audit-0847", date: "2026-11-09", time: "08:47", severity: "info", system: "ehr", titleKey: "auditEvent3", summaryKey: "auditSummary3", detailKey: "auditDetail3", actorKey: "auditActor3", sourceKey: "auditSource3", status: "recorded" },
];

type SpeechAlternativeLike = { transcript: string };
type SpeechResultLike = ArrayLike<SpeechAlternativeLike> & { isFinal: boolean };
type SpeechRecognitionEventLike = Event & { results: ArrayLike<SpeechResultLike> };
interface SpeechRecognizerLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognizerLike;
    webkitSpeechRecognition?: new () => SpeechRecognizerLike;
  }
}

const nodeMeta: Record<NetworkNodeId, { es: string; en: string; status: "safe" | "review"; metrics: { es: string[]; en: string[] } }> = {
  ehr: { es: "Historias clínicas electrónicas", en: "Electronic health records", status: "safe", metrics: { es: ["Carga de consulta · 62%", "Lectura mediana · 78 ms"], en: ["Query load · 62%", "Median read · 78 ms"] } },
  monitoring: { es: "Monitoreo de pacientes", en: "Patient monitoring", status: "review", metrics: { es: ["Latencia de segmento · 14 ms", "Dispositivos conectados · 97"], en: ["Segment latency · 14 ms", "Connected devices · 97"] } },
  pharmacy: { es: "Servidores de farmacia", en: "Pharmacy servers", status: "safe", metrics: { es: ["Tareas de inventario · 24 ms", "Sincronización · 99,9%"], en: ["Inventory jobs · 24 ms", "Synchronization · 99.9%"] } },
  network: { es: "Red clínica", en: "Clinical network", status: "safe", metrics: { es: ["Rendimiento · 6,8 Gbps", "Pérdida de paquetes · 0,02%"], en: ["Throughput · 6.8 Gbps", "Packet loss · 0.02%"] } },
  backup: { es: "Respaldo de datos", en: "Data backup", status: "safe", metrics: { es: ["Última copia · 02:00", "Prueba de restauración · 15 min"], en: ["Last backup · 02:00", "Restore drill · 15 min"] } },
  icu: { es: "Servidores de UCI", en: "ICU servers", status: "safe", metrics: { es: ["Monitores conectados · 21", "Latencia · 18 ms"], en: ["Connected monitors · 21", "Latency · 18 ms"] } },
  telemedicine: { es: "Pasarela de telemedicina", en: "Telemedicine gateway", status: "safe", metrics: { es: ["Sesiones de muestra · 9", "Latencia · 84 ms"], en: ["Sample sessions · 9", "Latency · 84 ms"] } },
  payments: { es: "Pasarela de pagos", en: "Payment gateway", status: "safe", metrics: { es: ["Disponibilidad demo · 99,8%", "Respuesta mediana · 43 ms"], en: ["Demo availability · 99.8%", "Median response · 43 ms"] } },
  perimeter: { es: "Seguridad perimetral", en: "Perimeter security", status: "review", metrics: { es: ["Reglas pendientes · 2", "Inspección WAF · demo"], en: ["Rules to review · 2", "WAF inspection · demo"] } },
  database: { es: "Base de datos clínica", en: "Clinical database", status: "safe", metrics: { es: ["Carga de almacenamiento · 61%", "Réplicas · 2 de 2"], en: ["Storage load · 61%", "Replicas · 2 of 2"] } },
};

export default function ClinicalSafetyDashboard({ locale, environment, lowStockCount, onNavigate, triageSummary, clinicians, inventory }: {
  locale: Locale;
  environment: string;
  lowStockCount: number;
  onNavigate: (section: Section) => void;
  triageSummary?: string;
  clinicians: Clinician[];
  inventory: InventoryItem[];
}) {
  const t = copy[locale];
  const [selectedNode, setSelectedNode] = useState<NetworkNodeId>("monitoring");
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "response">("idle");
  const [transcript, setTranscript] = useState("");
  const [draft, setDraft] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [permissionPending, setPermissionPending] = useState(false);
  const [available, setAvailable] = useState(true);
  const [localTime, setLocalTime] = useState("");
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const recognizerRef = useRef<SpeechRecognizerLike | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const startAttemptRef = useRef(0);
  const voiceSilenceTimerRef = useRef<number | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [auditDate, setAuditDate] = useState("2026-11-09");
  const [auditSystem, setAuditSystem] = useState("all");
  const [auditSeverity, setAuditSeverity] = useState("all");
  const [expandedAuditEvent, setExpandedAuditEvent] = useState<string | null>(null);
  const [reviewedAuditEvents, setReviewedAuditEvents] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanState, setScanState] = useState<"idle" | "running" | "complete">("idle");
  const [integrityVerified, setIntegrityVerified] = useState(false);
  const [demoIpBlocked, setDemoIpBlocked] = useState(false);
  const [securityDemoEvents, setSecurityDemoEvents] = useState<SecurityDemoEvent[]>([]);
  const simulationIntervalRef = useRef<number | null>(null);
  const selected = nodeMeta[selectedNode];
  const systemLabels: Record<AuditSystem, string> = {
    monitoring: t.monitoringSystem,
    pharmacy: t.pharmacySystem,
    ehr: t.ehrSystem,
  };
  const filteredAuditEvents = auditEvents.filter((event) => event.date === auditDate
    && (auditSystem === "all" || event.system === auditSystem)
    && (auditSeverity === "all" || event.severity === auditSeverity));

  useEffect(() => {
    if (!triageSummary) return;
    setTranscript(triageSummary);
    setAssistantMessage(locale === "es"
      ? "Resumen de demostración preparado para revisión por un profesional. No es un diagnóstico ni una clasificación clínica."
      : "Demo summary prepared for professional review. This is not a diagnosis or clinical classification.");
    setVoiceState("response");
  }, [triageSummary, locale]);

  useEffect(() => {
    const update = () => setLocalTime(new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, [locale]);

  const releaseAudio = useCallback(() => {
    if (voiceSilenceTimerRef.current !== null) window.clearTimeout(voiceSilenceTimerRef.current);
    voiceSilenceTimerRef.current = null;
    if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    recognizerRef.current?.stop();
    recognizerRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") void audioContextRef.current.close();
    audioContextRef.current = null;
    waveformRef.current?.querySelectorAll<HTMLElement>("i").forEach((bar) => { bar.style.height = ""; });
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      startAttemptRef.current += 1;
      releaseAudio();
      if (simulationIntervalRef.current !== null) window.clearInterval(simulationIntervalRef.current);
    };
  }, [releaseAudio]);

  function logSecurityDemoEvent(title: string, detail: string, severity: SecurityDemoEvent["severity"] = "info") {
    const time = new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
    setSecurityDemoEvents((events) => [{ id: `sec-${Date.now()}`, time, title, detail, severity }, ...events].slice(0, 4));
  }

  function startSecurityScan() {
    if (scanState === "running") return;
    setScanProgress(0);
    setScanState("running");
    let step = 0;
    simulationIntervalRef.current = window.setInterval(() => {
      step += 1;
      const progress = Math.min(100, step * 20);
      setScanProgress(progress);
      if (progress === 100) {
        if (simulationIntervalRef.current !== null) window.clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
        setScanState("complete");
        logSecurityDemoEvent(
          locale === "es" ? "Escaneo de nodos completado" : "Node scan completed",
          locale === "es" ? "10 nodos de demostración consultados · 2 requieren revisión manual." : "10 demo nodes checked · 2 need manual review.",
          "warning",
        );
      }
    }, 300);
  }

  function validateDemoIntegrity() {
    setIntegrityVerified(true);
    logSecurityDemoEvent(
      locale === "es" ? "Integridad de servidores validada" : "Server integrity validated",
      locale === "es" ? "Validación ficticia de 4/4 manifiestos · sin cambios en servidores reales." : "Fictional check of 4/4 manifests · no real servers changed.",
    );
  }

  function blockDemoIp() {
    if (demoIpBlocked) return;
    setDemoIpBlocked(true);
    logSecurityDemoEvent(
      locale === "es" ? "IP de prueba bloqueada" : "Test IP blocked",
      locale === "es" ? "198.51.100.42 · bloqueo local simulado; no se modificó ningún firewall." : "198.51.100.42 · local block simulation; no firewall was changed.",
      "warning",
    );
  }

  function composeResponse(message: string) {
    const normalized = message.toLocaleLowerCase();
    const isUrgent = /no puedo respirar|dificultad para respirar|dolor (en el pecho|torácico)|inconsciente|convulsión|sangrado intenso|can't breathe|difficulty breathing|chest pain|unconscious|seizure|severe bleeding/.test(normalized);
    if (isUrgent) return locale === "es"
      ? "No puedo evaluar ni atender una urgencia. Si esto describe una situación real, llama al 123 en Medellín o a los servicios locales y busca atención inmediata. Esta demo no contacta emergencias."
      : "I cannot assess or handle an emergency. If this describes a real situation, call local emergency services and seek immediate care. This demo does not contact emergency services.";
    const asksForClinicians = /qu[ií]en|qui[eé]nes|cu[aá]l|cu[aá]les|disponible|disponibles|m[eé]dicos|doctores|especialistas|care team|who is|who are|available clinician|doctors/.test(normalized);
    const asksForInventory = /qu[eé]|cu[aá]nt|disponible|disponibles|stock|existencias|inventario|insumo|medicamento|farmacia|inventory|suppl(y|ies)|medicine|minimum|below/.test(normalized);
    const requestsNavigation = /abre|abrir|ir a|ve a|lleva|navega|secci[oó]n|open|go to|navigate|take me/.test(normalized);
    if (!requestsNavigation && /equipo|m[eé]dico|doctor|especialista|staff|clinician/.test(normalized) && asksForClinicians) {
      const availableClinicians = clinicians.filter((person) => person.status === "available");
      const names = (availableClinicians.length ? availableClinicians : clinicians).slice(0, 5).map((person) => `${person.name} · ${person.title}`).join("; ");
      return locale === "es"
        ? `Equipo disponible en esta demo: ${names}. Los estados y perfiles son ficticios; abre Equipo médico para consultar las fichas.`
        : `Available in this demo: ${names}. Statuses and profiles are fictional; open Care team to view the profiles.`;
    }
    if (!requestsNavigation && asksForInventory) {
      const criticalItems = inventory.filter((item) => item.stock <= item.threshold);
      const isAskingCritical = /cr[ií]tic|bajo m[ií]nimo|low stock|critical|below minimum|below/.test(normalized);
      const summary = isAskingCritical
        ? criticalItems.map((item) => `${item.name} (${item.stock} ${item.unit})`).join("; ") || (locale === "es" ? "ninguna referencia bajo el mínimo" : "no items below minimum")
        : inventory.slice(0, 5).map((item) => `${item.name} (${item.stock} ${item.unit})`).join("; ");
      return locale === "es"
        ? `${inventory.length} referencias ficticias en inventario. ${criticalItems.length} están bajo el mínimo. ${isAskingCritical ? `Revisión: ${summary}.` : `Muestra: ${summary}.`}`
        : `${inventory.length} fictional inventory references. ${criticalItems.length} are below minimum. ${isAskingCritical ? `Review: ${summary}.` : `Sample: ${summary}.`}`;
    }
    const actions: Array<{ pattern: RegExp; section: Section; labelEs: string; labelEn: string }> = [
      { pattern: /inicio|resumen|seguridad cl[ií]nica|dashboard|home|overview/, section: "overview", labelEs: "Abrir seguridad clínica", labelEn: "Open clinical safety" },
      { pattern: /triage|triaje|consulta virtual|symptom|s[ií]ntoma/, section: "triage", labelEs: "Abrir guía de consulta", labelEn: "Open intake guide" },
      { pattern: /agenda|cita|turno|calendar|appointment/, section: "schedule", labelEs: "Abrir agenda", labelEn: "Open schedule" },
      { pattern: /hospital|mapa|ubicaci[oó]n|hospital network/, section: "locations", labelEs: "Abrir red hospitalaria", labelEn: "Open hospital network" },
      { pattern: /paciente|expediente|patients|record/, section: "patients", labelEs: "Abrir pacientes", labelEn: "Open patients" },
      { pattern: /equipo|profesional|m[eé]dico|staff|clinician/, section: "team", labelEs: "Abrir equipo", labelEn: "Open team" },
      { pattern: /inventario|farmacia|insumo|inventory|pharmacy/, section: "inventory", labelEs: "Abrir inventario", labelEn: "Open inventory" },
    ];
    const action = actions.find((item) => item.pattern.test(normalized));
    if (action) {
      onNavigate(action.section);
      return locale === "es"
        ? `Entendido. Abriendo ${action.labelEs.toLocaleLowerCase()} en esta demostración.`
        : `Understood. Opening ${action.labelEn.toLocaleLowerCase()} in this demo.`;
    }
    if (/dolor|fiebre|mareo|pain|fever|dizz/.test(normalized)) return locale === "es"
      ? "Puedo preparar un resumen de lo que escribas, pero no hago triage ni doy diagnósticos. Usa la guía de consulta para organizar los datos y compártelos con un profesional."
      : "I can prepare a summary of what you enter, but I do not triage or diagnose. Use the intake guide to organize details and share them with a professional.";
    return locale === "es"
      ? "Incidencia recibida en esta demostración. Resume el sistema afectado, la ubicación y la hora; después, notifícala por el canal institucional de TI. No se envió ni guardó fuera de esta pantalla."
      : "Demo incident received. Note the affected system, location and time, then report it through your organization’s IT channel. Nothing was sent or stored outside this screen.";
  }

  function respondTo(message: string, speak = false) {
    const value = message.trim();
    if (!value) return;
    setTranscript(value);
    const response = composeResponse(value);
    setAssistantMessage(response);
    setVoiceError("");
    releaseAudio();
    setVoiceState("response");
    if (speak && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = locale === "es" ? "es-CO" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  async function startVoice() {
    window.speechSynthesis?.cancel();
    const attempt = startAttemptRef.current + 1;
    startAttemptRef.current = attempt;
    setPermissionPending(true);
    setVoiceError("");
    setTranscript("");
    setAssistantMessage("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionPending(false);
      setVoiceError(locale === "es" ? "Este navegador no permite acceder al micrófono desde esta página." : "This browser cannot access a microphone from this page.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current || attempt !== startAttemptRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      setPermissionPending(false);
      mediaStreamRef.current = stream;
      const context = new AudioContext();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      context.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);
      const animate = () => {
        analyser.getByteTimeDomainData(samples);
        const level = samples.reduce((total, sample) => total + Math.abs(sample - 128), 0) / samples.length;
        const normalizedLevel = Math.min(1, level / 24);
        waveformRef.current?.querySelectorAll<HTMLElement>("i").forEach((bar, index) => {
          bar.style.height = `${6 + normalizedLevel * (9 + ((index * 13) % 29))}px`;
        });
        animationRef.current = window.requestAnimationFrame(animate);
      };
      animate();
      setVoiceState("listening");
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.lang = locale === "es" ? "es-CO" : "en-US";
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.onresult = (event) => {
          const transcriptParts: string[] = [];
          let containsFinalResult = false;
          for (let index = 0; index < event.results.length; index += 1) {
            const result = event.results[index];
            const phrase = result[0]?.transcript || "";
            if (phrase) transcriptParts.push(phrase);
            containsFinalResult ||= result.isFinal;
          }
          const current = transcriptParts.join(" ").trim();
          setTranscript(current.trim());
          if (current) {
            if (voiceSilenceTimerRef.current !== null) window.clearTimeout(voiceSilenceTimerRef.current);
            voiceSilenceTimerRef.current = window.setTimeout(() => respondTo(current, true), containsFinalResult ? 1100 : 1500);
          }
        };
        recognizer.onerror = () => {
          releaseAudio();
          setVoiceState("idle");
          setVoiceError(locale === "es" ? "No se pudo transcribir. Puedes escribir el reporte en el campo." : "Speech recognition failed. You can type the report instead.");
        };
        recognizerRef.current = recognizer;
        recognizer.start();
      } else setVoiceError(locale === "es" ? "La transcripción por voz no está disponible en este navegador; escribe el reporte abajo." : "Speech transcription is unavailable in this browser; type the report below.");
    } catch (error) {
      if (!mountedRef.current || attempt !== startAttemptRef.current) return;
      releaseAudio();
      setVoiceState("idle");
      setPermissionPending(false);
      const denied = error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "PermissionDeniedError");
      setVoiceError(denied
        ? (locale === "es" ? "Permiso de micrófono denegado. Revisa los permisos del navegador." : "Microphone permission was denied. Check your browser permissions.")
        : (locale === "es" ? "No fue posible iniciar el micrófono. Puedes escribir tu reporte." : "Could not start the microphone. You can type your report."));
    }
  }

  function stopVoice() {
    if (transcript.trim()) respondTo(transcript, true);
    else {
      releaseAudio();
      setVoiceState("idle");
    }
  }

  function speakResponse() {
    if (!assistantMessage || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(assistantMessage);
    utterance.lang = locale === "es" ? "es-CO" : "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function toggleReviewed(id: string) {
    setReviewed((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function markAuditEventReviewed(id: string) {
    setReviewedAuditEvents((items) => items.includes(id) ? items : [...items, id]);
  }

  return <section className="content-area safety-content">
    <div className="safety-heading">
      <div>
        <span className="safety-eyebrow"><Image src="/mednexus-clinical-mark.png" alt="" width={28} height={28} className="safety-heading-logo" /><span className="safety-eyebrow-icon"><Stethoscope size={15} /></span>{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>
      <span className="safety-demo-badge"><span />{t.demo}</span>
    </div>

    <section className="clinician-credential-card">
      <div className="clinician-credential-portrait"><Image src="/jose-daniel-profile.jpg" alt="José Daniel Pabón Villanueva" width={92} height={110} priority /><span className={available ? "credential-online" : "credential-away"}><i />{available ? (locale === "es" ? "Disponible" : "Available") : (locale === "es" ? "No disponible" : "Unavailable")}</span></div>
      <div className="clinician-credential-main"><span className="credential-eyebrow"><ShieldCheck size={13} />{locale === "es" ? "ADMINISTRADOR DE SEGURIDAD" : "SECURITY ADMINISTRATOR"}</span><h2>José Daniel Pabón Villanueva</h2><p>{locale === "es" ? "Administrador · Seguridad clínica" : "Administrator · Clinical safety"}</p><div className="credential-tags"><span>{locale === "es" ? "Control de acceso" : "Access control"}</span><span>{locale === "es" ? "Auditoría y defensa" : "Audit and defense"}</span><span><Clock3 size={12} />{locale === "es" ? "Demo local" : "Local demo"} · {localTime || "--:--"}</span></div></div>
      <div className="credential-actions"><button className="credential-availability" onClick={() => setAvailable((value) => !value)}><span className={available ? "availability-switch on" : "availability-switch"}><i /></span>{locale === "es" ? "Disponibilidad · demo" : "Availability · demo"}</button><div><button onClick={() => onNavigate("team")}><Users size={14} />{locale === "es" ? "Equipo" : "Team"}</button><button onClick={() => onNavigate("patients")}><ClipboardList size={14} />{locale === "es" ? "Pacientes" : "Patients"}</button><button onClick={() => onNavigate("locations")}><MapPin size={14} />{locale === "es" ? "Red hospitalaria" : "Hospital network"}</button><button onClick={() => onNavigate("inventory")}><Package size={14} />{locale === "es" ? "Inventario" : "Inventory"}</button></div></div>
    </section>

    <div className="safety-status-strip">
      <div className="safety-stable"><span className="safety-status-icon"><ShieldCheck size={18} /></span><span><b>{t.stable}</b><small>{t.synced}</small></span></div>
      <span className="safety-strip-divider" />
      <div className="safety-strip-item"><Wifi size={16} /><span><b>10</b> {t.systems}</span></div>
      <div className="safety-strip-item safety-strip-warning"><CircleHelp size={16} /><span><b>02</b> {t.review}</span></div>
      <div className="safety-current-environment"><span>{environment}</span></div>
    </div>

    <section className="safety-panel security-simulation-panel">
      <div className="safety-section-heading"><div><h2>{locale === "es" ? "Simulación de defensa hospitalaria" : "Hospital defense simulation"}</h2><p>{locale === "es" ? "Controles locales de demostración · no se conectan a servidores ni firewalls." : "Local demo controls · no servers or firewalls are contacted."}</p></div><span className="security-sim-badge"><ShieldCheck size={13} />{locale === "es" ? "Solo simulación" : "Simulation only"}</span></div>
      <div className="security-sim-grid">
        <article className="security-sim-card">
          <span className="security-sim-icon cyan"><Network size={17} /></span><div><b>{locale === "es" ? "Escaneo de nodos" : "Node scan"}</b><small>{scanState === "running" ? (locale === "es" ? `Consultando nodos · ${Math.round(scanProgress / 10)}/10` : `Checking nodes · ${Math.round(scanProgress / 10)}/10`) : scanState === "complete" ? (locale === "es" ? "Escaneo completado · 10 nodos" : "Scan complete · 10 nodes") : (locale === "es" ? "10 servicios de infraestructura" : "10 infrastructure services")}</small></div><button type="button" disabled={scanState === "running"} onClick={startSecurityScan}>{scanState === "running" ? (locale === "es" ? "Escaneando…" : "Scanning…") : (locale === "es" ? "Iniciar escaneo" : "Start scan")}</button>
          <div className="security-sim-progress" role="progressbar" aria-label={locale === "es" ? "Progreso del escaneo simulado" : "Demo scan progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={scanProgress}><i style={{ width: `${scanProgress}%` }} /></div>
        </article>
        <article className="security-sim-card">
          <span className="security-sim-icon green"><CheckCircle2 size={17} /></span><div><b>{locale === "es" ? "Integridad de servidores" : "Server integrity"}</b><small>{integrityVerified ? (locale === "es" ? "Manifiestos demo · 4 de 4 íntegros" : "Demo manifests · 4 of 4 intact") : (locale === "es" ? "Validación ficticia de manifiestos" : "Fictional manifest validation")}</small></div><button type="button" onClick={validateDemoIntegrity}>{integrityVerified ? (locale === "es" ? "Volver a validar" : "Validate again") : (locale === "es" ? "Validar" : "Validate")}</button>
        </article>
        <article className="security-sim-card">
          <span className="security-sim-icon amber"><ShieldCheck size={17} /></span><div><b>{locale === "es" ? "IP sospechosa · demo" : "Suspicious IP · demo"}</b><small>{demoIpBlocked ? (locale === "es" ? "198.51.100.42 · bloqueada en la simulación" : "198.51.100.42 · blocked in simulation") : (locale === "es" ? "198.51.100.42 · dirección reservada de prueba" : "198.51.100.42 · reserved test address")}</small></div><button type="button" disabled={demoIpBlocked} onClick={blockDemoIp}>{demoIpBlocked ? (locale === "es" ? "Bloqueada" : "Blocked") : (locale === "es" ? "Simular bloqueo" : "Simulate block")}</button>
        </article>
      </div>
      <div className="security-firewall-log"><div><span><Activity size={14} />{locale === "es" ? "Registro de firewall · demo" : "Firewall event log · demo"}</span><small>{locale === "es" ? "Últimos eventos locales" : "Latest local events"}</small></div>{securityDemoEvents.length ? securityDemoEvents.map((event) => <article key={event.id} className={event.severity}><time>{event.time}</time><b>{event.title}</b><small>{event.detail}</small></article>) : <article className="info"><time>--:--</time><b>{locale === "es" ? "Firewall de demostración preparado" : "Demo firewall ready"}</b><small>{locale === "es" ? "Las acciones aparecerán aquí y solo cambiarán el estado local de esta vista." : "Actions appear here and only change this view's local state."}</small></article>}</div>
    </section>

    <section className="safety-estate-card">
      <div className="safety-section-heading"><div><h2>{t.estateTitle}</h2><p>{t.estateSub}</p></div><span className="safety-section-live"><i />DEMO</span></div>
      <div className="safety-system-grid">
        <button className="safety-system-card" onClick={() => setSelectedNode("ehr")}>
          <span className="safety-system-icon blue"><FileCheck2 size={18} /></span><span className="safety-system-copy"><b>{t.ehr}</b><small>{t.ehrMeta}</small></span><span className="safety-system-state safe"><i />{t.active}</span><ArrowDownRight className="safety-system-arrow" size={16} />
        </button>
        <button className="safety-system-card" onClick={() => setSelectedNode("monitoring")}>
          <span className="safety-system-icon amber"><Activity size={18} /></span><span className="safety-system-copy"><b>{t.monitoring}</b><small>{t.monitoringMeta}</small></span><span className="safety-system-state review"><i />{t.attention}</span><ArrowDownRight className="safety-system-arrow" size={16} />
        </button>
        <button className="safety-system-card" onClick={() => setSelectedNode("pharmacy")}>
          <span className="safety-system-icon green"><PackageCheck size={18} /></span><span className="safety-system-copy"><b>{t.pharmacy}</b><small>{t.pharmacyMeta}</small></span><span className="safety-system-state safe"><i />{t.active}</span><ArrowDownRight className="safety-system-arrow" size={16} />
        </button>
      </div>
    </section>

    <div className="safety-main-grid">
      <section className="safety-panel safety-topology-panel">
        <div className="safety-section-heading"><div><h2>{t.topology}</h2><p>{t.topologySub}</p></div><span className="safety-round-icon"><Rotate3D size={17} /></span></div>
        <div className="safety-topology-content">
          <div className="safety-topology-visual" aria-label={t.topology}>
            <NetworkTopology selectedNode={selectedNode} onSelect={setSelectedNode} />
          </div>
          <div className="safety-node-details">
            <div className="safety-node-summary"><span className="safety-detail-label">{t.selected}</span><h3>{locale === "es" ? selected.es : selected.en}</h3><span className={"safety-node-status " + selected.status}><i />{selected.status === "safe" ? t.safeNode : t.reviewNode}</span><span className="safety-detail-label safety-metrics-label">{locale === "es" ? "Métricas de demostración" : "Demo metrics"}</span><div className="safety-node-metrics">{selected.metrics[locale].map((metric) => <span key={metric}><i />{metric}</span>)}</div></div>
            <div className="safety-node-navigation"><span className="safety-detail-label">{t.demoNode}</span><div className="safety-node-list">{(Object.keys(nodeMeta) as NetworkNodeId[]).map((id) => <button key={id} className={selectedNode === id ? "selected" : ""} onClick={() => setSelectedNode(id)}><span className={nodeMeta[id].status}><i /></span>{locale === "es" ? nodeMeta[id].es : nodeMeta[id].en}</button>)}</div></div>
          </div>
        </div>
        <div className="safety-topology-footer"><span className="safety-topology-legend"><i className="safe-dot" />{t.active}<i className="review-dot" />{t.attention}</span><span><Network size={14} />{t.rotate} · {t.zoom}</span><span>WebGL · 3D · {locale === "es" ? "flujo simulado" : "simulated flow"}</span></div>
      </section>

      <section className={"safety-panel safety-voice-panel " + (voiceState !== "idle" ? "voice-active" : "")}>
        <div className="safety-voice-header"><span className="safety-voice-icon"><AudioLines size={18} /></span><span className="safety-voice-label"><b>{t.voiceTitle}</b><small>{t.voiceSub}</small></span><span className="safety-voice-demo">DEMO</span></div>
        <div className="safety-voice-center">
          <div ref={waveformRef} className={"safety-wave " + (voiceState === "listening" ? "is-speaking" : "")} aria-hidden="true">{Array.from({ length: 29 }, (_, index) => <i key={index} style={{ "--bar": `${10 + ((index * 13) % 30)}px`, "--delay": `${(index % 9) * -0.11}s` } as CSSProperties & { "--bar": string; "--delay": string }} />)}</div>
          <span className="safety-voice-state">{voiceState === "idle" ? t.idle : voiceState === "listening" ? t.listening : t.response}</span>
        </div>
        {voiceState === "response" ? <div className="safety-conversation"><div className="safety-user-message"><small>{locale === "es" ? "Transcripción" : "Transcript"}</small>{transcript}</div><div className="safety-assistant-message"><span><CheckCircle2 size={14} /></span>{assistantMessage}</div><button className="safety-speak-button" onClick={speakResponse}><Volume2 size={13} />{locale === "es" ? "Repetir respuesta" : "Repeat response"}</button></div> : <div className="safety-voice-placeholder"><span>{voiceState === "listening" ? <Mic size={15} /> : <LockKeyhole size={15} />}</span>{voiceState === "listening" ? (transcript || t.noMic) : t.voiceNote}</div>}
        {voiceError && <p className="safety-voice-error" role="status">{voiceError}</p>}
        <div className="safety-voice-controls">
          <button className={"safety-call-button " + (voiceState === "listening" ? "active" : "")} disabled={permissionPending} onClick={voiceState === "listening" ? stopVoice : startVoice} aria-label={voiceState === "listening" ? t.stop : t.start}>
            {voiceState === "listening" ? <X size={21} /> : <Mic size={21} />}
          </button>
          <span className="safety-call-label">{permissionPending ? (locale === "es" ? "Solicitando permiso…" : "Requesting permission…") : voiceState === "listening" ? t.stop : t.start}</span>
        </div>
        <div className="safety-voice-examples"><span>{locale === "es" ? "Prueba una consulta" : "Try asking"}</span><div>{(locale === "es" ? ["¿Qué médicos están disponibles?", "¿Qué hay bajo mínimo?", "Abrir agenda"] : ["Which clinicians are available?", "What is below minimum?", "Open schedule"]).map((example) => <button type="button" key={example} onClick={() => respondTo(example)}>{example}</button>)}</div></div>
        <form className="safety-voice-text-form" onSubmit={(event) => { event.preventDefault(); respondTo(draft); setDraft(""); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={locale === "es" ? "Escribe un reporte o consulta" : "Type a report or question"} aria-label={locale === "es" ? "Reporte o consulta" : "Report or question"} /><button type="submit" disabled={!draft.trim()}>{locale === "es" ? "Enviar" : "Send"}</button></form>
        <div className="safety-voice-footer"><ShieldCheck size={14} /><span>{locale === "es" ? "La voz se procesa en el navegador; la transcripción puede usar servicios del navegador. No se almacena en esta demo." : "Audio is captured in the browser; transcription may use browser services. This demo does not store it."}<a className="azteclab-inline-link" href="https://www.azteclab.co/" target="_blank" rel="noreferrer">{locale === "es" ? "Conocer AztecLab" : "About AztecLab"}<ArrowRight size={12} /></a></span></div>
      </section>
    </div>

    <section className="safety-panel safety-recommendations">
      <div className="safety-section-heading"><div><h2>{t.recommendations}</h2><p>{t.recSub}</p></div><span className="safety-reference-note"><ShieldCheck size={15} />{t.safetyNote}</span></div>
      <div className="safety-recommendation-list">
        {[
          { id: "patch", title: t.patchTitle, text: t.patchText, tag: t.internal, priority: true, node: "monitoring" as NetworkNodeId, icon: <Activity size={17} /> },
          { id: "segmentation", title: t.networkTitle, text: t.networkText, tag: t.internal, priority: false, node: "network" as NetworkNodeId, icon: <Network size={17} /> },
          { id: "access", title: t.accessTitle, text: t.accessText, tag: t.hipaa, priority: false, node: "ehr" as NetworkNodeId, icon: <LockKeyhole size={17} /> },
        ].map((item) => <article className="safety-recommendation-row" key={item.id}>
          <span className={"safety-recommendation-icon " + (item.priority ? "amber" : "blue")}>{item.icon}</span>
          <div className="safety-recommendation-copy"><div className="safety-recommendation-title"><h3>{item.title}</h3><span className={item.priority ? "priority" : "normal"}>{item.priority ? t.priority : t.normal}</span></div><p>{item.text}</p><span className="safety-reference-tag">{item.tag}</span></div>
          <div className="safety-recommendation-actions"><button className="safety-inspect-button" onClick={() => setSelectedNode(item.node)}>{t.inspect} <ArrowRight size={14} /></button><button className={"safety-mark-button " + (reviewed.includes(item.id) ? "done" : "")} onClick={() => toggleReviewed(item.id)}>{reviewed.includes(item.id) ? <Check size={14} /> : <CheckCircle2 size={14} />}{reviewed.includes(item.id) ? t.marked : t.mark}</button></div>
        </article>)}
      </div>
      <div className="safety-recommendations-footer"><span><Clock3 size={14} />{t.demo}</span><button onClick={() => onNavigate("inventory")}>{t.lowStock} <b>{lowStockCount}</b><span>{t.detail} <ArrowRight size={13} /></span></button></div>
    </section>

    <section className="safety-panel safety-audit-timeline">
      <div className="safety-section-heading"><div><h2>{t.auditTitle}</h2><p>{t.auditSub}</p></div><span className="safety-audit-count"><Clock3 size={14} />{filteredAuditEvents.length} · {t.demo}</span></div>
      <div className="safety-audit-filters">
        <label><span>{t.auditDate}</span><input type="date" value={auditDate} onChange={(event) => setAuditDate(event.target.value)} /></label>
        <label><span>{t.auditSystem}</span><select value={auditSystem} onChange={(event) => setAuditSystem(event.target.value)}><option value="all">{t.all}</option><option value="monitoring">{t.monitoringSystem}</option><option value="pharmacy">{t.pharmacySystem}</option><option value="ehr">{t.ehrSystem}</option></select></label>
        <label><span>{t.auditSeverity}</span><select value={auditSeverity} onChange={(event) => setAuditSeverity(event.target.value)}><option value="all">{t.all}</option><option value="high">{t.high}</option><option value="medium">{t.medium}</option><option value="info">{t.info}</option></select></label>
      </div>
      <div className="safety-audit-list">
        {filteredAuditEvents.length === 0 ? <div className="safety-audit-empty"><CircleHelp size={17} /><span>{t.noEvents}</span></div> : filteredAuditEvents.map((event) => {
          const statusKey: AuditStatus = reviewedAuditEvents.includes(event.id) ? "eventReviewed" : event.status;
          const isExpanded = expandedAuditEvent === event.id;
          return <article className="safety-audit-event" key={event.id}>
            <button className="safety-audit-summary" aria-label={t.eventDetails} aria-expanded={isExpanded} onClick={() => setExpandedAuditEvent(isExpanded ? null : event.id)}>
              <span className="safety-audit-time"><b>{event.time}</b><small>COT</small></span>
              <span className="safety-audit-event-copy"><span className="safety-audit-title-row"><b>{t[event.titleKey]}</b><span className={"safety-audit-severity " + event.severity}>{t[event.severity]}</span></span><small>{systemLabels[event.system]} · {t[event.summaryKey]}</small></span>
              <span className={"safety-audit-status " + statusKey}>{t[statusKey]}</span>
              <ChevronDown className={isExpanded ? "expanded" : ""} size={16} />
            </button>
            {isExpanded && <div className="safety-audit-details">
              <div className="safety-audit-description"><small>{t.description}</small><p>{t[event.detailKey]}</p></div>
              <div><span><small>{t.actor}</small><b>{t[event.actorKey]}</b></span><span><small>{t.source}</small><b>{t[event.sourceKey]}</b></span><span><small>{t.auditSystem}</small><b>{systemLabels[event.system]}</b></span></div>
              <footer><span><ShieldCheck size={13} />{t.localReview}</span>{statusKey !== "eventReviewed" && event.status !== "recorded" && <button onClick={() => markAuditEventReviewed(event.id)}><Check size={13} />{t.markEventReviewed}</button>}</footer>
            </div>}
          </article>;
        })}
      </div>
    </section>
  </section>;
}
