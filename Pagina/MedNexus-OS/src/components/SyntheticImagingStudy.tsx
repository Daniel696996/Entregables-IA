"use client";

import { useState } from "react";
import { Maximize2, Rotate3D, ShieldCheck } from "lucide-react";
import type { InventoryModel, Locale } from "@/types/clinical";

/** Anatomical SVG illustration for UI demonstration only; never represents a clinical study. */
export default function SyntheticImagingStudy({ locale, onOpen3d, compact = false }: {
  locale: Locale;
  onOpen3d: (model: InventoryModel) => void;
  compact?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [model, setModel] = useState<InventoryModel>("fracture");
  const es = locale === "es";
  return <section className={"synthetic-study " + (compact ? "compact" : "")} aria-label={es ? "Estudio de imagen ilustrativo" : "Illustrative imaging study"}>
    <div className="synthetic-study-toolbar"><span><i />{es ? "RADIOGRAFÍA SINTÉTICA · DEMO" : "SYNTHETIC X-RAY · DEMO"}</span><label><Maximize2 size={13} /><input aria-label={es ? "Acercar imagen" : "Zoom image"} type="range" min="0.8" max="1.5" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label></div>
    <div className="synthetic-xray" role="img" aria-label={es ? "Ilustración radiográfica sintética de un hueso, sin valor diagnóstico" : "Synthetic radiographic bone illustration, not diagnostic"}>
      <svg viewBox="0 0 280 240" style={{ transform: `scale(${zoom})` }} aria-hidden="true">
        <defs><linearGradient id="boneGlow" x1="0" x2="1"><stop stopColor="#dcebf4"/><stop offset=".5" stopColor="#fff"/><stop offset="1" stopColor="#b8d3e1"/></linearGradient><filter id="softGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M102 36c-14-11-31 2-24 17 4 8 14 11 22 11l-1 111c-12 0-22 5-24 14-4 15 13 27 27 17 13 10 30-2 25-17-3-9-12-14-23-14l2-111c12 0 22-5 24-14 4-15-12-28-26-18z" fill="url(#boneGlow)" stroke="#e6f6ff" strokeWidth="2" filter="url(#softGlow)" />
        <path d="m106 100 28 17-31 13" fill="none" stroke="#f18a79" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="104" cy="116" r="8" fill="#f18a79" opacity=".8"/><path d="M136 116h43" stroke="#f18a79" strokeDasharray="4 4"/><circle cx="181" cy="116" r="4" fill="#f18a79"/>
        <path d="M27 24v20m0-20h20M253 24v20m0-20h-20M27 216v-20m0 20h20m206 0v-20m0 20h-20" stroke="#83d5e8" strokeWidth="1.5" opacity=".7"/>
        <path d="M28 120h25m174 0h25M140 18v18m0 168v18" stroke="#83d5e8" strokeDasharray="2 5" opacity=".45"/>
      </svg>
      <span className="synthetic-xray-label">{es ? "ILUSTRACIÓN EDUCATIVA" : "EDUCATIONAL ILLUSTRATION"}</span>
    </div>
    <div className="synthetic-study-caption"><span><ShieldCheck size={14} />{es ? "Imagen ficticia · no diagnóstica" : "Fictional image · not diagnostic"}</span><div><select value={model} onChange={(event) => setModel(event.target.value as InventoryModel)} aria-label={es ? "Modelo anatómico" : "Anatomical model"}><option value="fracture">{es ? "Hueso · fractura" : "Bone · fracture"}</option><option value="osteoporosis">{es ? "Osteoporosis · esquema" : "Osteoporosis · schematic"}</option><option value="pneumonia">{es ? "Neumonía · esquema" : "Pneumonia · schematic"}</option><option value="cell">{es ? "Estructura celular" : "Cell structure"}</option><option value="defibrillator">{es ? "Equipo biomédico" : "Medical device"}</option></select><button onClick={() => onOpen3d(model)}><Rotate3D size={14} />{es ? "Explorar 3D" : "Explore 3D"}</button></div></div>
  </section>;
}
