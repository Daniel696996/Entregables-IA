"use client";

import { useEffect, useState } from "react";
import { LocateFixed, MapPin, Navigation } from "lucide-react";
import type { Locale } from "@/types/clinical";
import { medellinFacilities } from "@/data/mock-data";

type Coordinates = { lat: number; lng: number; accuracy: number };
const MEDELLIN = { lat: 6.2442, lng: -75.5812 };
const maxDisplayableAccuracyMeters = 2_000;

export default function PatientLocationPreview({ locale, onOpenMap }: { locale: Locale; onOpenMap: () => void }) {
  const es = locale === "es";
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const inMedellin = Boolean(location && location.lat >= 6.15 && location.lat <= 6.35 && location.lng >= -75.7 && location.lng <= -75.45);
  const precisionUsable = Boolean(location && location.accuracy <= maxDisplayableAccuracyMeters);
  const showCurrentMarker = Boolean(location && inMedellin && precisionUsable);
  const pointStyle = (point: { lat: number; lng: number }) => ({
    left: `${Math.max(7, Math.min(93, ((point.lng + 75.7) / .25) * 100))}%`,
    top: `${Math.max(12, Math.min(88, (1 - (point.lat - 6.15) / .2) * 100))}%`,
  });

  function locate() {
    if (!navigator.geolocation) {
      setError(es ? "Este navegador no ofrece geolocalización." : "Geolocation is unavailable in this browser.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy });
      setLocating(false);
    }, () => {
      setLocating(false);
      setError(es ? "No se concedió ubicación. Se conserva Medellín como referencia." : "Location permission was not granted. Medellín remains the reference.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  useEffect(() => {
    if (!navigator.permissions?.query) return;
    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      if (permission.state !== "granted") return;
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy });
      }, undefined, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
    }).catch(() => undefined);
  }, []);

  return <section className="patient-location-preview azteclab-stream-panel" aria-label={es ? "Ubicación y red cercana" : "Location and nearby network"}>
    <div className="patient-location-map" role="img" aria-label={es ? "Mapa de Medellín con hospitales y ubicación" : "Map of Medellín with hospitals and location"}>
      <svg className="patient-map-svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1000" height="300" className="patient-map-ground" />
        <path className="patient-map-green" d="M40 30l140-21 66 44-21 55-150 14-54-42zM734 197l124-26 90 39-36 70-145 12-59-51z" />
        <path className="patient-map-river" d="M-20 178c110-44 172 30 267 6s133-78 224-51 155 54 250 29 182-18 300 12" />
        <g className="patient-map-streets"><path d="M-20 55l350 121 253-138 430 113M-18 252l281-111 240 123 515-151M92-20l82 171-50 178M294-20l83 173-48 172M509-20l58 181-33 170M718-10l64 173-34 169M-10 114l1035 115M-20 208L1010 47" /></g>
        <g className="patient-map-avenues"><path d="M-20 94c174-39 291-22 416 31s272 73 620 6M238-20c51 111 136 156 208 194s129 67 195 146M-22 247c188-44 335-131 484-169S792 14 1022 28" /></g>
      </svg>
      <span className="patient-map-place place-north">LAURELES</span><span className="patient-map-place place-center">CENTRO</span><span className="patient-map-place place-south">EL POBLADO</span>
      {medellinFacilities.slice(0, 4).map((facility, index) => <span className="patient-map-marker" key={facility.id} style={pointStyle(facility.coordinates)} title={facility.name}><i>{index + 1}</i></span>)}
      {showCurrentMarker && location ? <span className="patient-current-location" style={pointStyle(location)}><i /><b /></span> : (!location || !precisionUsable) && <span className="patient-current-location patient-reference-location" style={pointStyle(MEDELLIN)}><i /><b /></span>}
      <span className="patient-map-label"><MapPin size={12} />{location && precisionUsable ? (inMedellin ? (es ? `Ubicación actual (Medellín) · ±${location.accuracy >= 1000 ? `${(location.accuracy / 1000).toFixed(1)} km` : `${Math.round(location.accuracy)} m`}` : `Current location (Medellín) · ±${location.accuracy >= 1000 ? `${(location.accuracy / 1000).toFixed(1)} km` : `${Math.round(location.accuracy)} m`}`) : (es ? "Ubicación fuera de la vista de Medellín" : "Current location is outside the Medellín view")) : location ? (es ? `Precisión baja · ±${(location.accuracy / 1000).toFixed(1)} km · Medellín referencia` : `Low accuracy · ±${(location.accuracy / 1000).toFixed(1)} km · Medellín reference`) : (es ? "Medellín · ubicación de referencia" : "Medellín · reference location")}</span>
    </div>
    <div className="patient-location-copy"><span className="eyebrow"><Navigation size={13} />{es ? "RED CERCANA" : "NEARBY NETWORK"}</span><b>{showCurrentMarker ? (es ? "Ubicación actual (Medellín)" : "Current location (Medellín)") : (es ? "Medellín, Colombia" : "Medellín, Colombia")}</b><p>{location && !precisionUsable ? (es ? `Precisión del navegador baja (±${(location.accuracy / 1000).toFixed(1)} km); se muestra Medellín como referencia. La ubicación no se guarda.` : `Browser accuracy is low (±${(location.accuracy / 1000).toFixed(1)} km); Medellín remains the reference. Location is not stored.`) : location ? (es ? `Precisión del dispositivo ±${Math.round(location.accuracy)} m. La ubicación solo se usa en este navegador.` : `Device accuracy ±${Math.round(location.accuracy)} m. Location stays in this browser.`) : (es ? "Mapa de referencia de Medellín. Permite la ubicación para marcar tu posición y precisión." : "Medellín reference map. Enable location to show your position and accuracy.")}</p>
      {error && <small className="patient-location-error" role="status">{error}</small>}
      <div className="patient-location-actions"><button type="button" className="button button-secondary button-small" onClick={locate} disabled={locating}><LocateFixed size={14} />{locating ? (es ? "Localizando…" : "Locating…") : (es ? "Usar mi ubicación" : "Use my location")}</button><button type="button" className="patient-location-open" onClick={onOpenMap}>{es ? "Hospitales cercanos" : "Nearby hospitals"}<Navigation size={13} /></button></div>
    </div>
  </section>;
}
