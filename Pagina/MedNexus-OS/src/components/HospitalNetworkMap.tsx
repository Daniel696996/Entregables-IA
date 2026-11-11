"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Activity, ArrowUpRight, LocateFixed, MapPin, Minus, Navigation, Phone, Plus, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { medellinFacilities } from "@/data/mock-data";
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

interface NearbyHospital {
  id: string;
  place: GooglePlace | null;
  name: string;
  address: string;
  coordinates: Coordinates;
  phone: string;
  minutes: number | null;
  distanceMeters: number | null;
  distanceApprox: boolean;
  mapsUrl: string;
  officialUrl: string;
}

interface GoogleMapInstance {
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  fitBounds: (bounds: GoogleBounds) => void;
}

interface GoogleCircleInstance {
  setCenter: (center: Coordinates) => void;
  setRadius: (radius: number) => void;
  setMap: (map: GoogleMapInstance | null) => void;
}

interface GoogleMarker {
  map: GoogleMapInstance | null;
  position: Coordinates;
  title: string;
  content: HTMLElement;
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
  Circle: new (options: Record<string, unknown>) => GoogleCircleInstance;
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
const maxDisplayableAccuracyMeters = 2_000;
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
  if (label === "⌖") {
    element.className = "hospital-map-user-marker";
    const pulse = document.createElement("i");
    const dot = document.createElement("b");
    element.append(pulse, dot);
    return element;
  }
  element.className = "hospital-map-marker";
  element.textContent = label;
  return element;
}

function approximateDistanceMeters(from: Coordinates, to: Coordinates) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const earthRadiusMeters = 6_371_000;
  const latitudeDelta = radians(to.lat - from.lat);
  const longitudeDelta = radians(to.lng - from.lng);
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
}

function mapPointStyle(point: Coordinates): CSSProperties {
  const west = -75.7;
  const east = -75.45;
  const south = 6.15;
  const north = 6.35;
  const left = Math.max(7, Math.min(93, ((point.lng - west) / (east - west)) * 100));
  const top = Math.max(10, Math.min(90, (1 - (point.lat - south) / (north - south)) * 100));
  return { left: `${left}%`, top: `${top}%` };
}

function mapsDirectionsUrl(destination: string, origin: Coordinates) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("origin", `${origin.lat},${origin.lng}`);
  url.searchParams.set("destination", destination);
  url.searchParams.set("travelmode", "driving");
  return url.toString();
}

function curatedHospitalResults(origin: Coordinates): NearbyHospital[] {
  return medellinFacilities.map((facility) => ({
    id: facility.id,
    place: null,
    name: facility.name,
    address: facility.address,
    coordinates: facility.coordinates,
    phone: facility.phone,
    minutes: null,
    distanceMeters: approximateDistanceMeters(origin, facility.coordinates),
    distanceApprox: true,
    mapsUrl: mapsDirectionsUrl(facility.mapsQuery, origin),
    officialUrl: facility.officialUrl,
  }));
}

