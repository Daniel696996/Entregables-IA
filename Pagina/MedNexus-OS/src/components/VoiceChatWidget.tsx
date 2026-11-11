"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AudioLines, ChevronDown, Mic, MicOff, Send, Sparkles, X } from "lucide-react";
import type { Clinician, InventoryItem, Locale, Section } from "@/types/clinical";

type VoiceResult = ArrayLike<{ transcript: string }> & { isFinal?: boolean };
type VoiceEvent = Event & { results: ArrayLike<VoiceResult> };
interface VoiceRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: VoiceEvent) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechWindow = {
  SpeechRecognition?: new () => VoiceRecognition;
  webkitSpeechRecognition?: new () => VoiceRecognition;
};

interface Props {
  locale: Locale;
  clinicians: Clinician[];
  inventory: InventoryItem[];
  canAccessSecurity: boolean;
  onNavigate: (section: Section, filterWaiting?: boolean) => void;
}

export default function VoiceChatWidget({ locale, clinicians, inventory, canAccessSecurity, onNavigate }: Props) {
  const es = locale === "es";
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [draft, setDraft] = useState("");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<VoiceRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const latestTranscriptRef = useRef("");
  const processedTranscriptRef = useRef("");

  useEffect(() => () => {
    if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  function finishSpeech(transcriptValue: string) {
    const spoken = transcriptValue.trim();
    if (!spoken || spoken === processedTranscriptRef.current) return;
    processedTranscriptRef.current = spoken;
    if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
    recognitionRef.current?.stop();
    setListening(false);
    answerTo(spoken, true);
  }

  function answerTo(message: string, speak = false) {
    const query = message.trim();
    if (!query) return;
    const normalized = query.toLocaleLowerCase();
    let answer = "";
    let target: Section | null = null;
    let waitingFilter = false;

    if (/no puedo respirar|dolor fuerte en el pecho|inconsciente|convulsi[oó]n|sangrado abundante|can't breathe|severe chest pain|unconscious|seizure|heavy bleeding/.test(normalized)) {
      answer = es
        ? "Si esto describe una emergencia real, llama al 123 en Medellín o al servicio local y busca atención inmediata. Esta demo no evalúa ni contacta emergencias."
        : "If this describes a real emergency, call 123 in Medellín or your local service and seek immediate care. This demo cannot assess or contact emergency services.";
    } else if (/camilo|jaramillo/.test(normalized)) {
      target = "team";
      answer = es
        ? "Camilo Jaramillo figura como especialista de infraestructura y redes. Su ficha y actividad son datos de demostración."
        : "Camilo Jaramillo is listed as an infrastructure and networks specialist. His profile and activity are demo data.";
    } else if (/jos[eé]|pab[oó]n|administrador|admin/.test(normalized)) {
      target = "team";
      answer = es
        ? "José Daniel Pabón Villanueva es el perfil administrador de esta demostración. Su acceso a Seguridad clínica es simulado."
        : "José Daniel Pabón Villanueva is the administrator profile in this demo. His Clinical Safety access is simulated.";
    } else if (/equipo|m[eé]dico|doctor|doctora|especialista|staff|clinician|doctor available/.test(normalized)) {
      target = "team";
      const available = clinicians.filter((person) => person.status === "available").slice(0, 4);
      const names = available.map((person) => `${person.name} · ${person.title}`).join("; ");
      answer = es
        ? `Profesionales disponibles en esta demo: ${names || "consulta Equipo médico"}. Los perfiles y turnos son ilustrativos.`
        : `Available in this demo: ${names || "see the care team"}. Profiles and shifts are illustrative.`;
    } else if (/inventario|stock|existencias|medicamento|insumo|farmacia|inventory|supply|medicine/.test(normalized)) {
      target = "inventory";
      const lowStock = inventory.filter((item) => item.stock <= item.threshold);
      const samples = (/bajo|m[ií]nimo|critical|low/.test(normalized) ? lowStock : inventory).slice(0, 4);
      const list = samples.map((item) => `${item.name} (${item.stock} ${item.unit})`).join("; ");
      answer = es
        ? `${inventory.length} referencias ficticias. ${lowStock.length} bajo el mínimo. ${list ? `Muestra: ${list}.` : "No hay referencias bajo el mínimo."}`
        : `${inventory.length} fictional references. ${lowStock.length} below minimum. ${list ? `Sample: ${list}.` : "No items are below minimum."}`;
    } else if (/paciente|patients|expediente/.test(normalized) && /triaje|triage|espera|waiting/.test(normalized)) {
      target = "patients";
      waitingFilter = true;
      answer = es
        ? "Abriendo pacientes en espera. Esta demo no tiene una clasificación clínica de triaje; el filtro muestra el estado operativo de espera."
        : "Opening patients marked as waiting. This demo has no clinical triage classification; the filter shows the operational waiting status.";
    } else if (/hospital|mapa|ubicaci[oó]n|direcci[oó]n|hospital|location|map/.test(normalized)) {
      target = "locations";
      answer = es ? "Abriendo la red hospitalaria y el mapa de Medellín." : "Opening the hospital network and Medellín map.";
    } else if (/agenda|turno|cita|calendario|schedule|appointment|calendar/.test(normalized)) {
      target = "schedule";
      answer = es ? "Abriendo la agenda clínica de demostración." : "Opening the demo clinical schedule.";
    } else if (/triaje|triage|consulta virtual|s[ií]ntoma|symptom|virtual visit/.test(normalized)) {
      target = "triage";
      answer = es ? "Abriendo la guía de consulta asistida. No emite diagnósticos ni recomendaciones clínicas." : "Opening the guided intake. It does not provide diagnoses or clinical recommendations.";
    } else if (/paciente|patients|expediente/.test(normalized)) {
      target = "patients";
      answer = es ? "Abriendo el tablero de pacientes ficticios." : "Opening the fictional patient board.";
    } else if (/inicio|resumen|seguridad cl[ií]nica|dashboard|home|overview/.test(normalized)) {
      if (canAccessSecurity) {
        target = "overview";
        answer = es ? "Abriendo el centro de seguridad clínica." : "Opening the clinical safety center.";
      } else {
        answer = es ? "Seguridad clínica requiere el perfil Administrador de José Daniel. Mantengo tu sesión de Médico y Paciente." : "Clinical Safety requires José Daniel's Administrator profile. Your Clinician and Patient access remains active.";
      }
    } else {
      answer = es
        ? "Puedo abrir pacientes, equipo médico, inventario, agenda, hospitales o consulta asistida. También puedo resumir el stock de demostración."
        : "I can open patients, care team, inventory, schedule, hospitals or guided intake, and summarize demo inventory.";
    }

    setTranscript(query);
    setReply(answer);
    setError("");
    if (target) onNavigate(target, waitingFilter);
    if (speak && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.lang = es ? "es-CO" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const speechWindow = window as unknown as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError(es ? "Este navegador no admite dictado por voz. Puedes escribir tu consulta." : "This browser does not support speech recognition. You can type your question.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setTranscript("");
    setReply("");
    latestTranscriptRef.current = "";
    processedTranscriptRef.current = "";
    const recognizer = new Recognition();
    recognizer.lang = es ? "es-CO" : "en-US";
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.onresult = (event) => {
      const results = Array.from(event.results);
      const spoken = results.map((result) => result[0]?.transcript || "").join(" ").trim();
      setTranscript(spoken);
      latestTranscriptRef.current = spoken;
      if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
      const silenceWindow = results.some((result) => result.isFinal) ? 850 : 1400;
      silenceTimerRef.current = window.setTimeout(() => finishSpeech(latestTranscriptRef.current), silenceWindow);
    };
    recognizer.onerror = (event) => {
      if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
      setListening(false);
      const errorCode = (event as Event & { error?: string }).error || "error";
      setError(es ? `No se pudo reconocer la voz (${errorCode}). Escribe tu consulta.` : `Speech could not be recognized (${errorCode}). Type your question.`);
    };
    recognizer.onend = () => {
      setListening(false);
      if (latestTranscriptRef.current && latestTranscriptRef.current !== processedTranscriptRef.current) finishSpeech(latestTranscriptRef.current);
    };
    recognitionRef.current = recognizer;
    try {
      recognizer.start();
      setListening(true);
    } catch {
      setListening(false);
      setError(es ? "No se pudo iniciar el micrófono. Intenta escribir la consulta." : "Could not start the microphone. Try typing your question.");
    }
  }

  return <div className="voice-chat-widget">
    {open && <section className="voice-chat-panel" aria-label={es ? "Chat de voz clínico" : "Clinical voice chat"}>
      <header className="voice-chat-header"><span className="voice-chat-mark"><Sparkles size={16} /></span><div><b>Voice Chat</b><small>Azteclab Insights · demo local</small></div><button type="button" className="voice-chat-close" aria-label={es ? "Cerrar chat de voz" : "Close voice chat"} onClick={() => { if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; latestTranscriptRef.current = ""; recognitionRef.current?.stop(); setListening(false); setOpen(false); }}><X size={16} /></button></header>
      <div className="voice-chat-status-row"><span className={listening ? "voice-live-dot listening" : "voice-live-dot"} />{listening ? (es ? "Escuchando ahora" : "Listening now") : (es ? "Listo para ayudarte" : "Ready to help")}<span className="voice-chat-badge">AUTO VAD</span></div>
      <div className={"voice-chat-wave " + (listening ? "active" : "")} aria-hidden="true">{Array.from({ length: 23 }, (_, index) => <i key={`wave-${index}`} style={{ "--height": `${7 + (index * 17) % 27}px`, "--delay": `${(index % 8) * -0.13}s` } as CSSProperties & { "--height": string; "--delay": string }} />)}</div>
      {transcript && <div className="voice-chat-transcript"><small>{es ? "Tú" : "You"}</small><p>{transcript}</p></div>}
      {reply && <div className="voice-chat-reply"><small><Sparkles size={12} />{es ? "MedNexus · respuesta local" : "MedNexus · local reply"}</small><p>{reply}</p></div>}
      {error && <p className="voice-chat-error" role="status">{error}</p>}
      <form className="voice-chat-form" onSubmit={(event) => { event.preventDefault(); answerTo(draft); setDraft(""); }}>
        <button type="button" className={"voice-chat-mic " + (listening ? "is-listening" : "")} onClick={toggleListening} aria-label={listening ? (es ? "Detener voz" : "Stop voice input") : (es ? "Hablar" : "Speak")}><AudioLines size={17} />{listening ? <MicOff size={15} /> : <Mic size={15} />}</button>
        <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={es ? 'Hable ahora: “Azteclab, muéstrame pacientes con triaje…”' : 'Try: “Azteclab, show patients in triage…”'} aria-label={es ? "Escribe una consulta" : "Type a question"} />
        <button type="submit" className="voice-chat-send" disabled={!draft.trim()} aria-label={es ? "Enviar consulta" : "Send question"}><Send size={15} /></button>
      </form>
      <p className="voice-chat-disclaimer">{es ? "El dictado usa el navegador; el audio no se envía a AztecLab ni se guarda en esta demo." : "Speech recognition uses the browser; audio is not sent to AztecLab or stored by this demo."} <a href="https://www.azteclab.co/" target="_blank" rel="noreferrer">{es ? "Conocer AztecLab" : "About AztecLab"}</a></p>
    </section>}
    <button type="button" className={"voice-chat-launcher " + (listening ? "is-listening" : "")} onClick={() => { setOpen((value) => !value); if (!open) window.setTimeout(() => inputRef.current?.focus(), 50); }} aria-expanded={open} aria-label={open ? (es ? "Cerrar Voice Chat" : "Close Voice Chat") : (es ? "Abrir Voice Chat" : "Open Voice Chat")}>
      {open ? <ChevronDown size={18} /> : listening ? <AudioLines size={18} /> : <Mic size={18} />}<span>{listening ? (es ? "Escuchando" : "Listening") : "Voice Chat"}</span><span className="voice-chat-launcher-wave" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
  </div>;
}
