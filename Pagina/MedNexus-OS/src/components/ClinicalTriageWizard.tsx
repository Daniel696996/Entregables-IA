"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, HeartPulse, ShieldAlert } from "lucide-react";
import type { Locale } from "@/types/clinical";

export default function ClinicalTriageWizard({ locale, onSendSummary }: { locale: Locale; onSendSummary: (summary: string) => void }) {
  const es = locale === "es";
  const steps = es ? ["Síntomas", "Zona", "Intensidad", "Antecedentes", "Resumen"] : ["Symptoms", "Area", "Intensity", "History", "Summary"];
  const [step, setStep] = useState(0);
  const [symptom, setSymptom] = useState("");
  const [area, setArea] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [history, setHistory] = useState("");
  const [redFlags, setRedFlags] = useState("");
  const [description, setDescription] = useState("");
  const [finished, setFinished] = useState(false);

  const labels = useMemo(() => es ? {
    symptoms: ["Dolor", "Fiebre", "Mareo", "Dificultad respiratoria", "Lesión", "Otro / prefiero describirlo"],
    areas: ["Cabeza", "Pecho", "Abdomen", "Espalda", "Articulación o extremidad", "Otra zona / no aplica"],
    redFlags: "¿Hay dificultad intensa para respirar, dolor fuerte en el pecho, pérdida del conocimiento, convulsiones o sangrado abundante?",
  } : {
    symptoms: ["Pain", "Fever", "Dizziness", "Breathing difficulty", "Injury", "Other / describe below"],
    areas: ["Head", "Chest", "Abdomen", "Back", "Joint or limb", "Other / not applicable"],
    redFlags: "Is there severe breathing difficulty, severe chest pain, loss of consciousness, seizure, or heavy bleeding?",
  }, [es]);

  const summary = [
    `${es ? "Síntoma reportado" : "Reported symptom"}: ${symptom || (es ? "sin seleccionar" : "not selected")}`,
    `${es ? "Zona" : "Area"}: ${area || (es ? "sin seleccionar" : "not selected")}`,
    `${es ? "Intensidad indicada" : "Reported intensity"}: ${intensity}/10`,
    `${es ? "Antecedentes" : "History"}: ${history || (es ? "no indicado" : "not provided")}`,
    `${es ? "Señales de alarma referidas" : "Reported warning signs"}: ${redFlags || (es ? "sin responder" : "not answered")}`,
    `${es ? "Descripción" : "Description"}: ${description.trim() || (es ? "sin texto adicional" : "no additional text")}`,
  ].join(" · ");

  function next() {
    if (step === 3 && redFlags === "yes") {
      setFinished(true);
      return;
    }
    setStep((current) => Math.min(4, current + 1));
  }

  const canContinue = step === 0 ? Boolean(symptom) : step === 1 ? Boolean(area) : step === 3 ? Boolean(history) && Boolean(redFlags) : true;

  return <section className="content-area triage-page">
    <div className="triage-heading"><div><span className="eyebrow"><HeartPulse size={14} />{es ? "ORIENTACIÓN DE DEMOSTRACIÓN" : "DEMO INTAKE GUIDE"}</span><h1>{es ? "Consulta virtual · captura guiada" : "Virtual visit · guided intake"}</h1><p>{es ? "Organiza la información para compartirla con un profesional de salud." : "Organize information to share with a healthcare professional."}</p></div><span className="triage-safety-badge"><ShieldAlert size={14} />{es ? "No es un triage clínico" : "Not clinical triage"}</span></div>
    <div className="triage-disclaimer"><ShieldAlert size={16} /><span>{es ? "No ingreses información identificable real. Esta guía no diagnostica, no determina urgencia y no sustituye una evaluación profesional. No guarda ni envía tus respuestas." : "Do not enter identifiable real information. This guide does not diagnose, determine urgency, or replace professional assessment. It does not store or send your answers."}</span></div>

    {finished ? <section className="triage-emergency-card"><div><ShieldAlert size={22} /></div><span className="eyebrow">{es ? "BUSCA AYUDA INMEDIATA" : "SEEK IMMEDIATE HELP"}</span><h2>{es ? "No continúes el cuestionario" : "Do not continue this questionnaire"}</h2><p>{es ? "Marcaste una señal de alarma. Si esto describe una situación real, contacta ahora los servicios de emergencia locales o acude al servicio de urgencias más cercano. La demo no llama ni activa asistencia." : "You selected a warning sign. If this describes a real situation, contact local emergency services now or go to the nearest emergency department. The demo does not call or dispatch help."}</p><a href="tel:123">{es ? "Emergencias Medellín · 123" : "Medellín emergency line · 123"}</a></section>
      : <section className="triage-card panel glass">
        <div className="triage-progress-head"><span><b>{es ? `Paso ${step + 1} de 5` : `Step ${step + 1} of 5`}</b><small>{steps[step]}</small></span><span><ClipboardList size={17} />{es ? "Solo local" : "Local only"}</span></div>
        <div className="triage-progress"><i style={{ width: `${((step + 1) / 5) * 100}%` }} /></div>
        {step === 0 && <div className="triage-step"><h2>{es ? "¿Qué deseas reportar?" : "What would you like to report?"}</h2><div className="triage-choice-grid">{labels.symptoms.map((option) => <button type="button" className={symptom === option ? "selected" : ""} onClick={() => setSymptom(option)} key={option}>{option}</button>)}</div><label>{es ? "Descripción breve (opcional)" : "Brief description (optional)"}<textarea maxLength={280} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={es ? "Describe lo que notas, sin datos personales…" : "Describe what you notice, without personal data…"} /></label></div>}
        {step === 1 && <div className="triage-step"><h2>{es ? "¿En qué zona se presenta?" : "Where is it located?"}</h2><div className="triage-choice-grid">{labels.areas.map((option) => <button type="button" className={area === option ? "selected" : ""} onClick={() => setArea(option)} key={option}>{option}</button>)}</div></div>}
        {step === 2 && <div className="triage-step"><h2>{es ? "Intensidad percibida" : "Perceived intensity"}</h2><p>{es ? "Indica un número de 0 (ninguna) a 10 (máxima), según tu percepción." : "Choose 0 (none) to 10 (maximum), based on your perception."}</p><div className="triage-intensity-value">{intensity}<small>/10</small></div><input type="range" min="0" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} aria-label={es ? "Intensidad percibida de cero a diez" : "Perceived intensity from zero to ten"} /><div className="triage-range-labels"><span>{es ? "Ninguna" : "None"}</span><span>{es ? "Máxima" : "Maximum"}</span></div></div>}
        {step === 3 && <div className="triage-step"><h2>{es ? "Antecedentes y seguridad" : "History and safety"}</h2><fieldset><legend>{es ? "¿Quieres reportar antecedentes relevantes?" : "Would you like to report relevant history?"}</legend><div className="triage-choice-grid compact">{[["yes", es ? "Sí" : "Yes"], ["no", es ? "No" : "No"], ["unknown", es ? "Prefiero no responder" : "Prefer not to say"]].map(([value, label]) => <button type="button" className={history === value ? "selected" : ""} onClick={() => setHistory(value)} key={value}>{label}</button>)}</div></fieldset><fieldset><legend>{labels.redFlags}</legend><div className="triage-choice-grid compact"><button type="button" className={redFlags === "yes" ? "selected danger" : ""} onClick={() => setRedFlags("yes")}>{es ? "Sí" : "Yes"}</button><button type="button" className={redFlags === "no" ? "selected" : ""} onClick={() => setRedFlags("no")}>{es ? "No" : "No"}</button><button type="button" className={redFlags === "unknown" ? "selected" : ""} onClick={() => setRedFlags("unknown")}>{es ? "No estoy seguro" : "Not sure"}</button></div></fieldset></div>}
        {step === 4 && <div className="triage-step"><span className="triage-summary-icon"><CheckCircle2 size={20} /></span><h2>{es ? "Resumen para revisión profesional" : "Summary for professional review"}</h2><p>{summary}</p><div className={"triage-flow-guidance " + (redFlags === "unknown" ? "caution" : "") }><b>{es ? "Orientación del flujo · no es un dictamen médico" : "Flow guidance · not a medical opinion"}</b><p>{redFlags === "unknown" ? (es ? "No estás seguro sobre una señal de alarma. Busca orientación de un profesional de salud ahora; si notas deterioro o síntomas intensos, contacta los servicios de emergencia locales." : "You are unsure about a warning sign. Seek guidance from a healthcare professional now; if symptoms are severe or worsening, contact local emergency services.") : (es ? "No seleccionaste señales de alarma en este cuestionario. Comparte el resumen con un profesional y busca atención local si los síntomas empeoran o te preocupan." : "You did not select a warning sign in this questionnaire. Share the summary with a professional and seek local care if symptoms worsen or concern you.")}</p></div><div className="triage-summary-note">{es ? "La aplicación organiza respuestas autodeclaradas. No diagnostica, clasifica urgencia ni recomienda tratamiento." : "The app organizes self-reported answers. It does not diagnose, classify urgency or recommend treatment."}</div><button className="button button-primary" onClick={() => onSendSummary(summary)}><ClipboardList size={15} />{es ? "Preparar resumen en asistente" : "Prepare summary in assistant"}</button></div>}
        <div className="triage-actions">{step > 0 && <button className="button button-quiet" onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={14} />{es ? "Atrás" : "Back"}</button>}{step < 4 && <button className="button button-primary" disabled={!canContinue} onClick={next}>{es ? "Continuar" : "Continue"}<ArrowRight size={14} /></button>}</div>
      </section>}
    <p className="triage-footer">{es ? "Si necesitas ayuda urgente, contacta directamente los servicios locales. La línea 123 está verificada para emergencias en Medellín." : "For urgent help, contact local emergency services directly. The 123 line is verified for emergencies in Medellín."}</p>
  </section>;
}