export default function HospitalNetworkMap({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const apiKey = googleMapsKey;
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const originMarkerRef = useRef<GoogleMarker | null>(null);
  const accuracyCircleRef = useRef<GoogleCircleInstance | null>(null);
  const circleClassRef = useRef<GoogleMapLibrary["Circle"] | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const mapSdkRef = useRef<GoogleMapSdk | null>(null);
  const placesLibRef = useRef<GooglePlaceLibrary | null>(null);
  const markerLibRef = useRef<GoogleMarkerLibrary | null>(null);
  const routesLibRef = useRef<GoogleRoutesLibrary | null>(null);
  const coreLibRef = useRef<GoogleCoreLibrary | null>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>(apiKey ? "loading" : "missing-key");
  const [origin, setOrigin] = useState<Coordinates>(defaultMedellin);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [zoom, setZoom] = useState(14);
  const [locationState, setLocationState] = useState<"default" | "locating" | "current" | "low-accuracy" | "denied">("default");
  const [hospitals, setHospitals] = useState<NearbyHospital[]>(() => curatedHospitalResults(defaultMedellin));
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [hospitalQuery, setHospitalQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapError, setMapError] = useState("");

  const acceptDevicePosition = useCallback((position: GeolocationPosition) => {
    const accuracy = position.coords.accuracy;
    const hasValidCoordinates = Number.isFinite(position.coords.latitude) && Number.isFinite(position.coords.longitude);
    const hasValidAccuracy = Number.isFinite(accuracy) && accuracy > 0;
    setLocationAccuracy(hasValidAccuracy ? accuracy : null);
    if (!hasValidCoordinates || !hasValidAccuracy || accuracy > maxDisplayableAccuracyMeters) {
      setOrigin(defaultMedellin);
      setLocationState("low-accuracy");
      const accuracyText = hasValidAccuracy ? (accuracy >= 1000 ? `±${(accuracy / 1000).toFixed(1)} km` : `±${Math.round(accuracy)} m`) : "";
      setLocationError(es
        ? `La ubicación del navegador ${accuracyText ? `es demasiado aproximada (${accuracyText})` : "no tiene precisión válida"}. Se mantiene Medellín como referencia.`
        : `Browser location ${accuracyText ? `is too coarse (${accuracyText})` : "has no valid accuracy"}. Medellín remains the reference.`);
      return;
    }
    setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
    setLocationState("current");
    setLocationError("");
  }, [es]);

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
        coordinates: place.location!,
        phone: place.nationalPhoneNumber || "",
        minutes: null,
        distanceMeters: place.location ? approximateDistanceMeters(center, place.location) : null,
        distanceApprox: true,
        mapsUrl: place.googleMapsURI || mapsDirectionsUrl(placeName(place), center),
        officialUrl: "",
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
              distanceApprox: false,
            })));
          }
        } catch {
          setMapError(es ? "No se pudieron calcular los tiempos de ruta." : "Route estimates could not be calculated.");
        }
      }
    } catch {
      setHospitals(curatedHospitalResults(center));
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
      const { Map, Circle } = mapLibrary as GoogleMapLibrary;
      circleClassRef.current = Circle;
      markerLibRef.current = markerLibrary as GoogleMarkerLibrary;
      try { routesLibRef.current = await maps.maps.importLibrary("routes") as GoogleRoutesLibrary; }
      catch { routesLibRef.current = null; }
      if (cancelled || !mapElement.current) return;
      const map = new Map(mapElement.current, { center: origin, zoom, mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID", mapTypeControl: false, streetViewControl: false, fullscreenControl: false, zoomControl: false });
      mapRef.current = map;
      const { AdvancedMarkerElement } = markerLibrary as GoogleMarkerLibrary;
      const isCurrentLocation = locationState === "current";
      originMarkerRef.current = new AdvancedMarkerElement({ map, position: origin, title: isCurrentLocation ? (es ? "Ubicación actual del dispositivo" : "Current device location") : (es ? "Centro de referencia de Medellín" : "Medellín reference center"), content: markerContent(isCurrentLocation ? "⌖" : "M") });
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
    if (mapStatus === "missing-key" || mapStatus === "error") {
      setHospitals(curatedHospitalResults(origin));
      setSelectedHospitalId((current) => medellinFacilities.some((facility) => facility.id === current) ? current : medellinFacilities[0]?.id || "");
    }
  }, [mapStatus, origin]);

  useEffect(() => {
    if (mapStatus !== "ready" || !mapRef.current) return;
    mapRef.current.setCenter(origin);
    if (originMarkerRef.current) {
      originMarkerRef.current.map = mapRef.current;
      originMarkerRef.current.position = origin;
      const isCurrentLocation = locationState === "current";
      originMarkerRef.current.title = isCurrentLocation ? (es ? "Ubicación actual del dispositivo" : "Current device location") : (es ? "Centro de referencia de Medellín" : "Medellín reference center");
      originMarkerRef.current.content = markerContent(isCurrentLocation ? "⌖" : "M");
    }
    if (locationState === "current" && mapRef.current) {
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(mapRef.current);
        accuracyCircleRef.current.setCenter(origin);
        accuracyCircleRef.current.setRadius(Math.max(25, locationAccuracy || 100));
      } else if (circleClassRef.current) {
        accuracyCircleRef.current = new circleClassRef.current({
          map: mapRef.current,
          center: origin,
          radius: Math.max(25, locationAccuracy || 100),
          fillColor: "#1683ff",
          fillOpacity: 0.12,
          strokeColor: "#1683ff",
          strokeOpacity: 0.62,
          strokeWeight: 1.5,
          clickable: false,
        });
      }
    } else {
      accuracyCircleRef.current?.setMap(null);
    }
    void searchNearby(origin);
  }, [origin, mapStatus, searchNearby, locationState, locationAccuracy, es]);

  useEffect(() => {
    if (!navigator.permissions?.query) return;
    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      if (permission.state !== "granted") return;
      navigator.geolocation.getCurrentPosition((position) => {
        acceptDevicePosition(position);
      }, undefined, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
    }).catch(() => undefined);
  }, [acceptDevicePosition]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError(es ? "Este navegador no ofrece ubicación." : "This browser does not provide location access.");
      return;
    }
    setLocationState("locating");
    setLocationError("");
    navigator.geolocation.getCurrentPosition((position) => {
      acceptDevicePosition(position);
    }, () => {
      setLocationState("denied");
      setLocationError(es ? "No se concedió acceso. Se mantiene Medellín como centro." : "Location access was not granted. Medellín remains the center.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  function changeZoom(delta: number) {
    setZoom((current) => Math.max(11, Math.min(18, current + delta)));
  }

  useEffect(() => {
    if (mapStatus === "ready") mapRef.current?.setZoom(zoom);
  }, [zoom, mapStatus]);

  async function showHospitalDetails(id: string) {
    setSelectedHospitalId(id);
    const selected = hospitals.find((item) => item.id === id);
    if (!selected || selected.phone || !selected.place?.fetchFields) return;
    try {
      await selected.place.fetchFields({ fields: ["nationalPhoneNumber"] });
      const phone = selected.place.nationalPhoneNumber || "";
      setHospitals((current) => current.map((item) => item.id === id ? { ...item, phone } : item));
    } catch {
      setMapError(es ? "El teléfono no está disponible en Google Maps para este centro." : "A phone number is not available for this place in Google Maps.");
    }
  }

  const originInMedellin = origin.lat >= 6.15 && origin.lat <= 6.35 && origin.lng >= -75.7 && origin.lng <= -75.45;
  const isMedellinEmergencyArea = locationState === "default" || (locationState === "current" && originInMedellin);
  const originLabel = locationState === "current"
    ? (originInMedellin ? (es ? "Ubicación actual (Medellín)" : "Current location (Medellín)") : (es ? "Ubicación actual · fuera de Medellín" : "Current location · outside Medellín"))
    : locationState === "low-accuracy"
      ? (es ? "Precisión insuficiente · Medellín de referencia" : "Low accuracy · Medellín reference")
      : (es ? "Medellín, Colombia · centro de referencia" : "Medellín, Colombia · reference center");
  const externalSearchUrl = new URL("https://www.google.com/maps/search/");
  externalSearchUrl.searchParams.set("api", "1");
  externalSearchUrl.searchParams.set("query", `${es ? "hospitales cerca de" : "hospitals near"} ${origin.lat},${origin.lng}`);
  const visibleHospitals = hospitals.filter((hospital) => !hospitalQuery.trim()
    || `${hospital.name} ${hospital.address}`.toLocaleLowerCase().includes(hospitalQuery.trim().toLocaleLowerCase()));

  return <section className="content-area hospital-network-page">
    <div className="hospital-network-heading"><div><span className="eyebrow"><MapPin size={14} />{es ? "RED HOSPITALARIA" : "HOSPITAL NETWORK"}</span><h1>{es ? "Ubicaciones y red hospitalaria" : "Locations and hospital network"}</h1><p>{es ? "Centros de salud cercanos, rutas y datos de contacto disponibles en Google Maps." : "Nearby health facilities, routes and contact details from Google Maps."}</p></div><span className="hospital-demo-label"><ShieldCheck size={14} />{es ? "Ubicación protegida" : "Location protected"}</span></div>

    <div className="hospital-map-toolbar"><div className="hospital-origin"><span className="hospital-origin-icon"><LocateFixed size={16} /></span><span><small>{es ? "Origen de búsqueda" : "Search origin"}</small><b>{originLabel}</b>{(locationState === "current" || locationState === "low-accuracy") && locationAccuracy !== null && <em className={locationState === "current" ? "hospital-origin-accuracy" : "hospital-origin-accuracy low"}>±{locationAccuracy >= 1000 ? `${(locationAccuracy / 1000).toFixed(1)} km` : `${Math.round(locationAccuracy)} m`} {es ? "de precisión" : "accuracy"}</em>}</span></div><button className="hospital-locate-button" onClick={useCurrentLocation} disabled={locationState === "locating"}><LocateFixed size={15} />{locationState === "locating" ? (es ? "Buscando…" : "Locating…") : (es ? "Usar mi ubicación" : "Use my location")}</button><button className="hospital-refresh-button" onClick={() => void searchNearby(origin)} disabled={searching || mapStatus !== "ready"}><RefreshCw size={15} />{es ? "Actualizar" : "Refresh"}</button></div>
    {locationError && <p className="hospital-inline-error">{locationError}</p>}

    <div className="hospital-network-layout">
      <div className="hospital-map-shell">
        <div ref={mapElement} className="google-map-canvas" aria-label={es ? "Mapa de centros hospitalarios cercanos" : "Nearby hospital facilities map"} />
        {mapStatus !== "ready" && <div className="hospital-map-overlay">
          <div className="hospital-map-art">
            <div className="medellin-map-viewport" style={{ transform: `scale(${1 + (zoom - 14) * 0.075})` }}>
              <svg className="medellin-map-svg" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="1000" height="620" className="map-ground" />
                <path className="map-park-shape" d="M72 79l120-34 64 42-24 83-145 15-48-51zM692 74l141-15 43 64-33 78-126-9-55-56zM606 414l153-30 79 54-42 99-150 25-61-73zM133 405l95-21 64 44-19 77-92 18-43-52z" />
                <path className="map-river-edge" d="M-30 343C108 286 177 374 293 331s157-124 278-92 153 90 265 42 142-32 208 1" />
                <path className="map-river" d="M-30 343C108 286 177 374 293 331s157-124 278-92 153 90 265 42 142-32 208 1" />
                <g className="map-minor-roads">
                  <path d="M-20 75L300 214 570 53 1014 206M-30 137L238 290 552 115 1017 273M-22 220L250 366 572 193 1020 348M-35 425L251 271 546 438 1028 250M-26 528L248 376 543 537 1024 347M88-20L199 225 136 640M212-26L319 203 254 642M351-22L438 179 391 642M496-18L574 199 520 646M653-12L714 188 673 645M808-20L868 207 831 644M-5 301L1028 441M-15 488L1019 567" />
                </g>
                <g className="map-secondary-roads">
                  <path d="M-20 178L1022 515M-12 566L1007 135M16 18L973 601M112-12L928 625M-24 376L1019 40" />
                </g>
                <g className="map-primary-roads">
                  <path d="M-12 282C171 233 277 242 436 313s266 127 584 91M160-25C223 132 324 228 410 327s145 186 211 323M-20 475C183 415 325 373 472 301s296-148 553-161" />
                </g>
                <g className="map-road-centers">
                  <path d="M-12 282C171 233 277 242 436 313s266 127 584 91M160-25C223 132 324 228 410 327s145 186 211 323M-20 475C183 415 325 373 472 301s296-148 553-161" />
                </g>
              </svg>
              <span className="map-district district-a">ROBLEDO</span><span className="map-district district-b">LAURELES</span><span className="map-district district-c">CENTRO</span><span className="map-district district-d">EL POBLADO</span>
              {hospitals.slice(0, 5).map((hospital, index) => <button className={"map-hospital-marker " + (selectedHospitalId === hospital.id ? "selected" : "")} type="button" key={hospital.id} style={mapPointStyle(hospital.coordinates)} onClick={() => void showHospitalDetails(hospital.id)} aria-label={hospital.name} title={hospital.name}><span>{index + 1}</span></button>)}
              {locationState === "current" && originInMedellin ? <span className="map-current-point" style={mapPointStyle(origin)}><i /><b /><small>{es ? "Ubicación actual" : "Current location"}{locationAccuracy !== null ? ` · ±${Math.round(locationAccuracy)} m` : ""}</small></span> : <span className="map-reference-point" style={mapPointStyle(defaultMedellin)}><i /></span>}
            </div>
            <span className="map-city-label">{locationState === "current" ? (originInMedellin ? (es ? "MEDELLÍN · UBICACIÓN ACTUAL" : "MEDELLÍN · CURRENT LOCATION") : (es ? "UBICACIÓN FUERA DEL MAPA LOCAL" : "LOCATION OUTSIDE LOCAL MAP")) : locationState === "low-accuracy" ? (es ? "MEDELLÍN · CENTRO DE REFERENCIA" : "MEDELLÍN · REFERENCE CENTER") : "MEDELLÍN · ANTIOQUIA"}</span>
            <span className="map-scale-label">{es ? `Zoom ${zoom} · mapa de referencia` : `Zoom ${zoom} · reference map`}</span>
          </div>
          {mapStatus === "loading" && <span className="hospital-map-message">{es ? "Cargando Google Maps…" : "Loading Google Maps…"}</span>}
          {mapStatus === "missing-key" && <div className="hospital-map-setup"><span className="hospital-map-setup-icon"><MapPin size={19} /></span><b>{es ? "Activa Google Maps" : "Connect Google Maps"}</b><p>{es ? "Añade NEXT_PUBLIC_GOOGLE_MAPS_API_KEY al archivo .env.local y habilita Maps JavaScript API, Places API (New) y Routes API." : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local and enable Maps JavaScript API, Places API (New), and Routes API."}</p><a className="hospital-map-external-link" href={externalSearchUrl.toString()} target="_blank" rel="noreferrer">{es ? "Buscar centros en Google Maps" : "Find facilities in Google Maps"}<ArrowUpRight size={13} /></a><small className="hospital-map-external-note">{es ? "Se abrirá Maps con el área de búsqueda seleccionada." : "Maps will open with the selected search area."}</small></div>}
          {mapStatus === "error" && <span className="hospital-map-message error">{mapError}</span>}
        </div>}
        {mapStatus === "ready" && <div className="hospital-map-attribution">Google Maps</div>}
        <div className="hospital-map-controls" aria-label={es ? "Controles del mapa" : "Map controls"}><button type="button" onClick={() => changeZoom(1)} disabled={zoom >= 18} aria-label={es ? "Acercar mapa" : "Zoom in"}><Plus size={17} /></button><button type="button" onClick={() => changeZoom(-1)} disabled={zoom <= 11} aria-label={es ? "Alejar mapa" : "Zoom out"}><Minus size={17} /></button><span /><button type="button" onClick={useCurrentLocation} aria-label={es ? "Centrar en mi ubicación" : "Center on my location"}><LocateFixed size={16} /></button></div>
        {mapStatus !== "ready" && <div className="hospital-map-legend"><span><i className="legend-location" />{es ? "Tu ubicación" : "Your location"}</span><span><i className="legend-hospital" />{es ? "Hospitales" : "Hospitals"}</span></div>}
      </div>

      <aside className="hospital-results-panel">
        <div className="hospital-results-heading"><div><h2>{es ? "Centros cercanos" : "Nearby facilities"}</h2><p>{searching ? (es ? "Buscando hospitales y clínicas…" : "Searching hospitals and clinics…") : `${visibleHospitals.length} ${es ? "resultados" : "results"}`}</p></div><span className="hospital-results-count">{visibleHospitals.length.toString().padStart(2, "0")}</span></div>
        <label className="hospital-search-control"><Search size={15} /><input value={hospitalQuery} onChange={(event) => setHospitalQuery(event.target.value)} placeholder={es ? "Buscar hospital o dirección" : "Search hospital or address"} aria-label={es ? "Buscar hospitales" : "Search hospitals"} /></label>
        <label className="hospital-select-control"><span>{es ? "Seleccionar centro" : "Choose a facility"}</span><select value={selectedHospitalId} onChange={(event) => void showHospitalDetails(event.target.value)} aria-label={es ? "Centro hospitalario seleccionado" : "Selected hospital"}><option value="">{es ? "Elige un hospital" : "Choose a hospital"}</option>{visibleHospitals.map((hospital) => <option value={hospital.id} key={hospital.id}>{hospital.name}</option>)}</select></label>
        {mapError && mapStatus === "ready" && <p className="hospital-inline-error">{mapError}</p>}
        <div className="hospital-results-list">
          {visibleHospitals.map((item, index) => <article className={"hospital-result-card " + (selectedHospitalId === item.id ? "selected" : "")} key={item.id}>
            <button className="hospital-result-select" onClick={() => void showHospitalDetails(item.id)}><span className="hospital-marker-number">{index + 1}</span><span><b>{item.name}</b><small>{item.address}</small></span><ArrowUpRight size={15} /></button>
            <div className="hospital-result-meta"><span><Navigation size={13} />{item.minutes ? `${item.minutes} ${es ? "min en auto" : "min drive"}` : (item.distanceApprox ? (es ? "Distancia aprox. · línea recta" : "Approx. straight-line distance") : (es ? "Ruta sin estimar" : "No route estimate"))}</span>{item.distanceMeters !== null && <small>{item.distanceMeters < 1000 ? `${item.distanceMeters} m` : `${(item.distanceMeters / 1000).toFixed(1)} km`}</small>}</div>
            {selectedHospitalId === item.id && <div className="hospital-result-actions">{item.phone ? <a href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}><Phone size={13} />{item.phone}</a> : <span><Phone size={13} />{es ? "Teléfono no publicado" : "No phone listed"}</span>}<a href={item.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={13} />{es ? "Ver ruta en Maps" : "Directions in Maps"}</a>{item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noreferrer"><ArrowUpRight size={13} />{es ? "Contacto oficial" : "Official contact"}</a>}</div>}
          </article>)}
          {visibleHospitals.length === 0 && !searching && <div className="hospital-empty"><Activity size={19} /><span>{es ? "No se encontraron centros con esa búsqueda." : "No facilities match this search."}</span></div>}
          {mapStatus !== "ready" && <div className="hospital-empty muted"><MapPin size={19} /><span>{es ? "Directorio local de Medellín. Activa Google Maps para rutas en auto y centros cercanos en tiempo real." : "Local Medellín directory. Connect Google Maps for driving routes and live nearby facilities."}</span></div>}
        </div>
        <div className="hospital-results-footer"><span><ShieldCheck size={14} />{es ? "Los teléfonos se consultan al seleccionar un centro." : "Phone details load when a facility is selected."}</span></div>
      </aside>
    </div>

    <div className="hospital-emergency-strip"><span className="hospital-emergency-icon"><Activity size={17} /></span><span><b>{isMedellinEmergencyArea ? (es ? "Emergencia en Medellín" : "Emergency in Medellín") : (es ? "Servicios locales de emergencia" : "Local emergency services")}</b><small>{isMedellinEmergencyArea ? (es ? "La línea única de emergencias de Medellín es 123." : "Medellín's single emergency line is 123.") : (es ? "Confirma el número de emergencias de la zona actual; no mostramos un número sin verificar." : "Confirm the emergency number for your current area; an unverified number is not shown.")}</small></span>{isMedellinEmergencyArea && <a href="tel:123">{es ? "Llamar al 123" : "Call 123"}<Phone size={14} /></a>}</div>
    <p className="hospital-network-note">{es ? (isMedellinEmergencyArea ? "Los tiempos son estimaciones de Google Maps y pueden variar con el tráfico. En una emergencia, llama al 123." : "Los tiempos son estimaciones de Google Maps. En una emergencia, usa el número local de tu zona.") : (isMedellinEmergencyArea ? "Travel times are Google Maps estimates and may change with traffic. In an emergency, call 123." : "Travel times are Google Maps estimates. In an emergency, use your area's local emergency number.")}</p>
  </section>;
}
