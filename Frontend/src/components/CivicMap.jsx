import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { toLatLng } from '../lib/issueService';

const MAP_LIBRARIES = ['places'];

const TYPE_STYLE = {
  pothole: { color: '#d97706', label: 'P' },
  lighting: { color: '#0f766e', label: 'L' },
  sanitation: { color: '#e11d48', label: 'S' },
  noise: { color: '#7c3aed', label: 'N' },
  other: { color: '#475569', label: 'C' },
};
const RESOLVED_STYLE = { color: '#059669', label: '\u2713' };

function markerIcon(issue, isActive) {
  const style = issue.status === 'resolved' ? RESOLVED_STYLE : (TYPE_STYLE[issue.type] || TYPE_STYLE.other);
  const scale = isActive ? 13 : 10;
  return {
    icon: {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: style.color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
      scale,
    },
    label: {
      text: style.label,
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
    },
  };
}

const mapContainerStyle = { width: '100%', height: '100%' };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
};

export default function CivicMap({
  apiKey,
  center,
  userLocation,
  issues,
  selectedIssue,
  onSelectIssue,
  onRecenter,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: MAP_LIBRARIES,
  });

  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(14);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const recenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(15);
    }
    onRecenter?.();
  }, [userLocation, onRecenter]);

  const markers = useMemo(() => {
    return (issues || [])
      .map((issue) => ({ issue, position: toLatLng(issue) }))
      .filter((m) => m.position);
  }, [issues]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#e6e8ea] text-center p-8">
        <div className="max-w-sm space-y-2">
          <p className="font-bold text-slate-700 text-sm">Google Maps API key missing</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">VITE_GOOGLE_MAPS_API_KEY</code> to
            your Frontend <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">.env</code> file and
            restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#e6e8ea] text-center p-8">
        <p className="text-xs text-slate-500">
          Couldn't load Google Maps. Check the API key and enabled APIs (Maps JavaScript API), then reload.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#e6e8ea]">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
          <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onZoomChanged={() => mapRef.current && setZoom(mapRef.current.getZoom())}
        options={mapOptions}
      >
        {userLocation && (
          <MarkerF
            position={userLocation}
            zIndex={999}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
              scale: 8,
            }}
            title="You are here"
          />
        )}

        {markers.map(({ issue, position }) => (
          <MarkerF
            key={issue._id}
            position={position}
            onClick={() => onSelectIssue(issue)}
            zIndex={selectedIssue?._id === issue._id ? 998 : undefined}
            {...markerIcon(issue, selectedIssue?._id === issue._id)}
          />
        ))}
      </GoogleMap>

      <button
        type="button"
        onClick={recenter}
        className="absolute bottom-4 left-4 z-10 bg-white shadow-md border border-slate-200 rounded-full px-3 py-2 text-[11px] font-bold text-teal-700 hover:bg-teal-50 transition-all cursor-pointer"
      >
        Recenter on me
      </button>
    </div>
  );
}
