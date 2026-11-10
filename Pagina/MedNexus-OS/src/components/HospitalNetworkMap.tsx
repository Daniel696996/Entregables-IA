"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, ArrowUpRight, LocateFixed, MapPin, Navigation, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import type { Locale } from "@/types/clinical";

type Coordinates = { lat: number; lng: number };
type MapStatus = "missing-key" | "loading" | "ready" | "error";

interface GooglePlace {
  id?: string;
  displayName?: { text?: string } | string;
  formattedAddress?: string;
  location?: Coordinates;
  nationalPhoneNumber?: string;
  googleMapsURI?: string;
  fetchFields?: (request: { fields: string[] }) => Promise<void>;
}

interface GoogleMapInstance {
  setCenter: (center: Coordinates) => void;
  fitBounds: (bounds: GoogleBounds) => void;
}

interface GoogleMarker {
  map: GoogleMapInstance | null;
  addEventListener: (name: string, listener: () => void) => void;
}

interface GoogleBounds {
  extend: (point: Coordinates) => void;
}

interface GoogleMapSdk {
  maps: {
    importLibrary: (name: string) => Promise<unknown>;
  };
}

interface GoogleMapLibrary {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance;
}

interface GoogleCoreLibrary {
  LatLngBounds: new () => GoogleBounds;
  UnitSystem: { METRIC: unknown };
}

interface GoogleMarkerLibrary {
  AdvancedMarkerElement: new (options: { map: GoogleMapInstance; position: Coordinates; title: string; content?: HTMLElement; gmpClickable?: boolean }) => GoogleMarker;
}

interface GooglePlaceLibrary {
  Place: {
    searchNearby: (request: Record<string, unknown>) => Promise<{ places?: GooglePlace[] }>;
  };
  SearchNearbyRankPreference: { DISTANCE: string };
}

interface GoogleRoutesLibrary {
  RouteMatrix: {
    computeRouteMatrix: (request: Record<string, unknown>) => Promise<{
      matrix?: Array<Array<{ durationMillis?: number; distanceMeters?: number; condition?: string }>>
        | { rows?: Array<{ items?: Array<{ durationMillis?: number; distanceMeters?: number; condition?: string }> }> };
    }>;
  };
}

declare global {
  interface Window {
    google?: GoogleMapSdk;
  }
}

const defaultMedellin: Coordinates = { lat: 6.2442, lng: -75.5812 };
const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
let googleMapsLoader: Promise<GoogleMapSdk> | null = null;

function loadGoogleMaps(key: string): Promise<GoogleMapSdk> {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google as GoogleMapSdk);
  if (googleMapsLoader) return googleMapsLoader;

  const loader = new Promise<GoogleMapSdk>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&libraries=places`;
    script.onload = () => {
      if (window.google?.maps?.importLibrary) resolve(window.google as GoogleMapSdk);
      else reject(new Error("Google Maps did not initialize."));
    };
    script.onerror = () => reject(new Error("Google Maps could not be loaded."));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    googleMapsLoader = null;
    throw error;
  });
  googleMapsLoader = loader;
  return loader;
}

function placeName(place: GooglePlace) {
  return typeof place.displayName === "string" ? place.displayName : place.displayName?.text || "Hospital";
}

function markerContent(label: string) {
  const element = document.createElement("div");
  element.className = "hospital-map-marker";
  element.textContent = label;
  return element;
}

export default function HospitalNetworkMap({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const apiKey = googleMapsKey;
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const originMarkerRef = useRef<GoogleMarker | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const mapSdkRef = useRef<GoogleMapSdk | null>(null);
  const placesLibRef = useRef<GooglePlaceLibrary | null>(null);
  const markerLibRef = useRef<GoogleMarkerLibrary | null>(null);
  const routesLibRef = useRef<GoogleRoutesLibrary | null>(null);
  const coreLibRef = useRef<GoogleCoreLibrary | null>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>(apiKey ? "loading" : "missing-key");
  const [origin, setOrigin] = useState<Coordinates>(defaultMedellin);
  const [locationState, setLocationState] = useState<"default" | "locating" | "current" | "denied">("default");
  const [hospitals, setHospitals] = useState<Array<{ id: string; place: GooglePlace; name: string; address: string; phone: string; minutes: number | null; distanceMeters: number | null }>>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [searching, setSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapError, setMapError] = useState("");

  const searchNearby = useCallback(async (center: Coordinates) => {
    const map = mapRef.current;
    const maps = mapSdkRef.current;
    const placesLibrary = placesLibRef.current;
    if (!map || !maps || !placesLibrary) return;

    setSearching(true);
    setMapError("");
    try {
      const { places = [] } = await placesLibrary.Place.searchNearby({
        fields: ["id", "displayName", "formattedAddress", "location", "googleMapsURI"],
        locationRestriction: { center, radius: 8000 },
        includedPrimaryTypes: ["hospital", "medical_clinic", "medical_center"],
        maxResultCount: 8,
        rankPreference: placesLibrary.SearchNearbyRankPreference.DISTANCE,
        language: es ? "es" : "en",
        region: "CO",
      });

      markersRef.current.forEach((marker) => { marker.map = null; });
      markersRef.current = [];
      const validPlaces = places.filter((place) => place.location);
      const initialResults = validPlaces.map((place, index) => ({
        id: place.id || `hospital-${index}`,
        place,
        name: placeName(place),
        address: place.formattedAddress || (es ? "Dirección no disponible" : "Address not available"),
        phone: place.nationalPhoneNumber || "",
        minutes: null,
        distanceMeters: null,
      }));
      setHospitals(initialResults);
      setSelectedHospitalId((current) => initialResults.some((item) => item.id === current) ? current : initialResults[0]?.id || "");

      const core = coreLibRef.current;
      const markerLibrary = markerLibRef.current;
      if (core && validPlaces.length > 0) {
        const bounds = new core.LatLngBounds();
        bounds.extend(center);
        initialResults.forEach((item, index) => {
          const placeLocation = item.place.location;
          if (!placeLocation) return;
          bounds.extend(placeLocation);
          if (!markerLibrary) return;
          const marker = new markerLibrary.AdvancedMarkerElement({
            map,
            position: placeLocation,
            title: item.name,
            content: markerContent(String(index + 1)),
            gmpClickable: true,
          });
          marker.addEventListener("gmp-click", () => setSelectedHospitalId(item.id));
          markersRef.current.push(marker);
        });
        map.fitBounds(bounds);
      }

      const routes = routesLibRef.current;
      if (routes && core && validPlaces.length > 0) {
        try {
          const { matrix } = await routes.RouteMatrix.computeRouteMatrix({
            origins: [center],
            destinations: validPlaces,
            travelMode: "DRIVING",
            routingPreference: "TRAFFIC_AWARE",
            units: core.UnitSystem.METRIC,
            fields: ["durationMillis", "distanceMeters", "condition"],
          });
          const row = Array.isArray(matrix) ? matrix[0] : matrix?.rows?.[0]?.items;
          if (row) {
            setHospitals((current) => current.map((item, index) => ({
              ...item,
              minutes: row[index]?.durationMillis ? Math.max(1, Math.round(row[index].durationMillis! / 60000)) : null,
              distanceMeters: row[index]?.distanceMeters ?? null,
            })));
          }
        } catch {
          setMapError(es ? "No se pudieron calcular los tiempos de ruta." : "Route estimates could not be calculated.");
        }
      }
    } catch {
      setHospitals([]);
      setMapError(es ? "No fue posible cargar centros cercanos. Revisa la clave y las APIs de Google Maps." : "Nearby facilities could not be loaded. Check the Google Maps key and APIs.");
    } finally {
      setSearching(false);
    }
  }, [es]);

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    setMapStatus("loading");
    loadGoogleMaps(apiKey).then(async (maps) => {
      const [mapLibrary, placesLibrary, coreLibrary, markerLibrary] = await Promise.all([
        maps.maps.importLibrary("maps"), maps.maps.importLibrary("places"),
        maps.maps.importLibrary("core"), maps.maps.importLibrary("marker"),
      ]);
      if (cancelled || !mapElement.current) return;
      mapSdkRef.current = maps;
      placesLibRef.current = placesLibrary as GooglePlaceLibrary;
      coreLibRef.current = coreLibrary as GoogleCoreLibrary;
      const { Map } = mapLibrary as GoogleMapLibrary;
      markerLibRef.current = markerLibrary as GoogleMarkerLibrary;
      try { routesLibRef.current = await maps.maps.importLibrary("routes") as GoogleRoutesLibrary; }
      catch { routesLibRef.current = null; }
      if (cancelled || !mapElement.current) return;
      const map = new Map(mapElement.current, { center: origin, zoom: 13, mapId: "DEMO_MAP_ID", mapTypeControl: false, streetViewControl: false, fullscreenControl: true });
      mapRef.current = map;
      const { AdvancedMarkerElement } = markerLibrary as GoogleMarkerLibrary;
      originMarkerRef.current = new AdvancedMarkerElement({ map, position: origin, title: es ? "Ubicación de referencia" : "Reference location", content: markerContent("•") });
      setMapStatus("ready");
    }).catch(() => {
      if (!cancelled) {
        setMapStatus("error");
        setMapError(es ? "Google Maps no pudo iniciarse. Revisa la clave y la configuración de APIs." : "Google Maps could not start. Check the API key and API setup.");
      }
    });
    return () => { cancelled = true; };
  }, [apiKey, es]);

  useEffect(() => {
    if (mapStatus !== "ready" || !mapRef.current) return;
    mapRef.current.setCenter(origin);
    if (originMarkerRef.current) originMarkerRef.current.map = mapRef.current;
    void searchNearby(origin);
  }, [origin, mapStatus, searchNearby]);

  useEffect(() => {
    if (!navigator.permissions?.query) return;
    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      if (permission.state !== "granted") return;
      navigator.geolocation.getCurrentPosition((position) => {
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationState("current");
      });
    }).catch(() => undefined);
  }, [es]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError(es ? "Este navegador no ofrece ubicación." : "This browser does not provide location access.");
      return;
    }
    setLocationState("locating");
    setLocationError("");
    navigator.geolocation.getCurrentPosition((position) => {
      setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
      setLocationState("current");
    }, () => {
      setLocationState("denied");
      setLocationError(es ? "No se concedió acceso. Se mantiene Medellín como centro." : "Location access was not granted. Medellín remains the center.");
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
  }

  async function showHospitalDetails(id: string) {
    setSelectedHospitalId(id);
    const selected = hospitals.find((item) => item.id === id);
    if (!selected || selected.phone || !selected.place.fetchFields) return;
    try {
      await selected.place.fetchFields({ fields: ["nationalPhoneNumber"] });
      const phone = selected.place.nationalPhoneNumber || "";
      setHospitals((current) => current.map((item) => item.id === id ? { ...item, phone } : item));
    } catch {
      setMapError(es ? "El teléfono no está disponible en Google Maps para este centro." : "A phone number is not available for this place in Google Maps.");
    }
  }

  const isMedellinEmergencyArea = locationState !== "current"
    || (origin.lat >= 6.15 && origin.lat <= 6.35 && origin.lng >= -75.7 && origin.lng <= -75.45);
  const originLabel = locationState === "current"
    ? (es ? "Ubicación actual" : "Current location")
    : (es ? "Medellín, Colombia · centro de referencia" : "Medellín, Colombia · reference center");
  const externalSearchUrl = new URL("https://www.google.com/maps/search/");
  externalSearchUrl.searchParams.set("api", "1");
  externalSearchUrl.searchParams.set("query", `${es ? "hospitales cerca de" : "hospitals near"} ${origin.lat},${origin.lng}`);

  return <section className="content-area hospital-network-page">
    <div className="hospital-network-heading"><div><span className="eyebrow"><MapPin size={14} />{es ? "RED HOSPITALARIA" : "HOSPITAL NETWORK"}</span><h1>{es ? "Ubicaciones y red hospitalaria" : "Locations and hospital network"}</h1><p>{es ? "Centros de salud cercanos, rutas y datos de contacto disponibles en Google Maps." : "Nearby health facilities, routes and contact details from Google Maps."}</p></div><span className="hospital-demo-label"><ShieldCheck size={14} />{es ? "Ubicación protegida" : "Location protected"}</span></div>

    <div className="hospital-map-toolbar"><div className="hospital-origin"><span className="hospital-origin-icon"><LocateFixed size={16} /></span><span><small>{es ? "Origen de búsqueda" : "Search origin"}</small><b>{originLabel}</b></span></div><button className="hospital-locate-button" onClick={useCurrentLocation} disabled={locationState === "locating"}><LocateFixed size={15} />{locationState === "locating" ? (es ? "Buscando…" : "Locating…") : (es ? "Usar mi ubicación" : "Use my location")}</button><button className="hospital-refresh-button" onClick={() => void searchNearby(origin)} disabled={searching || mapStatus !== "ready"}><RefreshCw size={15} />{es ? "Actualizar" : "Refresh"}</button></div>
    {locationError && <p className="hospital-inline-error">{locationError}</p>}

    <div className="hospital-network-layout">
      <div className="hospital-map-shell">
        <div ref={mapElement} className="google-map-canvas" aria-label={es ? "Mapa de centros hospitalarios cercanos" : "Nearby hospital facilities map"} />
        {mapStatus !== "ready" && <div className="hospital-map-overlay">
          <div className="hospital-map-art"><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><span className="map-city-label">{locationState === "current" ? (es ? "UBICACIÓN ACTUAL · REFERENCIA" : "CURRENT LOCATION · REFERENCE") : "MEDELLÍN · CO"}</span></div>
          {mapStatus === "loading" && <span className="hospital-map-message">{es ? "Cargando Google Maps…" : "Loading Google Maps…"}</span>}
          {mapStatus === "missing-key" && <div className="hospital-map-setup"><span className="hospital-map-setup-icon"><MapPin size={19} /></span><b>{es ? "Activa Google Maps" : "Connect Google Maps"}</b><p>{es ? "Añade NEXT_PUBLIC_GOOGLE_MAPS_API_KEY al archivo .env.local y habilita Maps JavaScript API, Places API (New) y Routes API." : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local and enable Maps JavaScript API, Places API (New), and Routes API."}</p><a className="hospital-map-external-link" href={externalSearchUrl.toString()} target="_blank" rel="noreferrer">{es ? "Buscar centros en Google Maps" : "Find facilities in Google Maps"}<ArrowUpRight size={13} /></a><small className="hospital-map-external-note">{es ? "Se abrirá Maps con el área de búsqueda seleccionada." : "Maps will open with the selected search area."}</small></div>}
          {mapStatus === "error" && <span className="hospital-map-message error">{mapError}</span>}
        </div>}
        {mapStatus === "ready" && <div className="hospital-map-attribution">Google Maps</div>}
      </div>

      <aside className="hospital-results-panel">
        <div className="hospital-results-heading"><div><h2>{es ? "Centros cercanos" : "Nearby facilities"}</h2><p>{searching ? (es ? "Buscando hospitales y clínicas…" : "Searching hospitals and clinics…") : `${hospitals.length} ${es ? "resultados" : "results"}`}</p></div><span className="hospital-results-count">{hospitals.length.toString().padStart(2, "0")}</span></div>
        {mapError && mapStatus === "ready" && <p className="hospital-inline-error">{mapError}</p>}
        <div className="hospital-results-list">
          {hospitals.map((item, index) => <article className={"hospital-result-card " + (selectedHospitalId === item.id ? "selected" : "")} key={item.id}>
            <button className="hospital-result-select" onClick={() => void showHospitalDetails(item.id)}><span className="hospital-marker-number">{index + 1}</span><span><b>{item.name}</b><small>{item.address}</small></span><ArrowUpRight size={15} /></button>
            <div className="hospital-result-meta"><span><Navigation size={13} />{item.minutes ? `${item.minutes} ${es ? "min en auto" : "min drive"}` : (es ? "Ruta sin estimar" : "No route estimate")}</span>{item.distanceMeters !== null && <small>{item.distanceMeters < 1000 ? `${item.distanceMeters} m` : `${(item.distanceMeters / 1000).toFixed(1)} km`}</small>}</div>
            {selectedHospitalId === item.id && <div className="hospital-result-actions">{item.phone ? <a href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}><Phone size={13} />{item.phone}</a> : <span><Phone size={13} />{es ? "Teléfono no publicado" : "No phone listed"}</span>}{item.place.googleMapsURI && <a href={item.place.googleMapsURI} target="_blank" rel="noreferrer"><MapPin size={13} />{es ? "Abrir en Maps" : "Open in Maps"}</a>}</div>}
          </article>)}
          {mapStatus === "ready" && hospitals.length === 0 && !searching && <div className="hospital-empty"><Activity size={19} /><span>{es ? "No se encontraron centros en el área seleccionada." : "No facilities were found in this area."}</span></div>}
          {mapStatus !== "ready" && <div className="hospital-empty muted"><MapPin size={19} /><span>{es ? "Los resultados aparecerán al conectar Google Maps." : "Results will appear after Google Maps is connected."}</span></div>}
        </div>
        <div className="hospital-results-footer"><span><ShieldCheck size={14} />{es ? "Los teléfonos se consultan al seleccionar un centro." : "Phone details load when a facility is selected."}</span></div>
      </aside>
    </div>

    <div className="hospital-emergency-strip"><span className="hospital-emergency-icon"><Activity size={17} /></span><span><b>{isMedellinEmergencyArea ? (es ? "Emergencia en Medellín" : "Emergency in Medellín") : (es ? "Servicios locales de emergencia" : "Local emergency services")}</b><small>{isMedellinEmergencyArea ? (es ? "La línea única de emergencias de Medellín es 123." : "Medellín's single emergency line is 123.") : (es ? "Confirma el número de emergencias de la zona actual." : "Confirm the emergency number for your current area.")}</small></span>{isMedellinEmergencyArea && <a href="tel:123">{es ? "Llamar al 123" : "Call 123"}<Phone size={14} /></a>}</div>
    <p className="hospital-network-note">{es ? (isMedellinEmergencyArea ? "Los tiempos son estimaciones de Google Maps y pueden variar con el tráfico. En una emergencia, llama al 123." : "Los tiempos son estimaciones de Google Maps. En una emergencia, usa el número local de tu zona.") : (isMedellinEmergencyArea ? "Travel times are Google Maps estimates and may change with traffic. In an emergency, call 123." : "Travel times are Google Maps estimates. In an emergency, use your area's local emergency number.")}</p>
  </section>;
}
